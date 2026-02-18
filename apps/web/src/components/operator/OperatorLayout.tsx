import { ReactNode, useState } from 'react';
import { MobileBottomNavEnhanced } from './MobileBottomNavEnhanced';
import { MobileLayout } from './MobileLayout';

type MobilePanel = 'agents' | 'center' | 'trace';

interface OperatorLayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel: ReactNode;
  header?: ReactNode;
}

export function OperatorLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  header,
}: OperatorLayoutProps) {
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('center');

  return (
    <div className="h-screen flex flex-col bg-[#0A0F1E]">
      {/* Header */}
      {header && (
        <header className="min-h-16 border-b border-[rgba(255,255,255,0.05)] px-4 md:px-6 py-3 md:py-0 flex items-center justify-between bg-[#141b2e]">
          {header}
        </header>
      )}

      {/* Desktop: 3-Panel Layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left Panel - Agent & Tool Registry */}
        {showLeftPanel && (
          <aside className="w-[280px] border-r border-[rgba(255,255,255,0.05)] bg-[#0A0F1E] overflow-y-auto">
            {leftPanel}
          </aside>
        )}

        {/* Center Panel - Plan / Run / Interact */}
        <main className="flex-1 bg-[#0A0F1E] overflow-y-auto">
          {centerPanel}
        </main>

        {/* Right Panel - Trace / Policy / Audit */}
        {showRightPanel && (
          <aside className="w-[360px] border-l border-[rgba(255,255,255,0.05)] bg-[#0A0F1E] overflow-y-auto">
            {rightPanel}
          </aside>
        )}
      </div>

      {/* Mobile: Single Panel with Bottom Nav */}
      <MobileLayout className="md:hidden flex-1 overflow-hidden">
        <div className="h-full pb-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom))]">
          {mobilePanel === 'agents' && (
            <div className="h-full overflow-y-auto">
              {leftPanel}
            </div>
          )}
          {mobilePanel === 'center' && (
            <div className="h-full overflow-y-auto">
              {centerPanel}
            </div>
          )}
          {mobilePanel === 'trace' && (
            <div className="h-full overflow-y-auto">
              {rightPanel}
            </div>
          )}
        </div>
      </MobileLayout>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavEnhanced 
        activePanel={mobilePanel}
        onPanelChange={setMobilePanel}
      />

      {/* Desktop Panel Toggle Buttons */}
      <div className="hidden md:block">
        <div className="fixed bottom-4 left-4 flex gap-2 z-40">
          <button
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className="px-3 py-2 bg-[#141b2e]/90 backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-[#D1D5DB] hover:bg-[#1e2740] hover:border-[rgba(255,255,255,0.2)] transition-all shadow-lg"
            title={showLeftPanel ? 'Hide left panel' : 'Show left panel'}
          >
            {showLeftPanel ? '◀' : '▶'} Agents
          </button>
        </div>

        <div className="fixed bottom-4 right-4 flex gap-2 z-40">
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="px-3 py-2 bg-[#141b2e]/90 backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-[#D1D5DB] hover:bg-[#1e2740] hover:border-[rgba(255,255,255,0.2)] transition-all shadow-lg"
            title={showRightPanel ? 'Hide right panel' : 'Show right panel'}
          >
            Trace {showRightPanel ? '▶' : '◀'}
          </button>
        </div>
      </div>
    </div>
  );
}
