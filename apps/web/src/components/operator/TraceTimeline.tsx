import { useState } from 'react';
import { Trace, Span } from '../../lib/mockData';

interface TraceTimelineProps {
  traces: Trace[];
}

export function TraceTimeline({ traces }: TraceTimelineProps) {
  const [selectedSpan, setSelectedSpan] = useState<Span | null>(null);

  // Calculate max duration for scaling
  const allSpans = traces.flatMap(t => t.spans);
  const maxDuration = Math.max(...allSpans.map(s => s.duration || 1000));

  const getStatusColor = (status: Span['status']) => {
    switch (status) {
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#3B82F6';
    }
  };

  return (
    <div className="space-y-6">
      {traces.map((trace) => (
        <div key={trace.id} className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
          {/* Trace Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#F9FAFB]">
                Session: {trace.sessionId}
              </span>
              <span className="text-xs text-[#9CA3AF]">
                {trace.spans.length} spans
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#9CA3AF]">
                Total: {trace.spans.reduce((sum, s) => sum + (s.duration || 0), 0)}ms
              </span>
              <span className="text-sm font-semibold text-[#10B981]">
                ${trace.totalCost.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Timeline Bars */}
          <div className="space-y-2">
            {trace.spans.map((span) => {
              const widthPercent = ((span.duration || 0) / maxDuration) * 100;
              const isSelected = selectedSpan?.id === span.id;

              return (
                <div key={span.id} className="group">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs text-[#9CA3AF] w-24 text-right">
                      T+{span.startTime}ms
                    </span>
                    <div className="flex-1">
                      <button
                        onClick={() => setSelectedSpan(span)}
                        className={`
                          w-full relative h-8 rounded transition-all
                          ${isSelected ? 'ring-2 ring-[#3B82F6]' : 'hover:opacity-80'}
                        `}
                        style={{
                          background: `linear-gradient(90deg, ${getStatusColor(span.status)}dd, ${getStatusColor(span.status)}99)`,
                          width: `${Math.max(widthPercent, 5)}%`,
                        }}
                      >
                        <div className="absolute inset-0 flex items-center px-3 text-xs font-medium text-white truncate">
                          {span.tool || span.type}
                          <span className="ml-auto opacity-75">{span.duration}ms</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Span Details */}
          {selectedSpan && (
            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
              <div className="bg-[#0A0F1E] rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-[#F9FAFB]">
                    {selectedSpan.tool || selectedSpan.type}
                  </h4>
                  <button
                    onClick={() => setSelectedSpan(null)}
                    className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#9CA3AF]">Status:</span>
                    <span className={`ml-2 font-medium ${
                      selectedSpan.status === 'success' ? 'text-[#10B981]' :
                      selectedSpan.status === 'error' ? 'text-[#EF4444]' :
                      'text-[#F59E0B]'
                    }`}>
                      {selectedSpan.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF]">Duration:</span>
                    <span className="ml-2 text-[#F9FAFB]">{selectedSpan.duration}ms</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF]">Model:</span>
                    <span className="ml-2 text-[#F9FAFB]">{selectedSpan.model || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF]">Cost:</span>
                    <span className="ml-2 text-[#10B981]">${selectedSpan.cost?.toFixed(4) || '0.0000'}</span>
                  </div>
                </div>

                {selectedSpan.error && (
                  <div className="mt-3 p-2 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded text-xs text-[#EF4444]">
                    {selectedSpan.error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
