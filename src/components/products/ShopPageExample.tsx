'use client';

import React, { useState, useEffect } from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { EnhancedProduct, ProductFilters } from '@/lib/supabase/types';

// Import our new components
import { SupabaseProductCard } from './SupabaseProductCard';
import { ProductFiltersPanel } from './ProductFiltersPanel';
import { CategoryPills } from './CategoryPills';
import { ProductSkeleton } from './ProductSkeleton';

interface ShopPageExampleProps {
  products: EnhancedProduct[];
  isLoading?: boolean;
  className?: string;
}

type ViewMode = 'grid' | 'list';
type GridSize = 'compact' | 'default' | 'large';

export function ShopPageExample({
  products,
  isLoading = false,
  className
}: ShopPageExampleProps) {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [gridSize, setGridSize] = useState<GridSize>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<EnhancedProduct[]>(products);

  // Mock product counts for demonstration
  const mockProductCounts = {
    categories: {
      'Formal Wear': 45,
      'Vest & Accessory Sets': 32,
      'Footwear': 28,
      'Apparel': 67,
      'Other': 15
    },
    colors: {
      'black': 23,
      'navy': 18,
      'gray': 15,
      'brown': 12,
      'burgundy': 8
    },
    occasions: {
      'Wedding': 34,
      'Business': 45,
      'Formal': 28,
      'Prom': 22
    },
    brands: {
      'KCT Menswear': 89,
      'Calvin Klein': 23,
      'Hugo Boss': 15
    },
    totalProducts: products.length
  };

  // Filter products based on current filters
  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryName = selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      filtered = filtered.filter(product => 
        product.category.toLowerCase().includes(categoryName.toLowerCase())
      );
    }

    // Apply other filters
    if (filters.categories?.length) {
      filtered = filtered.filter(product =>
        filters.categories!.some(cat => 
          product.category.toLowerCase().includes(cat.toLowerCase())
        )
      );
    }

    if (filters.colors?.length) {
      filtered = filtered.filter(product =>
        filters.colors!.some(color =>
          product.colorFamily?.toLowerCase().includes(color.toLowerCase()) ||
          product.tags.some(tag => tag.toLowerCase().includes(color.toLowerCase()))
        )
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(product =>
        product.price >= filters.priceRange!.min &&
        product.price <= filters.priceRange!.max
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    if (filters.featured) {
      filtered = filtered.filter(product => product.isFeatured);
    }

    setFilteredProducts(filtered);
  }, [products, filters, selectedCategory]);

  const handleQuickView = (product: EnhancedProduct) => {

    // Implement quick view modal logic here
  };

  const getGridColumns = () => {
    switch (gridSize) {
      case 'compact':
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
      case 'large':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  if (isLoading) {
    return (
      <div className={cn("w-full", className)}>
        <ProductSkeleton 
          variant={gridSize === 'compact' ? 'compact' : 'default'}
          count={12}
          showFilters={true}
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Category Pills */}
      <div className="mb-8">
        <CategoryPills
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          variant="premium"
          showCounts={true}
          categories={[
            { id: 'all', name: 'All Products', count: products.length },
            { id: 'formal-wear', name: 'Formal Wear', count: mockProductCounts.categories['Formal Wear'] },
            { id: 'vest-accessory-sets', name: 'Vest & Accessory Sets', count: mockProductCounts.categories['Vest & Accessory Sets'] },
            { id: 'footwear', name: 'Footwear', count: mockProductCounts.categories['Footwear'] },
            { id: 'apparel', name: 'Apparel', count: mockProductCounts.categories['Apparel'] },
            { id: 'other', name: 'Other', count: mockProductCounts.categories['Other'] }
          ]}
        />
      </div>

      <div className="flex gap-8">
        {/* Filters Panel */}
        <div className={cn(
          "w-72 flex-shrink-0 transition-all duration-300",
          showFilters ? "block" : "hidden lg:block"
        )}>
          <ProductFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setShowFilters(false)}
            productCounts={mockProductCounts}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <p className="text-sm text-gray-600">
                {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Grid Size Controls */}
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <button
                  onClick={() => setGridSize('compact')}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    gridSize === 'compact' ? "bg-gold text-black" : "hover:bg-gray-100"
                  )}
                  title="Compact view"
                >
                  <Grid className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setGridSize('default')}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    gridSize === 'default' ? "bg-gold text-black" : "hover:bg-gray-100"
                  )}
                  title="Default view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridSize('large')}
                  className={cn(
                    "p-1.5 rounded transition-colors",
                    gridSize === 'large' ? "bg-gold text-black" : "hover:bg-gray-100"
                  )}
                  title="Large view"
                >
                  <Grid className="h-5 w-5" />
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded transition-colors",
                    viewMode === 'grid' ? "bg-gold text-black" : "hover:bg-gray-100"
                  )}
                  title="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded transition-colors",
                    viewMode === 'list' ? "bg-gold text-black" : "hover:bg-gray-100"
                  )}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <p className="text-gray-400">Try adjusting your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                  setSelectedCategory(null);
                }}
                className="mt-4"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? `grid ${getGridColumns()} gap-6` 
                : "space-y-4"
            )}>
              {filteredProducts.map((product) => (
                <SupabaseProductCard
                  key={product.id}
                  product={product}
                  variant={viewMode === 'list' ? 'default' : gridSize}
                  onQuickView={handleQuickView}
                  showQuickAdd={true}
                  showWishlist={true}
                />
              ))}
            </div>
          )}

          {/* Load More / Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center mt-12">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}