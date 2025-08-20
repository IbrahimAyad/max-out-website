'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star, TrendingUp } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-shop';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface LuxuryProductCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  featured?: boolean;
  size?: 'standard' | 'large';
}

export default function LuxuryProductCard({
  product,
  onQuickView,
  onAddToCart,
  featured = false,
  size = 'standard'
}: LuxuryProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsLoading(true);
    
    try {
      if (onAddToCart) {
        onAddToCart(product);
      } else {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl || '/placeholder.jpg',
          quantity: 1,
          category: product.category || 'product'
        });
      }
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  // Get color variants from product data
  const colorVariants = product.colors && product.colors.length > 0 
    ? product.colors 
    : product.color 
      ? [{ name: product.color, hex: '#000000', image: product.imageUrl }]
      : [];

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Dynamic sizing classes
  const sizeClasses = {
    standard: {
      container: 'max-w-sm',
      image: 'aspect-[3/4]',
      content: 'p-6',
      title: 'text-lg',
      price: 'text-xl'
    },
    large: {
      container: 'max-w-md',
      image: 'aspect-[4/5]',
      content: 'p-8',
      title: 'text-xl',
      price: 'text-2xl'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <article
      className={cn(
        "group relative bg-white overflow-hidden transition-all duration-300 ease-out",
        "hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:transform hover:-translate-y-1",
        "border border-transparent hover:border-neutral-200",
        currentSize.container,
        featured && "ring-2 ring-burgundy-800 ring-offset-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {featured && (
          <span className="inline-flex items-center gap-1 bg-burgundy-800 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
            <Star className="w-3 h-3" />
            Featured
          </span>
        )}
        {hasDiscount && (
          <span className="bg-burgundy-600 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
            Save {discountPercent}%
          </span>
        )}
        {product.trending && (
          <span className="inline-flex items-center gap-1 bg-neutral-900 text-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
            <TrendingUp className="w-3 h-3" />
            Trending
          </span>
        )}
        {product.aiScore && product.aiScore >= 85 && (
          <span className="bg-gold-500 text-neutral-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
            AI Pick
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white hover:scale-110"
        aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-all duration-200",
            isFavorited 
              ? "fill-burgundy-600 text-burgundy-600 scale-110" 
              : "text-neutral-400 hover:text-burgundy-600"
          )}
        />
      </button>

      {/* Product Image */}
      <Link 
        href={`/products/${product.slug || product.id}`} 
        className={cn("block relative overflow-hidden bg-neutral-50", currentSize.image)}
      >
        {(product.imageUrl || colorVariants[selectedColor]?.image) ? (
          <Image
            src={colorVariants[selectedColor]?.image || product.imageUrl || ''}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={featured}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-400 text-sm font-medium uppercase tracking-wide">
                {product.category || 'Product'}
              </p>
            </div>
          </div>
        )}
        
        {/* Hover Actions Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent",
          "flex items-end p-6 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="w-full flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isLoading}
              className={cn(
                "flex-1 py-3 px-4 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
                "border-2 backdrop-blur-sm",
                product.inStock
                  ? "bg-white/95 text-neutral-900 border-white hover:bg-white hover:shadow-lg"
                  : "bg-neutral-400/50 text-neutral-600 border-neutral-400 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-neutral-400 border-t-neutral-900 rounded-full animate-spin" />
                  Adding...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </div>
              )}
            </button>
            
            {onQuickView && (
              <button
                onClick={handleQuickView}
                className="px-4 py-3 bg-neutral-900/90 text-white border-2 border-neutral-900 hover:bg-neutral-900 backdrop-blur-sm transition-all duration-200 hover:shadow-lg"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Product Content */}
      <div className={currentSize.content}>
        {/* Category Label */}
        {product.category && (
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">
            {product.category}
          </p>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.slug || product.id}`}>
          <h3 className={cn(
            "font-serif font-normal text-neutral-900 mb-3 line-clamp-2",
            "hover:text-burgundy-800 transition-colors duration-200",
            currentSize.title
          )}>
            {product.name}
          </h3>
        </Link>

        {/* Product Description */}
        {product.description && (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Product Attributes */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.material && (
            <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">
              {product.material}
            </span>
          )}
          {product.size && Array.isArray(product.size) && product.size.length > 0 && (
            <span className="inline-block px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">
              {product.size.length} sizes
            </span>
          )}
        </div>

        {/* Price Display */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className={cn(
            "font-semibold text-burgundy-800",
            currentSize.price
          )}>
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-neutral-400 line-through">
                ${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}
              </span>
              <span className="text-sm text-green-600 font-semibold">
                Save ${((product.originalPrice! - product.price)).toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Color Variants */}
        {colorVariants.length > 1 && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
              Colors:
            </span>
            <div className="flex gap-2">
              {colorVariants.slice(0, 4).map((color, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(index);
                  }}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all duration-200",
                    "hover:scale-110 hover:shadow-md",
                    selectedColor === index 
                      ? "border-neutral-900 scale-110 shadow-lg" 
                      : "border-neutral-300"
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
              {colorVariants.length > 4 && (
                <span className="flex items-center justify-center w-6 h-6 bg-neutral-100 border-2 border-neutral-300 rounded-full text-xs font-semibold text-neutral-600">
                  +{colorVariants.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            product.inStock ? "bg-green-500" : "bg-neutral-400"
          )} />
          <span className="text-xs text-neutral-600 font-medium">
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Mobile Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
          className={cn(
            "md:hidden w-full mt-6 py-3 px-4 font-semibold text-sm uppercase tracking-wide transition-all duration-200",
            "border-2",
            product.inStock
              ? "bg-burgundy-800 text-white border-burgundy-800 hover:bg-burgundy-900 hover:border-burgundy-900"
              : "bg-neutral-200 text-neutral-400 border-neutral-200 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-neutral-400 border-t-white rounded-full animate-spin" />
              Adding...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </div>
          )}
        </button>
      </div>
    </article>
  );
}