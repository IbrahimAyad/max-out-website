'use client';

import { UnifiedProduct } from '@/types/unified-shop';
import UnifiedProductCard from './UnifiedProductCard';
import { cn } from '@/lib/utils';

interface MinimalProductGridProps {
  products: UnifiedProduct[];
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  columns?: 2 | 3 | 4;
  gap?: 'tight' | 'normal' | 'relaxed';
  className?: string;
}

export default function MinimalProductGrid({
  products,
  onQuickView,
  onAddToCart,
  columns = 4,
  gap = 'relaxed',
  className
}: MinimalProductGridProps) {
  
  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const gridGaps = {
    tight: 'gap-4',
    normal: 'gap-6',
    relaxed: 'gap-8 lg:gap-10'
  };

  return (
    <div className={cn(
      'grid',
      gridColumns[columns],
      gridGaps[gap],
      className
    )}>
      {products.map((product, index) => (
        <UnifiedProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          featured={index < 2} // Feature first 2 items
          layout="minimal"
        />
      ))}
    </div>
  );
}