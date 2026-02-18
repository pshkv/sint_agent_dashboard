import { useState } from 'react';
import { Agent, Integration, mockIntegrations } from '../../lib/mockData';
import { useOperatorStore } from '../../stores/operatorStore';

interface AgentRegistryProps {
  onAgentSelect: (agent: Agent) => void;
  selectedAgentId?: string;
}

export function AgentRegistry({ onAgentSelect, selectedAgentId }: AgentRegistryProps) {
  const [showIntegrations, setShowIntegrations] = useState(false);
  const agents = useOperatorStore((state) => state.agents);
  const integrations = mockIntegrations;

  const statusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'active': return '🟢';
      case 'idle': return '🔵';
      case 'error': return '🔴';
      case 'paused': return '🟡';
    }
  };

  const integrationStatusColor = (status: Integration['status']) => {
    switch (status) {
      case 'connected': return 'text-[#10B981]';
      case 'degraded': return 'text-[#F59E0B]';
      case 'down': return 'text-[#EF4444]';
    }
  };

  const activeAgents = agents.filter(a => a.status === 'active').length;
  const tasksToday = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const costToday = 4.18; // Mock
  const healthScore = 94; // Mock

  return (
    <div className="h-full flex flex-col p-4 md:p-4 space-y-4">
      {/* Mobile Title */}
      <h2 className="md:hidden text-lg font-bold text-[#F9FAFB] mb-2">Agents</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:space-y-0 pb-4 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between p-2 md:p-0 bg-[#141b2e] md:bg-transparent rounded-lg md:rounded-none">
          <span className="text-xs md:text-sm text-[#9CA3AF]">Active Agents</span>
          <span className="text-sm md:text-base text-[#F9FAFB] font-semibold mt-1 md:mt-0">{activeAgents}/{agents.length}</span>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between p-2 md:p-0 bg-[#141b2e] md:bg-transparent rounded-lg md:rounded-none">
          <span className="text-xs md:text-sm text-[#9CA3AF]">Tasks Today</span>
          <span className="text-sm md:text-base text-[#F9FAFB] font-semibold mt-1 md:mt-0">{tasksToday}</span>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between p-2 md:p-0 bg-[#141b2e] md:bg-transparent rounded-lg md:rounded-none">
          <span className="text-xs md:text-sm text-[#9CA3AF]">Cost Today</span>
          <span className="text-sm md:text-base text-[#F9FAFB] font-semibold mt-1 md:mt-0">${costToday.toFixed(2)}</span>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between p-2 md:p-0 bg-[#141b2e] md:bg-transparent rounded-lg md:rounded-none">
          <span className="text-xs md:text-sm text-[#9CA3AF]">Health Score</span>
          <span className={`text-sm md:text-base font-semibold mt-1 md:mt-0 ${healthScore > 80 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>
            {healthScore}%
          </span>
        </div>
      </div>

      {/* Hire New Employee Button */}
      <button className="w-full px-4 py-3 md:py-3 bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg md:hover:-translate-y-0.5 text-sm md:text-base touch-manipulation">
        + Hire New Employee
      </button>

      {/* Agent Roster */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-1 mb-2">
          Your Team
        </h3>
        
        {agents.map(agent => (
          <div
            key={agent.id}
            onClick={() => onAgentSelect(agent)}
            className={`
              p-4 md:p-3 rounded-lg border cursor-pointer transition-all touch-manipulation
              ${selectedAgentId === agent.id
                ? 'bg-[#1e2740] border-[#3B82F6] shadow-lg shadow-[#3B82F6]/20'
                : 'bg-[#141b2e] border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)] active:bg-[#1e2740]'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl md:text-2xl">{agent.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-[#F9FAFB] text-base md:text-sm">{agent.name}</span>
                  <span className="text-sm md:text-xs">{statusIcon(agent.status)}</span>
                </div>
                <div className="text-sm md:text-xs text-[#9CA3AF] mb-2">{agent.role}</div>
                
                {agent.currentTask && (
                  <div className="text-sm md:text-xs text-[#D1D5DB] mb-2 truncate">
                    {agent.currentTask}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm md:text-xs text-[#6B7280]">
                  <span>{agent.tasksCompleted} tasks</span>
                  <span className="hidden md:inline">{formatRelativeTime(agent.lastActive)}</span>
                  <span className="md:hidden">{formatRelativeTime(agent.lastActive).replace(' ago', '')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Integrations Section */}
      <div className="border-t border-[rgba(255,255,255,0.05)] pt-4">
        <button
          onClick={() => setShowIntegrations(!showIntegrations)}
          className="w-full flex items-center justify-between text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider px-1 mb-3 hover:text-[#D1D5DB] transition-colors"
        >
          <span>Integrations ({integrations.filter(i => i.enabled).length})</span>
          <span>{showIntegrations ? '▼' : '▶'}</span>
        </button>
        
        {showIntegrations && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {integrations.map(integration => (
              <div
                key={integration.id}
                className="flex items-center justify-between px-3 py-2 bg-[#141b2e] rounded-md text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${integrationStatusColor(integration.status)}`}>●</span>
                  <span className="text-[#D1D5DB]">{integration.name}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={integration.enabled}
                    onChange={() => {}}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-[#1e2740] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3B82F6]"></div>
                </label>
              </div>
            ))}
          </div>
        )}
        
        <button className="w-full mt-3 px-4 py-2 bg-[#1e2740] hover:bg-[#141b2e] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded-lg text-sm font-medium transition-all">
          Browse Marketplace →
        </button>
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
