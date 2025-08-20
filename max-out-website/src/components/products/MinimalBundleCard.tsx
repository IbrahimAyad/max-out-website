'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, Layers } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-shop';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface MinimalBundleCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  featured?: boolean;
}

export default function MinimalBundleCard({
  product,
  onQuickView,
  onAddToCart,
  featured = false
}: MinimalBundleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showComponents, setShowComponents] = useState(false);
  const { addItem } = useCart();

  if (!product.isBundle) {
    return null;
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.bundlePrice || product.price,
        image: product.imageUrl || '/placeholder.jpg',
        quantity: 1,
        category: 'bundle'
      });
    }
  };

  const savingsPercent = product.originalPrice && product.bundlePrice
    ? Math.round(((product.originalPrice - product.bundlePrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative bg-white",
        featured && "scale-105"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Minimal Badges - Only show savings if significant */}
      {savingsPercent >= 15 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-burgundy-600 text-white px-2.5 py-1 text-xs font-medium">
            Save {savingsPercent}%
          </span>
        </div>
      )}

      {/* Favorite Button */}
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

      {/* Main Image or Component View */}
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-gray-50 cursor-pointer"
        onClick={() => setShowComponents(!showComponents)}
      >
        {!showComponents ? (
          <>
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={featured}
            />
            
            {/* Subtle component indicator */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded">
              <Layers className="w-4 h-4 text-gray-700" />
            </div>

            {/* Hover overlay - Very minimal */}
            {isHovered && (
              <div className="absolute inset-0 bg-black/5 transition-opacity duration-300" />
            )}
          </>
        ) : (
          // Component Grid - Clean and minimal
          <div className={`grid ${product.bundleComponents?.pocketSquare ? 'grid-cols-2 grid-rows-2' : 'grid-cols-3'} h-full gap-0.5 bg-gray-100`}>
            {product.bundleComponents?.suit && (
              <div className="relative bg-white">
                {product.bundleComponents.suit.image ? (
                  <Image
                    src={product.bundleComponents.suit.image}
                    alt={`${product.bundleComponents.suit.color} Suit`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <span className="text-xs text-gray-400">Suit</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
                  {product.bundleComponents.suit.color}
                </div>
              </div>
            )}
            
            {product.bundleComponents?.shirt && (
              <div className="relative bg-white">
                {product.bundleComponents.shirt.image ? (
                  <Image
                    src={product.bundleComponents.shirt.image}
                    alt={`${product.bundleComponents.shirt.color} Shirt`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <span className="text-xs text-gray-400">Shirt</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
                  {product.bundleComponents.shirt.color}
                </div>
              </div>
            )}
            
            {product.bundleComponents?.tie && (
              <div className="relative bg-white">
                {product.bundleComponents.tie.image ? (
                  <Image
                    src={product.bundleComponents.tie.image}
                    alt={`${product.bundleComponents.tie.color} Tie`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <span className="text-xs text-gray-400">Tie</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
                  {product.bundleComponents.tie.color}
                </div>
              </div>
            )}
            
            {product.bundleComponents?.pocketSquare && (
              <div className="relative bg-white">
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <span className="text-xs text-gray-400">Pocket Square</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs">
                  {product.bundleComponents.pocketSquare.color}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Minimal Content */}
      <div className="pt-4">
        {/* Bundle Name */}
        <Link href={`/bundles/${product.id}`}>
          <h3 className="text-base font-normal text-gray-900 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Bundle Type / Occasions */}
        <p className="text-sm text-gray-500 mb-3">
          {product.occasions?.[0] || 'Complete Look'}
        </p>

        {/* Pricing - Clean presentation */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-lg font-light text-gray-900">
            ${product.bundlePrice || product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Components Indicator - Minimal dots */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex gap-1">
            {product.bundleComponents?.suit && (
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" title="Suit" />
            )}
            {product.bundleComponents?.shirt && (
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" title="Shirt" />
            )}
            {product.bundleComponents?.tie && (
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" title="Tie" />
            )}
            {product.bundleComponents?.pocketSquare && (
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" title="Pocket Square" />
            )}
          </div>
          <span>{showComponents ? 'Click to view outfit' : 'Click to see pieces'}</span>
        </div>

        {/* Hover Actions - Clean and minimal */}
        {isHovered && (
          <div className="flex gap-2 mt-3">
            <Link 
              href={`/bundles/${product.id}`}
              className="flex-1 border border-gray-300 text-center py-2 text-sm hover:bg-gray-50 transition-colors"
            >
              View Details
            </Link>
            {onQuickView && (
              <button
                onClick={() => onQuickView(product)}
                className="px-3 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
