'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Sparkles, Eye, ArrowRight, Info, Check, Zap } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-shop';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface LargeBundleCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  layout?: '2x2' | '3x3';
}

export default function LargeBundleCard({
  product,
  onQuickView,
  layout = '2x2'
}: LargeBundleCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showComponents, setShowComponents] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  if (!product.isBundle) return null;

  const savingsPercent = product.originalPrice && product.bundlePrice
    ? Math.round(((product.originalPrice - product.bundlePrice) / product.originalPrice) * 100)
    : 0;

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedSize && layout === '2x2') {
      setShowSizeGuide(true);
      return;
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.bundlePrice || product.price,
      image: product.imageUrl || '/placeholder.jpg',
      quantity: 1,
      category: 'bundle',
      size: selectedSize || '40'
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const sizes = ['36', '38', '40', '42', '44', '46', '48', '50'];

  // For 2x2 layout - larger, more impactful with smart features
  if (layout === '2x2') {
    return (
      <div 
        className="group relative bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {/* Favorite with animation */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-all",
              isFavorited ? "fill-burgundy-600 text-burgundy-600 animate-pulse" : "text-gray-600"
            )}
          />
        </button>

        {/* Large Image with smart interactions */}
        <Link href={`/bundles/${product.id}`}>
          <div 
            className="relative aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer"
            onClick={(e) => {
              if (showComponents) {
                e.preventDefault();
                setShowComponents(false);
              }
            }}
          >
            {!showComponents ? (
              <>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                
                {/* Hover overlay with smart actions */}
                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowComponents(true);
                        }}
                        className="flex-1 bg-white text-black py-3 px-4 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Pieces
                      </button>
                      {onQuickView && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onQuickView(product);
                          }}
                          className="bg-white/20 backdrop-blur-sm text-white p-3 hover:bg-white/30 transition-colors"
                        >
                          <Info className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Component Grid with enhanced display
              <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 bg-gray-100 p-4">
                <div className="relative bg-white group/item hover:z-10 hover:scale-105 transition-all">
                  {product.bundleComponents?.suit?.image && (
                    <Image
                      src={product.bundleComponents.suit.image}
                      alt="Suit"
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="text-white text-sm font-medium">
                      {product.bundleComponents?.suit?.color} Suit
                    </div>
                    <div className="text-white/80 text-xs">
                      {product.bundleComponents?.suit?.type}
                    </div>
                  </div>
                </div>
                
                <div className="relative bg-white group/item hover:z-10 hover:scale-105 transition-all">
                  {product.bundleComponents?.shirt?.image && (
                    <Image
                      src={product.bundleComponents.shirt.image}
                      alt="Shirt"
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="text-white text-sm font-medium">
                      {product.bundleComponents?.shirt?.color} Shirt
                    </div>
                    <div className="text-white/80 text-xs">
                      {product.bundleComponents?.shirt?.fit} Fit
                    </div>
                  </div>
                </div>
                
                <div className="relative bg-white group/item hover:z-10 hover:scale-105 transition-all">
                  {product.bundleComponents?.tie?.image && (
                    <Image
                      src={product.bundleComponents.tie.image}
                      alt="Tie"
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="text-white text-sm font-medium">
                      {product.bundleComponents?.tie?.color} Tie
                    </div>
                    <div className="text-white/80 text-xs">
                      {product.bundleComponents?.tie?.style}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
                  <div className="text-3xl font-light mb-2">${product.bundlePrice}</div>
                  <div className="text-sm text-white/60 line-through mb-1">${product.originalPrice}</div>
                  <div className="text-xs text-green-400 font-medium">Save ${product.originalPrice - product.bundlePrice}</div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowComponents(false);
                    }}
                    className="mt-3 text-xs underline hover:no-underline"
                  >
                    Back to outfit
                  </button>
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Enhanced Content with Smart Features */}
        <div className="pt-6 pb-2">
          <Link href={`/bundles/${product.id}`}>
            <h3 className="text-xl font-light text-gray-900 mb-2 hover:underline">{product.name}</h3>
          </Link>
          
          <p className="text-sm text-gray-500 mb-3">{product.occasions?.[0] || 'Formal'}</p>
          
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-light">${product.bundlePrice}</span>
            <span className="text-base text-gray-400 line-through">${product.originalPrice}</span>
            <span className="text-sm text-green-600 font-medium">Save ${product.originalPrice - product.bundlePrice}</span>
          </div>

          {/* Size Selector (shown on hover) */}
          {isHovered && (
            <div className="mb-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Quick Select Size:</span>
                <button 
                  className="text-xs text-blue-600 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    // Open size guide
                  }}
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedSize(size);
                    }}
                    className={cn(
                      "py-1.5 text-xs border transition-all",
                      selectedSize === size 
                        ? "bg-black text-white border-black" 
                        : "bg-white hover:border-black"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Smart Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleQuickAddToCart}
              className={cn(
                "flex-1 py-3 px-4 font-medium transition-all flex items-center justify-center gap-2",
                addedToCart 
                  ? "bg-green-600 text-white" 
                  : "bg-black text-white hover:bg-gray-800"
              )}
            >
              {addedToCart ? (
                <>
                  <Check className="w-4 h-4" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Quick Add
                </>
              )}
            </button>
            
            <Link 
              href={`/bundles/${product.id}`}
              className="px-4 py-3 border border-black text-black hover:bg-black hover:text-white transition-all flex items-center gap-2"
            >
              Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            {showComponents ? 'Click image to view full outfit' : 'Click image to see all pieces'}
          </p>
        </div>
      </div>
    );
  }

  // For 3x3 layout - more compact with smart hover effects
  return (
    <div 
      className="group relative bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* Favorite */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFavorited(!isFavorited);
        }}
        className="absolute top-4 right-4 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
      >
        <Heart 
          className={cn(
            "w-4 h-4 transition-all",
            isFavorited ? "fill-burgundy-600 text-burgundy-600" : "text-gray-600"
          )}
        />
      </button>

      {/* Image with 4x4 Component Grid */}
      <Link href={`/bundles/${product.id}`}>
        <div 
          className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
          onClick={(e) => {
            if (showComponents) {
              e.preventDefault();
              setShowComponents(!showComponents);
            }
          }}
        >
          {!showComponents ? (
            <>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              
              {/* Hover Actions Overlay */}
              {isHovered && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 animate-fadeIn">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowComponents(true);
                    }}
                    className="bg-white text-black px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    View Pieces
                  </button>
                  <button
                    onClick={handleQuickAddToCart}
                    className="bg-white text-black p-2 hover:bg-gray-100 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            // 4x4 Grid with 3 components + price box
            <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5 bg-gray-200">
              {/* Suit */}
              <div className="relative bg-white overflow-hidden group/item">
                {product.bundleComponents?.suit?.image ? (
                  <Image
                    src={product.bundleComponents.suit.image}
                    alt="Suit"
                    fill
                    className="object-cover group-hover/item:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-400">{product.bundleComponents?.suit?.color}</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 bg-white/90 px-2 py-0.5 text-xs">
                  {product.bundleComponents?.suit?.color}
                </div>
              </div>

              {/* Shirt */}
              <div className="relative bg-white overflow-hidden group/item">
                {product.bundleComponents?.shirt?.image ? (
                  <Image
                    src={product.bundleComponents.shirt.image}
                    alt="Shirt"
                    fill
                    className="object-cover group-hover/item:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-400">{product.bundleComponents?.shirt?.color}</span>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 bg-white/90 px-2 py-0.5 text-xs">
                  {product.bundleComponents?.shirt?.color}
                </div>
              </div>

              {/* Tie/Pocket Square */}
              <div className="relative bg-white overflow-hidden group/item">
                {(product.bundleComponents?.tie?.image || product.bundleComponents?.pocketSquare) ? (
                  <Image
                    src={product.bundleComponents?.tie?.image || '/placeholder.jpg'}
                    alt="Accessory"
                    fill
                    className="object-cover group-hover/item:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-400">
                      {product.bundleComponents?.tie?.color || product.bundleComponents?.pocketSquare?.color}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 bg-white/90 px-2 py-0.5 text-xs">
                  {product.bundleComponents?.tie?.color || 'Pocket Square'}
                </div>
              </div>

              {/* Price Box with Quick Actions */}
              <div className="bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-3">
                <div className="text-2xl font-light mb-1">${product.bundlePrice}</div>
                <div className="text-xs opacity-70 line-through">${product.originalPrice}</div>
                <button
                  onClick={handleQuickAddToCart}
                  className="mt-2 bg-white text-black px-3 py-1 text-xs font-medium hover:bg-gray-100 transition-colors"
                >
                  Quick Add
                </button>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Minimal Content */}
      <div className="pt-4">
        <Link href={`/bundles/${product.id}`}>
          <h3 className="text-base font-normal text-gray-900 mb-1 hover:underline">{product.name}</h3>
        </Link>
        <p className="text-sm text-gray-500">{product.occasions?.[0]}</p>
        
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-light">${product.bundlePrice}</span>
          <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
        </div>
        
        {/* Hover Actions */}
        {isHovered && (
          <Link 
            href={`/bundles/${product.id}`}
            className="mt-3 text-xs text-black underline hover:no-underline flex items-center gap-1"
          >
            View Details <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}