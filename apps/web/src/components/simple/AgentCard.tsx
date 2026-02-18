interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  task?: string;
  cost: number;
}

interface AgentCardProps {
  agent: Agent;
  selected: boolean;
  onClick: () => void;
}

const statusColors = {
  active: 'bg-green-500',
  idle: 'bg-blue-500',
  error: 'bg-red-500'
};

const statusLabels = {
  active: 'Active',
  idle: 'Idle',
  error: 'Error'
};

export function AgentCard({ agent, selected, onClick }: AgentCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left p-4 rounded-lg border-2 transition-all
        ${selected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColors[agent.status]}`} />
          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
        </div>
        <span className="text-xs font-medium text-gray-500">
          ${agent.cost.toFixed(2)}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">{statusLabels[agent.status]}</span>
        {agent.task && (
          <>
            <span className="text-gray-300">·</span>
            <span className="text-gray-600 truncate">{agent.task}</span>
          </>
        )}
      </div>
    </button>
  );
}
