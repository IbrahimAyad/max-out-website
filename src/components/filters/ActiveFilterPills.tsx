'use client';

import { X, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { formatFilterDisplay } from '@/lib/utils/url-filters';

interface ActiveFilterPillsProps {
  filters: any;
  updateFilters: (filters: any) => void;
  resetFilters: () => void;
  className?: string;
}

export default function ActiveFilterPills({
  filters,
  updateFilters,
  resetFilters,
  className
}: ActiveFilterPillsProps) {
  // Get active filters
  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (!value || key === 'page' || key === 'limit' || key === 'sortBy') return false;
    if (key === 'includeBundles' && value === true) return false;
    if (key === 'includeIndividual' && value === true) return false;
    return true;
  });

  if (activeFilters.length === 0) return null;

  const removeFilter = (key: string) => {
    updateFilters({ [key]: undefined });
  };

  const getFilterLabel = (key: string, value: any): string => {
    // Special handling for different filter types
    switch (key) {
      case 'minPrice':
        return `From $${value}`;
      case 'maxPrice':
        return `Up to $${value}`;
      case 'includeBundles':
        return value === false ? 'No Bundles' : 'Bundles Only';
      case 'includeIndividual':
        return value === false ? 'No Individual Items' : 'Individual Only';
      case 'trending':
        return 'Trending';
      case 'onSale':
        return 'On Sale';
      case 'newArrivals':
        return 'New Arrivals';
      case 'color':
        return Array.isArray(value) ? value.join(', ') : value;
      case 'occasions':
        return Array.isArray(value) ? value.join(', ') : value;
      case 'sizes':
        return Array.isArray(value) ? `Size: ${value.join(', ')}` : `Size: ${value}`;
      case 'material':
        return Array.isArray(value) ? value.join(', ') : value;
      case 'search':
        return `"${value}"`;
      default:
        return formatFilterDisplay(key, value);
    }
  };

  const getFilterColor = (key: string): string => {
    switch (key) {
      case 'onSale':
      case 'minPrice':
      case 'maxPrice':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'trending':
      case 'newArrivals':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'color':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'occasions':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'sizes':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'search':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-burgundy-100 text-burgundy-800 border-burgundy-200';
    }
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Filter className="w-4 h-4" />
        <span className="font-medium">Active:</span>
      </div>
      
      {activeFilters.map(([key, value]) => {
        // Handle price range specially
        if (key === 'minPrice' && filters.maxPrice) {
          // Skip minPrice if maxPrice exists, we'll show them together
          if (activeFilters.find(([k]) => k === 'maxPrice')) {
            return null;
          }
        }
        
        if (key === 'maxPrice' && filters.minPrice) {
          // Show combined price range
          return (
            <div
              key="price-range"
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all hover:scale-105",
                getFilterColor('minPrice')
              )}
            >
              <span>${filters.minPrice} - ${filters.maxPrice}</span>
              <button
                onClick={() => {
                  updateFilters({ minPrice: undefined, maxPrice: undefined });
                }}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        }
        
        if (key === 'minPrice' && !filters.maxPrice) {
          // Show only minPrice if no maxPrice
          return (
            <div
              key={key}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all hover:scale-105",
                getFilterColor(key)
              )}
            >
              <span>{getFilterLabel(key, value)}</span>
              <button
                onClick={() => removeFilter(key)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        }
        
        // Handle array values
        if (Array.isArray(value)) {
          return value.map((item, index) => (
            <div
              key={`${key}-${item}`}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all hover:scale-105",
                getFilterColor(key)
              )}
            >
              <span>{item}</span>
              <button
                onClick={() => {
                  const newValue = value.filter(v => v !== item);
                  updateFilters({ [key]: newValue.length > 0 ? newValue : undefined });
                }}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ));
        }
        
        // Single value filters
        return (
          <div
            key={key}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all hover:scale-105",
              getFilterColor(key)
            )}
          >
            <span>{getFilterLabel(key, value)}</span>
            <button
              onClick={() => removeFilter(key)}
              className="ml-1 hover:bg-black/10 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
      
      <Button
        onClick={resetFilters}
        variant="ghost"
        size="sm"
        className="text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50"
      >
        Clear All
      </Button>
    </div>
  );
}