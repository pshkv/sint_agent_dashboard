import { useState, useMemo } from 'react';
import { Trace, Span, mockMemory, mockAuditLog } from '../../lib/mockData';
import { useOperatorStore } from '../../stores/operatorStore';
import { TraceTimeline } from './TraceTimeline';
import { TraceFilters, TraceFilterState } from './TraceFilters';
import { TraceSummary } from './TraceSummary';
import { MetricsPanel } from './MetricsPanel';
import { PolicyEditor } from './PolicyEditor';
import { PolicyRule } from '../../lib/policyTypes';
import { MemorySearch, MemoryFilters } from './MemorySearch';
import { MemoryTimeline, generateMockMemoryEvents } from './MemoryTimeline';

type TabType = 'metrics' | 'trace' | 'policy' | 'audit' | 'memory';

export function TracePanel() {
  const [activeTab, setActiveTab] = useState<TabType>('metrics');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'metrics', label: 'Metrics', icon: '📊' },
    { id: 'trace', label: 'Trace', icon: '🔍' },
    { id: 'policy', label: 'Policy', icon: '🛡️' },
    { id: 'audit', label: 'Audit', icon: '📋' },
    { id: 'memory', label: 'Memory', icon: '🧠' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-[rgba(255,255,255,0.05)] px-4 pt-4 bg-[#141b2e]">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-t-lg text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-[#0A0F1E] text-[#F9FAFB] border-t border-l border-r border-[rgba(255,255,255,0.1)]'
                  : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'metrics' && <MetricsPanel />}
        {activeTab === 'trace' && (
          <div className="h-full overflow-y-auto p-4">
            <TraceView />
          </div>
        )}
        {activeTab === 'policy' && (
          <div className="h-full overflow-hidden">
            <PolicyView />
          </div>
        )}
        {activeTab === 'audit' && (
          <div className="h-full overflow-y-auto p-4">
            <AuditView />
          </div>
        )}
        {activeTab === 'memory' && (
          <div className="h-full overflow-y-auto p-4">
            <MemoryView />
          </div>
        )}
      </div>
    </div>
  );
}

function TraceView() {
  const traces = useOperatorStore((state) => state.traces);
  const [viewMode, setViewMode] = useState<'tree' | 'timeline'>('tree');
  const [filters, setFilters] = useState<TraceFilterState>({
    status: [],
    tools: [],
    search: '',
    minCost: 0,
    maxCost: 999,
    dateRange: 'all',
  });

  // Extract unique tools from all spans
  const availableTools = useMemo(() => {
    const toolSet = new Set<string>();
    traces.forEach(trace => {
      trace.spans.forEach(span => {
        if (span.tool) toolSet.add(span.tool);
      });
    });
    return Array.from(toolSet);
  }, [traces]);

  // Apply filters
  const filteredTraces = useMemo(() => {
    return traces.map(trace => {
      const filteredSpans = trace.spans.filter(span => {
        // Status filter
        if (filters.status.length > 0 && !filters.status.includes(span.status)) {
          return false;
        }

        // Tool filter
        if (filters.tools.length > 0 && span.tool && !filters.tools.includes(span.tool)) {
          return false;
        }

        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesTool = span.tool?.toLowerCase().includes(searchLower);
          const matchesModel = span.model?.toLowerCase().includes(searchLower);
          const matchesError = span.error?.toLowerCase().includes(searchLower);
          if (!matchesTool && !matchesModel && !matchesError) {
            return false;
          }
        }

        // Cost filter
        const spanCost = span.cost || 0;
        if (spanCost < filters.minCost || spanCost > filters.maxCost) {
          return false;
        }

        return true;
      });

      return {
        ...trace,
        spans: filteredSpans,
      };
    }).filter(trace => trace.spans.length > 0); // Only show traces with matching spans
  }, [traces, filters]);

  const resetFilters = () => {
    setFilters({
      status: [],
      tools: [],
      search: '',
      minCost: 0,
      maxCost: 999,
      dateRange: 'all',
    });
  };

  const exportTraces = () => {
    const dataStr = JSON.stringify(filteredTraces, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `traces-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[#F9FAFB]">
          Execution Trace
          {filteredTraces.length < traces.length && (
            <span className="ml-2 text-xs text-[#9CA3AF]">
              ({filteredTraces.length} of {traces.length})
            </span>
          )}
        </h3>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded-lg">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 text-xs font-medium rounded-l-lg transition-all ${
                viewMode === 'tree'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
              }`}
            >
              🌳 Tree
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded-r-lg transition-all ${
                viewMode === 'timeline'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#9CA3AF] hover:text-[#D1D5DB]'
              }`}
            >
              📊 Timeline
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={exportTraces}
            className="px-3 py-1.5 text-xs bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded-lg hover:bg-[#141b2e] transition-all"
          >
            📥 Export
          </button>

          {/* Time Travel (placeholder) */}
          <button className="px-3 py-1.5 text-xs bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded-lg hover:bg-[#141b2e] transition-all">
            ⏮ Time Travel
          </button>
        </div>
      </div>

      {/* Filters */}
      <TraceFilters
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        availableTools={availableTools}
      />

      {/* Summary Stats */}
      {filteredTraces.length > 0 && (
        <TraceSummary traces={filteredTraces} />
      )}

      {/* Content */}
      {filteredTraces.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-[#9CA3AF] text-sm">
            No traces match the current filters
          </p>
          <button
            onClick={resetFilters}
            className="mt-3 px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'timeline' ? (
        <TraceTimeline traces={filteredTraces} />
      ) : (
        <div className="space-y-4">
          {filteredTraces.map((trace) => (
            <TraceCard key={trace.id} trace={trace} />
          ))}
        </div>
      )}
    </div>
  );
}

function TraceCard({ trace }: { trace: Trace }) {
  const [expanded, setExpanded] = useState(true);
  
  const statusColor = trace.status === 'running' ? 'text-[#3B82F6]' : trace.status === 'success' ? 'text-[#10B981]' : 'text-[#EF4444]';
  const statusBg = trace.status === 'running' ? 'bg-[rgba(59,130,246,0.1)]' : trace.status === 'success' ? 'bg-[rgba(16,185,129,0.1)]' : 'bg-[rgba(239,68,68,0.1)]';

  return (
    <div className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 ${statusBg} ${statusColor} rounded text-xs font-semibold uppercase`}>
            {trace.status}
          </span>
          <span className="text-sm text-[#D1D5DB]">Session: {trace.sessionId}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9CA3AF]">${trace.totalCost.toFixed(3)}</span>
          <span className="text-[#9CA3AF]">{expanded ? '▼' : '▶'}</span>
        </div>
      </button>

      {expanded && (
        <div className="space-y-1">
          {trace.spans.map((span) => (
            <SpanCard key={span.id} span={span} />
          ))}
        </div>
      )}
    </div>
  );
}

function SpanCard({ span }: { span: Span }) {
  const [expanded, setExpanded] = useState(false);
  
  const statusIcon: Record<Span['status'], string> = {
    success: '🟢',
    error: '🔴',
    slow: '🟡',
    running: '🔵',
    pending: '⚪',
  };

  const typeColors = {
    llm_call: 'bg-[#3B82F6]',
    tool_exec: 'bg-[#10B981]',
    memory_search: 'bg-[#F59E0B]',
    browser: 'bg-[#06B6D4]',
    shell: 'bg-[#EF4444]',
  };

  return (
    <div className={`
      ${span.parentSpanId ? 'ml-6 border-l-2 border-[rgba(255,255,255,0.05)]' : ''}
    `}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full bg-[#1e2740] hover:bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded p-2 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs">{statusIcon[span.status]}</span>
            <span className={`px-1.5 py-0.5 ${typeColors[span.type]} text-white rounded text-xs font-mono`}>
              {span.type}
            </span>
            {span.model && (
              <span className="text-xs text-[#9CA3AF]">{span.model}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#9CA3AF]">{span.duration}ms</span>
            {span.cost > 0 && (
              <span className="text-xs text-[#9CA3AF]">${span.cost.toFixed(4)}</span>
            )}
            <span className="text-[#9CA3AF]">{expanded ? '▼' : '▶'}</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-2 ml-6 bg-[#0A0F1E] border border-[rgba(255,255,255,0.05)] rounded p-3 space-y-3 text-xs">
          <div>
            <div className="text-[#9CA3AF] mb-1">Input:</div>
            <pre className="bg-[#141b2e] p-2 rounded text-[#D1D5DB] overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(span.input, null, 2)}
            </pre>
          </div>
          <div>
            <div className="text-[#9CA3AF] mb-1">Output:</div>
            <pre className="bg-[#141b2e] p-2 rounded text-[#D1D5DB] overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(span.output, null, 2)}
            </pre>
          </div>
          {span.tokens && (
            <div className="flex items-center gap-4 text-[#9CA3AF]">
              <span>Tokens: {span.tokens.input.toLocaleString()} in / {span.tokens.output.toLocaleString()} out</span>
            </div>
          )}
          <div className="text-[#6B7280]">
            {formatTimestamp(span.timestamp)}
          </div>
        </div>
      )}
    </div>
  );
}

function PolicyView() {
  const [rules, setRules] = useState<PolicyRule[]>([
    // Start with one default rule
    {
      id: 'rule-default-budget',
      name: 'Daily Budget Limit',
      description: 'Prevent spending more than $50 per day',
      category: 'budget',
      action: 'deny',
      conditions: [
        {
          id: 'cond-1',
          type: 'cost',
          operator: 'greater_than',
          value: 50,
        },
      ],
      priority: 100,
      enabled: true,
    },
  ]);

  return <PolicyEditor rules={rules} onRulesChange={setRules} />;
}

function AuditView() {
  const auditLog = mockAuditLog;
  
  const statusColors = {
    success: 'text-[#10B981]',
    error: 'text-[#EF4444]',
    blocked: 'text-[#F59E0B]',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#F9FAFB]">Audit Log</h3>
        <button className="px-3 py-1 text-xs bg-[#1e2740] border border-[rgba(255,255,255,0.1)] text-[#D1D5DB] rounded hover:bg-[#141b2e] transition-all">
          Export CSV
        </button>
      </div>

      <div className="space-y-2">
        {auditLog.map((entry) => (
          <div
            key={entry.id}
            className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded p-3 text-xs"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className={statusColors[entry.status]}>●</span>
                <span className="font-mono text-[#D1D5DB]">{entry.action}</span>
                <span className="text-[#9CA3AF]">via {entry.tool}</span>
              </div>
              {entry.cost > 0 && (
                <span className="text-[#9CA3AF]">${entry.cost.toFixed(4)}</span>
              )}
            </div>
            <div className="flex items-center justify-between text-[#6B7280]">
              <span>{formatTimestamp(entry.timestamp)}</span>
              <span className="font-mono">#{entry.hash}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryView() {
  const memory = mockMemory;
  const [filteredMemory, setFilteredMemory] = useState(memory);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  
  const tierColors = {
    M0: 'bg-[#3B82F6]',
    M1: 'bg-[#10B981]',
    M2: 'bg-[#F59E0B]',
    M3: 'bg-[#EF4444]',
  };

  const tierLabels = {
    M0: 'Ephemeral',
    M1: 'Session',
    M2: 'Agent',
    M3: 'Archive',
  };

  const handleSearch = (query: string, filters: MemoryFilters) => {
    let results = [...memory];

    // Filter by tiers
    if (filters.tiers.length < 4) {
      results = results.filter(m => filters.tiers.includes(m.tier));
    }

    // Filter by promotion status
    if (filters.promoted !== null) {
      results = results.filter(m => 
        filters.promoted ? !!m.promotedFrom : !m.promotedFrom
      );
    }

    // Filter by time range
    if (filters.timeRange !== 'all') {
      const now = Date.now();
      const ranges: Record<string, number> = {
        '1h': 3600000,
        '24h': 86400000,
        '7d': 604800000,
        '30d': 2592000000,
      };
      const cutoff = now - ranges[filters.timeRange];
      results = results.filter(m => m.timestamp.getTime() > cutoff);
    }

    // Search in content
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(m =>
        m.content.toLowerCase().includes(lowerQuery) ||
        m.source.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredMemory(results);
  };

  const handleMemoryClick = (memoryId: string) => {
    setSelectedMemoryId(memoryId);
    setShowTimeline(true);
  };

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#F9FAFB]">Memory Tiers</h3>
          <p className="text-xs text-gray-500 mt-1">
            {filteredMemory.length} of {memory.length} entries
          </p>
        </div>
        <button 
          onClick={() => setShowTimeline(!showTimeline)}
          className={`px-3 py-1 text-xs border border-[rgba(255,255,255,0.1)] rounded transition-all ${
            showTimeline 
              ? 'bg-blue-500 text-white' 
              : 'bg-[#1e2740] text-[#D1D5DB] hover:bg-[#141b2e]'
          }`}
        >
          {showTimeline ? '📋 List View' : '📅 Timeline View'}
        </button>
      </div>

      {/* Search */}
      <MemorySearch onSearch={handleSearch} />

      {/* Timeline or List View */}
      {showTimeline && selectedMemoryId ? (
        <div className="space-y-4">
          <button
            onClick={() => setShowTimeline(false)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to list
          </button>
          <MemoryTimeline 
            events={generateMockMemoryEvents(selectedMemoryId)} 
            memoryId={selectedMemoryId}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMemory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No memory entries found
            </div>
          ) : (
            filteredMemory.map((entry) => (
              <div
                key={entry.id}
                onClick={() => handleMemoryClick(entry.id)}
                className="bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg p-3 cursor-pointer hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 ${tierColors[entry.tier]} text-white rounded text-xs font-mono`}>
                    {entry.tier}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">{tierLabels[entry.tier]}</span>
                  {entry.promotedFrom && (
                    <span className="text-xs text-[#6B7280]">↑ from {entry.promotedFrom}</span>
                  )}
                </div>
                <p className="text-sm text-[#D1D5DB] mb-2">{entry.content}</p>
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span>{entry.source}</span>
                  <div className="flex items-center gap-2">
                    <span>{formatTimestamp(entry.timestamp)}</span>
                    <span className="text-blue-400">View history →</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
