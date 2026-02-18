import { useState } from 'react';
import { ChatPanelEnhanced } from './ChatPanelEnhanced2';
import { CanvasPanel } from './CanvasPanel';
import { WorkflowPanel } from './WorkflowPanel';
import { useKeyboardShortcuts } from './KeyboardShortcuts';
import { Agent } from '../../lib/mockData';

type TabType = 'chat' | 'canvas' | 'workflow';

interface CenterTabsProps {
  agent: Agent | null;
  model?: string;
  session?: string;
}

export function CenterTabs({ agent, model, session }: CenterTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTabChat: () => setActiveTab('chat'),
    onTabCanvas: () => setActiveTab('canvas'),
    onTabWorkflow: () => setActiveTab('workflow'),
  });

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'canvas', label: 'Canvas', icon: '🎨' },
    { id: 'workflow', label: 'Workflow', icon: '🔀' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-[rgba(255,255,255,0.05)] px-2 md:px-4 bg-[#141b2e] flex items-center mobile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 md:flex-none px-3 md:px-4 py-3 md:py-3 text-sm md:text-sm font-medium transition-all relative touch-manipulation
              ${
                activeTab === tab.id
                  ? 'text-[#3B82F6]'
                  : 'text-[#9CA3AF] hover:text-[#D1D5DB] active:text-[#D1D5DB]'
              }
            `}
          >
            <span className="mr-1 md:mr-2 text-base md:text-base">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatPanelEnhanced agent={agent} model={model} session={session} />}
        {activeTab === 'canvas' && <CanvasPanel agentId={agent?.id} sessionId={session} />}
        {activeTab === 'workflow' && <WorkflowPanel />}
      </div>
    </div>
  );
}
