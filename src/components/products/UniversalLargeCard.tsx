'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, ArrowRight, Check, Layers } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-shop';
import { useSimpleCart } from '@/hooks/useSimpleCart';
import { cn } from '@/lib/utils';

interface UniversalLargeCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
}

export default function UniversalLargeCard({
  product,
  onQuickView
}: UniversalLargeCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useSimpleCart();

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Convert price to cents for Stripe
    const priceInCents = Math.round((product.isBundle ? (product.bundlePrice || product.price) : product.price) * 100);
    
    addItem({
      id: product.id,
      name: product.name,
      price: priceInCents, // Price in cents for Stripe
      image: product.imageUrl || '/placeholder.jpg',
      quantity: 1,
      category: product.isBundle ? 'bundle' : product.category || 'product',
      size: selectedSize || '40',
      color: product.color,
      stripePriceId: product.stripePriceId // Include if available
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const sizes = ['36', '38', '40', '42', '44', '46', '48', '50'];
  
  // Get color variants for individual products
  const colorVariants = product.colors && product.colors.length > 0 
    ? product.colors 
    : product.color 
      ? [{ name: product.color, hex: '#000000', image: product.imageUrl }]
      : [];

  const productLink = product.isBundle ? `/bundles/${product.id}` : `/products/${product.slug || product.id}`;
  
  const savingsAmount = product.originalPrice && product.isBundle && product.bundlePrice
    ? product.originalPrice - product.bundlePrice
    : product.originalPrice && !product.isBundle
    ? product.originalPrice - product.price
    : 0;

  return (
    <div 
      className="group relative bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFavorited(!isFavorited);
        }}
        className="absolute top-6 right-6 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-all duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:ring-offset-2"
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-all duration-200",
            isFavorited ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
          )}
        />
      </button>

      {/* Large Product Image */}
      <Link href={productLink}>
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer">
          {/* Bundle: Show component breakdown on hover */}
          {product.isBundle && isHovered && product.bundleComponents ? (
            <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5 bg-gray-200">
              <div className="relative bg-white">
                {product.bundleComponents.suit?.image && (
                  <Image
                    src={product.bundleComponents.suit.image}
                    alt="Suit"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-2">
                  <div className="text-white text-xs font-medium">
                    {product.bundleComponents.suit?.color} Suit
                  </div>
                </div>
              </div>
              
              <div className="relative bg-white">
                {product.bundleComponents.shirt?.image && (
                  <Image
                    src={product.bundleComponents.shirt.image}
                    alt="Shirt"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-2">
                  <div className="text-white text-xs font-medium">
                    {product.bundleComponents.shirt?.color} Shirt
                  </div>
                </div>
              </div>
              
              <div className="relative bg-white">
                {product.bundleComponents.tie?.image && (
                  <Image
                    src={product.bundleComponents.tie.image}
                    alt="Tie"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-2">
                  <div className="text-white text-xs font-medium">
                    {product.bundleComponents.tie?.color} Tie
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-2">
                <div className="text-2xl font-light mb-1">${product.bundlePrice}</div>
                <div className="text-xs text-white/60 line-through">${product.originalPrice}</div>
                <div className="text-xs text-green-400 font-medium">Save ${savingsAmount}</div>
              </div>
            </div>
          ) : (
            // Regular Product: Show second image on hover if available
            <>
              {/* Primary Image - Hidden on hover if second image exists */}
              <div className={cn(
                "absolute inset-0 transition-opacity duration-500",
                isHovered && product.images && product.images.length > 1 ? "opacity-0" : "opacity-100"
              )}>
                <Image
                  src={colorVariants[selectedColor]?.image || product.imageUrl || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              
              {/* Second Image - Shown on hover if available */}
              {product.images && product.images.length > 1 && (
                <div className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  isHovered ? "opacity-100" : "opacity-0"
                )}>
                  <Image
                    src={product.images[1]}
                    alt={`${product.name} - View 2`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              
              {/* Hover Overlay with Actions */}
              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-6 pointer-events-none">
                  <div className="flex gap-3 pointer-events-auto">
                    {product.isBundle ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Bundle hover already shows components
                        }}
                        className="flex-1 bg-white text-black py-3 px-4 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Layers className="w-4 h-4" />
                        View Bundle
                      </button>
                    ) : (
                      <button
                        onClick={handleQuickAddToCart}
                        className="flex-1 bg-white text-black py-3 px-4 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Quick Add
                      </button>
                    )}
                    {onQuickView && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onQuickView(product);
                        }}
                        className="bg-white/20 backdrop-blur-sm text-white p-3 hover:bg-white/30 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="pt-6 pb-2">
        <Link href={productLink}>
          <h3 className="text-xl font-light text-gray-900 mb-2 hover:underline">{product.name}</h3>
        </Link>
        
        {/* Category/Type */}
        <p className="text-sm text-gray-500 mb-3">
          {product.isBundle 
            ? `${product.occasions?.[0] || 'Complete Look'}`
            : `${product.category || 'Menswear'} ${product.material ? `• ${product.material}` : ''}`
          }
        </p>
        
        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl font-light">
            ${product.isBundle ? product.bundlePrice : product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-base text-gray-400 line-through">
                ${product.originalPrice}
              </span>
              {savingsAmount > 0 && (
                <span className="text-sm text-green-600 font-medium">
                  Save ${savingsAmount}
                </span>
              )}
            </>
          )}
        </div>

        {/* Size Selector (for hover) */}
        {isHovered && !product.isBundle && (
          <div className="mb-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Quick Select Size:</span>
              <Link href="/size-guide" className="text-xs text-blue-600 underline">
                Size Guide
              </Link>
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

        {/* Color Options (for individual products) */}
        {!product.isBundle && colorVariants.length > 1 && (
          <div className="mb-4">
            <span className="text-xs text-gray-600">Colors:</span>
            <div className="flex gap-2 mt-2">
              {colorVariants.map((color, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(index);
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    selectedColor === index 
                      ? "border-black scale-110" 
                      : "border-gray-300 hover:border-gray-500"
                  )}
                  style={{ backgroundColor: color.hex || '#ccc' }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleQuickAddToCart}
            className={cn(
              "flex-1 py-3 px-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
              addedToCart 
                ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-300" 
                : "bg-burgundy text-white hover:bg-burgundy-700 hover:shadow-md focus:ring-burgundy-300"
            )}
            disabled={addedToCart}
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
          
          <Link 
            href={productLink}
            className="px-4 py-3 border-2 border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50 hover:border-burgundy-400 transition-all duration-200 flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:ring-offset-2"
          >
            Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}