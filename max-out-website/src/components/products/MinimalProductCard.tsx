'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-shop';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface MinimalProductCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  featured?: boolean;
}

export default function MinimalProductCard({
  product,
  onQuickView,
  onAddToCart,
  featured = false
}: MinimalProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
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

  // Get color variants from product data or create a single variant
  const colorVariants = product.colors && product.colors.length > 0 
    ? product.colors 
    : product.color 
      ? [{ name: product.color, hex: '#000000', image: product.imageUrl }]
      : [];

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div
      className={cn(
        "group relative bg-white",
        featured && "scale-105"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite Button - Subtle, outside image */}
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className="absolute top-4 right-4 z-10 p-0 bg-transparent"
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-all duration-300",
            isFavorited ? "fill-burgundy-600 text-burgundy-600" : "text-gray-300 hover:text-gray-500"
          )}
        />
      </button>

      {/* Main Image - Taller, cleaner */}
      <Link href={`/products/${product.slug || product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="text-gray-300 mb-2">
                <ShoppingBag className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-400 text-sm">{product.category || 'Product'}</p>
            </div>
          </div>
        )}
        
        {/* Very subtle hover overlay - just for Quick View and Add to Cart */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/95 via-white/80 to-transparent">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="flex-1 bg-white border border-gray-300 text-gray-900 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Add to Cart
              </button>
              {onQuickView && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onQuickView(product);
                  }}
                  className="px-3 bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </Link>

      {/* Minimal Content Below Image */}
      <div className="pt-4">
        {/* Product Name - Clean, no hover effects */}
        <Link href={`/products/${product.slug || product.id}`}>
          <h3 className="text-base font-normal text-gray-900 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Brief Description or Material */}
        <p className="text-sm text-gray-500 mb-3">
          {product.material || product.category || 'Premium Collection'}
        </p>

        {/* Price - Simple and clean */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-lg font-light text-gray-900">
            ${product.price}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Color Swatches - If multiple colors available */}
        {colorVariants.length > 1 && (
          <div className="flex gap-1.5">
            {colorVariants.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(index)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-all",
                  selectedColor === index 
                    ? "border-gray-900 scale-110" 
                    : "border-gray-300 hover:border-gray-500"
                )}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}

        {/* Size availability - Very subtle */}
        {product.size && Array.isArray(product.size) && product.size.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {product.size.length} sizes available
          </p>
        )}
      </div>
    </div>
  );
}