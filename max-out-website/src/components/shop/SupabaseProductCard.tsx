'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { WishlistButton } from '@/components/products/WishlistButton';
import { useCart } from '@/lib/hooks/useCart';
import { EnhancedProduct } from '@/lib/supabase/types';

interface SupabaseProductCardProps {
  product: EnhancedProduct;
  className?: string;
  showQuickAdd?: boolean;
  showWishlist?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  onQuickView?: (product: EnhancedProduct) => void;
}

export function SupabaseProductCard({
  product,
  className,
  showQuickAdd = true,
  showWishlist = true,
  variant = 'default',
  onQuickView,
}: SupabaseProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For quick add, use the first available variant or default size
    const defaultVariant = product.variants?.[0];
    if (defaultVariant) {
      await addToCart(product, defaultVariant.size || 'M', 1);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const primaryImage = product.primaryImage || product.images[0];
  const secondaryImage = product.images[1];

  return (
    <div
      className={cn(
        "group relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100",
        "hover:shadow-xl hover:border-gold/20 transition-all duration-500 ease-out",
        "transform hover:scale-[1.02] hover:-translate-y-1",
        isCompact ? "aspect-[3/4]" : "aspect-[3/5]",
        isFeatured && "ring-2 ring-gold/30 shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Link Wrapper */}
      <Link
        href={`/products/${product.id}`}
        className="block h-full"
        aria-label={`View ${product.name}`}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
          {/* Primary Image */}
          {primaryImage && !imageError ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                imageLoaded ? "opacity-100" : "opacity-0",
                isHovered && secondaryImage ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              priority={isFeatured}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}

          {/* Secondary Image (Hover Effect) */}
          {secondaryImage && !imageError && (
            <Image
              src={secondaryImage}
              alt={`${product.name} - alternate view`}
              fill
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                isHovered ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {!product.inStock && (
              <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Out of Stock
              </div>
            )}
            {hasDiscount && (
              <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                -{discountPercentage}%
              </div>
            )}
            {product.isFeatured && (
              <div className="bg-gold text-black text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Featured
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className={cn(
            "absolute top-3 right-3 flex flex-col gap-2 z-10",
            "transform transition-all duration-300 ease-out",
            isHovered ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
          )}>
            {showWishlist && (
              <WishlistButton
                productId={product.id}
                variant="icon"
                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
              />
            )}
            {onQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm transition-all duration-300 hover:scale-110 group/btn"
                aria-label="Quick view"
              >
                <Eye className="h-4 w-4 text-gray-700 group-hover/btn:text-gold transition-colors" />
              </button>
            )}
          </div>

          {/* Quick Add Overlay */}
          {showQuickAdd && product.inStock && (
            <div className={cn(
              "absolute inset-x-3 bottom-3 z-10",
              "transform transition-all duration-300 ease-out",
              isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}>
              <Button
                onClick={handleQuickAdd}
                className="w-full bg-black/90 hover:bg-black text-white backdrop-blur-sm shadow-lg"
                size="sm"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          )}

          {/* Loading Shimmer */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          )}
        </div>

        {/* Product Info */}
        <div className={cn(
          "p-4 space-y-2",
          isCompact ? "p-3 space-y-1" : "p-4 space-y-2"
        )}>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="uppercase tracking-wide">{product.category}</span>
            {product.brand && (
              <span className="font-medium">{product.brand}</span>
            )}
          </div>

          {/* Product Name */}
          <h3 className={cn(
            "font-medium text-gray-900 line-clamp-2 transition-colors group-hover:text-gold",
            isCompact ? "text-sm" : "text-base"
          )}>
            {product.name}
          </h3>

          {/* Product Type */}
          {product.productType && (
            <p className="text-xs text-gray-500 capitalize">
              {product.productType}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-semibold text-gray-900",
              isCompact ? "text-sm" : "text-base"
            )}>
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Color Variants Preview */}
          {product.colorFamily && (
            <div className="flex items-center gap-1">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                style={{ backgroundColor: product.colorFamily.toLowerCase() }}
                title={product.colorFamily}
              />
              <span className="text-xs text-gray-500">
                {product.colorFamily}
              </span>
            </div>
          )}

          {/* Tags */}
          {product.occasionTags.length > 0 && !isCompact && (
            <div className="flex flex-wrap gap-1">
              {product.occasionTags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
              {product.occasionTags.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{product.occasionTags.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Gold accent border on hover */}
      <div className={cn(
        "absolute inset-0 border-2 border-gold rounded-lg pointer-events-none",
        "transition-opacity duration-300",
        isHovered ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
}