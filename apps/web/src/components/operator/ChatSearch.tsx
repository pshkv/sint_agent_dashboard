import React, { useState } from 'react';
import { Search, X, Calendar, User, Hash } from 'lucide-react';

export interface ChatSearchFilters {
  query: string;
  role: 'all' | 'user' | 'assistant' | 'system';
  dateRange: 'all' | 'today' | 'week' | 'month';
  hasTools: boolean | null;
}

interface ChatSearchProps {
  onSearch: (filters: ChatSearchFilters) => void;
  resultCount?: number;
  onClear: () => void;
}

export const ChatSearch: React.FC<ChatSearchProps> = ({ onSearch, resultCount, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ChatSearchFilters>({
    query: '',
    role: 'all',
    dateRange: 'all',
    hasTools: null,
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      query: '',
      role: 'all',
      dateRange: 'all',
      hasTools: null,
    });
    onClear();
    setIsOpen(false);
  };

  const hasActiveFilters = 
    filters.query !== '' ||
    filters.role !== 'all' ||
    filters.dateRange !== 'all' ||
    filters.hasTools !== null;

  return (
    <div className="relative">
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
              if (e.key === 'Escape') setIsOpen(false);
            }}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onFocus={() => setIsOpen(true)}
          />
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 space-y-4">
          {/* Role Filter */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
              <User className="w-3 h-3" />
              Message Role
            </label>
            <div className="flex gap-2">
              {(['all', 'user', 'assistant', 'system'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setFilters(prev => ({ ...prev, role }))}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all capitalize ${
                    filters.role === role
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Date Range
            </label>
            <div className="flex gap-2">
              {(['all', 'today', 'week', 'month'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setFilters(prev => ({ ...prev, dateRange: range }))}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all capitalize ${
                    filters.dateRange === range
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Tool Calls Filter */}
          <div>
            <label className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Hash className="w-3 h-3" />
              Tool Calls
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, hasTools: null }))}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  filters.hasTools === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, hasTools: true }))}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  filters.hasTools === true
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                With Tools
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, hasTools: false }))}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  filters.hasTools === false
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Without Tools
              </button>
            </div>
          </div>

          {/* Result Count */}
          {resultCount !== undefined && (
            <div className="pt-2 border-t border-gray-700 text-xs text-gray-400">
              Found {resultCount} {resultCount === 1 ? 'message' : 'messages'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
