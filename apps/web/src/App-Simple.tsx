import { useState, useEffect } from 'react';
import { GatewayClient } from './lib/gateway-simple';
import { AgentCard } from './components/simple/AgentCard';
import { ChatWindow } from './components/simple/ChatWindow';
import { ApprovalGate } from './components/simple/ApprovalGate';
import { CostDisplay } from './components/simple/CostDisplay';
import { ActivityLog } from './components/simple/ActivityLog';
import { ErrorBanner } from './components/simple/ErrorBanner';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  task?: string;
  cost: number;
}

interface Message {
  id: string;
  from: 'user' | 'agent';
  text: string;
  timestamp: Date;
  agentId?: string;
}

interface ApprovalRequest {
  id: string;
  message: string;
  action: string;
}

interface Activity {
  id: string;
  timestamp: Date;
  text: string;
  agentId?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export default function App() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<ApprovalRequest | null>(null);
  const [totalCost, setTotalCost] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [gateway] = useState(() => new GatewayClient());

  useEffect(() => {
    // Connect to Gateway
    try {
      gateway.connect('ws://127.0.0.1:18789');
    } catch (err) {
      setError('Failed to connect to Gateway. Make sure OpenClaw is running.');
      setConnecting(false);
    }

    gateway.onConnectionChange((status) => {
      setConnected(status === 'connected');
      setConnecting(false);
      if (status === 'connected') {
        setError(null);
        addActivity('Connected to OpenClaw Gateway', 'success');
      } else {
        setError('Disconnected from Gateway. Reconnecting...');
        addActivity('Disconnected from Gateway', 'warning');
      }
    });

    gateway.onAgentsUpdate((agentList) => {
      setAgents(agentList);
      // Calculate total cost
      const total = agentList.reduce((sum, agent) => sum + agent.cost, 0);
      setTotalCost(total);
      
      if (agentList.length > 0 && !selectedAgent) {
        // Auto-select first agent
        setSelectedAgent(agentList[0].id);
      }
    });

    gateway.onMessage((msg) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        from: 'agent',
        text: msg.text,
        timestamp: new Date(),
        agentId: msg.agentId
      }]);

      // Add to activity log
      addActivity(`${msg.agentName || 'Agent'}: ${msg.text.slice(0, 50)}...`, 'info', msg.agentId);
      
      setSendingMessage(false);
    });

    gateway.onApprovalRequired((approval) => {
      setPendingApproval(approval);
      addActivity(`Approval required: ${approval.action}`, 'warning');
    });

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        input?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      gateway.disconnect();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gateway, selectedAgent]);

  const addActivity = (text: string, type: Activity['type'] = 'info', agentId?: string) => {
    setActivities(prev => [{
      id: Date.now().toString(),
      timestamp: new Date(),
      text,
      agentId,
      type
    }, ...prev].slice(0, 50)); // Keep last 50
  };

  const sendMessage = async (text: string) => {
    if (!selectedAgent) {
      setError('Please select an agent first');
      return;
    }

    // Add user message immediately
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      from: 'user',
      text,
      timestamp: new Date()
    }]);

    addActivity(`You: ${text.slice(0, 50)}...`, 'info');

    setSendingMessage(true);
    
    try {
      await gateway.sendMessage(selectedAgent, text);
    } catch (err) {
      setError(`Failed to send message: ${err}`);
      addActivity(`Error sending message: ${err}`, 'error');
      setSendingMessage(false);
    }
  };

  const handleApproval = async (approved: boolean) => {
    if (!pendingApproval) return;
    
    try {
      await gateway.sendApproval(pendingApproval.id, approved);
      
      addActivity(
        `${approved ? 'Approved' : 'Rejected'}: ${pendingApproval.action}`,
        approved ? 'success' : 'warning'
      );
      
      setPendingApproval(null);
    } catch (err) {
      setError(`Failed to send approval: ${err}`);
      addActivity(`Error with approval: ${err}`, 'error');
    }
  };

  const clearError = () => setError(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SINT Agent Dashboard</h1>
            <p className="text-sm text-gray-500">Simple agent management</p>
          </div>
          <div className="flex items-center gap-6">
            <CostDisplay cost={totalCost} />
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connecting ? 'bg-yellow-500 animate-pulse' : 
                connected ? 'bg-green-500' : 
                'bg-red-500'
              }`} />
              <span className="text-sm text-gray-600">
                {connecting ? 'Connecting...' : connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Agents */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Running Agents ({agents.length})
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
              title="Refresh agents"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          {connecting ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Connecting to OpenClaw Gateway...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium mb-2">No agents running</p>
              <p className="text-sm text-gray-400 mb-4">
                Start an agent in OpenClaw to see it here
              </p>
              <code className="text-xs bg-gray-100 px-3 py-1 rounded text-gray-600">
                openclaw status
              </code>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedAgent === agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Chat */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Chat {selectedAgent && agents.find(a => a.id === selectedAgent) && (
              <span className="text-gray-500 font-normal">
                with {agents.find(a => a.id === selectedAgent)?.name}
              </span>
            )}
          </h2>
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            disabled={!selectedAgent || !connected}
            loading={sendingMessage}
          />
        </section>

        {/* Approval Gate */}
        {pendingApproval && (
          <ApprovalGate
            approval={pendingApproval}
            onApprove={() => handleApproval(true)}
            onReject={() => handleApproval(false)}
          />
        )}

        {/* Activity Log */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h2>
          <ActivityLog activities={activities} />
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-500">
        <p>
          Press <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700">⌘K</kbd> to focus chat •{' '}
          <a href="https://docs.openclaw.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
            Documentation
          </a>
        </p>
      </footer>
    </div>
  );
}
