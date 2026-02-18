import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Clock, Tag } from 'lucide-react';

interface MemorySearchProps {
  onSearch: (query: string, filters: MemoryFilters) => void;
}

export interface MemoryFilters {
  tiers: ('M0' | 'M1' | 'M2' | 'M3')[];
  timeRange: 'all' | '1h' | '24h' | '7d' | '30d';
  tags: string[];
  promoted: boolean | null;
}

export const MemorySearch: React.FC<MemorySearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MemoryFilters>({
    tiers: ['M0', 'M1', 'M2', 'M3'],
    timeRange: 'all',
    tags: [],
    promoted: null,
  });

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const toggleTier = (tier: 'M0' | 'M1' | 'M2' | 'M3') => {
    setFilters(prev => ({
      ...prev,
      tiers: prev.tiers.includes(tier)
        ? prev.tiers.filter(t => t !== tier)
        : [...prev.tiers, tier],
    }));
  };

  const timeRanges = [
    { value: 'all', label: 'All Time' },
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24h' },
    { value: '7d', label: 'Last Week' },
    { value: '30d', label: 'Last Month' },
  ];

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search memory entries..."
          className="w-full pl-10 pr-20 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors flex items-center gap-1"
        >
          <Filter className="w-3 h-3" />
          {Object.values(filters).some(v => Array.isArray(v) ? v.length < 4 : v !== null && v !== 'all') && (
            <span className="ml-1 px-1.5 py-0.5 bg-blue-500 rounded-full text-[10px]">
              {filters.tiers.length < 4 ? filters.tiers.length : ''}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg space-y-4">
          {/* Memory Tiers */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Tag className="w-3 h-3" />
              Memory Tiers
            </label>
            <div className="flex gap-2">
              {(['M0', 'M1', 'M2', 'M3'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => toggleTier(tier)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    filters.tiers.includes(tier)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Clock className="w-3 h-3" />
              Time Range
            </label>
            <div className="flex gap-2 flex-wrap">
              {timeRanges.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilters(prev => ({ ...prev, timeRange: value as any }))}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                    filters.timeRange === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Promotion Filter */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              Promotion Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, promoted: null }))}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  filters.promoted === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, promoted: true }))}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  filters.promoted === true
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Promoted
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, promoted: false }))}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  filters.promoted === false
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Not Promoted
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-700">
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setFilters({
                  tiers: ['M0', 'M1', 'M2', 'M3'],
                  timeRange: 'all',
                  tags: [],
                  promoted: null,
                });
                setQuery('');
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
