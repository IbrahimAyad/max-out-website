'use client';

import { UnifiedProduct } from '@/types/unified-shop';
import UnifiedProductCard from './UnifiedProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface UnifiedProductGridProps {
  products: UnifiedProduct[];
  loading?: boolean;
  featured?: string[]; // Product IDs to feature
  gridLayout?: 'standard' | 'large' | 'compact' | 'mixed';
  showBundlesFirst?: boolean;
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
}

export default function UnifiedProductGrid({
  products,
  loading = false,
  featured = [],
  gridLayout = 'standard',
  showBundlesFirst = true,
  onQuickView,
  onAddToCart
}: UnifiedProductGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Sort products: Featured first, then bundles (if showBundlesFirst), then others
  const sortedProducts = [...products].sort((a, b) => {
    // Featured products always first
    const aFeatured = featured.includes(a.id);
    const bFeatured = featured.includes(b.id);
    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;
    
    // Then bundles if showBundlesFirst is true
    if (showBundlesFirst) {
      if (a.isBundle && !b.isBundle) return -1;
      if (!a.isBundle && b.isBundle) return 1;
    }
    
    // Then by AI score if available
    const aScore = a.aiScore || 0;
    const bScore = b.aiScore || 0;
    return bScore - aScore;
  });
  
  // Determine grid class based on layout
  const getGridClass = () => {
    switch (gridLayout) {
      case 'large':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
      case 'compact':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4';
      case 'mixed':
        // Mixed layout: Bundles get larger space
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto';
      case 'standard':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };
  
  // Get card span class for mixed layout
  const getCardSpanClass = (product: UnifiedProduct, index: number) => {
    if (gridLayout !== 'mixed') return '';
    
    // Featured products and bundles get larger space in mixed layout
    const isFeatured = featured.includes(product.id);
    const isFirstBundle = product.isBundle && index === sortedProducts.findIndex(p => p.isBundle);
    
    if (isFeatured || isFirstBundle) {
      return 'md:col-span-2 md:row-span-2';
    }
    
    if (product.isBundle) {
      return 'lg:col-span-2';
    }
    
    return '';
  };
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-96 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No products found
          </h3>
          <p className="text-gray-600 mb-8">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-burgundy-600 text-white px-6 py-3 rounded-lg hover:bg-burgundy-700 transition-colors"
          >
            View All Products
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{products.length}</span> products
          {sortedProducts.filter(p => p.isBundle).length > 0 && (
            <span className="ml-2">
              ({sortedProducts.filter(p => p.isBundle).length} complete looks, 
              {' '}{sortedProducts.filter(p => !p.isBundle).length} individual items)
            </span>
          )}
        </p>
        
        {showBundlesFirst && sortedProducts.some(p => p.isBundle) && (
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-burgundy-600 rounded-full"></div>
            <span className="text-gray-600">Complete Styled Looks</span>
          </div>
        )}
      </div>
      
      {/* Product Grid */}
      <div className={getGridClass()}>
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={getCardSpanClass(product, index)}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`
                h-full relative
                ${hoveredId === product.id ? 'z-10' : ''}
                ${product.isBundle && gridLayout === 'mixed' ? 'scale-105' : ''}
              `}>
                <UnifiedProductCard
                  product={product}
                  featured={featured.includes(product.id)}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  layout={
                    gridLayout === 'mixed' && (featured.includes(product.id) || product.isBundle)
                      ? 'large'
                      : gridLayout === 'compact'
                      ? 'compact'
                      : 'standard'
                  }
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Bundle vs Individual Legend */}
      {sortedProducts.some(p => p.isBundle) && sortedProducts.some(p => !p.isBundle) && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-burgundy-600 to-burgundy-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">B</span>
              </div>
              <span className="text-gray-700">
                Complete Styled Look - Suit + Shirt + Tie
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-700 text-xs font-bold">I</span>
              </div>
              <span className="text-gray-700">
                Individual Item - Build Your Own Look
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}