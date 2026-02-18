import { useState } from 'react';
import { WorkflowBuilder, Workflow } from './WorkflowBuilder';
import { WorkflowTemplates, WorkflowTemplate } from './WorkflowTemplates';
import { Eye, Edit, Layout } from 'lucide-react';

/**
 * Workflow Panel - n8n-style Visual Node Graph
 * Shows agent execution flow as connected nodes
 */

interface WorkflowNode {
  id: string;
  type: 'llm' | 'tool' | 'decision' | 'approval' | 'output';
  label: string;
  status: 'pending' | 'running' | 'success' | 'error';
  input?: any;
  output?: any;
  duration?: number;
  position: { x: number; y: number };
  connections: string[]; // IDs of connected nodes
}

export function WorkflowPanel() {
  const [mode, setMode] = useState<'view' | 'build'>('view');
  const [showTemplates, setShowTemplates] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  // Mock workflow nodes
  const nodes: WorkflowNode[] = [
    {
      id: 'start',
      type: 'llm',
      label: 'Analyze Request',
      status: 'success',
      duration: 2340,
      position: { x: 100, y: 100 },
      connections: ['tool-1', 'tool-2'],
      input: { prompt: 'Build SINT Operator dashboard' },
      output: { plan: 'Create 3-panel layout...' },
    },
    {
      id: 'tool-1',
      type: 'tool',
      label: 'Read Research Doc',
      status: 'success',
      duration: 45,
      position: { x: 100, y: 220 },
      connections: ['decision-1'],
      input: { tool: 'read', path: 'research.md' },
      output: { content: '# Best Dashboards...' },
    },
    {
      id: 'tool-2',
      type: 'tool',
      label: 'Search Memory',
      status: 'success',
      duration: 156,
      position: { x: 300, y: 220 },
      connections: ['decision-1'],
      input: { query: 'dashboard task' },
      output: { results: [{ path: 'memory/2026-02-14.md' }] },
    },
    {
      id: 'decision-1',
      type: 'decision',
      label: 'Need Approval?',
      status: 'success',
      position: { x: 200, y: 360 },
      connections: ['llm-2'],
    },
    {
      id: 'llm-2',
      type: 'llm',
      label: 'Generate Code',
      status: 'running',
      duration: 4200,
      position: { x: 200, y: 480 },
      connections: ['output-1'],
      input: { prompt: 'Create mock data generators' },
    },
    {
      id: 'output-1',
      type: 'output',
      label: 'Output',
      status: 'pending',
      position: { x: 200, y: 600 },
      connections: [],
    },
  ];

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    const workflow: Workflow = {
      ...template.workflow,
      id: `workflow-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentWorkflow(workflow);
    setMode('build');
  };

  const handleSaveWorkflow = (workflow: Workflow) => {
    setCurrentWorkflow(workflow);
    console.log('Workflow saved:', workflow);
    // In real app: save to backend/Gateway
  };

  const handleRunWorkflow = (workflow: Workflow) => {
    console.log('Running workflow:', workflow);
    // In real app: send to Gateway for execution
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0F1E]">
      {/* Mode Header */}
      <div className="border-b border-[rgba(255,255,255,0.05)] px-6 py-3 bg-[#141b2e] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-[#F9FAFB]">Workflow</h3>
          <div className="flex items-center gap-1 bg-gray-800 rounded p-1">
            <button
              onClick={() => setMode('view')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                mode === 'view'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Eye className="w-3 h-3" />
              View
            </button>
            <button
              onClick={() => setMode('build')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                mode === 'build'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Edit className="w-3 h-3" />
              Build
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mode === 'build' && (
            <button
              onClick={() => setShowTemplates(true)}
              className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-all flex items-center gap-1"
            >
              <Layout className="w-3 h-3" />
              Templates
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {mode === 'build' ? (
        <>
          <WorkflowBuilder
            workflow={currentWorkflow}
            onSave={handleSaveWorkflow}
            onRun={handleRunWorkflow}
          />
          {showTemplates && (
            <WorkflowTemplates
              onSelectTemplate={handleSelectTemplate}
              onClose={() => setShowTemplates(false)}
            />
          )}
        </>
      ) : (
        <ViewMode
          nodes={nodes}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
        />
      )}
    </div>
  );
}

// Extracted View Mode Component
interface ViewModeProps {
  nodes: WorkflowNode[];
  selectedNode: WorkflowNode | null;
  setSelectedNode: (node: WorkflowNode | null) => void;
}

function ViewMode({ nodes, selectedNode, setSelectedNode }: ViewModeProps) {
  const nodeColors = {
    llm: '#3B82F6',
    tool: '#10B981',
    decision: '#F59E0B',
    approval: '#EF4444',
    output: '#06B6D4',
  };

  const statusColors = {
    pending: '#6B7280',
    running: '#3B82F6',
    success: '#10B981',
    error: '#EF4444',
  };

  return (
    <>
      {/* Workflow Header */}
      <div className="border-b border-[rgba(255,255,255,0.05)] px-6 py-4 bg-[#141b2e] flex items-center justify-between">
        <div>
          <p className="text-xs text-[#9CA3AF]">Execution flow visualization</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded hover:bg-[#141b2e] transition-all">
            Reset Zoom
          </button>
          <button className="px-3 py-1.5 text-xs bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded hover:bg-[#141b2e] transition-all">
            Auto Layout
          </button>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="flex-1 flex">
        {/* Graph Area */}
        <div className="flex-1 relative overflow-auto bg-[#0A0F1E] p-8">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Draw connections */}
            {nodes.map((node) =>
              node.connections.map((targetId) => {
                const target = nodes.find((n) => n.id === targetId);
                if (!target) return null;

                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={node.position.x + 75}
                    y1={node.position.y + 50}
                    x2={target.position.x + 75}
                    y2={target.position.y}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                  />
                );
              })
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: node.position.x,
                top: node.position.y,
              }}
              onClick={() => setSelectedNode(node)}
              className={`
                w-[150px] bg-[#141b2e] border-2 rounded-lg p-3 cursor-pointer transition-all
                ${
                  selectedNode?.id === node.id
                    ? 'border-[#3B82F6] shadow-lg'
                    : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
                }
                ${node.status === 'running' ? 'animate-pulse' : ''}
              `}
            >
              {/* Node Header */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: statusColors[node.status] }}
                />
                <span
                  className="text-xs font-semibold uppercase"
                  style={{ color: nodeColors[node.type] }}
                >
                  {node.type}
                </span>
              </div>

              {/* Node Label */}
              <div className="text-sm font-medium text-[#F9FAFB] mb-1">{node.label}</div>

              {/* Node Meta */}
              {node.duration && (
                <div className="text-xs text-[#9CA3AF]">{node.duration}ms</div>
              )}
            </div>
          ))}
        </div>

        {/* Node Details Sidebar */}
        {selectedNode && (
          <div className="w-80 border-l border-[rgba(255,255,255,0.05)] bg-[#141b2e] overflow-y-auto">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-[#F9FAFB]">Node Details</h4>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-[#9CA3AF] hover:text-[#F9FAFB]"
                >
                  ✕
                </button>
              </div>

              {/* Node Info */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-xs text-[#9CA3AF] mb-1">Type</div>
                  <div
                    className="text-sm font-semibold uppercase"
                    style={{ color: nodeColors[selectedNode.type] }}
                  >
                    {selectedNode.type}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[#9CA3AF] mb-1">Label</div>
                  <div className="text-sm text-[#F9FAFB]">{selectedNode.label}</div>
                </div>

                <div>
                  <div className="text-xs text-[#9CA3AF] mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusColors[selectedNode.status] }}
                    />
                    <span className="text-sm text-[#F9FAFB] capitalize">
                      {selectedNode.status}
                    </span>
                  </div>
                </div>

                {selectedNode.duration && (
                  <div>
                    <div className="text-xs text-[#9CA3AF] mb-1">Duration</div>
                    <div className="text-sm text-[#F9FAFB]">{selectedNode.duration}ms</div>
                  </div>
                )}
              </div>

              {/* Input */}
              {selectedNode.input && (
                <div className="mb-4">
                  <div className="text-xs text-[#9CA3AF] mb-1">Input</div>
                  <pre className="bg-[#0A0F1E] p-2 rounded text-xs text-[#D1D5DB] overflow-x-auto">
                    {JSON.stringify(selectedNode.input, null, 2)}
                  </pre>
                </div>
              )}

              {/* Output */}
              {selectedNode.output && (
                <div>
                  <div className="text-xs text-[#9CA3AF] mb-1">Output</div>
                  <pre className="bg-[#0A0F1E] p-2 rounded text-xs text-[#D1D5DB] overflow-x-auto">
                    {JSON.stringify(selectedNode.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="border-t border-[rgba(255,255,255,0.05)] px-6 py-3 bg-[#141b2e] flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: nodeColors.llm }} />
          <span className="text-[#9CA3AF]">LLM Call</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: nodeColors.tool }} />
          <span className="text-[#9CA3AF]">Tool Execution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: nodeColors.decision }} />
          <span className="text-[#9CA3AF]">Decision</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: nodeColors.approval }} />
          <span className="text-[#9CA3AF]">Approval Gate</span>
        </div>
      </div>
    </>
  );
}
