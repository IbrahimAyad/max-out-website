'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useUnifiedShop } from '@/hooks/useUnifiedShop';
import { getDbFiltersFromMarketing, getCollectionById } from '@/lib/config/collection-mapping';
import { UnifiedProduct } from '@/types/unified-shop';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Grid3X3, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartCollectionPageProps {
  collectionId: string;
  showFilters?: boolean;
}

export default function SmartCollectionPage({ collectionId, showFilters = true }: SmartCollectionPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const collection = getCollectionById(collectionId);
  
  // Get the database filters for this marketing collection
  const dbFilters = useMemo(() => {
    return getDbFiltersFromMarketing(collectionId);
  }, [collectionId]);

  // Fetch products using the smart filters
  const { 
    products, 
    loading, 
    error,
    totalCount 
  } = useUnifiedShop({
    initialFilters: {
      category: dbFilters.categories,
      tags: dbFilters.tags,
      includeIndividual: true,
      includeBundles: collectionId === 'complete-looks'
    },
    autoFetch: true
  });

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high':
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [products, sortBy]);

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Collection not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {collection.marketingName} Collection
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {collection.description}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="featured">Featured</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {collection.marketingName}...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading products</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-4">No products found in this collection</p>
              <p className="text-gray-500">Please check back later for new arrivals</p>
            </div>
          ) : (
            <div className={cn(
              'grid gap-6',
              viewMode === 'grid' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1'
            )}>
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, viewMode }: { product: UnifiedProduct; viewMode: 'grid' | 'list' }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle different image formats from unified products
  const getProductImage = () => {
    if (product.imageUrl) return product.imageUrl;
    if (product.images?.length > 0) {
      // Check if it's an object with src property (enhanced products)
      if (typeof product.images[0] === 'object' && product.images[0].src) {
        return product.images[0].src;
      }
      // Otherwise assume it's a direct URL string
      return product.images[0];
    }
    return '/placeholder-product.jpg';
  };
  
  const productImage = getProductImage();
  const productPrice = typeof product.price === 'string' 
    ? parseFloat(product.price) 
    : product.price;
  
  // Determine the product link URL
  const getProductUrl = () => {
    // For enhanced products, use the ID (enhanced_[id] format)
    if (product.enhanced && product.id.startsWith('enhanced_')) {
      return `/products/${product.id}`;
    }
    // For other products, use slug if available, otherwise id
    return `/products/${product.slug || product.id}`;
  };

  if (viewMode === 'list') {
    return (
      <div className="flex gap-6 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
        <Link href={getProductUrl()} className="relative w-48 h-48 flex-shrink-0">
          <Image
            src={imageError ? '/placeholder-product.jpg' : productImage}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            onError={() => setImageError(true)}
          />
        </Link>
        <div className="flex-1">
          <Link href={getProductUrl()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:underline">{product.name}</h3>
          </Link>
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          <p className="text-2xl font-bold text-gray-900 mb-4">${productPrice.toFixed(2)}</p>
          <div className="flex gap-2">
            <Button className="flex-1">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn('w-4 h-4', isLiked && 'fill-red-500 text-red-500')} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <Link href={getProductUrl()} className="block">
        <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={imageError ? '/placeholder-product.jpg' : productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={cn('w-5 h-5', isLiked && 'fill-red-500 text-red-500')} />
          </button>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-gray-900">
          ${productPrice.toFixed(2)}
        </p>
      </Link>
      <Button 
        className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
        size="sm"
      >
        Quick Add
      </Button>
    </div>
  );
}