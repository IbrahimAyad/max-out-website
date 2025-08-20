'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUnifiedShop } from '@/hooks/useUnifiedShop';
import LargeProductGrid from '@/components/products/LargeProductGrid';
import EnhancedFilterPanel from '@/components/filters/EnhancedFilterPanel';
import MobileFilterDrawer from '@/components/filters/MobileFilterDrawer';
import ActiveFilterPills from '@/components/filters/ActiveFilterPills';
import UnifiedVisualFilter from '@/components/filters/UnifiedVisualFilter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Package,
  Tag,
  Grid2x2,
  Grid3x3,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { getAllPresetIds, getFilterPreset } from '@/lib/config/filter-presets';
import { formatFilterDisplay } from '@/lib/utils/url-filters';

function UnifiedProductsContent() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'2x2' | '3x3'>('2x2');
  const [showVisualFilters, setShowVisualFilters] = useState(true);
  const [selectedVisualFilters, setSelectedVisualFilters] = useState<string[]>([]);
  
  const {
    products,
    loading,
    error,
    totalCount,
    filteredCount,
    facets,
    suggestions,
    pagination,
    presetMetadata,
    filters,
    activePreset,
    updateFilters,
    resetFilters,
    applyPreset,
    clearPreset,
    toggleFilter,
    search,
    setPage,
    setSortBy,
    isFilterActive,
    getShareableLink
  } = useUnifiedShop({
    autoFetch: true,
    debounceDelay: 300
  });
  
  // Calculate active filter count
  const activeFilterCount = Object.keys(filters).filter(key => 
    filters[key as keyof typeof filters] !== undefined && 
    key !== 'page' && 
    key !== 'limit' && 
    key !== 'sortBy'
  ).length;

  // Show pagination when there are products and multiple pages
  const showAllProducts = products.length > 0 && pagination.totalPages > 1;

  // Handle unified visual filter toggle
  const handleVisualFilterToggle = (filterId: string) => {
    const newFilters = selectedVisualFilters.includes(filterId)
      ? selectedVisualFilters.filter(id => id !== filterId)
      : [...selectedVisualFilters, filterId];
    
    setSelectedVisualFilters(newFilters);
    
    // Split filters by type
    const categoryFilters = newFilters.filter(id => 
      ['suits', 'shirts', 'pants', 'knitwear', 'jackets', 'accessories', 'shoes', 'bundles'].includes(id)
    );
    const occasionFilters = newFilters.filter(id => 
      ['wedding', 'business', 'black-tie', 'prom', 'cocktail', 'date-night'].includes(id)
    );
    
    // Update actual filters
    updateFilters({ 
      category: categoryFilters.length > 0 ? categoryFilters : undefined,
      occasions: occasionFilters.length > 0 ? occasionFilters : undefined
    });
  };

  // Clear all visual filters
  const handleClearAllVisualFilters = () => {
    setSelectedVisualFilters([]);
    updateFilters({ category: undefined, occasions: undefined });
  };
  
  // Get preset collections for quick access
  const presetCollections = [
    { id: 'black-tie', icon: '🎩', name: 'Black Tie' },
    { id: 'wedding-guest', icon: '💒', name: 'Wedding Guest' },
    { id: 'business-professional', icon: '💼', name: 'Business' },
    { id: 'prom-special', icon: '🌟', name: 'Prom 2025' },
    { id: 'complete-looks-199', icon: '💰', name: '$199 Bundles' },
    { id: 'all-black', icon: '⚫', name: 'All Black' },
    { id: 'navy-collection', icon: '🔷', name: 'Navy' },
    { id: 'summer-wedding', icon: '☀️', name: 'Summer' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Preset Header if active */}
      {presetMetadata && (
        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif flex items-center gap-3">
                  <span className="text-4xl">{presetMetadata.icon}</span>
                  {presetMetadata.name}
                </h1>
                <p className="mt-2 text-burgundy-100">{presetMetadata.description}</p>
              </div>
              <Button
                onClick={clearPreset}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Preset
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Header */}
      <div className="bg-white border-b border-gold-200/30 sticky top-0 z-30 shadow-sm backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-serif bg-gradient-to-r from-burgundy-700 to-burgundy-500 bg-clip-text text-transparent">
                {activePreset ? presetMetadata?.name : 'Shop All Products'}
              </h1>
              <div className="flex gap-2">
                <Badge className="bg-gold-100 text-burgundy-700 border-gold-300">
                  {totalCount} total
                </Badge>
                {filteredCount !== totalCount && (
                  <Badge className="bg-burgundy-100 text-burgundy-700 border-burgundy-300">
                    {filteredCount} filtered
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => search(e.target.value)}
                  placeholder="Search suits, bundles, colors..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-300 transition-all duration-200 hover:border-burgundy-200"
                />
                {filters.search && (
                  <button
                    onClick={() => search('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Layout Toggle */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLayoutMode('2x2')}
                  className={cn(
                    "p-2 rounded transition-colors",
                    layoutMode === '2x2' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Large Grid"
                >
                  <Grid2x2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('3x3')}
                  className={cn(
                    "p-2 rounded transition-colors",
                    layoutMode === '3x3' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Medium Grid"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "border-burgundy-200 hover:bg-burgundy-50 hover:border-burgundy-300 transition-all",
                  showFilters && "bg-burgundy-50 border-burgundy-400"
                )}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2 text-burgundy-600" />
                <span className="text-burgundy-700 hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-burgundy-500 text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              
              <select
                value={filters.sortBy || 'newest'}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 border-2 border-gold-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-300 bg-white hover:border-gold-300 transition-colors text-burgundy-700 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="trending">Trending</option>
                <option value="ai-score">AI Recommended</option>
              </select>
            </div>
          </div>
          
          {/* Preset Collections Quick Access */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {presetCollections.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap",
                  activePreset === preset.id
                    ? "bg-burgundy-600 border-burgundy-600 text-white"
                    : "bg-white border-gold-200 hover:border-burgundy-300 text-burgundy-700"
                )}
              >
                <span className="text-lg">{preset.icon}</span>
                <span className="text-sm font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Active Filters Pills */}
      {activeFilterCount > 0 && (
        <div className="bg-gradient-to-r from-burgundy-50 to-gold-50 border-b border-burgundy-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ActiveFilterPills
              filters={filters}
              updateFilters={updateFilters}
              resetFilters={resetFilters}
            />
          </div>
        </div>
      )}
      
      {/* Desktop Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="hidden lg:block bg-white border-b border-gray-200"
          >
            <div className="max-w-7xl mx-auto">
              <EnhancedFilterPanel
                filters={filters}
                facets={facets}
                isFilterActive={isFilterActive}
                toggleFilter={toggleFilter}
                updateFilters={updateFilters}
                resetFilters={resetFilters}
                onClose={() => setShowFilters(false)}
                variant="dropdown"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        facets={facets}
        isFilterActive={isFilterActive}
        toggleFilter={toggleFilter}
        updateFilters={updateFilters}
        resetFilters={resetFilters}
      />
      
      {/* Visual Filters Section */}
      {showVisualFilters && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVisualFilters(false)}
                className="text-gray-500 hover:text-gray-700 ml-auto"
              >
                Hide Visual Filters
              </Button>
            </div>
            
            {/* Unified Visual Filters */}
            <UnifiedVisualFilter
              selectedFilters={selectedVisualFilters}
              onFilterToggle={handleVisualFilterToggle}
              onClearAll={handleClearAllVisualFilters}
              title="Shop by Style"
              subtitle="Click images to filter products by category or occasion"
            />
          </div>
        </div>
      )}
      
      {/* Show Visual Filters Button (when hidden) */}
      {!showVisualFilters && (
        <div className="bg-gray-50 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVisualFilters(true)}
              className="border-gray-300 hover:border-burgundy-300"
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Show Visual Filters
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Suggestions */}
        {suggestions?.didYouMean && (
          <div className="mb-6 p-4 bg-gold-50 border border-gold-200 rounded-lg">
            <p className="text-sm text-burgundy-700">
              Did you mean: 
              <button
                onClick={() => search(suggestions.didYouMean!)}
                className="ml-2 font-medium underline hover:text-burgundy-900"
              >
                {suggestions.didYouMean}
              </button>
            </p>
          </div>
        )}
        
        {/* Product Grid - Large 2x2 Layout */}
        <LargeProductGrid
          products={products}
          loading={loading}
          onQuickView={(product) => {
            // Handle quick view
          }}
        />
        
        {/* Pagination */}
        {showAllProducts && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              onClick={() => setPage(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  variant={pagination.currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {pagination.totalPages > 5 && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <Button
                  onClick={() => setPage(pagination.totalPages)}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 border-burgundy-200 hover:bg-burgundy-50 text-burgundy-700"
                >
                  {pagination.totalPages}
                </Button>
              </>
            )}
            
            <Button
              onClick={() => setPage(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnifiedProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-burgundy-600" />
      </div>
    }>
      <UnifiedProductsContent />
    </Suspense>
  );
}