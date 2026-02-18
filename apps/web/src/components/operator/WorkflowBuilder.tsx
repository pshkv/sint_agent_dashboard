import React, { useState } from 'react';
import { Plus, Play, Save, Download, Upload, Trash2, Copy } from 'lucide-react';

export interface WorkflowNode {
  id: string;
  type: 'agent' | 'condition' | 'parallel' | 'sequential' | 'input' | 'output';
  label: string;
  agentId?: string;
  config?: any;
  position: { x: number; y: number };
  inputs: string[];
  outputs: string[];
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  condition?: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: number;
  updatedAt: number;
}

interface WorkflowBuilderProps {
  workflow: Workflow | null;
  onSave: (workflow: Workflow) => void;
  onRun: (workflow: Workflow) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow: initialWorkflow,
  onSave,
  onRun,
}) => {
  const [workflow, setWorkflow] = useState<Workflow>(
    initialWorkflow || {
      id: `workflow-${Date.now()}`,
      name: 'New Workflow',
      description: '',
      nodes: [],
      edges: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  );

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const nodeTypes = [
    { type: 'agent', label: 'Agent', icon: '🤖', color: 'bg-blue-500' },
    { type: 'condition', label: 'Condition', icon: '🔀', color: 'bg-yellow-500' },
    { type: 'parallel', label: 'Parallel', icon: '⚡', color: 'bg-purple-500' },
    { type: 'sequential', label: 'Sequential', icon: '➡️', color: 'bg-green-500' },
  ];

  const addNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      label: `${type} ${workflow.nodes.length + 1}`,
      position: { x: 100 + workflow.nodes.length * 20, y: 100 + workflow.nodes.length * 20 },
      inputs: [],
      outputs: [],
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: Date.now(),
    }));
  };

  const deleteNode = (nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.from !== nodeId && e.to !== nodeId),
      updatedAt: Date.now(),
    }));
    setSelectedNode(null);
  };

  const duplicateNode = (nodeId: string) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const newNode: WorkflowNode = {
      ...node,
      id: `node-${Date.now()}`,
      label: `${node.label} (copy)`,
      position: { x: node.position.x + 20, y: node.position.y + 20 },
      inputs: [],
      outputs: [],
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: Date.now(),
    }));
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => (n.id === nodeId ? { ...n, ...updates } : n)),
      updatedAt: Date.now(),
    }));
  };

  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setSelectedNode(nodeId);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    });
  };

  const handleNodeDrag = (e: React.MouseEvent) => {
    if (!isDragging || !selectedNode) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    updateNode(selectedNode, {
      position: { x: newX, y: newY },
    });
  };

  const handleNodeDragEnd = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    onSave(workflow);
  };

  const handleRun = () => {
    onRun(workflow);
  };

  const handleExport = () => {
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${workflow.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setWorkflow(imported);
      } catch (error) {
        console.error('Failed to import workflow:', error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="border-b border-gray-700 p-3 flex items-center justify-between bg-gray-800">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={workflow.name}
            onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
            className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-500">
            {workflow.nodes.length} nodes, {workflow.edges.length} edges
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleRun}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
          <div className="w-px h-6 bg-gray-600" />
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <label className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette */}
        <div className="w-48 border-r border-gray-700 p-3 space-y-2 bg-gray-800">
          <h3 className="text-xs font-semibold text-gray-400 mb-3">Add Nodes</h3>
          {nodeTypes.map(({ type, label, icon, color }) => (
            <button
              key={type}
              onClick={() => addNode(type as WorkflowNode['type'])}
              className={`w-full flex items-center gap-2 px-3 py-2 ${color} hover:opacity-80 rounded text-sm font-medium transition-all`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
              <Plus className="w-4 h-4 ml-auto" />
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div
          className="flex-1 relative bg-gray-900 overflow-auto"
          onMouseMove={handleNodeDrag}
          onMouseUp={handleNodeDragEnd}
          onMouseLeave={handleNodeDragEnd}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Edges */}
          <svg className="absolute inset-0 pointer-events-none">
            {workflow.edges.map(edge => {
              const fromNode = workflow.nodes.find(n => n.id === edge.from);
              const toNode = workflow.nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.position.x + 60;
              const y1 = fromNode.position.y + 25;
              const x2 = toNode.position.x + 60;
              const y2 = toNode.position.y + 25;

              return (
                <g key={edge.id}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(59, 130, 246, 0.5)"
                    strokeWidth="2"
                  />
                  {edge.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2}
                      fill="rgba(156, 163, 175, 0.8)"
                      fontSize="12"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {workflow.nodes.map(node => (
            <WorkflowNodeCard
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onSelect={() => setSelectedNode(node.id)}
              onDragStart={(e) => handleNodeDragStart(node.id, e)}
              onDelete={() => deleteNode(node.id)}
              onDuplicate={() => duplicateNode(node.id)}
              onUpdate={(updates) => updateNode(node.id, updates)}
            />
          ))}

          {/* Empty State */}
          {workflow.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">Empty Workflow</p>
                <p className="text-sm">Add nodes from the palette to get started</p>
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <NodePropertiesPanel
            node={workflow.nodes.find(n => n.id === selectedNode)!}
            onUpdate={(updates) => updateNode(selectedNode, updates)}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
};

interface WorkflowNodeCardProps {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: (updates: Partial<WorkflowNode>) => void;
}

const WorkflowNodeCard: React.FC<WorkflowNodeCardProps> = ({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onDelete,
  onDuplicate,
}) => {
  const colors = {
    agent: 'bg-blue-500',
    condition: 'bg-yellow-500',
    parallel: 'bg-purple-500',
    sequential: 'bg-green-500',
    input: 'bg-gray-500',
    output: 'bg-gray-500',
  };

  return (
    <div
      className={`absolute cursor-move select-none ${
        isSelected ? 'ring-2 ring-blue-400' : ''
      }`}
      style={{
        left: node.position.x,
        top: node.position.y,
        width: 120,
      }}
      onClick={onSelect}
      onMouseDown={onDragStart}
    >
      <div className={`${colors[node.type]} rounded-t px-3 py-2 text-white text-xs font-medium`}>
        {node.label}
      </div>
      <div className="bg-gray-800 border-l-2 border-r-2 border-b-2 border-gray-700 rounded-b p-2 text-xs text-gray-300">
        <div className="mb-1 text-[10px] text-gray-500 uppercase">{node.type}</div>
        {node.agentId && (
          <div className="text-[10px] text-gray-400 truncate">Agent: {node.agentId}</div>
        )}
      </div>

      {isSelected && (
        <div className="absolute -top-8 right-0 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 bg-red-500 hover:bg-red-600 rounded text-xs"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

interface NodePropertiesPanelProps {
  node: WorkflowNode;
  onUpdate: (updates: Partial<WorkflowNode>) => void;
  onClose: () => void;
}

const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({ node, onUpdate, onClose }) => {
  return (
    <div className="w-64 border-l border-gray-700 p-4 bg-gray-800 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-200">Properties</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
          ✕
        </button>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-400 block mb-1">Label</label>
        <input
          type="text"
          value={node.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-gray-400 block mb-1">Type</label>
        <div className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-gray-300">
          {node.type}
        </div>
      </div>

      {node.type === 'agent' && (
        <div>
          <label className="text-xs font-medium text-gray-400 block mb-1">Agent ID</label>
          <input
            type="text"
            value={node.agentId || ''}
            onChange={(e) => onUpdate({ agentId: e.target.value })}
            placeholder="agent-1"
            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-gray-400 block mb-1">Position</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <input
              type="number"
              value={node.position.x}
              onChange={(e) =>
                onUpdate({ position: { ...node.position, x: parseInt(e.target.value) } })
              }
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-[10px] text-gray-500 mt-0.5">X</div>
          </div>
          <div>
            <input
              type="number"
              value={node.position.y}
              onChange={(e) =>
                onUpdate({ position: { ...node.position, y: parseInt(e.target.value) } })
              }
              className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-[10px] text-gray-500 mt-0.5">Y</div>
          </div>
        </div>
      </div>
    </div>
  );
};
