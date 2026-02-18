/**
 * OpenClaw Gateway Client
 * Protocol: Direct WebSocket to ws://127.0.0.1:18789
 * Auth: Event-based handshake (connect.challenge -> connect.response)
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
  private pendingRequests = new Map<number, { resolve: (data: any) => void; reject: (err: any) => void; timeout: number }>();
  
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
      // Create WebSocket without subprotocol - Gateway doesn't require it
      this.ws = new WebSocket(this.url);
      
      // Important: Don't send anything until we get connect.challenge
      this.ws.onopen = () => {
        console.log('[Gateway] 🔌 WebSocket opened, waiting for challenge...');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (err) {
          console.error('[Gateway] ❌ Parse error:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[Gateway] ❌ WebSocket error:', error);
        this.emit('connectionChange', 'disconnected');
      };

      this.ws.onclose = (event) => {
        console.log(`[Gateway] 🔌 Closed: code=${event.code} reason="${event.reason}"`);
        this.authenticated = false;
        this.emit('connectionChange', 'disconnected');
        this.clearPendingRequests();
        this.scheduleReconnect();
      };
    } catch (err) {
      console.error('[Gateway] ❌ Connection failed:', err);
      this.emit('connectionChange', 'disconnected');
      this.scheduleReconnect();
    }
  }

  private clearPendingRequests() {
    this.pendingRequests.forEach(({ timeout }) => clearTimeout(timeout));
    this.pendingRequests.clear();
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    
    console.log('[Gateway] 🔄 Will reconnect in 3s...');
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.createConnection();
    }, 3000);
  }

  private async handleAuthChallenge(payload: any) {
    console.log('[Gateway] 🔐 Got challenge, nonce:', payload.nonce?.substring(0, 8) + '...');
    
    try {
      // Send response - Gateway will auto-approve localhost
      const response = {
        type: 'connect.response',
        payload: {
          nonce: payload.nonce,
          deviceId: `sint-dashboard-${Date.now()}`,
          deviceName: 'SINT Agent Dashboard',
          deviceType: 'browser'
        }
      };
      
      console.log('[Gateway] 📤 Sending auth response...');
      this.send(response);
    } catch (err) {
      console.error('[Gateway] ❌ Auth failed:', err);
      this.emit('connectionChange', 'disconnected');
    }
  }

  private handleAuthSuccess() {
    console.log('[Gateway] ✅ Authenticated!');
    this.authenticated = true;
    this.emit('connectionChange', 'connected');
    
    // Give Gateway a moment to settle, then fetch data
    setTimeout(() => {
      this.fetchSessions();
    }, 100);
  }

  private async fetchSessions() {
    try {
      console.log('[Gateway] 🔍 Fetching sessions...');
      
      const response = await this.call('sessions.list', { 
        activeMinutes: 1440, // Last 24 hours
        limit: 50,
        messageLimit: 1 // Get last message for context
      });
      
      console.log('[Gateway] 📦 Response:', response);
      
      if (response && response.sessions && Array.isArray(response.sessions)) {
        console.log(`[Gateway] 👥 Found ${response.sessions.length} sessions`);
        
        const agents: Agent[] = response.sessions.map((session: any, index: number) => {
          const agent = {
            id: session.sessionKey || session.key || `session-${index}`,
            name: this.getSessionName(session),
            status: this.getSessionStatus(session),
            task: this.getSessionTask(session),
            cost: this.calculateSessionCost(session)
          };
          console.log(`[Gateway] 🤖 ${agent.name}:`, agent.status, agent.cost > 0 ? `$${agent.cost.toFixed(2)}` : '');
          return agent;
        });
        
        this.emit('agentsUpdate', agents);
      } else {
        console.log('[Gateway] ⚠️ No sessions in response');
        this.emit('agentsUpdate', []);
      }
    } catch (err) {
      console.error('[Gateway] ❌ Failed to fetch sessions:', err);
      this.emit('agentsUpdate', []);
    }
  }

  private getSessionName(session: any): string {
    if (session.name) return session.name;
    
    if (session.sessionKey) {
      // Parse "agent:main:channel:type:id..."
      const parts = session.sessionKey.split(':');
      if (parts.length >= 2) {
        return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      }
    }
    
    return session.agentId || 'Agent';
  }

  private getSessionStatus(session: any): 'active' | 'idle' | 'error' {
    if (session.age) {
      const age = session.age.toLowerCase();
      if (age.includes('second') || age.includes('just now')) return 'active';
      if (age.includes('minute')) {
        const mins = parseInt(age);
        return mins < 5 ? 'active' : 'idle';
      }
    }
    return 'idle';
  }

  private getSessionTask(session: any): string | undefined {
    // Try to get last message
    if (session.lastMessages && session.lastMessages.length > 0) {
      const last = session.lastMessages[0];
      const text = last.text || last.content || '';
      return text.slice(0, 50);
    }
    
    if (session.lastMessage) {
      const text = session.lastMessage.text || session.lastMessage.content || '';
      return text.slice(0, 50);
    }
    
    return undefined;
  }

  private calculateSessionCost(session: any): number {
    if (typeof session.cost === 'number') return session.cost;
    if (session.tokens?.cost) return session.tokens.cost;
    if (session.usage?.cost) return session.usage.cost;
    
    // Try to calculate from token counts
    if (session.tokens) {
      const total = (session.tokens.prompt || 0) + (session.tokens.completion || 0);
      // Rough estimate: $0.01 per 1K tokens
      return total / 1000 * 0.01;
    }
    
    return 0;
  }

  private handleMessage(data: any) {
    const type = data.type || data.event || data.method || 'unknown';
    console.log(`[Gateway] 📨 ${type}`);
    
    // Handle connect flow events
    if (data.type === 'event') {
      if (data.event === 'connect.challenge') {
        this.handleAuthChallenge(data.payload);
        return;
      }
      
      if (data.event === 'connect.ok') {
        this.handleAuthSuccess();
        return;
      }
      
      if (data.event === 'connect.error') {
        console.error('[Gateway] ❌ Auth error:', data.payload);
        this.emit('connectionChange', 'disconnected');
        return;
      }
    }

    // Handle JSON-RPC responses
    if (typeof data.id === 'number' && this.pendingRequests.has(data.id)) {
      const { resolve, reject, timeout } = this.pendingRequests.get(data.id)!;
      clearTimeout(timeout);
      this.pendingRequests.delete(data.id);
      
      if (data.error) {
        console.error(`[Gateway] ❌ RPC error:`, data.error);
        reject(data.error);
      } else {
        resolve(data.result || data);
      }
      return;
    }

    // Handle chat messages
    if (data.type === 'chat' || data.method === 'chat') {
      this.emit('message', {
        text: data.text || data.content || data.message || '',
        agentId: data.sessionKey || data.agentId,
        agentName: this.extractAgentName(data.sessionKey)
      });
      return;
    }
    
    // Handle approvals
    if (data.type === 'approval' || data.method === 'approval.required') {
      this.emit('approvalRequired', {
        id: data.id || Date.now().toString(),
        message: data.message || 'Approval required',
        action: data.action || data.description || 'unknown action'
      });
      return;
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

  private send(data: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not open');
    }
    this.ws.send(JSON.stringify(data));
  }

  async sendMessage(agentId: string, text: string) {
    try {
      console.log(`[Gateway] 💬 Sending to ${agentId.split(':')[1] || agentId}`);
      await this.call('chat.send', {
        sessionKey: agentId,
        message: text
      });
    } catch (err) {
      console.error('[Gateway] ❌ Send failed:', err);
      throw err;
    }
  }

  async sendApproval(approvalId: string, approved: boolean) {
    try {
      console.log(`[Gateway] ${approved ? '✅' : '❌'} Approval:`, approvalId);
      await this.call('approval.respond', {
        id: approvalId,
        approved
      });
    } catch (err) {
      console.error('[Gateway] ❌ Approval failed:', err);
      throw err;
    }
  }

  private call(method: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected'));
        return;
      }

      if (!this.authenticated) {
        reject(new Error('Not authenticated'));
        return;
      }

      const id = ++this.messageId;
      
      const message = {
        jsonrpc: '2.0',
        id,
        method,
        params
      };

      const timeout = window.setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Timeout: ${method}`));
        }
      }, 30000);

      this.pendingRequests.set(id, { resolve, reject, timeout });

      console.log(`[Gateway] 📤 ${method}`);
      this.send(message);
    });
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.clearPendingRequests();
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
        console.error(`[Gateway] ❌ Listener error (${event}):`, err);
      }
    });
  }
}
