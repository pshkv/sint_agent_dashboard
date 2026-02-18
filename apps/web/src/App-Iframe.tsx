/**
 * SINT Dashboard - Hybrid Approach
 * Wraps OpenClaw's Control UI with enhanced features
 */

import { useState, useEffect } from 'react';

export default function App() {
  const [stats, setStats] = useState({ sessions: 0, cost: 0 });
  const [showInfo, setShowInfo] = useState(true);

  // Fetch stats from Gateway (if we can)
  useEffect(() => {
    // TODO: Add stats fetching when WebSocket client is ready
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">SINT Agent Dashboard</h1>
              <p className="text-sm text-blue-100">OpenClaw Control Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="bg-blue-800 bg-opacity-50 px-3 py-1.5 rounded-lg">
                <span className="text-blue-200">Sessions:</span>{' '}
                <span className="font-semibold">{stats.sessions}</span>
              </div>
              <div className="bg-blue-800 bg-opacity-50 px-3 py-1.5 rounded-lg">
                <span className="text-blue-200">Cost:</span>{' '}
                <span className="font-semibold">${stats.cost.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 rounded-lg text-sm font-medium transition-colors"
                title="Toggle info"
              >
                ℹ️ Info
              </button>
              <a 
                href="http://127.0.0.1:18789/" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 rounded-lg text-sm font-medium transition-colors"
                title="Open in new tab"
              >
                🔗 New Tab
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      {showInfo && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              💡
            </div>
            <div>
              <p className="font-medium text-yellow-900">
                Using OpenClaw's official Control UI
              </p>
              <p className="text-yellow-700">
                Full WebSocket client coming soon. See WEBSOCKET-PROTOCOL-NOTES.md for details.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="text-yellow-600 hover:text-yellow-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* OpenClaw Control UI */}
      <div className="flex-1 relative overflow-hidden">
        <iframe
          src="http://127.0.0.1:18789/"
          className="absolute inset-0 w-full h-full border-0"
          title="OpenClaw Control UI"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-2 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div>
            <span className="font-medium">SINT Dashboard</span> • 
            <span className="ml-2">Powered by OpenClaw</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://docs.openclaw.ai" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              📚 Docs
            </a>
            <a 
              href="https://github.com/openclaw/openclaw" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              🔗 GitHub
            </a>
            <span className="text-gray-400">v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
