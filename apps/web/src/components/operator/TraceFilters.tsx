import { useState } from 'react';

export interface TraceFilterState {
  status: string[];
  tools: string[];
  search: string;
  minCost: number;
  maxCost: number;
  dateRange: 'all' | 'today' | 'week' | 'month';
}

interface TraceFiltersProps {
  filters: TraceFilterState;
  onChange: (filters: TraceFilterState) => void;
  onReset: () => void;
  availableTools: string[];
}

export function TraceFilters({ filters, onChange, onReset, availableTools }: TraceFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const statusOptions = [
    { value: 'success', label: 'Success', color: '#10B981' },
    { value: 'error', label: 'Error', color: '#EF4444' },
    { value: 'running', label: 'Running', color: '#3B82F6' },
    { value: 'pending', label: 'Pending', color: '#F59E0B' },
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const toggleStatus = (status: string) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    onChange({ ...filters, status: newStatuses });
  };

  const toggleTool = (tool: string) => {
    const newTools = filters.tools.includes(tool)
      ? filters.tools.filter(t => t !== tool)
      : [...filters.tools, tool];
    onChange({ ...filters, tools: newTools });
  };

  const activeFilterCount = 
    filters.status.length + 
    filters.tools.length + 
    (filters.search ? 1 : 0) +
    (filters.dateRange !== 'all' ? 1 : 0);

  return (
    <div className="mb-4 bg-[#141b2e] border border-[rgba(255,255,255,0.05)] rounded-lg">
      {/* Filter Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[rgba(255,255,255,0.02)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#F9FAFB]">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-[#3B82F6] text-white text-xs font-semibold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="px-2 py-1 text-xs text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
            >
              Reset
            </button>
          )}
          <span className="text-[#9CA3AF]">{expanded ? '▼' : '▶'}</span>
        </div>
      </button>

      {/* Filter Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-[rgba(255,255,255,0.05)]">
          {/* Search */}
          <div className="pt-4">
            <label className="block text-xs font-medium text-[#9CA3AF] mb-2">
              Search Spans
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Search by tool name, model, or error..."
              className="w-full px-3 py-2 bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                    ${filters.status.includes(option.value)
                      ? 'border-transparent text-white'
                      : 'border-[rgba(255,255,255,0.1)] text-[#9CA3AF] hover:border-[rgba(255,255,255,0.2)]'
                    }
                  `}
                  style={filters.status.includes(option.value) 
                    ? { backgroundColor: option.color } 
                    : {}
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tool Filter */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-2">
              Tools
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTools.map((tool) => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                    ${filters.tools.includes(tool)
                      ? 'bg-[#3B82F6] border-transparent text-white'
                      : 'border-[rgba(255,255,255,0.1)] text-[#9CA3AF] hover:border-[rgba(255,255,255,0.2)]'
                    }
                  `}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-2">
              Time Range
            </label>
            <div className="flex gap-2">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onChange({ ...filters, dateRange: option.value as any })}
                  className={`
                    flex-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                    ${filters.dateRange === option.value
                      ? 'bg-[#3B82F6] border-transparent text-white'
                      : 'border-[rgba(255,255,255,0.1)] text-[#9CA3AF] hover:border-[rgba(255,255,255,0.2)]'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cost Range */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-2">
              Cost Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.minCost}
                onChange={(e) => onChange({ ...filters, minCost: parseFloat(e.target.value) || 0 })}
                placeholder="Min"
                step="0.001"
                className="flex-1 px-3 py-2 bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
              />
              <span className="text-[#9CA3AF]">→</span>
              <input
                type="number"
                value={filters.maxCost}
                onChange={(e) => onChange({ ...filters, maxCost: parseFloat(e.target.value) || 999 })}
                placeholder="Max"
                step="0.001"
                className="flex-1 px-3 py-2 bg-[#0A0F1E] border border-[rgba(255,255,255,0.1)] rounded-lg text-sm text-[#F9FAFB] focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
