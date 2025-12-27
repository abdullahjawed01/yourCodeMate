import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchFilter {
  difficulty?: string[];
  status?: string[];
  tags?: string[];
  minLevel?: number;
  maxLevel?: number;
}

interface AdvancedSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilter) => void;
  suggestions?: string[];
  placeholder?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onFilterChange,
  suggestions = [],
  placeholder = 'Search...',
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilter>({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!query || suggestions.length === 0) return [];
    return suggestions.filter((s) =>
      s.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }, [query, suggestions]);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const updateFilters = (newFilters: SearchFilter) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => handleSearch('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all',
            showFilters
              ? 'bg-primary-500 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          )}
        >
          <Filter className="w-4 h-4" />
        </motion.button>
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full glass rounded-xl p-2 z-50 border border-white/10"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  handleSearch(suggestion);
                  setShowSuggestions(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-white/80 text-sm">{suggestion}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 glass rounded-xl p-4 border border-white/10 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Difficulty
                </label>
                <div className="flex flex-wrap gap-2">
                  {['easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => {
                        const current = filters.difficulty || [];
                        const updated = current.includes(diff)
                          ? current.filter((d) => d !== diff)
                          : [...current, diff];
                        updateFilters({ difficulty: updated });
                      }}
                      className={cn(
                        'px-3 py-1 rounded-lg text-sm font-medium transition-all',
                        filters.difficulty?.includes(diff)
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {['completed', 'unlocked', 'locked'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        const current = filters.status || [];
                        const updated = current.includes(status)
                          ? current.filter((s) => s !== status)
                          : [...current, status];
                        updateFilters({ status: updated });
                      }}
                      className={cn(
                        'px-3 py-1 rounded-lg text-sm font-medium transition-all',
                        filters.status?.includes(status)
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Level Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Min"
                    value={filters.minLevel || ''}
                    onChange={(e) =>
                      updateFilters({ minLevel: parseInt(e.target.value) || undefined })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-white/60">-</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Max"
                    value={filters.maxLevel || ''}
                    onChange={(e) =>
                      updateFilters({ maxLevel: parseInt(e.target.value) || undefined })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setFilters({});
                  onFilterChange({});
                }}
                className="px-4 py-2 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


