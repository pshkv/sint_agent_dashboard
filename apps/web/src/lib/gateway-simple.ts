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
        console.log('[Gateway] ✅ WebSocket connected, waiting for handshake...');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (err) {
          console.error('[Gateway] ❌ Failed to parse:', err);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[Gateway] ❌ WebSocket error:', error);
        this.emit('connectionChange', 'disconnected');
      };

      this.ws.onclose = () => {
        console.log('[Gateway] 🔌 Connection closed');
        this.authenticated = false;
        this.emit('connectionChange', 'disconnected');
        this.scheduleReconnect();
      };
    } catch (err) {
      console.error('[Gateway] ❌ Connection failed:', err);
      this.emit('connectionChange', 'disconnected');
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    
    this.reconnectTimer = window.setTimeout(() => {
      console.log('[Gateway] 🔄 Reconnecting...');
      this.reconnectTimer = null;
      this.createConnection();
    }, 3000);
  }

  private async handleAuthChallenge(payload: any) {
    console.log('[Gateway] 🔐 Handling auth challenge, nonce:', payload.nonce);
    
    try {
      // For localhost, send device info without crypto
      const response = {
        type: 'connect.response',
        payload: {
          nonce: payload.nonce,
          deviceId: `sint-dashboard-${Math.random().toString(36).substring(7)}`,
          deviceName: 'SINT Agent Dashboard',
          deviceType: 'browser',
          // Localhost doesn't need signature
        }
      };
      
      this.ws?.send(JSON.stringify(response));
      console.log('[Gateway] 📤 Sent auth response');
    } catch (err) {
      console.error('[Gateway] ❌ Auth failed:', err);
      this.emit('connectionChange', 'disconnected');
    }
  }

  private handleAuthSuccess() {
    console.log('[Gateway] ✅ Authenticated!');
    this.authenticated = true;
    this.emit('connectionChange', 'connected');
    
    // Give it a moment, then fetch data
    setTimeout(() => {
      this.subscribeToEvents();
      this.fetchSessions();
    }, 100);
  }

  private subscribeToEvents() {
    console.log('[Gateway] 📡 Subscribing to events...');
    
    // Try to subscribe to chat events (may not be supported)
    this.call('chat.subscribe', {}).catch(err => {
      console.log('[Gateway] ℹ️ Chat subscribe not available');
    });
  }

  private async fetchSessions() {
    try {
      console.log('[Gateway] 🔍 Fetching sessions...');
      
      const response = await this.call('sessions.list', { 
        activeMinutes: 1440, // Last 24 hours
        limit: 50 
      });
      
      console.log('[Gateway] 📦 Got response:', response);
      
      if (response && response.sessions && Array.isArray(response.sessions)) {
        console.log('[Gateway] 👥 Found', response.sessions.length, 'sessions');
        
        // Convert sessions to agents
        const agents: Agent[] = response.sessions.map((session: any, index: number) => {
          const agent = {
            id: session.sessionKey || session.key || `session-${index}`,
            name: this.getSessionName(session),
            status: this.getSessionStatus(session),
            task: this.getSessionTask(session),
            cost: this.calculateSessionCost(session)
          };
          console.log('[Gateway] 🤖 Agent:', agent);
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
    // Try different fields
    if (session.name) return session.name;
    
    // Extract from sessionKey: "agent:main:channel:..."
    if (session.sessionKey) {
      const parts = session.sessionKey.split(':');
      if (parts.length >= 2) {
        const name = parts[1];
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
    
    if (session.agentId) return session.agentId;
    if (session.key) return session.key.split(':')[1] || 'Agent';
    
    return 'Agent';
  }

  private getSessionStatus(session: any): 'active' | 'idle' | 'error' {
    // Check age
    if (session.age) {
      const ageStr = session.age.toLowerCase();
      if (ageStr.includes('second') || ageStr.includes('sec') || ageStr.includes('just now')) {
        return 'active';
      }
      if (ageStr.includes('minute') || ageStr.includes('min')) {
        const minutes = parseInt(ageStr);
        return minutes < 5 ? 'active' : 'idle';
      }
    }
    
    // Default to idle
    return 'idle';
  }

  private getSessionTask(session: any): string | undefined {
    // Try to get last message or activity
    if (session.lastMessage) {
      const text = session.lastMessage.text || session.lastMessage.content || '';
      return text.slice(0, 50);
    }
    
    if (session.currentTask) {
      return session.currentTask.slice(0, 50);
    }
    
    return undefined;
  }

  private calculateSessionCost(session: any): number {
    // Try different cost fields
    if (typeof session.cost === 'number') return session.cost;
    if (session.tokens?.cost) return session.tokens.cost;
    if (session.usage?.cost) return session.usage.cost;
    return 0;
  }

  private handleMessage(data: any) {
    // Log all messages for debugging
    const type = data.type || data.event || data.method || 'unknown';
    console.log(`[Gateway] 📨 ${type}`, data);
    
    // Handle event-based messages (connect flow)
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

    // Handle RPC responses
    if (typeof data.id === 'number' && this.pendingRequests.has(data.id)) {
      const pending = this.pendingRequests.get(data.id)!;
      this.pendingRequests.delete(data.id);
      
      if (data.error) {
        console.error('[Gateway] ❌ RPC error:', data.error);
        pending.reject(data.error);
      } else {
        pending.resolve(data.result || data);
      }
      return;
    }

    // Handle chat events
    if (data.type === 'chat' || data.method === 'chat') {
      this.emit('message', {
        text: data.text || data.content || data.message || '',
        agentId: data.sessionKey || data.agentId,
        agentName: this.extractAgentName(data.sessionKey)
      });
      return;
    }
    
    // Handle approval events
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

  async sendMessage(agentId: string, text: string) {
    try {
      console.log('[Gateway] 💬 Sending message to', agentId);
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
      console.log('[Gateway] ✅ Sending approval:', approved);
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

      console.log(`[Gateway] 📤 RPC: ${method}`);
      this.ws.send(JSON.stringify(message));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Timeout: ${method}`));
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
        console.error(`[Gateway] ❌ Listener error (${event}):`, err);
      }
    });
  }
}
