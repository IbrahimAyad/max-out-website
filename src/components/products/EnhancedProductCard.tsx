'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Tag, TrendingUp, Star } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-shop';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface EnhancedProductCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  featured?: boolean;
}

export default function EnhancedProductCard({
  product,
  onQuickView,
  onAddToCart,
  featured = false
}: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
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
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300",
        featured && "ring-2 ring-gold-500 ring-offset-2"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {hasDiscount && (
          <span className="bg-burgundy-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            Save {discountPercent}%
          </span>
        )}
        {product.trending && (
          <span className="bg-gold-500 text-burgundy-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </span>
        )}
        {product.aiScore && product.aiScore >= 85 && (
          <span className="bg-gold-500 text-burgundy-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3" />
            AI Pick
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-colors",
            isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
          )}
        />
      </button>

      {/* Image - Matching bundle card height */}
      <Link 
        href={`/products/${product.slug || product.id}`} 
        className="block relative h-96 overflow-hidden bg-gray-100 group"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
            <Tag className="w-16 h-16" />
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="w-full">
            <div className="flex gap-3 mb-3">
              {onQuickView && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onQuickView(product);
                  }}
                  className="flex-1 bg-white text-gray-900 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Quick View
                </button>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                disabled={!product.inStock}
                className={cn(
                  "flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-2",
                  product.inStock
                    ? "bg-burgundy-600 text-white hover:bg-burgundy-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Content - Matching bundle card padding */}
      <div className="p-6">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {product.category}
          </p>
        )}

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-burgundy-600 transition-colors">
          <Link href={`/products/${product.slug || product.id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Product Details */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.color && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
              {product.color}
            </span>
          )}
          {product.size && Array.isArray(product.size) && product.size.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {product.size.length} sizes available
            </span>
          )}
          {product.material && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {product.material}
            </span>
          )}
        </div>

        {/* Price - Larger text to match bundle cards */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-burgundy-600">
            ${product.price}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-gray-400 line-through">
                ${product.originalPrice}
              </span>
              <span className="text-sm text-green-600 font-medium">
                Save ${(product.originalPrice! - product.price).toFixed(2)}
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            product.inStock ? "bg-green-500" : "bg-gray-400"
          )}></div>
          <span className="text-xs text-gray-600">
            {product.inStock ? 'Always in Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Mobile Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            "md:hidden w-full mt-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2",
            product.inStock
              ? "bg-burgundy-600 text-white hover:bg-burgundy-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          <ShoppingBag className="w-4 h-4" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}