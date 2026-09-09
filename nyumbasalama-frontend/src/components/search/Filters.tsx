'use client';

import { X } from 'lucide-react';
import { PRICE_RANGES, UNIVERSITIES, PROPERTY_TYPES } from '@/lib/constants';

interface FiltersProps {
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
}

export default function Filters({ activeFilters, onFilterChange, onClear }: FiltersProps) {
  const hasActive = Object.keys(activeFilters).length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 text-sm">Filters</h4>
        {hasActive && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">University</label>
        <div className="flex flex-wrap gap-2">
          {UNIVERSITIES.map((uni) => (
            <button
              key={uni.value}
              onClick={() =>
                onFilterChange('university', activeFilters.university === uni.value ? '' : uni.value)
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilters.university === uni.value
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {uni.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Price (TSh)</label>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() =>
                onFilterChange('priceRange', activeFilters.priceRange === range.value ? '' : range.value)
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilters.priceRange === range.value
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">Property Type</label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type: string) => (
            <button
              key={type}
              onClick={() =>
                onFilterChange('type', activeFilters.type === type ? '' : type)
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilters.type === type
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
