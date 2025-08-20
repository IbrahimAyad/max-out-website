'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Grid, List, ArrowUpDown, Eye, Type, Sparkles, Camera, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils/cn'
import { AdvancedVisualSearch } from '@/components/search/AdvancedVisualSearch'
import { EnhancedProductCard } from '@/components/products/enhanced/EnhancedProductCard'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  category: string
  base_price: number
  image_url?: string
  description?: string
  tags?: string[]
  in_stock?: boolean
  rating?: number
  reviews_count?: number
  brand?: string
}

interface SearchFilters {
  category: string[]
  priceRange: [number, number]
  inStock: boolean
  brand: string[]
  rating: number
  tags: string[]
}

const CATEGORIES = [
  'suits',
  'shirts',
  'ties',
  'accessories',
  'shoes',
  'jackets',
  'pants',
  'vests'
]

const BRANDS = [
  'Hugo Boss',
  'Armani',
  'Calvin Klein',
  'Ralph Lauren',
  'Brooks Brothers',
  'KCT Custom'
]

const PRICE_RANGES = [
  { label: 'Under $100', value: [0, 99] },
  { label: '$100 - $300', value: [100, 299] },
  { label: '$300 - $500', value: [300, 499] },
  { label: '$500 - $1000', value: [500, 999] },
  { label: 'Over $1000', value: [1000, 9999] }
]

export default function SearchPageContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchType, setSearchType] = useState<'text' | 'visual'>('text')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'>('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    priceRange: [0, 9999],
    inStock: false,
    brand: [],
    rating: 0,
    tags: []
  })
  
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = `search_${Date.now()}`

  // Load products and handle search
  useEffect(() => {
    loadProducts()
    
    // Get initial search query from URL params
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      setSearchType('text')
    }
    
    const type = searchParams.get('type')
    if (type === 'visual') {
      setSearchType('visual')
    }
  }, [searchParams])

  // Filter and search products
  useEffect(() => {
    filterAndSearchProducts()
  }, [products, searchQuery, filters, sortBy])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          category,
          base_price,
          image_url,
          description,
          tags,
          in_stock,
          brand,
          created_at
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) throw error
      
      const loadedProducts = data || []
      setProducts(loadedProducts)
      setTotalResults(loadedProducts.length)
      
    } catch (error) {
      console.error('Error loading products:', error)
      // Load demo products as fallback
      setProducts(createDemoProducts())
    } finally {
      setIsLoading(false)
    }
  }

  const createDemoProducts = (): Product[] => [
    {
      id: '1',
      name: 'Classic Navy Suit',
      category: 'suits',
      base_price: 599.99,
      image_url: '/images/products/navy-suit.jpg',
      description: 'Premium wool navy suit with modern fit',
      tags: ['business', 'formal', 'navy'],
      in_stock: true,
      rating: 4.8,
      reviews_count: 127,
      brand: 'KCT Custom'
    },
    {
      id: '2',
      name: 'Black Tuxedo',
      category: 'suits',
      base_price: 799.99,
      image_url: '/images/products/black-tuxedo.jpg',
      description: 'Elegant black tuxedo for formal events',
      tags: ['formal', 'wedding', 'black'],
      in_stock: true,
      rating: 4.9,
      reviews_count: 89,
      brand: 'Hugo Boss'
    },
    {
      id: '3',
      name: 'Cotton Dress Shirt',
      category: 'shirts',
      base_price: 79.99,
      image_url: '/images/products/dress-shirt.jpg',
      description: 'Classic white cotton dress shirt',
      tags: ['business', 'cotton', 'white'],
      in_stock: true,
      rating: 4.6,
      reviews_count: 203,
      brand: 'Calvin Klein'
    },
    {
      id: '4',
      name: 'Silk Burgundy Tie',
      category: 'ties',
      base_price: 24.99,
      image_url: '/images/products/burgundy-tie.jpg',
      description: '100% silk tie in rich burgundy',
      tags: ['silk', 'burgundy', 'formal'],
      in_stock: true,
      rating: 4.7,
      reviews_count: 156,
      brand: 'Ralph Lauren'
    }
  ]

  const filterAndSearchProducts = useCallback(() => {
    let filtered = [...products]
    
    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        product.brand?.toLowerCase().includes(query)
      )
    }
    
    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(product => 
        filters.category.includes(product.category)
      )
    }
    
    // Price range filter
    filtered = filtered.filter(product => 
      product.base_price >= filters.priceRange[0] && 
      product.base_price <= filters.priceRange[1]
    )
    
    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.in_stock)
    }
    
    // Brand filter
    if (filters.brand.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && filters.brand.includes(product.brand)
      )
    }
    
    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => 
        (product.rating || 0) >= filters.rating
      )
    }
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.base_price - b.base_price
        case 'price_high':
          return b.base_price - a.base_price
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        default:
          return 0
      }
    })
    
    setFilteredProducts(filtered)
    setTotalResults(filtered.length)
  }, [products, searchQuery, filters, sortBy])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    
    // Track search interaction
    if (user && query.trim()) {
      try {
        await supabase.functions.invoke('analytics-tracking', {
          body: {
            interactionType: 'text_search',
            sessionId,
            userId: user.id,
            interactionData: {
              searchQuery: query,
              resultsCount: totalResults
            },
            pageUrl: window.location.href
          }
        })
      } catch (error) {
        console.error('Analytics tracking failed:', error)
      }
    }
    
    // Update URL
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (searchType === 'visual') params.set('type', 'visual')
    router.push(`/search?${params.toString()}`, { scroll: false })
  }

  const handleVisualSearchResult = (productId: string) => {
    router.push(`/products-v2/${productId}`)
  }

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 9999],
      inStock: false,
      brand: [],
      rating: 0,
      tags: []
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 text-burgundy mb-2">
                <Search className="h-5 w-5" />
                <span className="text-sm font-semibold tracking-widest uppercase">Search & Discovery</span>
                <Sparkles className="h-5 w-5" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900">
                Find Your Perfect Style
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Search our collection with text or discover similar items using AI-powered visual search
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Tabs */}
        <Tabs value={searchType} onValueChange={(value) => setSearchType(value as 'text' | 'visual')} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text Search
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visual AI Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-6">
            {/* Text Search Interface */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search for suits, shirts, ties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                      className="pl-10 h-12 text-base"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleSearch(searchQuery)}
                  size="lg"
                  className="bg-burgundy hover:bg-burgundy-700 h-12 px-8"
                >
                  Search
                </Button>
              </div>
            </Card>

            {/* Filters and Results */}
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <Card className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Category</h4>
                    <div className="space-y-2">
                      {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={filters.category.includes(category)}
                            onCheckedChange={(checked) => {
                              const newCategories = checked
                                ? [...filters.category, category]
                                : filters.category.filter(c => c !== category)
                              updateFilter('category', newCategories)
                            }}
                          />
                          <label htmlFor={category} className="text-sm font-medium capitalize cursor-pointer">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="space-y-2">
                      {PRICE_RANGES.map((range) => (
                        <div key={range.label} className="flex items-center space-x-2">
                          <Checkbox
                            id={range.label}
                            checked={filters.priceRange[0] === range.value[0] && filters.priceRange[1] === range.value[1]}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFilter('priceRange', range.value)
                              }
                            }}
                          />
                          <label htmlFor={range.label} className="text-sm font-medium cursor-pointer">
                            {range.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Brand</h4>
                    <div className="space-y-2">
                      {BRANDS.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={brand}
                            checked={filters.brand.includes(brand)}
                            onCheckedChange={(checked) => {
                              const newBrands = checked
                                ? [...filters.brand, brand]
                                : filters.brand.filter(b => b !== brand)
                              updateFilter('brand', newBrands)
                            }}
                          />
                          <label htmlFor={brand} className="text-sm font-medium cursor-pointer">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* In Stock Filter */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={filters.inStock}
                      onCheckedChange={(checked) => updateFilter('inStock', checked)}
                    />
                    <label htmlFor="in-stock" className="text-sm font-medium cursor-pointer">
                      In Stock Only
                    </label>
                  </div>
                </Card>
              </div>

              {/* Results */}
              <div className="lg:col-span-3 space-y-6">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-gray-600">
                      {isLoading ? 'Loading...' : `${totalResults} results found`}
                      {searchQuery && (
                        <span className="ml-1">
                          for "<span className="font-medium">{searchQuery}</span>"
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* View Mode */}
                    <div className="flex border rounded-lg">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="rounded-r-none"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="p-4 animate-pulse">
                        <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className={cn(
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  )}>
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href={`/products-v2/${product.id}`}>
                          <EnhancedProductCard
                            product={product}
                            viewMode={viewMode}
                            showQuickAdd={true}
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visual" className="space-y-6">
            {/* Visual Search Interface */}
            <AdvancedVisualSearch
              onResultClick={handleVisualSearchResult}
              className=""
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
