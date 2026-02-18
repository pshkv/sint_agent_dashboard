/**
 * OpenClaw Gateway WebSocket Client
 * Connects to OpenClaw Gateway at ws://127.0.0.1:18789
 * Handles AG-UI protocol events
 */

import { AGUIEvent } from './mockData';

export type OpenClawEventType = 
  | 'agent_thinking'
  | 'agent_tool_call'
  | 'agent_response'
  | 'span_start'
  | 'span_end'
  | 'session_update'
  | 'cost_update'
  | 'approval_required'
  | 'error';

export interface OpenClawEvent {
  type: OpenClawEventType;
  sessionId: string;
  timestamp: string;
  data: any;
}

export interface OpenClawConfig {
  gatewayUrl?: string;
  autoReconnect?: boolean;
  reconnectIntervalMs?: number;
  mockMode?: boolean;
}

export class OpenClawClient {
  private ws: WebSocket | null = null;
  private config: Required<OpenClawConfig>;
  private listeners: Map<string, Set<(event: OpenClawEvent) => void>> = new Map();
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;

  constructor(config: OpenClawConfig = {}) {
    this.config = {
      gatewayUrl: config.gatewayUrl || 'ws://127.0.0.1:18789',
      autoReconnect: config.autoReconnect ?? true,
      reconnectIntervalMs: config.reconnectIntervalMs || 5000,
      mockMode: config.mockMode ?? true, // Default to mock for now
    };
  }

  /**
   * Connect to OpenClaw Gateway
   */
  connect(): Promise<void> {
    if (this.config.mockMode) {
      console.log('[OpenClaw] Running in MOCK mode');
      return Promise.resolve();
    }

    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        this.isConnecting = true;
        console.log(`[OpenClaw] Connecting to ${this.config.gatewayUrl}...`);
        
        this.ws = new WebSocket(this.config.gatewayUrl);

        this.ws.onopen = () => {
          this.isConnecting = false;
          console.log('[OpenClaw] Connected to Gateway');
          this.clearReconnectTimer();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            // Handle Gateway authentication challenge
            if (message.type === 'event' && message.event === 'connect.challenge') {
              console.log('[OpenClaw] Received auth challenge, responding...');
              // Respond to challenge (for now, just acknowledge)
              this.ws?.send(JSON.stringify({
                type: 'event',
                event: 'connect.auth',
                payload: {
                  nonce: message.payload.nonce,
                  token: null, // No auth token for local development
                },
              }));
              return;
            }
            
            this.handleMessage(message);
          } catch (error) {
            console.error('[OpenClaw] Failed to parse message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[OpenClaw] WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('[OpenClaw] Disconnected from Gateway');
          this.isConnecting = false;
          this.ws = null;
          
          if (this.config.autoReconnect) {
            this.scheduleReconnect();
          }
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from Gateway
   */
  disconnect(): void {
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send message to Gateway
   */
  send(message: any): void {
    if (this.config.mockMode) {
      console.log('[OpenClaw] MOCK send:', message);
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      console.log('[OpenClaw] Sent message:', message);
    } else {
      console.warn('[OpenClaw] Cannot send - not connected');
    }
  }
  
  /**
   * Send approval response to Gateway
   */
  sendApproval(approvalId: string, approved: boolean, editedInput?: any): void {
    this.send({
      type: 'event',
      event: 'approval.response',
      payload: {
        approvalId,
        approved,
        editedInput,
        timestamp: Date.now(),
      },
    });
  }
  
  /**
   * Send user message to agent
   */
  sendUserMessage(content: string, sessionId?: string): void {
    this.send({
      type: 'event',
      event: 'user.message',
      payload: {
        content,
        sessionId: sessionId || 'main',
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Subscribe to events
   */
  on(eventType: OpenClawEventType | '*', callback: (event: OpenClawEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    if (this.config.mockMode) return true;
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Toggle mock mode
   */
  setMockMode(enabled: boolean): void {
    const wasConnected = this.isConnected();
    this.config.mockMode = enabled;
    
    if (enabled && wasConnected) {
      this.disconnect();
    } else if (!enabled && !wasConnected) {
      this.connect();
    }
  }

  // Private methods

  private handleMessage(message: any): void {
    // Convert Gateway event format to our internal format
    let event: OpenClawEvent;
    
    if (message.type === 'event' && message.event) {
      // Gateway format: { type: 'event', event: 'xxx', payload: {...} }
      event = {
        type: this.mapGatewayEventType(message.event),
        sessionId: message.sessionId || 'unknown',
        timestamp: message.payload?.ts ? new Date(message.payload.ts).toISOString() : new Date().toISOString(),
        data: message.payload || {},
      };
    } else {
      // Already in our format or unknown format
      event = message as OpenClawEvent;
    }
    
    // Emit to type-specific listeners
    const typeListeners = this.listeners.get(event.type);
    if (typeListeners) {
      typeListeners.forEach(callback => callback(event));
    }

    // Emit to wildcard listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach(callback => callback(event));
    }
  }
  
  private mapGatewayEventType(gatewayEvent: string): OpenClawEventType {
    // Map Gateway event names to our event types
    const eventMap: Record<string, OpenClawEventType> = {
      'agent.thinking': 'agent_thinking',
      'agent.tool_call': 'agent_tool_call',
      'agent.response': 'agent_response',
      'span.start': 'span_start',
      'span.end': 'span_end',
      'session.update': 'session_update',
      'cost.update': 'cost_update',
      'approval.required': 'approval_required',
      'error': 'error',
    };
    
    return eventMap[gatewayEvent] || 'session_update';
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    
    console.log(`[OpenClaw] Reconnecting in ${this.config.reconnectIntervalMs}ms...`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch(error => {
        console.error('[OpenClaw] Reconnect failed:', error);
      });
    }, this.config.reconnectIntervalMs);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

// Singleton instance
let clientInstance: OpenClawClient | null = null;

export function getOpenClawClient(config?: OpenClawConfig): OpenClawClient {
  if (!clientInstance) {
    clientInstance = new OpenClawClient(config);
  }
  return clientInstance;
}

// AG-UI Protocol Mapper
// Maps OpenClaw events to AG-UI protocol
export function mapToAGUIEvent(openclawEvent: OpenClawEvent): AGUIEvent {
  switch (openclawEvent.type) {
    case 'agent_thinking':
      return {
        type: 'thinking_start',
        data: openclawEvent.data,
        timestamp: new Date(openclawEvent.timestamp),
      };
    
    case 'agent_tool_call':
      return {
        type: 'tool_call_start',
        data: openclawEvent.data,
        timestamp: new Date(openclawEvent.timestamp),
      };
    
    case 'agent_response':
      return {
        type: 'text_stream',
        data: openclawEvent.data,
        timestamp: new Date(openclawEvent.timestamp),
      };
    
    case 'span_start':
    case 'span_end':
      return {
        type: 'state_sync',
        data: openclawEvent.data,
        timestamp: new Date(openclawEvent.timestamp),
      };
    
    case 'approval_required':
      return {
        type: 'approval_request',
        data: openclawEvent.data,
        timestamp: new Date(openclawEvent.timestamp),
      };
    
    case 'error':
      return {
        type: 'error',
        data: openclawEvent.data,
        timestamp: new Date(openclawEvent.timestamp),
      };
    
    default:
      return {
        type: 'state_sync',
        data: openclawEvent.data,
        timestamp: new Date(openclawEvent.timestamp),
      };
  }
}
