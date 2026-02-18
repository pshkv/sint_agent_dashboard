/**
 * Process OpenClaw Gateway events and update dashboard state
 */

import { OpenClawEvent } from './openclawClient';
import { useOperatorStore } from '../stores/operatorStore';
import { Span, Trace } from './mockData';

export class EventProcessor {
  private store = useOperatorStore.getState();

  /**
   * Process incoming OpenClaw event
   */
  processEvent(event: OpenClawEvent): void {
    console.log('[EventProcessor] Processing:', event.type, event.data);

    switch (event.type) {
      case 'agent_thinking':
        this.handleAgentThinking(event);
        break;

      case 'agent_tool_call':
        this.handleToolCall(event);
        break;

      case 'agent_response':
        this.handleAgentResponse(event);
        break;

      case 'span_start':
        this.handleSpanStart(event);
        break;

      case 'span_end':
        this.handleSpanEnd(event);
        break;

      case 'session_update':
        this.handleSessionUpdate(event);
        break;

      case 'cost_update':
        this.handleCostUpdate(event);
        break;

      case 'approval_required':
        this.handleApprovalRequired(event);
        break;

      case 'error':
        this.handleError(event);
        break;

      default:
        console.warn('[EventProcessor] Unknown event type:', event.type);
    }
  }

  private handleAgentThinking(event: OpenClawEvent): void {
    // Update agent status to thinking
    const agentId = event.data.agentId || this.store.selectedAgentId;
    
    this.store.updateAgent(agentId, {
      status: 'active',
      currentTask: 'Thinking...',
    });

    this.store.setAgentThinking(true);

    // Add system message
    this.store.addMessage({
      id: `msg-${Date.now()}`,
      role: 'system',
      content: '🤔 Agent is thinking...',
      timestamp: new Date(event.timestamp),
      agentStatus: 'thinking',
    });
  }

  private handleToolCall(event: OpenClawEvent): void {
    const { tool, input, spanId } = event.data;

    // Add tool call message
    this.store.addMessage({
      id: `msg-${Date.now()}`,
      role: 'tool',
      content: `Executing: ${tool}`,
      timestamp: new Date(event.timestamp),
      toolCalls: [{
        id: spanId || `tc-${Date.now()}`,
        tool,
        input,
        output: null,
        duration: 0,
        status: 'pending_approval',
      }],
    });

    // Update agent status
    const agentId = event.data.agentId || this.store.selectedAgentId;
    this.store.updateAgent(agentId, {
      currentTask: `Executing: ${tool}`,
    });
  }

  private handleAgentResponse(event: OpenClawEvent): void {
    const { content, agentId } = event.data;

    this.store.setAgentThinking(false);

    // Add agent message
    this.store.addMessage({
      id: `msg-${Date.now()}`,
      role: 'agent',
      content: content || event.data.text || '',
      timestamp: new Date(event.timestamp),
      agentStatus: 'idle',
    });

    // Update agent status
    const targetAgentId = agentId || this.store.selectedAgentId;
    this.store.updateAgent(targetAgentId, {
      status: 'idle',
      currentTask: null,
    });
  }

  private handleSpanStart(event: OpenClawEvent): void {
    const { spanId, type, input, traceId, parentSpanId } = event.data;

    const newSpan: Span = {
      id: spanId,
      traceId: traceId || this.store.activeTraceId || 'trace-live',
      type: type || 'tool_exec',
      input,
      output: null,
      duration: 0,
      status: 'success', // Will update on span_end
      cost: 0,
      parentSpanId: parentSpanId || null,
      timestamp: new Date(event.timestamp),
    };

    // Find or create trace
    const trace = this.store.traces.find(t => t.id === newSpan.traceId);
    if (trace) {
      this.store.addSpan(newSpan.traceId, newSpan);
    } else {
      // Create new trace
      const newTrace: Trace = {
        id: newSpan.traceId,
        sessionId: event.sessionId || 'session-live',
        agentId: this.store.selectedAgentId,
        startTime: new Date(event.timestamp),
        endTime: null,
        status: 'running',
        spans: [newSpan],
        totalCost: 0,
      };
      this.store.addTrace(newTrace);
    }
  }

  private handleSpanEnd(event: OpenClawEvent): void {
    const { spanId, output, duration, cost, status, traceId, tokens } = event.data;

    const targetTraceId = traceId || this.store.activeTraceId;
    if (!targetTraceId) return;

    this.store.updateSpan(targetTraceId, spanId, {
      output,
      duration: duration || 0,
      cost: cost || 0,
      status: status || 'success',
      tokens,
    });

    // Update trace total cost
    const trace = this.store.traces.find(t => t.id === targetTraceId);
    if (trace) {
      const totalCost = trace.spans.reduce((sum, s) => sum + s.cost, 0);
      this.store.updateTrace(targetTraceId, { totalCost });
    }
  }

  private handleSessionUpdate(event: OpenClawEvent): void {
    // Update session-level info
    console.log('[EventProcessor] Session update:', event.data);
  }

  private handleCostUpdate(event: OpenClawEvent): void {
    const { cost, model, tokens } = event.data;
    console.log('[EventProcessor] Cost update:', { cost, model, tokens });
    
    // Note: Could track cumulative cost here if needed
  }

  private handleApprovalRequired(event: OpenClawEvent): void {
    const { action, description, tool, input, policyRule, approvalId } = event.data;

    // Add approval request message
    this.store.addMessage({
      id: `msg-${Date.now()}`,
      role: 'system',
      content: `⚠️ Approval Required: ${action || 'Action requires your approval'}`,
      timestamp: new Date(event.timestamp),
    });

    // Trigger approval gate UI by dispatching custom event
    window.dispatchEvent(new CustomEvent('openclaw:approval-required', {
      detail: {
        id: approvalId || `approval-${Date.now()}`,
        action: action || 'unknown_action',
        description: description || 'Agent is requesting approval',
        tool: tool || 'unknown',
        input: input || {},
        policyRule: policyRule || 'Approval Policy',
      },
    }));
  }

  private handleError(event: OpenClawEvent): void {
    const { error, message } = event.data;

    // Add error message
    this.store.addMessage({
      id: `msg-${Date.now()}`,
      role: 'system',
      content: `❌ Error: ${message || error}`,
      timestamp: new Date(event.timestamp),
    });

    // Update agent status
    const agentId = event.data.agentId || this.store.selectedAgentId;
    this.store.updateAgent(agentId, {
      status: 'error',
      currentTask: null,
    });
  }
}

// Singleton instance
let processorInstance: EventProcessor | null = null;

export function getEventProcessor(): EventProcessor {
  if (!processorInstance) {
    processorInstance = new EventProcessor();
  }
  return processorInstance;
}
