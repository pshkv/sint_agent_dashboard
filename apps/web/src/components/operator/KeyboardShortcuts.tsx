import { useEffect } from 'react';

/**
 * Global Keyboard Shortcuts for Operator Dashboard
 */

interface ShortcutHandlers {
  onTabChat?: () => void;
  onTabCanvas?: () => void;
  onTabWorkflow?: () => void;
  onToggleLeftPanel?: () => void;
  onToggleRightPanel?: () => void;
  onGlobalSearch?: () => void;
  onNewSession?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl key
      const isMod = e.metaKey || e.ctrlKey;

      // Tab shortcuts: Cmd+1/2/3
      if (isMod && e.key === '1' && handlers.onTabChat) {
        e.preventDefault();
        handlers.onTabChat();
      }
      if (isMod && e.key === '2' && handlers.onTabCanvas) {
        e.preventDefault();
        handlers.onTabCanvas();
      }
      if (isMod && e.key === '3' && handlers.onTabWorkflow) {
        e.preventDefault();
        handlers.onTabWorkflow();
      }

      // Panel shortcuts: Cmd+B (left), Cmd+T (right)
      if (isMod && e.key === 'b' && handlers.onToggleLeftPanel) {
        e.preventDefault();
        handlers.onToggleLeftPanel();
      }
      if (isMod && e.key === 't' && handlers.onToggleRightPanel) {
        e.preventDefault();
        handlers.onToggleRightPanel();
      }

      // Global search: Cmd+K
      if (isMod && e.key === 'k' && handlers.onGlobalSearch) {
        e.preventDefault();
        handlers.onGlobalSearch();
      }

      // New session: Cmd+N
      if (isMod && e.key === 'n' && handlers.onNewSession) {
        e.preventDefault();
        handlers.onNewSession();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}

export function KeyboardShortcutsHelp() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[rgba(20,27,46,0.95)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-lg shadow-xl p-4 z-50">
      <h3 className="text-sm font-semibold text-[#F9FAFB] mb-3">Keyboard Shortcuts</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        <ShortcutItem keys={['⌘', '1']} description="Switch to Chat" />
        <ShortcutItem keys={['⌘', '2']} description="Switch to Canvas" />
        <ShortcutItem keys={['⌘', '3']} description="Switch to Workflow" />
        <ShortcutItem keys={['⌘', 'B']} description="Toggle Agent Panel" />
        <ShortcutItem keys={['⌘', 'T']} description="Toggle Trace Panel" />
        <ShortcutItem keys={['⌘', 'K']} description="Global Search" />
        <ShortcutItem keys={['⌘', 'N']} description="New Session" />
        <ShortcutItem keys={['?']} description="Show this help" />
      </div>
    </div>
  );
}

function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <kbd
            key={i}
            className="px-2 py-0.5 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] rounded text-[#D1D5DB] font-mono"
          >
            {key}
          </kbd>
        ))}
      </div>
      <span className="text-[#9CA3AF]">{description}</span>
    </div>
  );
}
