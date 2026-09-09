'use client';

import { useState } from 'react';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Filters from './Filters';

interface SearchBarProps {
  onSearch: (query: string, filters: Record<string, string>) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, activeFilters);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
    onSearch(query, newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onSearch(query, {});
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg shadow-orange-100/50 border border-orange-100 p-2">
          <div className="flex-1 flex items-center gap-2 px-2">
            <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch(e.target.value, activeFilters);
              }}
              placeholder="Search location, property type..."
              className="w-full py-2 text-gray-700 placeholder-gray-400 outline-none text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl transition-colors ${
              Object.keys(activeFilters).length > 0
                ? 'bg-orange-100 text-orange-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="p-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2"
          >
            <Filters
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
