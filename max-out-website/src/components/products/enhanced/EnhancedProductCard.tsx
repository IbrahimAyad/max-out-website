'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Tag } from 'lucide-react';
import { EnhancedProduct } from '@/lib/products/enhanced/types';
import { EnhancedAddToCartButton } from './EnhancedBuyButton';

interface EnhancedProductCardProps {
  product: EnhancedProduct;
  className?: string;
  showQuickActions?: boolean;
  showPricingTier?: boolean;
}

export function EnhancedProductCard({ 
  product, 
  className = '',
  showQuickActions = true,
  showPricingTier = false
}: EnhancedProductCardProps) {
  
  // Get primary image with fallback (supports both primary and hero fields)
  const getPrimaryImage = () => {
    const images = product.images;
    if (typeof images === 'object') {
      // Check for hero field (admin uses this)
      if (images.hero) {
        return {
          url: images.hero.url || images.hero.cdn_url,
          alt: images.hero.alt || product.name
        };
      }
      // Check for primary field (original schema)
      if (images.primary) {
        return {
          url: images.primary.cdn_url || images.primary.url,
          alt: images.primary.alt_text || product.name
        };
      }
    }
    return {
      url: '/placeholder-product.jpg',
      alt: product.name
    };
  };

  // Get current pricing tier
  const getCurrentTier = () => {
    if (!Array.isArray(product.pricing_tiers)) return null;
    
    return product.pricing_tiers.find(tier => 
      product.base_price >= tier.price_range.min && 
      product.base_price <= tier.price_range.max
    );
  };

  // Check if product is in stock
  const isInStock = () => {
    const inventory = product.inventory;
    if (typeof inventory === 'object' && 'available_stock' in inventory) {
      return (inventory.available_stock as number) > 0;
    }
    return true; // Default to in stock
  };

  // Get stock level indicator
  const getStockLevel = () => {
    const inventory = product.inventory;
    if (typeof inventory === 'object' && 'available_stock' in inventory) {
      const stock = inventory.available_stock as number;
      const threshold = (inventory.low_stock_threshold as number) || 5;
      
      if (stock === 0) return { level: 'out', text: 'Out of Stock', color: 'text-red-600' };
      if (stock <= threshold) return { level: 'low', text: 'Low Stock', color: 'text-orange-600' };
      return { level: 'good', text: 'In Stock', color: 'text-green-600' };
    }
    return { level: 'good', text: 'In Stock', color: 'text-green-600' };
  };

  const primaryImage = getPrimaryImage();
  const currentTier = getCurrentTier();
  const stockLevel = getStockLevel();
  const inStock = isInStock();

  return (
    <div className={`group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </Link>
        
        {/* Product Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
              Featured
            </span>
          )}
          {product.trending && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              Trending
            </span>
          )}
          {showPricingTier && currentTier && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
              <Tag size={10} />
              {currentTier.tier_name}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-medium px-2 py-1 rounded bg-white/90 ${stockLevel.color}`}>
            {stockLevel.text}
          </span>
        </div>

        {/* Quick Actions - Show on Hover */}
        {showQuickActions && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2">
              <button 
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                disabled={!inStock}
                title={inStock ? "Add to Cart" : "Out of Stock"}
              >
                <ShoppingCart size={18} />
              </button>
              <button 
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Add to Wishlist"
              >
                <Heart size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="capitalize">{product.category}</span>
          {product.brand && <span>{product.brand}</span>}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        {product.short_description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {product.short_description}
          </p>
        )}

        {/* Features (First 2) */}
        {Array.isArray(product.features) && product.features.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{product.features.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ${product.base_price.toFixed(2)}
            </span>
            {currentTier && showPricingTier && (
              <span className="text-xs text-gray-500">
                {currentTier.tier_name} tier
              </span>
            )}
          </div>

          {/* Rating (if available) */}
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.5</span>
            <span className="text-xs text-gray-500">(12)</span>
          </div>
        </div>

        {/* Action Button */}
        {inStock ? (
          <EnhancedAddToCartButton
            productId={product.id}
            productName={product.name}
            price={product.base_price}
            className="w-full mt-3"
            variant="primary"
          />
        ) : (
          <button
            className="w-full mt-3 py-2 px-4 rounded-md text-sm font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
            disabled
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}

// Grid wrapper component for enhanced product cards
interface EnhancedProductGridProps {
  products: EnhancedProduct[];
  className?: string;
  showQuickActions?: boolean;
  showPricingTier?: boolean;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export function EnhancedProductGrid({ 
  products, 
  className = '',
  showQuickActions = true,
  showPricingTier = false,
  columns = { mobile: 2, tablet: 3, desktop: 4 }
}: EnhancedProductGridProps) {
  
  const getGridClasses = () => {
    const mobileClass = `grid-cols-${columns.mobile}`;
    const tabletClass = `md:grid-cols-${columns.tablet}`;
    const desktopClass = `lg:grid-cols-${columns.desktop}`;
    
    return `grid ${mobileClass} ${tabletClass} ${desktopClass} gap-4`;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {products.map((product) => (
        <EnhancedProductCard
          key={product.id}
          product={product}
          showQuickActions={showQuickActions}
          showPricingTier={showPricingTier}
        />
      ))}
    </div>
  );
}