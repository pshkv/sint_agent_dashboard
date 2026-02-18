/**
 * Recent Activity Panel
 * Shows recent agents, sessions, and actions
 */

import { useState } from 'react';

interface ActivityItem {
  id: string;
  type: 'agent' | 'session' | 'cron';
  label: string;
  timestamp: string;
  icon: string;
  status?: 'active' | 'idle' | 'error';
}

// Mock data - will be replaced with real data when WebSocket is ready
const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'agent', label: 'main', timestamp: '2 min ago', icon: '🤖', status: 'active' },
  { id: '2', type: 'session', label: 'Chat #1234', timestamp: '5 min ago', icon: '💬', status: 'idle' },
  { id: '3', type: 'cron', label: 'Daily sync', timestamp: '1 hour ago', icon: '⏰', status: 'idle' },
  { id: '4', type: 'agent', label: 'research', timestamp: '2 hours ago', icon: '🔬', status: 'idle' },
];

export function RecentActivity() {
  const [activity] = useState<ActivityItem[]>(MOCK_ACTIVITY);
  const [filter, setFilter] = useState<'all' | 'agent' | 'session' | 'cron'>('all');

  const filtered = filter === 'all' 
    ? activity 
    : activity.filter((item) => item.type === filter);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-400';
      case 'idle':
        return 'bg-gray-300';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 text-xs rounded ${
              filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('agent')}
            className={`px-2 py-1 text-xs rounded ${
              filter === 'agent' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Agents
          </button>
          <button
            onClick={() => setFilter('session')}
            className={`px-2 py-1 text-xs rounded ${
              filter === 'session' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Sessions
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No {filter === 'all' ? '' : filter} activity yet
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="relative flex-shrink-0">
                <span className="text-2xl">{item.icon}</span>
                {item.status && (
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusColor(
                      item.status
                    )}`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{item.label}</div>
                <div className="text-xs text-gray-500">{item.timestamp}</div>
              </div>
              <div className="flex-shrink-0 text-gray-400 text-xs">
                {item.type}
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
            View All Activity →
          </button>
        </div>
      )}
    </div>
  );
}
