'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { UnifiedProduct } from '@/types/unified-shop';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star,
  TrendingUp,
  Sparkles,
  Package,
  Search,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid-3' | 'grid-4' | 'list';

interface ResponsiveProductGridProps {
  products: UnifiedProduct[];
  loading?: boolean;
  viewMode?: ViewMode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  emptyStateConfig?: {
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
  };
  onProductClick?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  onToggleWishlist?: (productId: string) => void;
  wishlistItems?: Set<string>;
}

interface ProductCardProps {
  product: UnifiedProduct;
  viewMode: ViewMode;
  onAddToCart?: (product: UnifiedProduct) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  index: number;
}

// Individual Product Card Component
function ProductCard({ 
  product, 
  viewMode, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted,
  index 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  }, [onAddToCart, product]);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product.id);
  }, [onToggleWishlist, product.id]);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  }, []);

  // Determine if product has sale pricing
  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = isOnSale 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Grid column class based on view mode
  const gridClass = {
    'grid-3': 'col-span-1',
    'grid-4': 'col-span-1',
    'list': 'col-span-full'
  }[viewMode];

  // Layout variant for list vs grid
  const isListView = viewMode === 'list';

  return (
    <motion.div
      className={cn("group relative", gridClass)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
      role="article"
      aria-label={`Product: ${product.name}, Price: $${product.price}`}
    >
      <Link href={`/products/${product.id}`}>
        <div className={cn(
          "relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-300",
          isListView ? "flex" : "block"
        )}>
          {/* Product Image Container */}
          <div className={cn(
            "relative bg-gray-50 overflow-hidden",
            isListView 
              ? "w-48 h-48 flex-shrink-0" 
              : "aspect-[3/4] w-full"
          )}>
            {/* Main Product Image */}
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                isHovered ? "scale-110" : "scale-100",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              sizes={isListView ? "192px" : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"}
              priority={index < 8}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Hover Image if Available */}
            {product.images?.[1] && isHovered && (
              <Image
                src={product.images[1]}
                alt={`${product.name} - alternate view`}
                fill
                className="object-cover transition-opacity duration-300"
                sizes={isListView ? "192px" : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"}
              />
            )}

            {/* Image Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
              {product.isBundle && (
                <span className="bg-black text-white px-2 py-1 text-xs font-medium rounded">
                  BUNDLE
                </span>
              )}
              {product.trending && (
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 text-xs font-medium rounded flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  TRENDING
                </span>
              )}
              {product.tags?.includes('new') && (
                <span className="bg-green-500 text-white px-2 py-1 text-xs font-medium rounded">
                  NEW
                </span>
              )}
              {isOnSale && (
                <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                  -{discountPercentage}%
                </span>
              )}
              {product.aiScore && product.aiScore > 0.8 && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 text-xs font-medium rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI PICK
                </span>
              )}
            </div>

            {/* Quick Actions Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered || isFocused ? 1 : 0 }}
            >
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleQuickView}
                  className="bg-white/90 hover:bg-white text-gray-900"
                  aria-label={`Quick view ${product.name}`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="bg-black hover:bg-gray-900 text-white"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Wishlist Button */}
            <motion.button
              onClick={handleToggleWishlist}
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10",
                isWishlisted 
                  ? "bg-red-100 text-red-500" 
                  : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart 
                className={cn(
                  "w-4 h-4 transition-all",
                  isWishlisted && "fill-current"
                )} 
              />
            </motion.button>
          </div>

          {/* Product Information */}
          <div className={cn(
            "p-4",
            isListView ? "flex-1 flex flex-col justify-between" : "space-y-2"
          )}>
            <div className="space-y-1">
              {/* Product Name */}
              <h3 className={cn(
                "font-medium text-gray-900 line-clamp-2 group-hover:text-burgundy transition-colors",
                isListView ? "text-lg" : "text-sm"
              )}>
                {product.name}
              </h3>

              {/* Category & Bundle Info */}
              <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                {product.category && (
                  <span className="capitalize">{product.category}</span>
                )}
                {product.bundleTier && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded capitalize">
                    {product.bundleTier} Bundle
                  </span>
                )}
              </div>

              {/* Occasions */}
              {product.occasions && product.occasions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.occasions.slice(0, 2).map(occasion => (
                    <span 
                      key={occasion}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize"
                    >
                      {occasion}
                    </span>
                  ))}
                  {product.occasions.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{product.occasions.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between mt-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    "font-bold text-gray-900",
                    isListView ? "text-xl" : "text-lg"
                  )}>
                    ${product.price}
                  </span>
                  {isOnSale && (
                    <span className={cn(
                      "text-gray-500 line-through",
                      isListView ? "text-base" : "text-sm"
                    )}>
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                
                {product.savings && (
                  <div className="text-xs text-green-600 font-medium">
                    Save ${product.savings}
                  </div>
                )}
              </div>

              {/* AI Score */}
              {product.aiScore && (
                <div className="flex items-center space-x-1 text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.aiScore.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Bundle Components Preview (for list view) */}
            {isListView && product.isBundle && product.bundleComponents && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Bundle Includes:</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {product.bundleComponents.suit && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {product.bundleComponents.suit.color} {product.bundleComponents.suit.type}
                    </span>
                  )}
                  {product.bundleComponents.shirt && (
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded">
                      {product.bundleComponents.shirt.color} Shirt
                    </span>
                  )}
                  {product.bundleComponents.tie && (
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                      {product.bundleComponents.tie.color} Tie
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Main Grid Component
export function ResponsiveProductGrid({
  products,
  loading = false,
  viewMode = 'grid-4',
  onLoadMore,
  hasMore = false,
  emptyStateConfig = {
    title: "No products found",
    description: "Try adjusting your search or filters"
  },
  onProductClick,
  onAddToCart,
  onToggleWishlist,
  wishlistItems = new Set()
}: ResponsiveProductGridProps) {
  const [isNearBottom, setIsNearBottom] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Grid configuration based on view mode
  const gridConfig = {
    'grid-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'grid-4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    'list': 'grid-cols-1'
  };

  // Infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;
      const threshold = documentHeight - 1000; // Trigger 1000px before bottom
      
      setIsNearBottom(scrollPosition >= threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-load more when near bottom
  useEffect(() => {
    if (isNearBottom && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  }, [isNearBottom, hasMore, loading, onLoadMore]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={cn("grid gap-4 md:gap-6", gridConfig[viewMode])}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {emptyStateConfig.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {emptyStateConfig.description}
          </p>
          {emptyStateConfig.actionText && emptyStateConfig.onAction && (
            <Button
              onClick={emptyStateConfig.onAction}
              variant="outline"
              className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {emptyStateConfig.actionText}
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Product Grid */}
      <motion.div
        ref={gridRef}
        className={cn("grid gap-4 md:gap-6", gridConfig[viewMode])}
        layout
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlistItems.has(product.id)}
            index={index}
          />
        ))}
      </motion.div>

      {/* Loading More Indicator */}
      {loading && products.length > 0 && (
        <motion.div
          className="flex justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-burgundy border-t-transparent" />
            <span>Loading more products...</span>
          </div>
        </motion.div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <motion.div
          className="flex justify-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={onLoadMore}
            variant="outline"
            className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white"
          >
            Load More Products
          </Button>
        </motion.div>
      )}

      {/* Initial Loading */}
      {loading && products.length === 0 && <LoadingSkeleton />}
    </div>
  );
}