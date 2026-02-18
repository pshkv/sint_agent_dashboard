/**
 * Simple OpenClaw Gateway Client
 * Connects to Gateway WebSocket at ws://127.0.0.1:18789
 */

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  task?: string;
  cost: number;
}

export class GatewayClient {
  private ws: WebSocket | null = null;
  private url: string = '';
  private reconnectTimer: number | null = null;
  private messageId = 0;
  private authenticated = false;
  private pendingRequests = new Map<number, { resolve: (data: any) => void; reject: (err: any) => void }>();
  
  private listeners: {
    connectionChange: Array<(status: 'connected' | 'disconnected') => void>;
    agentsUpdate: Array<(agents: Agent[]) => void>;
    message: Array<(msg: any) => void>;
    approvalRequired: Array<(approval: any) => void>;
  } = {
    connectionChange: [],
    agentsUpdate: [],
    message: [],
    approvalRequired: []
  };

  connect(url: string) {
    this.url = url;
    this.createConnection();
  }

  private createConnection() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('[Gateway] WebSocket opened, waiting for auth...');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (err) {
          console.error('[Gateway] Failed to parse message:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[Gateway] WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('[Gateway] Disconnected');
        this.authenticated = false;
        this.emit('connectionChange', 'disconnected');
        this.scheduleReconnect();
      };
    } catch (err) {
      console.error('[Gateway] Failed to connect:', err);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = window.setTimeout(() => {
      console.log('[Gateway] Reconnecting...');
      this.reconnectTimer = null;
      this.createConnection();
    }, 3000);
  }

  private async handleAuthChallenge(payload: any) {
    console.log('[Gateway] Handling auth challenge');
    
    // For local connections, we just respond to the challenge
    // The Gateway will auto-approve localhost connections
    try {
      const response = {
        type: 'connect.response',
        payload: {
          nonce: payload.nonce,
          // For localhost, no auth needed
          deviceId: 'sint-dashboard-' + Date.now(),
          deviceName: 'SINT Dashboard',
          deviceType: 'browser'
        }
      };
      
      this.ws?.send(JSON.stringify(response));
      console.log('[Gateway] Sent auth response');
    } catch (err) {
      console.error('[Gateway] Auth failed:', err);
    }
  }

  private handleAuthSuccess() {
    console.log('[Gateway] Authenticated successfully');
    this.authenticated = true;
    this.emit('connectionChange', 'connected');
    
    // Now we can subscribe and fetch data
    this.subscribeToEvents();
    this.fetchSessions();
  }

  private subscribeToEvents() {
    console.log('[Gateway] Subscribing to events...');
    // Subscribe to chat events
    this.call('chat.subscribe', {}).catch(err => {
      console.log('[Gateway] Chat subscribe not available:', err);
    });
  }

  private async fetchSessions() {
    try {
      console.log('[Gateway] Fetching sessions...');
      const response = await this.call('sessions.list', { 
        activeMinutes: 60,
        limit: 50 
      });
      
      console.log('[Gateway] Sessions response:', response);
      
      if (response.sessions) {
        // Convert sessions to agents
        const agents: Agent[] = response.sessions.map((session: any, index: number) => ({
          id: session.sessionKey || session.key || `agent-${index}`,
          name: this.getSessionName(session),
          status: this.getSessionStatus(session),
          task: session.lastMessage?.text?.slice(0, 50) || undefined,
          cost: this.calculateSessionCost(session)
        }));
        
        console.log('[Gateway] Emitting agents:', agents);
        this.emit('agentsUpdate', agents);
      }
    } catch (err) {
      console.error('[Gateway] Failed to fetch sessions:', err);
      // Emit empty agents list on error
      this.emit('agentsUpdate', []);
    }
  }

  private getSessionName(session: any): string {
    // Extract agent name from session key
    // Format: "agent:main:telegram:direct:..."
    if (session.sessionKey) {
      const parts = session.sessionKey.split(':');
      if (parts.length >= 2) {
        return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      }
    }
    return session.agentId || session.id || 'Agent';
  }

  private getSessionStatus(session: any): 'active' | 'idle' | 'error' {
    const ageMinutes = session.ageMinutes || 0;
    if (ageMinutes < 5) return 'active';
    if (ageMinutes < 60) return 'idle';
    return 'idle';
  }

  private calculateSessionCost(session: any): number {
    // Extract cost from tokens or messages
    if (session.tokens?.cost) return session.tokens.cost;
    if (session.cost) return session.cost;
    return 0;
  }

  private handleMessage(data: any) {
    console.log('[Gateway] Received:', data.type || data.method);
    
    // Handle auth flow
    if (data.type === 'event' && data.event === 'connect.challenge') {
      this.handleAuthChallenge(data.payload);
      return;
    }
    
    if (data.type === 'event' && data.event === 'connect.ok') {
      this.handleAuthSuccess();
      return;
    }
    
    if (data.type === 'event' && data.event === 'connect.error') {
      console.error('[Gateway] Auth error:', data.payload);
      this.emit('connectionChange', 'disconnected');
      return;
    }

    // Handle RPC responses
    if (typeof data.id === 'number' && this.pendingRequests.has(data.id)) {
      const pending = this.pendingRequests.get(data.id)!;
      this.pendingRequests.delete(data.id);
      
      if (data.error) {
        pending.reject(data.error);
      } else {
        pending.resolve(data.result || data);
      }
      return;
    }

    // Handle events
    switch (data.type || data.method) {
      case 'chat':
      case 'chat.message':
        this.emit('message', {
          text: data.text || data.content || data.message || '',
          agentId: data.sessionKey || data.agentId,
          agentName: this.extractAgentName(data.sessionKey)
        });
        break;
      
      case 'approval':
      case 'approval.required':
        this.emit('approvalRequired', {
          id: data.id || Date.now().toString(),
          message: data.message || 'Approval required',
          action: data.action || data.description || 'unknown action'
        });
        break;
      
      case 'sessions.update':
        if (data.sessions) {
          this.fetchSessions(); // Refresh session list
        }
        break;
      
      default:
        console.log('[Gateway] Unhandled message:', data);
    }
  }

  private extractAgentName(sessionKey?: string): string {
    if (!sessionKey) return 'Agent';
    const parts = sessionKey.split(':');
    if (parts.length >= 2) {
      return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    }
    return 'Agent';
  }

  async sendMessage(agentId: string, text: string) {
    try {
      await this.call('chat.send', {
        sessionKey: agentId,
        message: text
      });
    } catch (err) {
      console.error('[Gateway] Failed to send message:', err);
      throw err;
    }
  }

  async sendApproval(approvalId: string, approved: boolean) {
    try {
      await this.call('approval.respond', {
        id: approvalId,
        approved
      });
    } catch (err) {
      console.error('[Gateway] Failed to send approval:', err);
      throw err;
    }
  }

  private call(method: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected to Gateway'));
        return;
      }

      if (!this.authenticated && method !== 'connect.response') {
        reject(new Error('Not authenticated'));
        return;
      }

      const id = ++this.messageId;
      this.pendingRequests.set(id, { resolve, reject });

      const message = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      console.log('[Gateway] Sending:', method);
      this.ws.send(JSON.stringify(message));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Event listeners
  onConnectionChange(callback: (status: 'connected' | 'disconnected') => void) {
    this.listeners.connectionChange.push(callback);
  }

  onAgentsUpdate(callback: (agents: Agent[]) => void) {
    this.listeners.agentsUpdate.push(callback);
  }

  onMessage(callback: (msg: any) => void) {
    this.listeners.message.push(callback);
  }

  onApprovalRequired(callback: (approval: any) => void) {
    this.listeners.approvalRequired.push(callback);
  }

  private emit(event: keyof typeof this.listeners, data: any) {
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[Gateway] Error in ${event} listener:`, err);
      }
    });
  }
}
