type Panel = 'agents' | 'center' | 'trace';

interface MobileBottomNavProps {
  activePanel: Panel;
  onPanelChange: (panel: Panel) => void;
}

export function MobileBottomNav({ activePanel, onPanelChange }: MobileBottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0F1E]/95 backdrop-blur-xl border-t border-[rgba(255,255,255,0.1)] z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-4">
        {/* Agents Tab */}
        <button
          onClick={() => onPanelChange('agents')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            activePanel === 'agents'
              ? 'text-[#3B82F6]'
              : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
          }`}
        >
          <div className="text-xl mb-1">👥</div>
          <div className="text-xs font-medium">Agents</div>
          {activePanel === 'agents' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" />
          )}
        </button>

        {/* Chat/Canvas/Workflow Tab */}
        <button
          onClick={() => onPanelChange('center')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            activePanel === 'center'
              ? 'text-[#3B82F6]'
              : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
          }`}
        >
          <div className="text-xl mb-1">💬</div>
          <div className="text-xs font-medium">Control</div>
          {activePanel === 'center' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" />
          )}
        </button>

        {/* Trace Tab */}
        <button
          onClick={() => onPanelChange('trace')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            activePanel === 'trace'
              ? 'text-[#3B82F6]'
              : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
          }`}
        >
          <div className="text-xl mb-1">📊</div>
          <div className="text-xs font-medium">Trace</div>
          {activePanel === 'trace' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" />
          )}
        </button>
      </div>
    </nav>
  );
}
