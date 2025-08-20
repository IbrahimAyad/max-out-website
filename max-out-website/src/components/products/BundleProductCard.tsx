'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { UnifiedProduct, BUNDLE_TIERS } from '@/types/unified-shop';
import { FiShoppingCart, FiEye, FiTrendingUp, FiStar } from 'react-icons/fi';
import { useState } from 'react';

interface BundleProductCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  featured?: boolean;
}

export default function BundleProductCard({ 
  product, 
  onQuickView, 
  onAddToCart,
  featured = false 
}: BundleProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [showComponents, setShowComponents] = useState(false);
  
  if (!product.isBundle) {
    return null; // This component is only for bundles
  }
  
  const tierConfig = product.bundleTier ? BUNDLE_TIERS[product.bundleTier] : null;
  const savingsPercent = product.originalPrice && product.bundlePrice
    ? Math.round(((product.originalPrice - product.bundlePrice) / product.originalPrice) * 100)
    : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`
        relative bg-white rounded-lg overflow-hidden shadow-lg
        ${featured ? 'ring-2 ring-gold-500 ring-offset-2' : ''}
        hover:shadow-2xl transition-all duration-300
      `}
    >
      {/* Tier Badge */}
      {tierConfig && (
        <div className={`absolute top-4 left-4 z-10 ${tierConfig.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
          {tierConfig.label}
          {product.trending && <FiTrendingUp className="w-3 h-3" />}
        </div>
      )}
      
      {/* Savings Badge */}
      {savingsPercent > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-burgundy-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          Save {savingsPercent}%
        </div>
      )}
      
      {/* AI Score Badge */}
      {product.aiScore && product.aiScore >= 85 && (
        <div className="absolute top-14 right-4 z-10 bg-gold-500 text-burgundy-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <FiStar className="w-3 h-3" />
          AI Pick
        </div>
      )}
      
      {/* Main Image Container */}
      <Link 
        href={`/bundles/${product.id}`}
        className="block relative h-96 bg-gray-100 cursor-pointer group"
        onClick={(e) => {
          // Allow component toggle only if clicking on the image area, not when navigating
          if (e.ctrlKey || e.metaKey || e.shiftKey) return;
          e.preventDefault();
          setShowComponents(!showComponents);
        }}
      >
        {!showComponents ? (
          // Main bundle image
          <div className="relative w-full h-full">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
              </div>
            )}
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onLoadingComplete={() => setImageLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Component Preview Overlay - Enhanced visibility */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm font-semibold mb-2 drop-shadow-lg">Click to see components</p>
              <div className="flex flex-wrap gap-2">
                {product.bundleComponents?.suit && (
                  <div className="bg-white/30 backdrop-blur-md rounded-md px-3 py-1.5 text-xs text-white font-medium shadow-lg">
                    {product.bundleComponents.suit.color} Suit
                  </div>
                )}
                {product.bundleComponents?.shirt && (
                  <div className="bg-white/30 backdrop-blur-md rounded-md px-3 py-1.5 text-xs text-white font-medium shadow-lg">
                    {product.bundleComponents.shirt.color} Shirt
                  </div>
                )}
                {product.bundleComponents?.tie && (
                  <div className="bg-white/30 backdrop-blur-md rounded-md px-3 py-1.5 text-xs text-white font-medium shadow-lg">
                    {product.bundleComponents.tie.color} Tie
                  </div>
                )}
                {product.bundleComponents?.pocketSquare && (
                  <div className="bg-white/30 backdrop-blur-md rounded-md px-3 py-1.5 text-xs text-white font-medium shadow-lg">
                    {product.bundleComponents.pocketSquare.color} Pocket Square
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Component breakdown view - handles 3 or 4 items
          <div className={`grid ${product.bundleComponents?.pocketSquare ? 'grid-cols-4' : 'grid-cols-3'} h-full`}>
            {product.bundleComponents?.suit && (
              <div className="relative bg-gray-50">
                {product.bundleComponents.suit.image ? (
                  <Image
                    src={product.bundleComponents.suit.image}
                    alt={`${product.bundleComponents.suit.color} Suit`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 150px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-2">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">S</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/40 text-white p-2">
                  <p className="text-xs font-semibold">Suit</p>
                  <p className="text-xs opacity-90">{product.bundleComponents.suit.color}</p>
                </div>
              </div>
            )}
            {product.bundleComponents?.shirt && (
              <div className="relative bg-gray-50">
                {product.bundleComponents.shirt.image ? (
                  <Image
                    src={product.bundleComponents.shirt.image}
                    alt={`${product.bundleComponents.shirt.color} Shirt`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 150px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-2">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">SH</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/40 text-white p-2">
                  <p className="text-xs font-semibold">Shirt</p>
                  <p className="text-xs opacity-90">{product.bundleComponents.shirt.color}</p>
                </div>
              </div>
            )}
            {product.bundleComponents?.tie && (
              <div className="relative bg-gray-50">
                {product.bundleComponents.tie.image ? (
                  <Image
                    src={product.bundleComponents.tie.image}
                    alt={`${product.bundleComponents.tie.color} Tie`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 150px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-2">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">T</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/40 text-white p-2">
                  <p className="text-xs font-semibold">{product.bundleComponents.tie.style || 'Tie'}</p>
                  <p className="text-xs opacity-90">{product.bundleComponents.tie.color}</p>
                </div>
              </div>
            )}
            {product.bundleComponents?.pocketSquare && (
              <div className="relative bg-gray-50">
                {product.bundleComponents.pocketSquare.image ? (
                  <Image
                    src={product.bundleComponents.pocketSquare.image}
                    alt={`${product.bundleComponents.pocketSquare.color} Pocket Square`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 150px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-2">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 text-xs">PS</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-black/40 text-white p-2">
                  <p className="text-xs font-semibold">Pocket Square</p>
                  <p className="text-xs opacity-90">{product.bundleComponents.pocketSquare.color}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Link>
      
      {/* Product Info */}
      <div className="p-6">
        <Link href={`/bundles/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-burgundy-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Occasions */}
        {product.occasions.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.occasions.slice(0, 3).map((occasion) => (
              <span
                key={occasion}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                {occasion}
              </span>
            ))}
            {product.occasions.length > 3 && (
              <span className="text-xs text-gray-500">
                +{product.occasions.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-burgundy-600">
            ${product.bundlePrice || product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-lg text-gray-400 line-through">
                ${product.originalPrice}
              </span>
              <span className="text-sm text-green-600 font-medium">
                Save ${product.savings}
              </span>
            </>
          )}
        </div>
        
        {/* What's Included */}
        <div className="border-t pt-3 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Complete Look Includes:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {product.bundleComponents?.suit && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-burgundy-600 rounded-full"></div>
                <span>{product.bundleComponents.suit.type}</span>
              </div>
            )}
            {product.bundleComponents?.shirt && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                <span>{product.bundleComponents.shirt.fit} Shirt</span>
              </div>
            )}
            {product.bundleComponents?.tie && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <span>{product.bundleComponents.tie.style}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link 
            href={`/bundles/${product.id}`}
            className="flex-1 bg-burgundy-600 text-white px-4 py-2 rounded-lg hover:bg-burgundy-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
          >
            View Details
          </Link>
          <button
            onClick={() => onQuickView?.(product)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="Quick view"
          >
            <FiEye className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Stock Status */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            Always In Stock
          </span>
          {featured && (
            <span className="text-xs text-gold-600 font-bold">
              Featured Look
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}