import { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage, ToolCall, Agent } from '../../lib/mockData';
import { ApprovalGate } from './ApprovalGate';
import { useOperatorStore } from '../../stores/operatorStore';
import { getOpenClawClient } from '../../lib/openclawClient';
import { ChatSearch, ChatSearchFilters } from './ChatSearch';
import { ChatThreads, generateMockThreads } from './ChatThreads';
import { ChatExport, ExportOptions, exportToMarkdown, exportToJSON, exportToText } from './ChatExport';
import { List, MessageSquare } from 'lucide-react';

interface PendingApproval {
  id: string;
  action: string;
  description: string;
  tool: string;
  input: any;
  policyRule?: string;
}

interface ChatPanelEnhancedProps {
  agent: Agent | null;
  model?: string;
  session?: string;
}

export function ChatPanelEnhanced({ agent, model = 'claude-sonnet-4-5', session = 'main' }: ChatPanelEnhancedProps) {
  // Get messages from store
  const messages = useOperatorStore((state) => state.messages);
  const addMessage = useOperatorStore((state) => state.addMessage);
  const isAgentThinking = useOperatorStore((state) => state.isAgentThinking);
  
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingApproval, setPendingApproval] = useState<PendingApproval | null>(null);
  const [viewMode, setViewMode] = useState<'chat' | 'threads'>('chat');
  const [searchFilters, setSearchFilters] = useState<ChatSearchFilters | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock threads data
  const threads = useMemo(() => generateMockThreads(), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Listen for approval required events from Gateway
  useEffect(() => {
    const handleApprovalRequired = (e: CustomEvent) => {
      const approval = e.detail;
      setPendingApproval({
        id: approval.id,
        action: approval.action,
        description: approval.description,
        tool: approval.tool,
        input: approval.input,
        policyRule: approval.policyRule,
      });
    };
    
    window.addEventListener('openclaw:approval-required', handleApprovalRequired as EventListener);
    
    return () => {
      window.removeEventListener('openclaw:approval-required', handleApprovalRequired as EventListener);
    };
  }, []);

  // Filter messages based on search
  const filteredMessages = useMemo(() => {
    if (!searchFilters) return messages;

    let filtered = [...messages];

    // Role filter
    if (searchFilters.role !== 'all') {
      filtered = filtered.filter(msg => msg.role === searchFilters.role);
    }

    // Text search
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.content.toLowerCase().includes(query)
      );
    }

    // Tool calls filter
    if (searchFilters.hasTools !== null) {
      filtered = filtered.filter(msg => {
        const hasTools = msg.toolCalls && msg.toolCalls.length > 0;
        return searchFilters.hasTools ? hasTools : !hasTools;
      });
    }

    // Date range filter
    if (searchFilters.dateRange !== 'all') {
      const now = Date.now();
      const ranges: Record<string, number> = {
        today: 86400000,
        week: 604800000,
        month: 2592000000,
      };
      const cutoff = now - ranges[searchFilters.dateRange];
      filtered = filtered.filter(msg => msg.timestamp.getTime() > cutoff);
    }

    return filtered;
  }, [messages, searchFilters]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    addMessage(newMessage);
    const userInput = input;
    setInput('');
    
    // Send message to Gateway (if not in demo mode)
    const client = getOpenClawClient();
    if (client.isConnected() && !client['config'].mockMode) {
      client.sendUserMessage(userInput, session);
      setIsStreaming(true);
      return;
    }
    
    // Demo mode response
    setIsStreaming(true);
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'agent',
        content: `Processing "${userInput}"...`,
        timestamp: new Date(),
        toolCalls: [
          {
            id: `tool-${Date.now()}`,
            tool: 'web_search',
            status: 'pending_approval',
            input: { query: userInput },
            output: null,
            duration: 0,
          },
        ],
      };
      addMessage(botMessage);
      setIsStreaming(false);
    }, 1000);
  };

  const handleApprove = (id: string, reason?: string) => {
    const client = getOpenClawClient();
    client.sendApproval(id, true, reason);
    setPendingApproval(null);
  };

  const handleReject = (id: string, reason?: string) => {
    const client = getOpenClawClient();
    client.sendApproval(id, false, reason);
    setPendingApproval(null);
  };

  const handleSearch = (filters: ChatSearchFilters) => {
    setSearchFilters(filters);
  };

  const handleClearSearch = () => {
    setSearchFilters(null);
  };

  const handleExport = async (options: ExportOptions) => {
    const messagesToExport = searchFilters ? filteredMessages : messages;
    
    let content: string;
    let filename: string;
    const date = new Date().toISOString().split('T')[0];

    switch (options.format) {
      case 'markdown':
        content = exportToMarkdown(messagesToExport, options);
        filename = `chat-export-${date}.md`;
        break;
      case 'json':
        content = exportToJSON(messagesToExport, options);
        filename = `chat-export-${date}.json`;
        break;
      case 'txt':
        content = exportToText(messagesToExport, options);
        filename = `chat-export-${date}.txt`;
        break;
    }

    // Download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setViewMode('chat');
    // In real implementation, load messages for this thread
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0F1E]">
      {/* Header with Search & Controls */}
      <div className="border-b border-[rgba(255,255,255,0.05)] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-sm font-semibold text-[#F9FAFB]">
                {agent?.name || 'SINT Agent'}
              </h3>
              <p className="text-xs text-[#6B7280]">{model}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-800 rounded p-1">
              <button
                onClick={() => setViewMode('chat')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'chat'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <List className="w-3 h-3" />
                Chat
              </button>
              <button
                onClick={() => setViewMode('threads')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'threads'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                Threads
              </button>
            </div>

            {/* Export Button */}
            <ChatExport
              onExport={handleExport}
              messageCount={filteredMessages.length}
            />
          </div>
        </div>

        {/* Search Bar (only in chat view) */}
        {viewMode === 'chat' && (
          <ChatSearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            resultCount={searchFilters ? filteredMessages.length : undefined}
          />
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'threads' ? (
          <ChatThreads
            threads={threads}
            onSelectThread={handleSelectThread}
            selectedThreadId={selectedThreadId}
          />
        ) : (
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchFilters ? (
                  <>
                    <p className="text-sm mb-2">No messages match your search</p>
                    <button
                      onClick={handleClearSearch}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Clear filters
                    </button>
                  </>
                ) : (
                  <p className="text-sm">No messages yet. Start a conversation below.</p>
                )}
              </div>
            ) : (
              filteredMessages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}
            
            {isAgentThinking && (
              <div className="flex items-center gap-2 text-[#9CA3AF] text-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                Agent is thinking...
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Approval Gate */}
      {pendingApproval && (
        <div className="border-t border-[rgba(255,255,255,0.05)] p-4">
          <ApprovalGate
            action={pendingApproval.action}
            description={pendingApproval.description}
            tool={pendingApproval.tool}
            input={pendingApproval.input}
            policyRule={pendingApproval.policyRule}
            onApprove={() => handleApprove(pendingApproval.id)}
            onReject={() => handleReject(pendingApproval.id)}
            onEdit={(edited) => console.log('Edited:', edited)}
          />
        </div>
      )}

      {/* Input Area (only in chat view) */}
      {viewMode === 'chat' && (
        <form onSubmit={handleSend} className="border-t border-[rgba(255,255,255,0.05)] p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${agent?.name || 'agent'}...`}
              className="flex-1 px-4 py-2 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#F9FAFB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] placeholder-[#6B7280]"
              disabled={isStreaming}
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="px-6 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStreaming ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser
            ? 'bg-[#3B82F6] text-white'
            : isSystem
            ? 'bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#9CA3AF]'
            : 'bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB]'
        }`}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>

        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.1)] space-y-2">
            {message.toolCalls.map((tool, idx) => (
              <ToolCallCard key={idx} tool={tool} />
            ))}
          </div>
        )}

        {message.timestamp && (
          <div className="mt-2 text-xs opacity-60">
            {message.timestamp.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolCallCard({ tool }: { tool: ToolCall }) {
  const statusColors: Record<string, string> = {
    pending_approval: 'text-[#F59E0B]',
    success: 'text-[#10B981]',
    error: 'text-[#EF4444]',
  };

  return (
    <div className="bg-[rgba(0,0,0,0.2)] rounded p-2 text-xs">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[#9CA3AF]">{tool.tool}</span>
        <span className={statusColors[tool.status] || 'text-gray-400'}>{tool.status}</span>
      </div>
      {tool.output && (
        <div className="text-[#6B7280] mt-1 truncate">{String(tool.output)}</div>
      )}
    </div>
  );
}
