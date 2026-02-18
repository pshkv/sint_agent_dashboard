import React, { useState } from 'react';
import { MessageSquare, ChevronRight, Clock, Hash } from 'lucide-react';

export interface ChatThread {
  id: string;
  title: string;
  messageCount: number;
  startTime: number;
  endTime: number;
  participants: string[];
  tags: string[];
  preview: string;
}

interface ChatThreadsProps {
  threads: ChatThread[];
  onSelectThread: (threadId: string) => void;
  selectedThreadId?: string;
}

export const ChatThreads: React.FC<ChatThreadsProps> = ({ 
  threads, 
  onSelectThread, 
  selectedThreadId 
}) => {
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  const toggleThread = (threadId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(threadId)) {
      newExpanded.delete(threadId);
    } else {
      newExpanded.add(threadId);
    }
    setExpandedThreads(newExpanded);
  };

  const formatDuration = (start: number, end: number) => {
    const duration = end - start;
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${Math.floor(duration / 1000)}s`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (threads.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No conversation threads yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Conversation Threads</h3>
        <span className="text-xs text-gray-500">{threads.length} threads</span>
      </div>

      {threads.map(thread => {
        const isExpanded = expandedThreads.has(thread.id);
        const isSelected = selectedThreadId === thread.id;

        return (
          <div
            key={thread.id}
            className={`border rounded-lg transition-all ${
              isSelected
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
            }`}
          >
            {/* Thread Header */}
            <div
              className="p-3 cursor-pointer"
              onClick={() => onSelectThread(thread.id)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-200 truncate">
                      {thread.title}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                      {thread.preview}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleThread(thread.id);
                  }}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Thread Metadata */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {thread.messageCount}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(thread.startTime, thread.endTime)}
                </span>
                {thread.tags.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {thread.tags[0]}
                    {thread.tags.length > 1 && ` +${thread.tags.length - 1}`}
                  </span>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="px-3 pb-3 pt-0 space-y-2 border-t border-gray-700/50">
                <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                  <div>
                    <span className="text-gray-500">Started:</span>
                    <div className="text-gray-300">{formatTime(thread.startTime)}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Ended:</span>
                    <div className="text-gray-300">{formatTime(thread.endTime)}</div>
                  </div>
                </div>

                {thread.participants.length > 0 && (
                  <div className="text-xs">
                    <span className="text-gray-500">Participants:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {thread.participants.map(participant => (
                        <span
                          key={participant}
                          className="px-2 py-0.5 bg-gray-700 rounded text-gray-300"
                        >
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {thread.tags.length > 0 && (
                  <div className="text-xs">
                    <span className="text-gray-500">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {thread.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Mock data generator
export const generateMockThreads = (): ChatThread[] => {
  const now = Date.now();
  return [
    {
      id: 'thread-1',
      title: 'SINT Dashboard Development',
      messageCount: 47,
      startTime: now - 25200000, // 7 hours ago
      endTime: now - 3600000, // 1 hour ago
      participants: ['User', 'SINT', 'Gateway'],
      tags: ['development', 'dashboard', 'react'],
      preview: 'Building the operator dashboard with 3-panel layout...',
    },
    {
      id: 'thread-2',
      title: 'Security Hardening Review',
      messageCount: 12,
      startTime: now - 86400000, // 1 day ago
      endTime: now - 82800000, // 23 hours ago
      participants: ['User', 'SINT'],
      tags: ['security', 'audit'],
      preview: 'Reviewing firewall rules and FileVault configuration...',
    },
    {
      id: 'thread-3',
      title: 'Notion Documentation Import',
      messageCount: 8,
      startTime: now - 172800000, // 2 days ago
      endTime: now - 169200000, // 47 hours ago
      participants: ['User', 'SINT', 'Sub-Agent'],
      tags: ['documentation', 'analysis'],
      preview: 'Importing 67 Notion pages for strategic analysis...',
    },
    {
      id: 'thread-4',
      title: 'GitHub Integration Setup',
      messageCount: 15,
      startTime: now - 172800000, // 2 days ago
      endTime: now - 169000000,
      participants: ['User', 'SINT'],
      tags: ['github', 'setup'],
      preview: 'Installing gh CLI and authenticating with GitHub...',
    },
  ];
};
