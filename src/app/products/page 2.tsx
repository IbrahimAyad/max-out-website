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
import { SupabaseConfigError } from "@/components/ui/SupabaseConfigError";
import { PullToRefresh } from "@/components/mobile/PullToRefresh";
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

  // Load products on mount and when dependencies change
  useEffect(() => {
    loadProducts()
  }, [filters, sort, currentPage, searchQuery, loadProducts])

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
    setCurrentPage(1)
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
    <PullToRefresh onRefresh={handleRefresh} className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-serif">Shop All Products</h1>
              <Badge variant="secondary">{totalCount} items</Badge>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </form>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              
              <div className="hidden sm:flex items-center gap-2 border border-gray-200 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-2"
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
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
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

      {/* Category Pills */}
      <div className="bg-white border-b">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              </Card>
            ) : (
              <>
                <div className={cn(
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                  <div className="mt-12 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNum = i + 1
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                      {totalPages > 5 && <span>...</span>}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
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
    </PullToRefresh>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}