import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function CostPanel() {
  const { data: summary } = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: () => api.analytics.summary(),
    refetchInterval: 30000, // Refetch every 30s
  });

  const { data: modelUsage } = useQuery({
    queryKey: ['analytics', 'models'],
    queryFn: () => api.analytics.byModel(),
  });

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-[#2c2c2c] border-l border-notion-border shadow-lg p-6 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6">Analytics</h2>
      
      {/* Summary metrics */}
      <div className="space-y-4 mb-8">
        <MetricCard
          label="Today's Cost"
          value={`$${summary?.today_cost.toFixed(2) || '0.00'}`}
          icon="💰"
        />
        <MetricCard
          label="Week's Cost"
          value={`$${summary?.week_cost.toFixed(2) || '0.00'}`}
          icon="📊"
        />
        <MetricCard
          label="Active Tasks"
          value={summary?.active_tasks.toString() || '0'}
          icon="▶️"
        />
        <MetricCard
          label="Completed Tasks"
          value={summary?.completed_tasks.toString() || '0'}
          icon="✅"
        />
      </div>

      {/* Model usage */}
      {modelUsage && modelUsage.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Model Usage</h3>
          <div className="space-y-2">
            {modelUsage.map(model => (
              <div key={model.model} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-notion-text-secondary">{model.model}</span>
                  <span className="font-medium">${model.cost.toFixed(2)}</span>
                </div>
                <div className="w-full bg-notion-surface rounded-full h-2">
                  <div
                    className="bg-notion-accent h-2 rounded-full transition-all"
                    style={{ width: `${model.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-notion-text-secondary mt-1">
                  {model.total_tokens.toLocaleString()} tokens
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-notion-surface dark:bg-[#1f1f1f] p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-notion-text-secondary">{label}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
