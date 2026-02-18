import { Users, MessageSquare, BarChart3 } from 'lucide-react';

type Panel = 'agents' | 'center' | 'trace';

interface MobileBottomNavProps {
  activePanel: Panel;
  onPanelChange: (panel: Panel) => void;
}

export function MobileBottomNavEnhanced({ activePanel, onPanelChange }: MobileBottomNavProps) {
  const tabs = [
    { id: 'agents' as Panel, icon: Users, label: 'Agents' },
    { id: 'center' as Panel, icon: MessageSquare, label: 'Control' },
    { id: 'trace' as Panel, icon: BarChart3, label: 'Metrics' },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map(({ id, icon: Icon, label }) => {
        const isActive = activePanel === id;
        
        return (
          <button
            key={id}
            onClick={() => onPanelChange(id)}
            className={`
              mobile-nav-item touch-manipulation
              ${isActive ? 'active' : ''}
            `}
            aria-label={label}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Icon with scale animation */}
            <div className={`
              mobile-nav-icon relative transition-all duration-200
              ${isActive ? 'scale-110' : 'scale-100'}
            `}>
              <Icon 
                className="w-full h-full" 
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>
            
            {/* Label */}
            <span className={`
              mobile-nav-label transition-all duration-200
              ${isActive ? 'font-semibold' : 'font-medium'}
            `}>
              {label}
            </span>
            
            {/* Active indicator line */}
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
