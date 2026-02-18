import React from 'react';
import { Workflow } from './WorkflowBuilder';
import { Zap, GitBranch, Layers, Workflow as WorkflowIcon } from 'lucide-react';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'research' | 'automation';
  icon: React.ReactNode;
  workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>;
}

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'sequential-agents',
    name: 'Sequential Agents',
    description: 'Run multiple agents in sequence, passing output from one to the next',
    category: 'basic',
    icon: <Zap className="w-5 h-5" />,
    workflow: {
      name: 'Sequential Agents',
      description: 'Chain multiple agents together',
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          label: 'Start',
          position: { x: 50, y: 100 },
          inputs: [],
          outputs: ['agent-1'],
        },
        {
          id: 'agent-1',
          type: 'agent',
          label: 'Research Agent',
          agentId: 'research-agent',
          position: { x: 200, y: 100 },
          inputs: ['input-1'],
          outputs: ['agent-2'],
        },
        {
          id: 'agent-2',
          type: 'agent',
          label: 'Analysis Agent',
          agentId: 'analysis-agent',
          position: { x: 350, y: 100 },
          inputs: ['agent-1'],
          outputs: ['output-1'],
        },
        {
          id: 'output-1',
          type: 'output',
          label: 'Result',
          position: { x: 500, y: 100 },
          inputs: ['agent-2'],
          outputs: [],
        },
      ],
      edges: [
        { id: 'edge-1', from: 'input-1', to: 'agent-1' },
        { id: 'edge-2', from: 'agent-1', to: 'agent-2', label: 'research data' },
        { id: 'edge-3', from: 'agent-2', to: 'output-1', label: 'analysis' },
      ],
    },
  },
  {
    id: 'parallel-processing',
    name: 'Parallel Processing',
    description: 'Run multiple agents in parallel and merge results',
    category: 'basic',
    icon: <Layers className="w-5 h-5" />,
    workflow: {
      name: 'Parallel Processing',
      description: 'Execute multiple tasks simultaneously',
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          label: 'Start',
          position: { x: 50, y: 150 },
          inputs: [],
          outputs: ['parallel-1'],
        },
        {
          id: 'parallel-1',
          type: 'parallel',
          label: 'Parallel Split',
          position: { x: 200, y: 150 },
          inputs: ['input-1'],
          outputs: ['agent-1', 'agent-2', 'agent-3'],
        },
        {
          id: 'agent-1',
          type: 'agent',
          label: 'Search Agent',
          agentId: 'search-agent',
          position: { x: 350, y: 50 },
          inputs: ['parallel-1'],
          outputs: ['merge-1'],
        },
        {
          id: 'agent-2',
          type: 'agent',
          label: 'Scrape Agent',
          agentId: 'scrape-agent',
          position: { x: 350, y: 150 },
          inputs: ['parallel-1'],
          outputs: ['merge-1'],
        },
        {
          id: 'agent-3',
          type: 'agent',
          label: 'API Agent',
          agentId: 'api-agent',
          position: { x: 350, y: 250 },
          inputs: ['parallel-1'],
          outputs: ['merge-1'],
        },
        {
          id: 'merge-1',
          type: 'sequential',
          label: 'Merge Results',
          position: { x: 500, y: 150 },
          inputs: ['agent-1', 'agent-2', 'agent-3'],
          outputs: ['output-1'],
        },
        {
          id: 'output-1',
          type: 'output',
          label: 'Result',
          position: { x: 650, y: 150 },
          inputs: ['merge-1'],
          outputs: [],
        },
      ],
      edges: [
        { id: 'edge-1', from: 'input-1', to: 'parallel-1' },
        { id: 'edge-2', from: 'parallel-1', to: 'agent-1' },
        { id: 'edge-3', from: 'parallel-1', to: 'agent-2' },
        { id: 'edge-4', from: 'parallel-1', to: 'agent-3' },
        { id: 'edge-5', from: 'agent-1', to: 'merge-1', label: 'search results' },
        { id: 'edge-6', from: 'agent-2', to: 'merge-1', label: 'scraped data' },
        { id: 'edge-7', from: 'agent-3', to: 'merge-1', label: 'api data' },
        { id: 'edge-8', from: 'merge-1', to: 'output-1' },
      ],
    },
  },
  {
    id: 'conditional-routing',
    name: 'Conditional Routing',
    description: 'Route tasks based on conditions and results',
    category: 'advanced',
    icon: <GitBranch className="w-5 h-5" />,
    workflow: {
      name: 'Conditional Routing',
      description: 'Dynamic task routing based on conditions',
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          label: 'Start',
          position: { x: 50, y: 150 },
          inputs: [],
          outputs: ['agent-1'],
        },
        {
          id: 'agent-1',
          type: 'agent',
          label: 'Classifier',
          agentId: 'classifier-agent',
          position: { x: 200, y: 150 },
          inputs: ['input-1'],
          outputs: ['condition-1'],
        },
        {
          id: 'condition-1',
          type: 'condition',
          label: 'Check Type',
          position: { x: 350, y: 150 },
          inputs: ['agent-1'],
          outputs: ['agent-2', 'agent-3'],
          config: { condition: 'result.type === "urgent"' },
        },
        {
          id: 'agent-2',
          type: 'agent',
          label: 'Urgent Handler',
          agentId: 'urgent-agent',
          position: { x: 500, y: 75 },
          inputs: ['condition-1'],
          outputs: ['output-1'],
        },
        {
          id: 'agent-3',
          type: 'agent',
          label: 'Normal Handler',
          agentId: 'normal-agent',
          position: { x: 500, y: 225 },
          inputs: ['condition-1'],
          outputs: ['output-1'],
        },
        {
          id: 'output-1',
          type: 'output',
          label: 'Result',
          position: { x: 650, y: 150 },
          inputs: ['agent-2', 'agent-3'],
          outputs: [],
        },
      ],
      edges: [
        { id: 'edge-1', from: 'input-1', to: 'agent-1' },
        { id: 'edge-2', from: 'agent-1', to: 'condition-1', label: 'classification' },
        { id: 'edge-3', from: 'condition-1', to: 'agent-2', label: 'urgent' },
        { id: 'edge-4', from: 'condition-1', to: 'agent-3', label: 'normal' },
        { id: 'edge-5', from: 'agent-2', to: 'output-1' },
        { id: 'edge-6', from: 'agent-3', to: 'output-1' },
      ],
    },
  },
  {
    id: 'research-pipeline',
    name: 'Research Pipeline',
    description: 'Comprehensive research workflow with validation and synthesis',
    category: 'research',
    icon: <WorkflowIcon className="w-5 h-5" />,
    workflow: {
      name: 'Research Pipeline',
      description: 'Multi-stage research and analysis',
      nodes: [
        {
          id: 'input-1',
          type: 'input',
          label: 'Query',
          position: { x: 50, y: 200 },
          inputs: [],
          outputs: ['agent-1'],
        },
        {
          id: 'agent-1',
          type: 'agent',
          label: 'Query Expander',
          agentId: 'query-expander',
          position: { x: 200, y: 200 },
          inputs: ['input-1'],
          outputs: ['parallel-1'],
        },
        {
          id: 'parallel-1',
          type: 'parallel',
          label: 'Multi-Source',
          position: { x: 350, y: 200 },
          inputs: ['agent-1'],
          outputs: ['agent-2', 'agent-3', 'agent-4'],
        },
        {
          id: 'agent-2',
          type: 'agent',
          label: 'Web Search',
          agentId: 'web-search',
          position: { x: 500, y: 100 },
          inputs: ['parallel-1'],
          outputs: ['agent-5'],
        },
        {
          id: 'agent-3',
          type: 'agent',
          label: 'Academic Search',
          agentId: 'academic-search',
          position: { x: 500, y: 200 },
          inputs: ['parallel-1'],
          outputs: ['agent-5'],
        },
        {
          id: 'agent-4',
          type: 'agent',
          label: 'News Search',
          agentId: 'news-search',
          position: { x: 500, y: 300 },
          inputs: ['parallel-1'],
          outputs: ['agent-5'],
        },
        {
          id: 'agent-5',
          type: 'agent',
          label: 'Validator',
          agentId: 'validator',
          position: { x: 650, y: 200 },
          inputs: ['agent-2', 'agent-3', 'agent-4'],
          outputs: ['agent-6'],
        },
        {
          id: 'agent-6',
          type: 'agent',
          label: 'Synthesizer',
          agentId: 'synthesizer',
          position: { x: 800, y: 200 },
          inputs: ['agent-5'],
          outputs: ['output-1'],
        },
        {
          id: 'output-1',
          type: 'output',
          label: 'Report',
          position: { x: 950, y: 200 },
          inputs: ['agent-6'],
          outputs: [],
        },
      ],
      edges: [
        { id: 'edge-1', from: 'input-1', to: 'agent-1' },
        { id: 'edge-2', from: 'agent-1', to: 'parallel-1', label: 'expanded queries' },
        { id: 'edge-3', from: 'parallel-1', to: 'agent-2' },
        { id: 'edge-4', from: 'parallel-1', to: 'agent-3' },
        { id: 'edge-5', from: 'parallel-1', to: 'agent-4' },
        { id: 'edge-6', from: 'agent-2', to: 'agent-5', label: 'web results' },
        { id: 'edge-7', from: 'agent-3', to: 'agent-5', label: 'papers' },
        { id: 'edge-8', from: 'agent-4', to: 'agent-5', label: 'news' },
        { id: 'edge-9', from: 'agent-5', to: 'agent-6', label: 'validated data' },
        { id: 'edge-10', from: 'agent-6', to: 'output-1', label: 'final report' },
      ],
    },
  },
];

interface WorkflowTemplatesProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
  onClose: () => void;
}

export const WorkflowTemplates: React.FC<WorkflowTemplatesProps> = ({
  onSelectTemplate,
  onClose,
}) => {
  const categories = {
    basic: { label: 'Basic', color: 'text-blue-400' },
    advanced: { label: 'Advanced', color: 'text-purple-400' },
    research: { label: 'Research', color: 'text-green-400' },
    automation: { label: 'Automation', color: 'text-yellow-400' },
  };

  const groupedTemplates = workflowTemplates.reduce((acc, template) => {
    if (!acc[template.category]) acc[template.category] = [];
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, WorkflowTemplate[]>);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-200">Workflow Templates</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {Object.entries(groupedTemplates).map(([category, templates]) => (
              <div key={category}>
                <h3
                  className={`text-sm font-semibold mb-3 ${
                    categories[category as keyof typeof categories].color
                  }`}
                >
                  {categories[category as keyof typeof categories].label}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => {
                        onSelectTemplate(template);
                        onClose();
                      }}
                      className="text-left p-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-all"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 bg-gray-800 rounded">{template.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-200 mb-1">
                            {template.name}
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{template.workflow.nodes.length} nodes</span>
                        <span>•</span>
                        <span>{template.workflow.edges.length} edges</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
