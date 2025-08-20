'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { ProductFilters, PRODUCT_CATEGORIES } from '@/lib/supabase/types';

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

interface ProductFiltersPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
  productCounts?: {
    categories: Record<string, number>;
    colors: Record<string, number>;
    occasions: Record<string, number>;
    brands: Record<string, number>;
    totalProducts: number;
  };
}

const OCCASION_OPTIONS = [
  'Wedding',
  'Prom',
  'Business',
  'Formal',
  'Cocktail',
  'Black Tie',
  'Casual',
  'Date Night',
  'Interview',
  'Party'
];

const COLOR_OPTIONS = [
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Navy', value: 'navy', hex: '#1f2937' },
  { name: 'Charcoal', value: 'charcoal', hex: '#4b5563' },
  { name: 'Gray', value: 'gray', hex: '#6b7280' },
  { name: 'Brown', value: 'brown', hex: '#92400e' },
  { name: 'Burgundy', value: 'burgundy', hex: '#8b0000' },
  { name: 'Blue', value: 'blue', hex: '#1e40af' },
  { name: 'White', value: 'white', hex: '#ffffff' },
  { name: 'Cream', value: 'cream', hex: '#fffbeb' },
  { name: 'Tan', value: 'tan', hex: '#d2b48c' }
];

const BRAND_OPTIONS = [
  'KCT Menswear',
  'Calvin Klein',
  'Hugo Boss',
  'Ralph Lauren',
  'Brooks Brothers',
  'Theory',
  'Armani',
  'Custom'
];

const PRICE_RANGES = [
  { label: 'Under $100', min: 0, max: 10000 },
  { label: '$100 - $250', min: 10000, max: 25000 },
  { label: '$250 - $500', min: 25000, max: 50000 },
  { label: '$500 - $1000', min: 50000, max: 100000 },
  { label: 'Over $1000', min: 100000, max: 999999 }
];

export function ProductFiltersPanel({
  filters,
  onFiltersChange,
  onClose,
  isOpen = true,
  className,
  productCounts
}: ProductFiltersPanelProps) {
  const [sections, setSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    colors: true,
    occasions: false,
    brands: false,
    availability: true
  });

  const toggleSection = (sectionId: string) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    onFiltersChange({ ...filters, ...newFilters });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const toggleCategory = (category: string) => {
    const categories = filters.categories || [];
    const updatedCategories = categories.includes(category)
      ? categories.filter(c => c !== category)
      : [...categories, category];
    updateFilters({ categories: updatedCategories });
  };

  const toggleColor = (color: string) => {
    const colors = filters.colors || [];
    const updatedColors = colors.includes(color)
      ? colors.filter(c => c !== color)
      : [...colors, color];
    updateFilters({ colors: updatedColors });
  };

  const toggleOccasion = (occasion: string) => {
    const occasions = filters.occasions || [];
    const updatedOccasions = occasions.includes(occasion)
      ? occasions.filter(o => o !== occasion)
      : [...occasions, occasion];
    updateFilters({ occasions: updatedOccasions });
  };

  const toggleBrand = (brand: string) => {
    const brands = filters.brands || [];
    const updatedBrands = brands.includes(brand)
      ? brands.filter(b => b !== brand)
      : [...brands, brand];
    updateFilters({ brands: updatedBrands });
  };

  const selectPriceRange = (range: PriceRange) => {
    updateFilters({ priceRange: range });
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof ProductFilters];
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  });

  const FilterSection = ({ 
    id, 
    title, 
    children, 
    count 
  }: { 
    id: string; 
    title: string; 
    children: React.ReactNode;
    count?: number;
  }) => (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">{title}</h3>
          {count !== undefined && (
            <span className="text-sm text-gray-500">({count})</span>
          )}
        </div>
        {sections[id] ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {sections[id] && (
        <div className="px-4 pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn(
      "bg-white border border-gray-200 rounded-lg shadow-sm h-fit",
      !isOpen && "hidden",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-700" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-gold p-1 h-auto"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Categories */}
        <FilterSection id="categories" title="Categories" count={productCounts?.totalProducts}>
          <div className="space-y-2">
            {PRODUCT_CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={(filters.categories || []).includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 text-gold border-gray-300 rounded focus:ring-gold focus:ring-2"
                />
                <span className="text-sm text-gray-700 group-hover:text-gold transition-colors flex-1">
                  {category}
                </span>
                {productCounts?.categories[category] && (
                  <span className="text-xs text-gray-500">
                    {productCounts.categories[category]}
                  </span>
                )}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection id="price" title="Price Range">
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => (
              <label
                key={range.label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={
                    filters.priceRange?.min === range.min &&
                    filters.priceRange?.max === range.max
                  }
                  onChange={() => selectPriceRange({ min: range.min, max: range.max })}
                  className="h-4 w-4 text-gold border-gray-300 focus:ring-gold focus:ring-2"
                />
                <span className="text-sm text-gray-700 group-hover:text-gold transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Colors */}
        <FilterSection id="colors" title="Colors">
          <div className="grid grid-cols-2 gap-2">
            {COLOR_OPTIONS.map((color) => (
              <label
                key={color.value}
                className="flex items-center gap-2 cursor-pointer group p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={(filters.colors || []).includes(color.value)}
                  onChange={() => toggleColor(color.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <div 
                    className={cn(
                      "w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 flex-shrink-0",
                      (filters.colors || []).includes(color.value) && "ring-2 ring-gold"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gold transition-colors">
                    {color.name}
                  </span>
                </div>
                {productCounts?.colors[color.value] && (
                  <span className="text-xs text-gray-500 ml-auto">
                    {productCounts.colors[color.value]}
                  </span>
                )}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Occasions */}
        <FilterSection id="occasions" title="Occasions">
          <div className="space-y-2">
            {OCCASION_OPTIONS.map((occasion) => (
              <label
                key={occasion}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={(filters.occasions || []).includes(occasion)}
                  onChange={() => toggleOccasion(occasion)}
                  className="h-4 w-4 text-gold border-gray-300 rounded focus:ring-gold focus:ring-2"
                />
                <span className="text-sm text-gray-700 group-hover:text-gold transition-colors flex-1">
                  {occasion}
                </span>
                {productCounts?.occasions[occasion] && (
                  <span className="text-xs text-gray-500">
                    {productCounts.occasions[occasion]}
                  </span>
                )}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Brands */}
        <FilterSection id="brands" title="Brands">
          <div className="space-y-2">
            {BRAND_OPTIONS.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={(filters.brands || []).includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 text-gold border-gray-300 rounded focus:ring-gold focus:ring-2"
                />
                <span className="text-sm text-gray-700 group-hover:text-gold transition-colors flex-1">
                  {brand}
                </span>
                {productCounts?.brands[brand] && (
                  <span className="text-xs text-gray-500">
                    {productCounts.brands[brand]}
                  </span>
                )}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection id="availability" title="Availability">
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.inStock || false}
                onChange={(e) => updateFilters({ inStock: e.target.checked })}
                className="h-4 w-4 text-gold border-gray-300 rounded focus:ring-gold focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gold transition-colors">
                In Stock Only
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.featured || false}
                onChange={(e) => updateFilters({ featured: e.target.checked })}
                className="h-4 w-4 text-gold border-gray-300 rounded focus:ring-gold focus:ring-2"
              />
              <span className="text-sm text-gray-700 group-hover:text-gold transition-colors">
                Featured Items
              </span>
            </label>
          </div>
        </FilterSection>
      </div>

      {/* Footer */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Active filters: {Object.values(filters).flat().filter(Boolean).length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}