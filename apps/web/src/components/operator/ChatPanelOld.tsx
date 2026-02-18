import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ToolCall, mockChatMessages, Agent } from '../../lib/mockData';

interface ChatPanelProps {
  agent: Agent | null;
  model?: string;
  session?: string;
}

export function ChatPanel({ agent, model = 'claude-sonnet-4-5', session = 'main' }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate agent response
    setIsStreaming(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        role: 'agent',
        content: `I'll help you with that...`,
        timestamp: new Date(),
        agentStatus: 'thinking',
      }]);
      setIsStreaming(false);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top Bar */}
      <div className="border-b border-[rgba(255,255,255,0.05)] px-6 py-4 bg-[#141b2e]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {agent && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{agent.avatar}</span>
                <div>
                  <div className="font-semibold text-[#F9FAFB]">{agent.name}</div>
                  <div className="text-xs text-[#9CA3AF]">{agent.role}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Model Selector */}
            <select 
              value={model}
              className="px-3 py-1.5 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] rounded-md text-sm text-[#D1D5DB] focus:border-[#3B82F6] focus:outline-none"
            >
              <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="opus-4.6">Opus 4.6</option>
            </select>

            {/* Session Selector */}
            <select 
              value={session}
              className="px-3 py-1.5 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] rounded-md text-sm text-[#D1D5DB] focus:border-[#3B82F6] focus:outline-none"
            >
              <option value="main">Main Session</option>
              <option value="dm">DM Session</option>
              <option value="group">Group Session</option>
            </select>

            {/* Actions */}
            <button className="px-3 py-1.5 text-sm text-[#D1D5DB] hover:text-[#F9FAFB] transition-colors">
              New Session
            </button>
            <button className="px-3 py-1.5 text-sm text-[#D1D5DB] hover:text-[#F9FAFB] transition-colors">
              Compact
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isStreaming && (
          <div className="flex items-center gap-2 text-[#9CA3AF] text-sm">
            <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></div>
            <span>Thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-[rgba(255,255,255,0.05)] p-4 bg-[#141b2e]">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Message your agent..."
              className="w-full px-4 py-3 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] rounded-lg text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#3B82F6] focus:outline-none resize-none"
              rows={1}
            />
          </div>
          
          <button
            type="button"
            className="p-3 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[#141b2e] transition-all"
            title="Voice input"
          >
            🎤
          </button>
          
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#1e2740] disabled:text-[#6B7280] text-white rounded-lg font-medium transition-all"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${isUser ? 'ml-12' : 'mr-12'}`}>
        {/* Message Header */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs text-[#9CA3AF]">
            {message.role === 'user' ? 'You' : message.role === 'agent' ? 'Agent' : message.role === 'tool' ? 'Tool' : 'System'}
          </span>
          {message.agentStatus && (
            <span className="text-xs text-[#6B7280]">
              • {message.agentStatus.replace('_', ' ')}
            </span>
          )}
          <span className="text-xs text-[#6B7280]">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Message Content */}
        <div className={`
          px-4 py-3 rounded-lg
          ${isUser 
            ? 'bg-[#3B82F6] text-white' 
            : isTool
              ? 'bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#9CA3AF] font-mono text-sm'
              : 'bg-[#141b2e] border border-[rgba(255,255,255,0.05)] text-[#F9FAFB]'
          }
        `}>
          {message.content}
        </div>

        {/* Tool Calls */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.toolCalls.map((toolCall) => (
              <ToolCallCard key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolCallCard({ toolCall }: { toolCall: ToolCall }) {
  const [expanded, setExpanded] = useState(false);
  
  const statusColor = toolCall.status === 'success' ? 'text-[#10B981]' : 'text-[#EF4444]';
  const statusBg = toolCall.status === 'success' ? 'bg-[rgba(16,185,129,0.1)]' : 'bg-[rgba(239,68,68,0.1)]';

  return (
    <div className="bg-[#1e2740] border border-[rgba(255,255,255,0.1)] rounded-lg p-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 ${statusBg} ${statusColor} rounded text-xs font-mono`}>
            {toolCall.tool}
          </span>
          <span className="text-sm text-[#D1D5DB]">
            {toolCall.duration}ms
          </span>
          <span className={`text-xs ${statusColor}`}>
            {toolCall.status === 'success' ? '✓' : '✗'}
          </span>
        </div>
        <span className="text-[#9CA3AF]">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 text-sm">
          <div>
            <div className="text-xs text-[#9CA3AF] mb-1">Input:</div>
            <pre className="bg-[#0A0F1E] p-2 rounded text-xs text-[#D1D5DB] overflow-x-auto">
              {JSON.stringify(toolCall.input, null, 2)}
            </pre>
          </div>
          {toolCall.output && (
            <div>
              <div className="text-xs text-[#9CA3AF] mb-1">Output:</div>
              <pre className="bg-[#0A0F1E] p-2 rounded text-xs text-[#D1D5DB] overflow-x-auto">
                {JSON.stringify(toolCall.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
