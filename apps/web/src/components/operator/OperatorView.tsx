import { useState, useEffect } from 'react';
import { OperatorLayout } from './OperatorLayout';
import { AgentRegistry } from './AgentRegistry';
import { CenterTabs } from './CenterTabs';
import { TracePanel } from './TracePanel';
import { useOpenClaw } from '../../hooks/useOpenClaw';
import { useOperatorStore } from '../../stores/operatorStore';
import { getEventProcessor } from '../../lib/eventProcessor';
import { Agent } from '../../lib/mockData';

export function OperatorView() {
  const [isDemoMode, setIsDemoMode] = useState(true); // Toggle between mock and live data
  
  // Get state from store
  const agents = useOperatorStore((state) => state.agents);
  const selectedAgentId = useOperatorStore((state) => state.selectedAgentId);
  const selectAgent = useOperatorStore((state) => state.selectAgent);
  const reset = useOperatorStore((state) => state.reset);
  
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  
  // OpenClaw Gateway integration
  const { isConnected, lastEvent, error, toggleMockMode } = useOpenClaw(isDemoMode);
  
  // Event processor
  const eventProcessor = getEventProcessor();
  
  // Handle demo mode toggle
  const handleDemoModeToggle = (enabled: boolean) => {
    setIsDemoMode(enabled);
    toggleMockMode(enabled);
    
    // Reset to mock data when enabling demo mode
    if (enabled) {
      reset();
    }
  };
  
  // Listen for OpenClaw events and process them
  useEffect(() => {
    if (lastEvent && !isDemoMode) {
      eventProcessor.processEvent(lastEvent);
    }
  }, [lastEvent, isDemoMode, eventProcessor]);

  const header = (
    <>
      {/* Logo & Title */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div className="text-xl md:text-2xl">⚡</div>
        <div className="min-w-0">
          <h1 className="text-base md:text-lg font-bold text-[#F9FAFB] truncate">SINT Operator</h1>
          <p className="hidden md:block text-xs text-[#9CA3AF]">Agent Control Center</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Demo Mode Toggle - Desktop Only Label */}
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-sm text-[#9CA3AF]">Demo Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={(e) => handleDemoModeToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#1e2740] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3B82F6]"></div>
          </label>
        </div>

        {/* System Health / Connection Status */}
        <div className="hidden md:flex items-center gap-2">
          <div 
            className={`w-2 h-2 rounded-full ${
              isConnected 
                ? 'bg-[#10B981] animate-pulse' 
                : 'bg-[#EF4444]'
            }`}
          ></div>
          <span className="text-sm text-[#9CA3AF]">
            {isDemoMode ? 'Demo Mode' : isConnected ? 'Connected' : 'Disconnected'}
          </span>
          {!isDemoMode && error && (
            <span className="text-xs text-[#EF4444]" title={error.message}>
              ⚠️
            </span>
          )}
        </div>

        {/* Mobile Connection Indicator */}
        <div className="md:hidden">
          <div 
            className={`w-3 h-3 rounded-full ${
              isConnected 
                ? 'bg-[#10B981] animate-pulse' 
                : 'bg-[#EF4444]'
            }`}
            title={isDemoMode ? 'Demo Mode' : isConnected ? 'Connected' : 'Disconnected'}
          ></div>
        </div>

        {/* Notifications - Desktop Only */}
        <button className="hidden md:block relative p-2 hover:bg-[#1e2740] rounded-lg transition-all">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
        </button>

        {/* Global Search - Desktop Only */}
        <button className="hidden md:block p-2 hover:bg-[#1e2740] rounded-lg transition-all">
          <span className="text-lg">🔍</span>
        </button>

        {/* Kill Switch - Desktop Only */}
        <button className="hidden md:block px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg text-sm font-medium transition-all">
          🛑 Kill Switch
        </button>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-[rgba(255,255,255,0.1)]">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-semibold">
            I
          </div>
          <div className="text-sm">
            <div className="text-[#F9FAFB] font-medium">Illia</div>
            <div className="text-[#6B7280] text-xs">Admin</div>
          </div>
        </div>
        
        {/* Mobile User Avatar */}
        <div className="md:hidden w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-semibold text-sm">
          I
        </div>
      </div>
    </>
  );

  const leftPanel = (
    <AgentRegistry
      onAgentSelect={(agent: Agent) => selectAgent(agent.id)}
      selectedAgentId={selectedAgent.id}
    />
  );

  const centerPanel = (
    <CenterTabs agent={selectedAgent} />
  );

  const rightPanel = (
    <TracePanel />
  );

  return (
    <div className="relative">
      <OperatorLayout
        header={header}
        leftPanel={leftPanel}
        centerPanel={centerPanel}
        rightPanel={rightPanel}
      />

      {/* Demo Mode Indicator - Desktop Only */}
      {isDemoMode && (
        <div className="hidden md:block fixed top-20 right-6 px-4 py-2 bg-[#F59E0B] bg-opacity-90 backdrop-blur-sm text-white rounded-lg shadow-lg text-sm font-medium z-50">
          📊 Demo Mode • Using mock data
        </div>
      )}
    </div>
  );
}
