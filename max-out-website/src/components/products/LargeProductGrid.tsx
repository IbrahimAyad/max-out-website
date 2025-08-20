'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UnifiedProduct } from '@/types/unified-shop';
import UniversalLargeCard from './UniversalLargeCard';
import { Grid2x2, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LargeProductGridProps {
  products: UnifiedProduct[];
  loading?: boolean;
  onQuickView?: (product: UnifiedProduct) => void;
  showLayoutToggle?: boolean;
  defaultLayout?: '2x2' | '3x3';
}

export default function LargeProductGrid({
  products,
  loading = false,
  onQuickView,
  showLayoutToggle = true,
  defaultLayout = '2x2'
}: LargeProductGridProps) {
  const [layoutMode, setLayoutMode] = useState<'2x2' | '3x3'>(defaultLayout);
  
  // Update layout when prop changes
  React.useEffect(() => {
    setLayoutMode(defaultLayout);
  }, [defaultLayout]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] bg-gray-200 rounded-lg mb-4" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">No products found</p>
        <p className="text-gray-400">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <>
      {/* Layout Toggle (optional) */}
      {showLayoutToggle && products.length > 2 && (
        <div className="flex justify-end mb-6">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
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
        </div>
      )}

      {/* Product Grid */}
      <div 
        className={cn(
          "grid gap-8",
          layoutMode === '2x2' 
            ? "grid-cols-1 lg:grid-cols-2 lg:gap-12" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
        )}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.05,
              duration: 0.3
            }}
          >
            <UniversalLargeCard
              product={product}
              onQuickView={onQuickView}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}