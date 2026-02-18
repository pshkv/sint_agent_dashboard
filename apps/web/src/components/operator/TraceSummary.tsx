import { useMemo } from 'react';
import { Trace } from '../../lib/mockData';

interface TraceSummaryProps {
  traces: Trace[];
}

export function TraceSummary({ traces }: TraceSummaryProps) {
  const stats = useMemo(() => {
    const allSpans = traces.flatMap(t => t.spans);
    const totalCost = traces.reduce((sum, t) => sum + t.totalCost, 0);
    const totalDuration = allSpans.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgDuration = allSpans.length > 0 ? totalDuration / allSpans.length : 0;
    
    const successCount = allSpans.filter(s => s.status === 'success').length;
    const errorCount = allSpans.filter(s => s.status === 'error').length;
    const successRate = allSpans.length > 0 ? (successCount / allSpans.length) * 100 : 0;

    // Cost by model
    const costByModel: Record<string, number> = {};
    allSpans.forEach(span => {
      if (span.model && span.cost) {
        costByModel[span.model] = (costByModel[span.model] || 0) + span.cost;
      }
    });

    // Most expensive spans
    const expensiveSpans = [...allSpans]
      .filter(s => s.cost && s.cost > 0)
      .sort((a, b) => (b.cost || 0) - (a.cost || 0))
      .slice(0, 3);

    // Slowest spans
    const slowestSpans = [...allSpans]
      .filter(s => s.duration && s.duration > 0)
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 3);

    return {
      totalCost,
      totalDuration,
      avgDuration,
      successRate,
      successCount,
      errorCount,
      totalSpans: allSpans.length,
      totalSessions: traces.length,
      costByModel,
      expensiveSpans,
      slowestSpans,
    };
  }, [traces]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {/* Total Cost */}
      <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
        <div className="text-xs text-[#9CA3AF] mb-1">Total Cost</div>
        <div className="text-xl font-bold text-[#10B981]">
          ${stats.totalCost.toFixed(3)}
        </div>
        <div className="text-xs text-[#6B7280] mt-1">
          {stats.totalSessions} sessions
        </div>
      </div>

      {/* Average Duration */}
      <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
        <div className="text-xs text-[#9CA3AF] mb-1">Avg Duration</div>
        <div className="text-xl font-bold text-[#3B82F6]">
          {stats.avgDuration.toFixed(0)}ms
        </div>
        <div className="text-xs text-[#6B7280] mt-1">
          {stats.totalSpans} spans
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
        <div className="text-xs text-[#9CA3AF] mb-1">Success Rate</div>
        <div className={`text-xl font-bold ${
          stats.successRate >= 95 ? 'text-[#10B981]' :
          stats.successRate >= 80 ? 'text-[#F59E0B]' :
          'text-[#EF4444]'
        }`}>
          {stats.successRate.toFixed(1)}%
        </div>
        <div className="text-xs text-[#6B7280] mt-1">
          {stats.errorCount} errors
        </div>
      </div>

      {/* Total Duration */}
      <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
        <div className="text-xs text-[#9CA3AF] mb-1">Total Time</div>
        <div className="text-xl font-bold text-[#F9FAFB]">
          {(stats.totalDuration / 1000).toFixed(1)}s
        </div>
        <div className="text-xs text-[#6B7280] mt-1">
          execution time
        </div>
      </div>

      {/* Cost by Model (if multiple) */}
      {Object.keys(stats.costByModel).length > 1 && (
        <div className="col-span-2 md:col-span-4 bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
          <div className="text-xs text-[#9CA3AF] mb-2">Cost by Model</div>
          <div className="space-y-2">
            {Object.entries(stats.costByModel)
              .sort(([, a], [, b]) => b - a)
              .map(([model, cost]) => {
                const percentage = (cost / stats.totalCost) * 100;
                return (
                  <div key={model} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#D1D5DB] truncate">{model}</span>
                        <span className="text-[#9CA3AF] ml-2">${cost.toFixed(3)}</span>
                      </div>
                      <div className="h-1.5 bg-[#0A0F1E] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3B82F6] rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-[#9CA3AF] w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Most Expensive Spans */}
      {stats.expensiveSpans.length > 0 && (
        <div className="col-span-2 bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
          <div className="text-xs text-[#9CA3AF] mb-2">💰 Most Expensive</div>
          <div className="space-y-1.5">
            {stats.expensiveSpans.map((span, idx) => (
              <div key={span.id} className="flex items-center justify-between text-xs">
                <span className="text-[#D1D5DB]">
                  {idx + 1}. {span.tool || span.type}
                </span>
                <span className="text-[#10B981] font-semibold">
                  ${span.cost?.toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slowest Spans */}
      {stats.slowestSpans.length > 0 && (
        <div className="col-span-2 bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
          <div className="text-xs text-[#9CA3AF] mb-2">🐌 Slowest</div>
          <div className="space-y-1.5">
            {stats.slowestSpans.map((span, idx) => (
              <div key={span.id} className="flex items-center justify-between text-xs">
                <span className="text-[#D1D5DB]">
                  {idx + 1}. {span.tool || span.type}
                </span>
                <span className="text-[#F59E0B] font-semibold">
                  {span.duration}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
