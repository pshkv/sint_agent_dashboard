import { useState, useEffect } from 'react';

/**
 * Canvas Panel - A2UI Rendering Surface
 * Renders agent-generated UI components safely
 */

interface A2UIElement {
  type: 'form' | 'button' | 'text' | 'input' | 'select' | 'datepicker' | 'card' | 'list';
  id: string;
  label?: string;
  value?: any;
  options?: Array<{ label: string; value: any }>;
  action?: string;
  params?: Record<string, any>;
  children?: A2UIElement[];
}

interface CanvasPanelProps {
  agentId?: string;
  sessionId?: string;
}

export function CanvasPanel({ agentId = 'unknown', sessionId = 'unknown' }: CanvasPanelProps) {
  const [elements, setElements] = useState<A2UIElement[]>([]);
  const [splitView, setSplitView] = useState(false);

  // Mock A2UI elements for demo
  useEffect(() => {
    // TODO: Load A2UI elements for agentId: ${agentId}, sessionId: ${sessionId}
    console.log('[Canvas] Loading for agent:', agentId, 'session:', sessionId);
    setElements([
      {
        type: 'card',
        id: 'task-overview',
        label: 'Task Overview',
        children: [
          {
            type: 'text',
            id: 'task-count',
            label: 'Tasks Completed Today',
            value: '12 tasks',
          },
          {
            type: 'text',
            id: 'cost-today',
            label: 'Total Cost',
            value: '$4.18',
          },
        ],
      },
      {
        type: 'form',
        id: 'new-task-form',
        label: 'Create New Task',
        action: 'create_task',
        children: [
          {
            type: 'input',
            id: 'task-title',
            label: 'Task Title',
            value: '',
          },
          {
            type: 'select',
            id: 'task-priority',
            label: 'Priority',
            value: 'P1',
            options: [
              { label: 'P0 - Critical', value: 'P0' },
              { label: 'P1 - High', value: 'P1' },
              { label: 'P2 - Medium', value: 'P2' },
              { label: 'P3 - Low', value: 'P3' },
            ],
          },
          {
            type: 'button',
            id: 'submit-task',
            label: 'Create Task',
            action: 'submit',
          },
        ],
      },
      {
        type: 'list',
        id: 'recent-actions',
        label: 'Recent Actions',
        children: [
          { type: 'text', id: 'action-1', value: '✓ Read dashboard requirements' },
          { type: 'text', id: 'action-2', value: '✓ Created mock data generators' },
          { type: 'text', id: 'action-3', value: '✓ Built 3-panel layout' },
          { type: 'text', id: 'action-4', value: '🔄 Integrating WebSocket client' },
        ],
      },
    ]);
  }, []);

  const handleAction = (action: string, params?: Record<string, any>) => {
    console.log('[Canvas] Action triggered:', action, params);
    // TODO: Send action back to agent via OpenClaw Gateway
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0F1E]">
      {/* Canvas Header */}
      <div className="border-b border-[rgba(255,255,255,0.05)] px-6 py-4 bg-[#141b2e] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#F9FAFB]">Canvas</h3>
          <p className="text-xs text-[#9CA3AF]">Agent-generated interface</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSplitView(!splitView)}
            className="px-3 py-1.5 text-xs bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded hover:bg-[#141b2e] transition-all"
          >
            {splitView ? 'Full Canvas' : 'Split View'}
          </button>
          <button className="px-3 py-1.5 text-xs bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded hover:bg-[#141b2e] transition-all">
            Refresh
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {elements.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-[#F9FAFB] mb-2">Canvas Ready</h3>
            <p className="text-sm text-[#9CA3AF] max-w-md">
              Agent can generate interactive UI components here using the A2UI protocol.
              Forms, buttons, dashboards, and more will appear dynamically.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {elements.map((element) => (
              <A2UIRenderer
                key={element.id}
                element={element}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// A2UI Element Renderer
function A2UIRenderer({
  element,
  onAction,
}: {
  element: A2UIElement;
  onAction: (action: string, params?: Record<string, any>) => void;
}) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleInputChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (element.action) {
      onAction(element.action, formData);
    }
  };

  switch (element.type) {
    case 'card':
      return (
        <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-6">
          {element.label && (
            <h3 className="text-lg font-semibold text-[#F9FAFB] mb-4">{element.label}</h3>
          )}
          <div className="space-y-3">
            {element.children?.map((child) => (
              <A2UIRenderer key={child.id} element={child} onAction={onAction} />
            ))}
          </div>
        </div>
      );

    case 'form':
      return (
        <form onSubmit={handleSubmit} className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-6">
          {element.label && (
            <h3 className="text-lg font-semibold text-[#F9FAFB] mb-4">{element.label}</h3>
          )}
          <div className="space-y-4">
            {element.children?.map((child) => (
              <div key={child.id}>
                <A2UIRenderer
                  element={{
                    ...child,
                    value: formData[child.id] ?? child.value,
                  }}
                  onAction={(action, params) => {
                    if (action === 'change') {
                      handleInputChange(child.id, params?.value);
                    } else {
                      onAction(action, params);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </form>
      );

    case 'input':
      return (
        <div>
          {element.label && (
            <label className="block text-sm font-medium text-[#D1D5DB] mb-1">
              {element.label}
            </label>
          )}
          <input
            type="text"
            value={element.value || ''}
            onChange={(e) => onAction('change', { value: e.target.value })}
            className="w-full px-3 py-2 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] rounded-md text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
            placeholder={element.label}
          />
        </div>
      );

    case 'select':
      return (
        <div>
          {element.label && (
            <label className="block text-sm font-medium text-[#D1D5DB] mb-1">
              {element.label}
            </label>
          )}
          <select
            value={element.value || ''}
            onChange={(e) => onAction('change', { value: e.target.value })}
            className="w-full px-3 py-2 bg-[#1e2740] border border-[rgba(255,255,255,0.1)] rounded-md text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
          >
            {element.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'button':
      return (
        <button
          type={element.action === 'submit' ? 'submit' : 'button'}
          onClick={() => element.action && onAction(element.action, element.params)}
          className="w-full px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md font-medium transition-all"
        >
          {element.label}
        </button>
      );

    case 'text':
      return (
        <div className="flex items-start justify-between">
          {element.label && (
            <span className="text-sm text-[#9CA3AF]">{element.label}:</span>
          )}
          <span className="text-sm font-medium text-[#F9FAFB]">{element.value}</span>
        </div>
      );

    case 'list':
      return (
        <div>
          {element.label && (
            <h4 className="text-sm font-semibold text-[#D1D5DB] mb-3">{element.label}</h4>
          )}
          <div className="space-y-2">
            {element.children?.map((child) => (
              <div
                key={child.id}
                className="px-3 py-2 bg-[#1e2740] rounded text-sm text-[#D1D5DB]"
              >
                {child.value}
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="text-sm text-[#6B7280]">
          Unknown element type: {element.type}
        </div>
      );
  }
}
