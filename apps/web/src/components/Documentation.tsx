/**
 * Documentation Panel
 * Quick help, tips, and useful links
 */

interface DocLink {
  title: string;
  description: string;
  url: string;
  icon: string;
}

const DOC_LINKS: DocLink[] = [
  {
    title: 'OpenClaw Docs',
    description: 'Complete documentation and guides',
    url: 'https://docs.openclaw.ai',
    icon: '📚',
  },
  {
    title: 'GitHub',
    description: 'Source code and issues',
    url: 'https://github.com/openclaw/openclaw',
    icon: '🔗',
  },
  {
    title: 'Discord Community',
    description: 'Get help and share ideas',
    url: 'https://discord.com/invite/clawd',
    icon: '💬',
  },
  {
    title: 'ClawHub',
    description: 'Find and share agent skills',
    url: 'https://clawhub.com',
    icon: '🎯',
  },
];

interface QuickTip {
  tip: string;
  icon: string;
}

const QUICK_TIPS: QuickTip[] = [
  { tip: 'Use keyboard shortcuts for faster navigation', icon: '⚡' },
  { tip: 'Cron jobs can automate recurring tasks', icon: '⏰' },
  { tip: 'Enable caching to reduce API costs', icon: '💰' },
  { tip: 'Use Gemini Flash for free development', icon: '✨' },
  { tip: 'Sessions list shows all active agents', icon: '🤖' },
];

export function Documentation() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Help & Resources</h3>
      
      {/* Quick Tips */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">💡 Quick Tips</h4>
        <div className="space-y-1.5">
          {QUICK_TIPS.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm">
              <span className="flex-shrink-0 mt-0.5">{tip.icon}</span>
              <span className="text-gray-600">{tip.tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Documentation Links */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">📖 Documentation</h4>
        <div className="space-y-2">
          {DOC_LINKS.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="flex-shrink-0 text-xl">{link.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">{link.title}</div>
                <div className="text-xs text-gray-500">{link.description}</div>
              </div>
              <svg
                className="flex-shrink-0 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Dashboard Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">🎯 Dashboard Info</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>Mode:</span>
            <span className="font-mono text-gray-900">Hybrid (iframe + widgets)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Protocol:</span>
            <span className="font-mono text-gray-900">WebSocket v3</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Version:</span>
            <span className="font-mono text-gray-900">1.0.0</span>
          </div>
        </div>
      </div>

      {/* Protocol Note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 mt-0.5">💡</span>
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Custom WebSocket client coming soon</p>
            <p className="text-blue-700">
              Currently using iframe embed. Direct WebSocket implementation requires Ed25519 
              signature support (~5h work). See WEBSOCKET-PROTOCOL-NOTES.md for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
