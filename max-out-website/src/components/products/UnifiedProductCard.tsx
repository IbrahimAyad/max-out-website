'use client';

import { UnifiedProduct } from '@/types/unified-shop';
import MinimalBundleCard from './MinimalBundleCard';
import MinimalProductCard from './MinimalProductCard';
import BundleProductCard from './BundleProductCard';
import SimpleProductCard from './SimpleProductCard';

interface UnifiedProductCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  featured?: boolean;
  layout?: 'standard' | 'large' | 'compact' | 'minimal';
}

export default function UnifiedProductCard({
  product,
  onQuickView,
  onAddToCart,
  featured = false,
  layout = 'minimal' // Changed default to minimal for the new clean look
}: UnifiedProductCardProps) {
  
  // Use minimal layout by default for modern, clean look
  if (layout === 'minimal') {
    if (product.isBundle) {
      return (
        <MinimalBundleCard
          product={product}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          featured={featured}
        />
      );
    }
    return (
      <MinimalProductCard
        product={product}
        onQuickView={onQuickView}
        onAddToCart={onAddToCart}
        featured={featured}
      />
    );
  }
  
  // Fall back to standard cards if requested
  if (product.isBundle) {
    return (
      <BundleProductCard
        product={product}
        onQuickView={onQuickView}
        onAddToCart={onAddToCart}
        featured={featured}
      />
    );
  }
  
  return (
    <SimpleProductCard
      product={product}
      onQuickView={onQuickView}
      onAddToCart={onAddToCart}
      featured={featured}
    />
  );
}