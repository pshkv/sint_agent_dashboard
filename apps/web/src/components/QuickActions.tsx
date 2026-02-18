/**
 * Quick Actions Panel
 * Keyboard shortcuts and common actions
 */

interface QuickAction {
  key: string;
  label: string;
  description: string;
  icon: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { key: '/', label: 'Search', description: 'Search sessions, agents, or commands', icon: '🔍' },
  { key: '?', label: 'Help', description: 'Show keyboard shortcuts', icon: '❓' },
  { key: 'n', label: 'New Chat', description: 'Start new chat session', icon: '💬' },
  { key: 'c', label: 'Cron Jobs', description: 'View scheduled tasks', icon: '⏰' },
  { key: 's', label: 'Sessions', description: 'List all sessions', icon: '📋' },
  { key: 'd', label: 'Devices', description: 'Manage paired devices', icon: '📱' },
  { key: 'u', label: 'Usage', description: 'View costs and usage', icon: '💰' },
  { key: 'l', label: 'Logs', description: 'Live log viewer', icon: '📝' },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.key}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            title={action.description}
          >
            <div className="flex-shrink-0 text-2xl">{action.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{action.label}</span>
                <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
                  {action.key}
                </kbd>
              </div>
              <p className="text-xs text-gray-500 truncate">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">?</kbd> in Control UI for more shortcuts
        </p>
      </div>
    </div>
  );
}
