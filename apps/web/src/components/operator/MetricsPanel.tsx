import { useState, useMemo } from 'react';
import { useOperatorStore } from '../../stores/operatorStore';

type TimeRange = '1h' | '24h' | '7d' | '30d';

export function MetricsPanel() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  
  const traces = useOperatorStore((state) => state.traces);
  const agents = useOperatorStore((state) => state.agents);

  const metrics = useMemo(() => {
    const now = Date.now();
    const rangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }[timeRange];

    const allSpans = traces.flatMap(t => t.spans);
    const recentSpans = allSpans.filter(s => 
      now - s.timestamp.getTime() < rangeMs
    );

    // Total metrics
    const totalCost = recentSpans.reduce((sum, s) => sum + (s.cost || 0), 0);
    const totalTokens = recentSpans.reduce((sum, s) => {
      if (s.tokens) {
        return sum + s.tokens.input + s.tokens.output;
      }
      return sum;
    }, 0);
    const totalDuration = recentSpans.reduce((sum, s) => sum + (s.duration || 0), 0);
    const errorCount = recentSpans.filter(s => s.status === 'error').length;
    const errorRate = recentSpans.length > 0 ? (errorCount / recentSpans.length) * 100 : 0;

    // Cost by model
    const costByModel: Record<string, number> = {};
    recentSpans.forEach(span => {
      if (span.model && span.cost) {
        costByModel[span.model] = (costByModel[span.model] || 0) + span.cost;
      }
    });

    // Cost by agent
    const costByAgent: Record<string, number> = {};
    traces.forEach(trace => {
      const traceCost = trace.spans
        .filter(s => now - s.timestamp.getTime() < rangeMs)
        .reduce((sum, s) => sum + (s.cost || 0), 0);
      if (traceCost > 0) {
        const agent = agents.find(a => a.id === trace.agentId);
        if (agent) {
          costByAgent[agent.name] = (costByAgent[agent.name] || 0) + traceCost;
        }
      }
    });

    // Response time distribution
    const durationBuckets = [0, 100, 500, 1000, 2000, 5000, Infinity];
    const durationDist: Record<string, number> = {};
    recentSpans.forEach(span => {
      for (let i = 0; i < durationBuckets.length - 1; i++) {
        const min = durationBuckets[i];
        const max = durationBuckets[i + 1];
        if (span.duration >= min && span.duration < max) {
          const label = max === Infinity ? `${min}ms+` : `${min}-${max}ms`;
          durationDist[label] = (durationDist[label] || 0) + 1;
          break;
        }
      }
    });

    // Time series data (hourly buckets)
    const buckets = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 * 4 : 30;
    const bucketSize = rangeMs / buckets;
    const costTimeSeries: { time: string; value: number }[] = [];
    
    for (let i = 0; i < buckets; i++) {
      const bucketStart = now - rangeMs + i * bucketSize;
      const bucketEnd = bucketStart + bucketSize;
      const bucketCost = recentSpans
        .filter(s => {
          const time = s.timestamp.getTime();
          return time >= bucketStart && time < bucketEnd;
        })
        .reduce((sum, s) => sum + (s.cost || 0), 0);
      
      const timeLabel = timeRange === '1h' 
        ? new Date(bucketStart).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : timeRange === '24h'
        ? new Date(bucketStart).toLocaleTimeString('en-US', { hour: 'numeric' })
        : new Date(bucketStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      costTimeSeries.push({ time: timeLabel, value: bucketCost });
    }

    return {
      totalCost,
      totalTokens,
      totalDuration,
      errorCount,
      errorRate,
      spanCount: recentSpans.length,
      costByModel,
      costByAgent,
      durationDist,
      costTimeSeries,
    };
  }, [traces, agents, timeRange]);

  const maxCost = Math.max(...metrics.costTimeSeries.map(d => d.value), 0.01);

  return (
    <div className="h-full flex flex-col p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#F9FAFB]">📊 Metrics & Analytics</h3>
        
        {/* Time Range Selector */}
        <div className="flex bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded-lg">
          {(['1h', '24h', '7d', '30d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
              } ${range === '1h' ? 'rounded-l-lg' : range === '30d' ? 'rounded-r-lg' : ''}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Cost"
          value={`$${metrics.totalCost.toFixed(3)}`}
          sublabel={`${metrics.spanCount} spans`}
          color="green"
          icon="💰"
        />
        <MetricCard
          label="Total Tokens"
          value={formatNumber(metrics.totalTokens)}
          sublabel={`${(metrics.totalTokens / 1000).toFixed(1)}K`}
          color="blue"
          icon="🔢"
        />
        <MetricCard
          label="Avg Duration"
          value={`${(metrics.totalDuration / Math.max(metrics.spanCount, 1)).toFixed(0)}ms`}
          sublabel={`${(metrics.totalDuration / 1000).toFixed(1)}s total`}
          color="purple"
          icon="⏱️"
        />
        <MetricCard
          label="Error Rate"
          value={`${metrics.errorRate.toFixed(1)}%`}
          sublabel={`${metrics.errorCount} errors`}
          color={metrics.errorRate < 5 ? 'green' : metrics.errorRate < 15 ? 'yellow' : 'red'}
          icon="⚠️"
        />
      </div>

      {/* Cost Over Time Chart */}
      <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
        <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Cost Over Time</h4>
        <div className="space-y-2">
          {metrics.costTimeSeries.map((point, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs text-[#9CA3AF] w-16 text-right">{point.time}</span>
              <div className="flex-1 bg-[#0A0F1E] rounded-full h-6 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all"
                  style={{ width: `${(point.value / maxCost) * 100}%` }}
                />
                {point.value > 0 && (
                  <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs text-white font-medium">
                    ${point.value.toFixed(3)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost by Model */}
      <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
        <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Cost by Model</h4>
        <div className="space-y-3">
          {Object.entries(metrics.costByModel)
            .sort(([, a], [, b]) => b - a)
            .map(([model, cost]) => {
              const percentage = (cost / metrics.totalCost) * 100;
              return (
                <div key={model}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#D1D5DB] truncate">{model}</span>
                    <span className="text-[#9CA3AF]">${cost.toFixed(3)}</span>
                  </div>
                  <div className="h-2 bg-[#0A0F1E] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3B82F6] rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Cost by Agent */}
      {Object.keys(metrics.costByAgent).length > 0 && (
        <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Cost by Agent</h4>
          <div className="space-y-3">
            {Object.entries(metrics.costByAgent)
              .sort(([, a], [, b]) => b - a)
              .map(([agent, cost]) => {
                const percentage = (cost / metrics.totalCost) * 100;
                return (
                  <div key={agent} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#D1D5DB]">{agent}</span>
                        <span className="text-[#9CA3AF]">${cost.toFixed(3)}</span>
                      </div>
                      <div className="h-2 bg-[#0A0F1E] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-[#6B7280] w-12 text-right">{percentage.toFixed(0)}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Response Time Distribution */}
      <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
        <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Response Time Distribution</h4>
        <div className="space-y-2">
          {Object.entries(metrics.durationDist).map(([label, count]) => {
            const percentage = (count / metrics.spanCount) * 100;
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-[#9CA3AF] w-20">{label}</span>
                <div className="flex-1 bg-[#0A0F1E] rounded-full h-6 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                  {count > 0 && (
                    <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs text-white font-medium">
                      {count} spans
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Budget Tracker (Mock) */}
      <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
        <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Budget Status</h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#9CA3AF]">Daily Budget</span>
              <span className="text-[#F9FAFB]">
                ${metrics.totalCost.toFixed(3)} / $50.00
              </span>
            </div>
            <div className="h-3 bg-[#0A0F1E] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  metrics.totalCost / 50 < 0.7 ? 'bg-[#10B981]' :
                  metrics.totalCost / 50 < 0.9 ? 'bg-[#F59E0B]' :
                  'bg-[#EF4444]'
                }`}
                style={{ width: `${Math.min((metrics.totalCost / 50) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              {((metrics.totalCost / 50) * 100).toFixed(1)}% used
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  sublabel: string;
  color: 'green' | 'blue' | 'purple' | 'yellow' | 'red';
  icon: string;
}

function MetricCard({ label, value, sublabel, color, icon }: MetricCardProps) {
  const colors = {
    green: 'text-[#10B981]',
    blue: 'text-[#3B82F6]',
    purple: 'text-[#8B5CF6]',
    yellow: 'text-[#F59E0B]',
    red: 'text-[#EF4444]',
  };

  return (
    <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-[#9CA3AF]">{label}</span>
      </div>
      <div className={`text-xl font-bold ${colors[color]} mb-1`}>
        {value}
      </div>
      <div className="text-xs text-[#6B7280]">{sublabel}</div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}
