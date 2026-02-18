/**
 * Global state for Operator Dashboard
 * Handles live data from OpenClaw Gateway
 */

import { create } from 'zustand';
import { Agent, Span, Trace, ChatMessage } from '../lib/mockData';
import { mockAgents, mockTraces, mockChatMessages } from '../lib/mockData';

interface OperatorState {
  // Agents
  agents: Agent[];
  selectedAgentId: string;
  
  // Traces & Spans
  traces: Trace[];
  activeTraceId: string | null;
  
  // Chat
  messages: ChatMessage[];
  isAgentThinking: boolean;
  
  // Actions
  setAgents: (agents: Agent[]) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  selectAgent: (agentId: string) => void;
  
  addTrace: (trace: Trace) => void;
  updateTrace: (traceId: string, updates: Partial<Trace>) => void;
  addSpan: (traceId: string, span: Span) => void;
  updateSpan: (traceId: string, spanId: string, updates: Partial<Span>) => void;
  
  addMessage: (message: ChatMessage) => void;
  setAgentThinking: (thinking: boolean) => void;
  
  reset: () => void;
}

export const useOperatorStore = create<OperatorState>((set) => ({
  // Initial state
  agents: mockAgents,
  selectedAgentId: mockAgents[0].id,
  traces: mockTraces,
  activeTraceId: mockTraces[0]?.id || null,
  messages: mockChatMessages,
  isAgentThinking: false,

  // Agent actions
  setAgents: (agents) => set({ agents }),
  
  updateAgent: (agentId, updates) => set((state) => ({
    agents: state.agents.map((a) =>
      a.id === agentId ? { ...a, ...updates } : a
    ),
  })),
  
  selectAgent: (agentId) => set({ selectedAgentId: agentId }),

  // Trace actions
  addTrace: (trace) => set((state) => ({
    traces: [trace, ...state.traces],
    activeTraceId: trace.id,
  })),
  
  updateTrace: (traceId, updates) => set((state) => ({
    traces: state.traces.map((t) =>
      t.id === traceId ? { ...t, ...updates } : t
    ),
  })),
  
  addSpan: (traceId, span) => set((state) => ({
    traces: state.traces.map((t) =>
      t.id === traceId
        ? {
            ...t,
            spans: [...t.spans, span],
            totalCost: t.totalCost + span.cost,
          }
        : t
    ),
  })),
  
  updateSpan: (traceId, spanId, updates) => set((state) => ({
    traces: state.traces.map((t) =>
      t.id === traceId
        ? {
            ...t,
            spans: t.spans.map((s) =>
              s.id === spanId ? { ...s, ...updates } : s
            ),
          }
        : t
    ),
  })),

  // Chat actions
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  
  setAgentThinking: (thinking) => set({ isAgentThinking: thinking }),

  // Reset to initial state
  reset: () => set({
    agents: mockAgents,
    selectedAgentId: mockAgents[0].id,
    traces: mockTraces,
    activeTraceId: mockTraces[0]?.id || null,
    messages: mockChatMessages,
    isAgentThinking: false,
  }),
}));
