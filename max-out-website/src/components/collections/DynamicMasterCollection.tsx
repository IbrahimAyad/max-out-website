'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUnifiedShop } from '@/hooks/useUnifiedShop';
import { DynamicFilterPanel } from './DynamicFilterPanel';
import MinimalResponsiveProductGrid from './MinimalResponsiveProductGrid';
import { UnifiedProduct, UnifiedProductFilters } from '@/types/unified-shop';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  Grid3X3, 
  Grid2X2, 
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid-2' | 'grid-3' | 'grid-4';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name' | 'trending';

interface DynamicMasterCollectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  heroImage?: string;
  initialFilters?: Partial<UnifiedProductFilters>;
  showHero?: boolean;
  enablePresets?: boolean;
  defaultViewMode?: ViewMode;
}

export function DynamicMasterCollection({
  title = "Master Collection",
  subtitle = "COMPLETE MENSWEAR",
  description = "Precision-tailored pieces in timeless colors enhance every part of a man's wardrobe.",
  heroImage,
  initialFilters = {},
  showHero = true,
  enablePresets = true,
  defaultViewMode = 'grid-4'
}: DynamicMasterCollectionProps) {
  // State
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll for sticky elements
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Unified shop hook with smart defaults
  const {
    products,
    loading,
    error,
    totalCount,
    filteredCount,
    facets,
    filters,
    updateFilters,
    resetFilters,
    search,
    setSortBy,
    toggleFilter,
    isFilterActive,
    refreshProducts
  } = useUnifiedShop({
    initialFilters: {
      page: 1,
      limit: isMobile ? 12 : 16,
      ...initialFilters
    },
    autoFetch: true,
    debounceDelay: 300
  });

  // Memoized filter counts for performance
  const filterCounts = useMemo(() => ({
    total: totalCount,
    filtered: filteredCount,
    showing: products.length
  }), [totalCount, filteredCount, products.length]);

  // Dynamic category detection from products
  const dynamicCategories = useMemo(() => {
    const categoryMap = new Map<string, { count: number; image?: string }>();
    
    products.forEach(product => {
      if (product.category) {
        const existing = categoryMap.get(product.category) || { count: 0 };
        categoryMap.set(product.category, {
          count: existing.count + 1,
          image: existing.image || product.imageUrl
        });
      }
    });

    return Array.from(categoryMap.entries()).map(([category, { count, image }]) => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count,
      image
    }));
  }, [products]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    search(query);
  }, [search]);

  // Handle sort change
  const handleSortChange = useCallback((sortOption: SortOption) => {
    const sortMapping: Record<SortOption, UnifiedProductFilters['sortBy']> = {
      'featured': 'ai-score',
      'price-asc': 'price-asc',
      'price-desc': 'price-desc',
      'newest': 'newest',
      'name': 'name',
      'trending': 'trending'
    };
    setSortBy(sortMapping[sortOption]);
  }, [setSortBy]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    // Adjust items per page based on view mode
    const limitMapping: Record<ViewMode, number> = {
      'grid-3': isMobile ? 9 : 12,
      'grid-4': isMobile ? 12 : 16,
      'list': isMobile ? 8 : 10
    };
    updateFilters({ limit: limitMapping[mode] });
  }, [updateFilters, isMobile]);

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-burgundy mx-auto mb-6"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-burgundy animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Loading collection...</p>
          <p className="text-sm text-gray-400 mt-1">Curating the perfect pieces for you</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-red-500 mb-4">
            <X className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-burgundy hover:bg-burgundy-700"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {showHero && (
        <motion.section
          className="relative h-[40vh] md:h-[50vh] bg-gradient-to-br from-gray-900 to-black overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {heroImage && (
            <div className="absolute inset-0">
              <img 
                src={heroImage} 
                alt={title}
                className="w-full h-full object-cover opacity-50"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-4xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                {title}
              </h1>
              <p className="text-lg md:text-xl font-light mb-2 tracking-wider text-gray-200">
                {subtitle}
              </p>
              <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
                {description}
              </p>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Sticky Controls Bar */}
      <motion.div
        className={cn(
          "sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300",
          isScrolled ? "shadow-lg" : "shadow-sm"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Search and Filter Count */}
            <div className="flex items-center space-x-4">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden"
                aria-label="Open filters panel"
                aria-expanded={showMobileFilters}
                aria-controls="mobile-filters-panel"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>

              {/* Search Toggle/Bar */}
              <div className="flex items-center">
                {showSearch || !isMobile ? (
                  <motion.div
                    className="relative"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                  >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search collection..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-transparent outline-none w-full md:w-80"
                      aria-label="Search products in collection"
                      role="searchbox"
                      aria-describedby="search-help"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => handleSearch('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <div className="hidden md:flex items-center text-sm text-gray-600">
                <span className="font-medium">{filterCounts.filtered}</span>
                <span className="mx-1">of</span>
                <span>{filterCounts.total}</span>
                <span className="ml-1">products</span>
              </div>
            </div>

            {/* Right side - Sort and View Options */}
            <div className="flex items-center space-x-3">
              {/* Sort Dropdown */}
              <select
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-burgundy focus:border-transparent outline-none"
                value={filters.sortBy || 'featured'}
                aria-label="Sort products by"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="trending">Trending</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View Mode Toggles */}
              <div className="hidden md:flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleViewModeChange('grid-3')}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === 'grid-3' 
                      ? "bg-burgundy text-white" 
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                  title="3 columns"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange('grid-4')}
                  className={cn(
                    "p-2 border-l border-gray-300 transition-colors",
                    viewMode === 'grid-4' 
                      ? "bg-burgundy text-white" 
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  )}
                  title="4 columns"
                >
                  <Grid2X2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {Object.keys(filters).length > 0 && (
            <motion.div
              className="mt-3 flex items-center flex-wrap gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <span className="text-xs text-gray-500 font-medium">Active filters:</span>
              {/* Display active filter pills here */}
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-burgundy hover:text-burgundy-700"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block w-80 border-r border-gray-200 bg-white">
          <DynamicFilterPanel
            facets={facets}
            filters={filters}
            onFilterChange={updateFilters}
            onToggleFilter={toggleFilter}
            isFilterActive={isFilterActive}
            dynamicCategories={dynamicCategories}
            loading={loading}
          />
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <MinimalResponsiveProductGrid
            products={products}
            loading={loading}
            viewMode={viewMode === 'list' ? 'grid-3' : viewMode}
            onLoadMore={() => updateFilters({ 
              page: (filters.page || 1) + 1 
            })}
            hasMore={products.length < filteredCount}
            emptyStateConfig={{
              title: "No products found",
              description: "Try adjusting your filters or search terms",
              actionText: "Clear Filters",
              onAction: resetFilters
            }}
            mobileGrid="3x3"
          />
        </main>
      </div>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-5rem)]">
                <DynamicFilterPanel
                  facets={facets}
                  filters={filters}
                  onFilterChange={updateFilters}
                  onToggleFilter={toggleFilter}
                  isFilterActive={isFilterActive}
                  dynamicCategories={dynamicCategories}
                  loading={loading}
                  isMobile={true}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 bg-burgundy hover:bg-burgundy-700"
                  >
                    Show Results ({filteredCount})
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mobile Controls */}
      {isMobile && isScrolled && (
        <motion.div
          className="fixed bottom-4 right-4 flex flex-col space-y-2 md:hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            size="sm"
            onClick={() => setShowMobileFilters(true)}
            className="bg-black text-white shadow-lg"
          >
            <Filter className="w-4 h-4" />
          </Button>
          {/* Scroll to top */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white shadow-lg"
          >
            <ChevronDown className="w-4 h-4 transform rotate-180" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}