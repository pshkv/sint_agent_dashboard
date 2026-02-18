/**
 * SINT Dashboard - Final Version
 * Full-featured hybrid dashboard with tabbed sidebar
 */

import { useState } from 'react';
import { QuickActions } from './components/QuickActions';
import { SystemStatus } from './components/SystemStatus';
import { CostTracker } from './components/CostTracker';
import { RecentActivity } from './components/RecentActivity';
import { Documentation } from './components/Documentation';

type SidebarTab = 'overview' | 'actions' | 'costs' | 'activity' | 'help';

export default function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [activeTab, setActiveTab] = useState<SidebarTab>('overview');

  const tabs: { id: SidebarTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'actions', label: 'Actions', icon: '⚡' },
    { id: 'costs', label: 'Costs', icon: '💰' },
    { id: 'activity', label: 'Activity', icon: '📈' },
    { id: 'help', label: 'Help', icon: '❓' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">SINT</h1>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Agent Dashboard</span>
              <span className="text-xs text-blue-200">OpenClaw Control Center</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 rounded-lg text-sm font-medium transition-colors"
              title="Toggle info banner"
            >
              ℹ️
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 rounded-lg text-sm font-medium transition-colors"
              title="Toggle sidebar"
            >
              {showSidebar ? '◀️' : '▶️'} Sidebar
            </button>
            <a 
              href="http://127.0.0.1:18789/" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 rounded-lg text-sm font-medium transition-colors"
              title="Open Control UI in new tab"
            >
              🔗 New Tab
            </a>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      {showInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              🚀
            </div>
            <div>
              <p className="font-medium text-blue-900">
                Enhanced Dashboard • Hybrid Mode
              </p>
              <p className="text-blue-700">
                Official Control UI + Quick actions, cost tracking, status monitoring & more
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Close banner"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
            {/* Sidebar Tabs */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-3 py-3 text-xs font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={tab.label}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                {activeTab === 'overview' && (
                  <>
                    <SystemStatus />
                    <RecentActivity />
                  </>
                )}
                {activeTab === 'actions' && <QuickActions />}
                {activeTab === 'costs' && <CostTracker />}
                {activeTab === 'activity' && <RecentActivity />}
                {activeTab === 'help' && <Documentation />}
              </div>
            </div>
          </aside>
        )}

        {/* Control UI iframe */}
        <main className="flex-1 relative overflow-hidden bg-white">
          <iframe
            src="http://127.0.0.1:18789/"
            className="absolute inset-0 w-full h-full border-0"
            title="OpenClaw Control UI"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-2 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="font-semibold">SINT Dashboard v1.0.0</span>
            <span className="text-gray-400">•</span>
            <span>Hybrid Mode</span>
            <span className="text-gray-400">•</span>
            <span className="text-green-600">● Online</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/pshkv/sint_agent_dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
            <span className="text-gray-400">•</span>
            <a 
              href="https://docs.openclaw.ai" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              OpenClaw Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
