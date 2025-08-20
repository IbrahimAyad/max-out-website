'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronDown, 
  ChevronUp,
  Filter,
  Sparkles,
  TrendingUp,
  Tag,
  Palette,
  DollarSign,
  Package,
  Calendar,
  Ruler,
  Shirt,
  Search,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

interface FilterSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  expanded: boolean;
}

interface EnhancedFilterPanelProps {
  filters: any;
  facets: any;
  isFilterActive: (key: string, value: any) => boolean;
  toggleFilter: (key: string, value: any) => void;
  updateFilters: (filters: any) => void;
  resetFilters: () => void;
  onClose?: () => void;
  variant?: 'sidebar' | 'dropdown' | 'modal';
}

export default function EnhancedFilterPanel({
  filters,
  facets,
  isFilterActive,
  toggleFilter,
  updateFilters,
  resetFilters,
  onClose,
  variant = 'dropdown'
}: EnhancedFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['type', 'color', 'price']));
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 1000
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Visual color palette with actual colors
  const colorPalette = [
    { name: 'Black', hex: '#000000' },
    { name: 'Navy', hex: '#1e3a8a' },
    { name: 'Gray', hex: '#6b7280' },
    { name: 'Burgundy', hex: '#7f1d1d' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Blue', hex: '#2563eb' },
    { name: 'Red', hex: '#dc2626' },
    { name: 'Green', hex: '#16a34a' },
    { name: 'Brown', hex: '#92400e' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Purple', hex: '#9333ea' },
    { name: 'Gold', hex: '#eab308' }
  ];

  // Size groups
  const sizeGroups = {
    'XS-S': ['34', '36', '38'],
    'M-L': ['40', '42', '44'],
    'XL-XXL': ['46', '48', '50'],
    '3XL+': ['52', '54', '56']
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange([values[0], values[1]]);
  };

  const applyPriceFilter = () => {
    updateFilters({
      minPrice: localPriceRange[0],
      maxPrice: localPriceRange[1]
    });
  };

  // Count active filters
  const activeFilterCount = Object.keys(filters).filter(key => 
    filters[key] !== undefined && 
    key !== 'page' && 
    key !== 'limit' && 
    key !== 'sortBy'
  ).length;

  return (
    <div className={cn(
      "bg-white",
      variant === 'sidebar' && "h-full border-r",
      variant === 'dropdown' && "border-b",
      variant === 'modal' && "rounded-lg shadow-xl"
    )}>
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge className="bg-burgundy-600 text-white">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={resetFilters}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            {onClose && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Sections */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {/* Quick Filters */}
        <div className="px-6 py-4 bg-gradient-to-r from-burgundy-50 to-gold-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilters({ onSale: !filters.onSale })}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                filters.onSale 
                  ? "bg-burgundy-600 text-white" 
                  : "bg-white border hover:border-burgundy-300"
              )}
            >
              <Tag className="w-3 h-3 inline mr-1" />
              On Sale
            </button>
            <button
              onClick={() => updateFilters({ trending: !filters.trending })}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                filters.trending 
                  ? "bg-burgundy-600 text-white" 
                  : "bg-white border hover:border-burgundy-300"
              )}
            >
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Trending
            </button>
            <button
              onClick={() => updateFilters({ newArrivals: !filters.newArrivals })}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                filters.newArrivals 
                  ? "bg-burgundy-600 text-white" 
                  : "bg-white border hover:border-burgundy-300"
              )}
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              New
            </button>
            <button
              onClick={() => updateFilters({ includeBundles: !filters.includeBundles })}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                filters.includeBundles !== false 
                  ? "bg-burgundy-600 text-white" 
                  : "bg-white border hover:border-burgundy-300"
              )}
            >
              <Package className="w-3 h-3 inline mr-1" />
              Bundles Only
            </button>
          </div>
        </div>

        {/* Product Type */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('type')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Product Type</span>
              {facets?.categories && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {facets.categories.reduce((sum: number, cat: any) => sum + cat.count, 0)}
                </span>
              )}
            </div>
            {expandedSections.has('type') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {expandedSections.has('type') && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={filters.includeBundles !== false}
                      onChange={(e) => updateFilters({ includeBundles: e.target.checked })}
                      className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                    />
                    <span className="text-sm">Complete Looks</span>
                    <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {facets?.bundleTiers?.reduce((sum: number, tier: any) => sum + tier.count, 0) || 0}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={filters.includeIndividual !== false}
                      onChange={(e) => updateFilters({ includeIndividual: e.target.checked })}
                      className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                    />
                    <span className="text-sm">Individual Items</span>
                    <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {facets?.categories ? facets.categories.filter((cat: any) => !['Bundle'].includes(cat.name)).reduce((sum: number, cat: any) => sum + cat.count, 0) : 0}
                    </span>
                  </label>
                  
                  {/* Category breakdown */}
                  {facets?.categories && facets.categories.length > 0 && (
                    <div className="ml-4 mt-2 space-y-1">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Categories</div>
                      {facets.categories.map((category: any) => (
                        <label key={category.name} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={isFilterActive('category', category.name)}
                            onChange={() => toggleFilter('category', category.name)}
                            className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                          />
                          <span className="text-sm capitalize">{category.name}</span>
                          <span className="ml-auto text-xs text-gray-500">({category.count})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Color Palette */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('color')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Colors</span>
              {filters.color && <Badge className="ml-2">{filters.color.length}</Badge>}
            </div>
            {expandedSections.has('color') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {expandedSections.has('color') && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  {/* Color swatches */}
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {colorPalette.map((color) => {
                      const colorData = facets.colors?.find((c: any) => c.name.toLowerCase() === color.name.toLowerCase());
                      const isActive = isFilterActive('color', color.name);
                      
                      return (
                        <button
                          key={color.name}
                          onClick={() => toggleFilter('color', color.name)}
                          className={cn(
                            "relative w-10 h-10 rounded-full border-2 transition-all",
                            isActive ? "border-burgundy-600 scale-110" : "border-gray-300 hover:border-gray-500"
                          )}
                          style={{ backgroundColor: color.hex }}
                          title={`${color.name} ${colorData ? `(${colorData.count})` : ''}`}
                        >
                          {isActive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full shadow-lg" />
                            </div>
                          )}
                          {colorData && (
                            <span className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4 bg-gray-100 rounded-full">
                              {colorData.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Color list for additional colors */}
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {facets.colors?.filter((c: any) => 
                      !colorPalette.find(cp => cp.name.toLowerCase() === c.name.toLowerCase())
                    ).map((color: any) => (
                      <label key={color.name} className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={isFilterActive('color', color.name)}
                          onChange={() => toggleFilter('color', color.name)}
                          className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                        />
                        <span className="text-sm capitalize">{color.name}</span>
                        <span className="ml-auto text-xs text-gray-500">({color.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range Slider */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('price')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Price Range</span>
              {(filters.minPrice || filters.maxPrice) && (
                <Badge className="ml-2">${filters.minPrice || 0} - ${filters.maxPrice || 1000}</Badge>
              )}
            </div>
            {expandedSections.has('price') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {expandedSections.has('price') && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  {/* Price Slider */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">${localPriceRange[0]}</span>
                      <span className="text-sm text-gray-600">${localPriceRange[1]}</span>
                    </div>
                    {typeof window !== 'undefined' && (
                      <Slider
                        defaultValue={localPriceRange}
                        value={localPriceRange}
                        onValueChange={handlePriceChange}
                        min={0}
                        max={1000}
                        step={10}
                        className="mb-3"
                      />
                    )}
                    <Button
                      onClick={applyPriceFilter}
                      size="sm"
                      className="w-full"
                      variant="outline"
                    >
                      Apply Price Filter
                    </Button>
                  </div>
                  
                  {/* Quick price ranges */}
                  <div className="grid grid-cols-2 gap-2">
                    {facets.priceRanges?.map((range: any) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          setLocalPriceRange([range.min, range.max]);
                          updateFilters({ minPrice: range.min, maxPrice: range.max });
                        }}
                        className={cn(
                          "px-3 py-2 text-sm rounded-lg transition-colors",
                          filters.minPrice === range.min && filters.maxPrice === range.max
                            ? "bg-burgundy-100 text-burgundy-700 font-medium"
                            : "bg-gray-50 hover:bg-gray-100"
                        )}
                      >
                        <span>{range.label}</span>
                        <span className="ml-1 text-xs">({range.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Size Groups */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('size')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Ruler className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Sizes</span>
              {filters.sizes && <Badge className="ml-2">{filters.sizes.length}</Badge>}
              {facets?.sizes && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {facets.sizes.length} available
                </span>
              )}
            </div>
            {expandedSections.has('size') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {expandedSections.has('size') && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4">
                  {/* Size groups */}
                  {Object.entries(sizeGroups).map(([group, sizes]) => (
                    <div key={group} className="mb-3">
                      <h5 className="text-xs font-medium text-gray-600 mb-2">{group}</h5>
                      <div className="grid grid-cols-3 gap-2">
                        {sizes.map(size => {
                          const sizeData = facets?.sizes?.find((s: any) => s.size === size);
                          return (
                            <button
                              key={size}
                              onClick={() => toggleFilter('sizes', size)}
                              className={cn(
                                "py-2 px-3 text-sm border rounded-lg transition-all relative",
                                isFilterActive('sizes', size)
                                  ? "bg-burgundy-600 text-white border-burgundy-600"
                                  : "bg-white hover:border-burgundy-300"
                              )}
                            >
                              {size}
                              {sizeData && (
                                <span className="absolute -top-1 -right-1 text-xs bg-gray-100 text-gray-600 px-1 rounded-full">
                                  {sizeData.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Occasions */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('occasion')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Occasions</span>
              {filters.occasions && <Badge className="ml-2">{filters.occasions.length}</Badge>}
            </div>
            {expandedSections.has('occasion') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {expandedSections.has('occasion') && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 space-y-2">
                  {facets.occasions?.map((occasion: any) => (
                    <label key={occasion.name} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={isFilterActive('occasions', occasion.name)}
                        onChange={() => toggleFilter('occasions', occasion.name)}
                        className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                      />
                      <span className="text-sm">{occasion.name}</span>
                      <span className="ml-auto text-xs text-gray-500">({occasion.count})</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Material/Fabric */}
        <div className="border-b">
          <button
            onClick={() => toggleSection('material')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shirt className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Material</span>
            </div>
            {expandedSections.has('material') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {expandedSections.has('material') && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-4 space-y-2">
                  {facets?.materials ? (
                    facets.materials.map((material: any) => (
                      <label key={material.name} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={isFilterActive('material', material.name)}
                          onChange={() => toggleFilter('material', material.name)}
                          className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                        />
                        <span className="text-sm">{material.name}</span>
                        <span className="ml-auto text-xs text-gray-500">({material.count})</span>
                      </label>
                    ))
                  ) : (
                    ['Wool', 'Cotton', 'Polyester', 'Silk', 'Linen', 'Velvet'].map(material => (
                      <label key={material} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={isFilterActive('material', material)}
                          onChange={() => toggleFilter('material', material)}
                          className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                        />
                        <span className="text-sm">{material}</span>
                      </label>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Apply/Clear Actions (for modal variant) */}
      {variant === 'modal' && (
        <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
          <Button
            onClick={resetFilters}
            variant="outline"
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white"
          >
            Apply Filters ({activeFilterCount})
          </Button>
        </div>
      )}
    </div>
  );
}