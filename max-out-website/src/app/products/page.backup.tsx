"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  Grid3X3,
  List,
  SlidersHorizontal 
} from "lucide-react";
import { EnhancedProduct, ProductFilters, ProductSortOptions } from "@/lib/supabase/types";
import { SupabaseProductCard } from "@/components/shop/SupabaseProductCard";
import { ProductFiltersPanel } from "@/components/shop/ProductFiltersPanel";
import { CategoryPills, menswearCategories } from "@/components/shop/CategoryPills";
import { SmartFilters, QuickPriceFilters } from "@/components/shop/SmartFilters";
import { SupabaseConfigError } from "@/components/ui/SupabaseConfigError";
import { PullToRefresh } from "@/components/mobile/PullToRefresh";
import { MobileFilterDrawer } from "@/components/shop/MobileFilterDrawer";
import { MobileFilterTabs, ActiveFilterPills } from "@/components/shop/MobileFilterTabs";
import { InlineFilterSection } from "@/components/shop/InlineFilterSection";
import { GestureTutorial } from "@/components/mobile/GestureTutorial";
import { cn } from "@/lib/utils/cn";

interface ProductsResponse {
  products: EnhancedProduct[]
  totalCount: number
  currentPage: number
  totalPages: number
}

interface FilterMetadata {
  categories: string[]
  vendors: string[]
  colors: string[]
  priceRange: { min: number; max: number }
}

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<EnhancedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState<ProductFilters>({})
  const [sort, setSort] = useState<ProductSortOptions>({ field: 'created_at', direction: 'desc' })
  const [showFilters, setShowFilters] = useState(false)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [filterMetadata, setFilterMetadata] = useState<FilterMetadata>({
    categories: [],
    vendors: [],
    colors: [],
    priceRange: { min: 0, max: 1000 }
  })

  // Load filter metadata on component mount
  useEffect(() => {
    const loadFilterMetadata = async () => {
      try {
        const [categoriesRes, vendorsRes, colorsRes, priceRangeRes] = await Promise.all([
          fetch('/api/supabase/products?meta=categories'),
          fetch('/api/supabase/products?meta=vendors'),
          fetch('/api/supabase/products?meta=colors'),
          fetch('/api/supabase/products?meta=price-range')
        ])

        const [categoriesData, vendorsData, colorsData, priceRangeData] = await Promise.all([
          categoriesRes.json(),
          vendorsRes.json(),
          colorsRes.json(),
          priceRangeRes.json()
        ])

        setFilterMetadata({
          categories: categoriesData.categories || [],
          vendors: vendorsData.vendors || [],
          colors: colorsData.colors || [],
          priceRange: priceRangeData.priceRange || { min: 0, max: 1000 }
        })
      } catch (error) {
        console.error('Error loading filter metadata:', error)
      }
    }
    loadFilterMetadata()
  }, [])

  // Load products function (extracted for reuse)
  const loadProducts = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      
      // Add filters
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category)
      }
      if (filters.vendor) params.append('vendor', filters.vendor)
      if (filters.color) params.append('color', filters.color)
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
      if (searchQuery) params.append('search', searchQuery)
      
      // Add pagination
      params.append('page', currentPage.toString())
      params.append('limit', '24')
      
      // Add sorting
      params.append('sortBy', sort.field)
      params.append('sortOrder', sort.direction)

      const response = await fetch(`/api/supabase/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data: ProductsResponse = await response.json()
      
      setProducts(data.products)
      setTotalCount(data.totalCount)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error loading products:', error)
      setError('Failed to load products. Please try again later.')
    } finally {
      if (!isRefresh) setIsLoading(false)
    }
  }

  // Load products when dependencies change
  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, currentPage, searchQuery])

  // Reset page when filters, search, or sort changes  
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, searchQuery, sort.field, sort.direction])

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    await loadProducts(true)
  }

  // Handle category selection
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setFilters(prev => ({ ...prev, category: selectedCategory }))
    } else {
      setFilters(prev => {
        const { category, ...rest } = prev
        return rest
      })
    }
  }, [selectedCategory])

  // Handle search params
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setSelectedCategory('all')
    setSearchQuery('')
    setCurrentPage(1)
  }

  const activeFilterCount = Object.keys(filters).length + (searchQuery ? 1 : 0)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4 text-red-600">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </Card>
      </div>
    )
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gold-200/30 sticky top-0 z-30 shadow-sm backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-serif bg-gradient-to-r from-burgundy-700 to-burgundy-500 bg-clip-text text-transparent">Shop All Products</h1>
              <Badge className="bg-gold-100 text-burgundy-700 border-gold-300">{totalCount} items</Badge>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-300 transition-all duration-200 hover:border-burgundy-200"
                />
              </div>
            </form>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              {/* Desktop Filter Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex border-burgundy-200 hover:bg-burgundy-50 hover:border-burgundy-300 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2 text-burgundy-600" />
                <span className="text-burgundy-700">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-burgundy-500 text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              
              <div className="hidden sm:flex items-center gap-1 border-2 border-gold-200 rounded-xl p-1 bg-gold-50/50">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    viewMode === 'grid' 
                      ? "bg-burgundy-600 hover:bg-burgundy-700 text-white" 
                      : "hover:bg-gold-100 text-burgundy-700"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-all",
                    viewMode === 'list' 
                      ? "bg-burgundy-600 hover:bg-burgundy-700 text-white" 
                      : "hover:bg-gold-100 text-burgundy-700"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <select
                value={`${sort.field}-${sort.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-') as [ProductSortOptions['field'], ProductSortOptions['direction']]
                  setSort({ field, direction })
                }}
                className="px-4 py-2.5 border-2 border-gold-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-300 bg-white hover:border-gold-300 transition-colors text-burgundy-700 font-medium"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Name: A-Z</option>
                <option value="title-desc">Name: Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Inline Filter Section - Visible on Mobile Only */}
      <div className="lg:hidden bg-gradient-to-r from-burgundy-50/50 to-gold-50/50 border-b border-gold-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <InlineFilterSection
            filters={filters}
            onFiltersChange={(newFilters) => {
              setFilters(newFilters)
              // Sync category selection
              if (newFilters.category !== filters.category) {
                setSelectedCategory(newFilters.category || 'all')
              }
            }}
            metadata={filterMetadata}
            onOpenAllFilters={() => setIsMobileFilterOpen(true)}
          />
        </div>
      </div>

      {/* Desktop Category Pills */}
      <div className="hidden lg:block bg-gradient-to-r from-burgundy-50/30 via-white to-gold-50/30 border-b border-gold-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <CategoryPills
            categories={menswearCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Smart Filters Only */}
        <div className="hidden lg:block">
          <SmartFilters
            products={products}
            currentFilters={filters}
            onFiltersChange={setFilters}
            className="mb-6"
          />
        </div>

        {/* Quick Price Filters */}
        <QuickPriceFilters
          products={products}
          currentFilters={filters}
          onFiltersChange={setFilters}
          className="mb-6"
        />

        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFiltersPanel
              filters={filters}
              onFiltersChange={setFilters}
              metadata={filterMetadata}
              onClear={clearFilters}
              activeCount={activeFilterCount}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="animate-pulse border-gold-100">
                    <div className="aspect-[2/3] bg-gradient-to-br from-gold-100 to-burgundy-100/20" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gold-100 rounded w-3/4" />
                      <div className="h-4 bg-burgundy-100/50 rounded w-1/2" />
                      <div className="h-6 bg-burgundy-100 rounded w-1/3" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-gold-50 to-burgundy-50/20 border-2 border-gold-200">
                <Search className="h-12 w-12 text-burgundy-400 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-burgundy-700 mb-2">No products found</h3>
                <p className="text-burgundy-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="border-burgundy-300 hover:bg-burgundy-50 hover:border-burgundy-400 text-burgundy-700 font-semibold"
                >
                  Clear all filters
                </Button>
              </Card>
            ) : (
              <>
                <div className={cn(
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    : "space-y-4"
                )}>
                  {products.map((product) => (
                    <SupabaseProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1 || isLoading}
                      className="border-burgundy-200 hover:bg-burgundy-50 hover:border-burgundy-300 text-burgundy-700 font-medium transition-all"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-gold-50 border-2 border-gold-200 rounded-xl">
                      <span className="text-sm font-medium text-burgundy-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Badge className="bg-burgundy-500 text-white text-xs">
                        {totalCount} products
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages || isLoading}
                      className="border-burgundy-200 hover:bg-burgundy-50 hover:border-burgundy-300 text-burgundy-700 font-medium transition-all"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <ProductFiltersPanel
                filters={filters}
                onFiltersChange={setFilters}
                metadata={filterMetadata}
                onClear={clearFilters}
                activeCount={activeFilterCount}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        metadata={filterMetadata}
        onClear={clearFilters}
        activeCount={activeFilterCount}
      />
      
      {/* Mobile Gesture Tutorial */}
      <GestureTutorial />
    </PullToRefresh>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-burgundy-50/20 to-gold-50/20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-burgundy-600 mx-auto mb-4" />
          <p className="text-burgundy-700 font-medium">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}