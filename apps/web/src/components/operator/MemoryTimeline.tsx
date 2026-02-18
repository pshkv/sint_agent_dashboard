import React from 'react';
import { TrendingUp, Clock, Zap, Archive } from 'lucide-react';

interface MemoryEvent {
  id: string;
  timestamp: number;
  type: 'create' | 'promote' | 'access' | 'archive';
  fromTier?: 'M0' | 'M1' | 'M2' | 'M3';
  toTier?: 'M0' | 'M1' | 'M2' | 'M3';
  content: string;
  reason?: string;
  accessCount?: number;
}

interface MemoryTimelineProps {
  events: MemoryEvent[];
  memoryId: string;
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ events }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getEventIcon = (type: MemoryEvent['type']) => {
    switch (type) {
      case 'create':
        return <Zap className="w-4 h-4 text-green-400" />;
      case 'promote':
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      case 'access':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventColor = (type: MemoryEvent['type']) => {
    switch (type) {
      case 'create':
        return 'border-green-500 bg-green-500/10';
      case 'promote':
        return 'border-blue-500 bg-blue-500/10';
      case 'access':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'archive':
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'M0': return 'text-blue-400';
      case 'M1': return 'text-green-400';
      case 'M2': return 'text-yellow-400';
      case 'M3': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-300">Memory Evolution</h3>
        <span className="text-xs text-gray-500">{events.length} events</span>
      </div>

      <div className="relative pl-6 space-y-4">
        {/* Timeline Line */}
        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-700" />

        {events.map((event) => (
          <div key={event.id} className="relative">
            {/* Timeline Dot */}
            <div className={`absolute -left-6 mt-1 w-4 h-4 rounded-full border-2 ${getEventColor(event.type)} flex items-center justify-center`}>
              <div className="w-2 h-2 rounded-full bg-current" />
            </div>

            {/* Event Card */}
            <div className={`p-3 rounded-lg border ${getEventColor(event.type)} space-y-2`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getEventIcon(event.type)}
                  <span className="text-xs font-medium text-gray-300 capitalize">
                    {event.type}
                  </span>
                  {event.type === 'promote' && event.fromTier && event.toTier && (
                    <span className="text-xs text-gray-400">
                      <span className={getTierColor(event.fromTier)}>{event.fromTier}</span>
                      {' → '}
                      <span className={getTierColor(event.toTier)}>{event.toTier}</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTime(event.timestamp)}
                </span>
              </div>

              <p className="text-sm text-gray-300 line-clamp-2">
                {event.content}
              </p>

              {event.reason && (
                <div className="text-xs text-gray-400 italic border-l-2 border-gray-600 pl-2">
                  {event.reason}
                </div>
              )}

              {event.accessCount !== undefined && (
                <div className="text-xs text-gray-500">
                  Accessed {event.accessCount} times
                </div>
              )}
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No events recorded yet
          </div>
        )}
      </div>
    </div>
  );
};

// Mock data generator for testing
export const generateMockMemoryEvents = (memoryId: string): MemoryEvent[] => {
  const now = Date.now();
  return [
    {
      id: `${memoryId}-1`,
      timestamp: now - 172800000, // 2 days ago
      type: 'create',
      toTier: 'M0',
      content: 'Initial memory creation: User prefers dark mode in all applications',
    },
    {
      id: `${memoryId}-2`,
      timestamp: now - 86400000, // 1 day ago
      type: 'access',
      content: 'Referenced during UI customization task',
      accessCount: 3,
    },
    {
      id: `${memoryId}-3`,
      timestamp: now - 43200000, // 12 hours ago
      type: 'promote',
      fromTier: 'M0',
      toTier: 'M1',
      content: 'Promoted to M1 due to frequent access (5 times in 24h)',
      reason: 'High access frequency indicates important preference',
    },
    {
      id: `${memoryId}-4`,
      timestamp: now - 7200000, // 2 hours ago
      type: 'access',
      content: 'Referenced during theme selection',
      accessCount: 8,
    },
    {
      id: `${memoryId}-5`,
      timestamp: now - 3600000, // 1 hour ago
      type: 'promote',
      fromTier: 'M1',
      toTier: 'M2',
      content: 'Promoted to M2: Core user preference pattern established',
      reason: 'Consistent behavior across multiple sessions',
    },
  ];
};
