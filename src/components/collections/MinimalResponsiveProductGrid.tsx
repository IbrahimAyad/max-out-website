'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedProduct } from '@/types/unified-shop';
import UltraMinimalProductCard from '@/components/products/UltraMinimalProductCard';
import ProductQuickView from '@/components/products/ProductQuickView';
import { Button } from '@/components/ui/button';
import { 
  Package,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid-2' | 'grid-3' | 'grid-4';

interface MinimalResponsiveProductGridProps {
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
  mobileGrid?: '2x2' | '3x3'; // Optional mobile grid control
}

export default function MinimalResponsiveProductGrid({
  products,
  loading = false,
  viewMode = 'grid-4',
  onLoadMore,
  hasMore = false,
  emptyStateConfig = {
    title: "No products found",
    description: "Try adjusting your filters or search terms"
  },
  mobileGrid = '3x3'
}: MinimalResponsiveProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<UnifiedProduct | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<UnifiedProduct[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update displayed products when products prop changes
  useEffect(() => {
    setDisplayedProducts(products);
  }, [products]);

  // Handle quick view
  const handleQuickView = useCallback((product: UnifiedProduct) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  }, []);

  // Navigate between products in quick view
  const handleNavigate = useCallback((direction: 'prev' | 'next') => {
    if (!selectedProduct) return;
    
    const currentIndex = displayedProducts.findIndex(p => p.id === selectedProduct.id);
    let newIndex = currentIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : displayedProducts.length - 1;
    } else {
      newIndex = currentIndex < displayedProducts.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedProduct(displayedProducts[newIndex]);
  }, [selectedProduct, displayedProducts]);

  // Infinite scroll setup
  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoadingMore) {
        setIsLoadingMore(true);
        onLoadMore();
        setTimeout(() => setIsLoadingMore(false), 1000);
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px'
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, onLoadMore, isLoadingMore]);

  // Determine grid class based on view mode and mobile grid preference
  const getGridClass = () => {
    if (isMobile) {
      return mobileGrid === '2x2' 
        ? "grid-cols-2 gap-3"
        : "grid-cols-3 gap-2";
    }
    
    switch (viewMode) {
      case 'grid-2':
        return "grid-cols-2 gap-4";
      case 'grid-3':
        return "grid-cols-3 gap-3 md:gap-4";
      case 'grid-4':
      default:
        return "grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4";
    }
  };

  // Loading skeleton
  if (loading && displayedProducts.length === 0) {
    return (
      <div className={cn("grid", getGridClass())}>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (!loading && displayedProducts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 px-4"
      >
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          {emptyStateConfig.actionText ? (
            <Search className="w-12 h-12 text-gray-400" />
          ) : (
            <Package className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {emptyStateConfig.title}
        </h3>
        <p className="text-gray-600 text-center max-w-md mb-6">
          {emptyStateConfig.description}
        </p>
        {emptyStateConfig.actionText && emptyStateConfig.onAction && (
          <Button
            onClick={emptyStateConfig.onAction}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {emptyStateConfig.actionText}
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <>
      {/* Product Grid */}
      <div className={cn("grid", getGridClass())}>
        <AnimatePresence mode="popLayout">
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.02,
                layout: { type: "spring", stiffness: 300, damping: 30 }
              }}
            >
              <UltraMinimalProductCard
                product={product}
                onQuickView={handleQuickView}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Trigger */}
      {hasMore && (
        <div 
          ref={loadMoreRef} 
          className="h-20 flex items-center justify-center mt-8"
        >
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading more products...</span>
            </div>
          )}
        </div>
      )}

      {/* Load More Button (fallback) */}
      {hasMore && !isLoadingMore && onLoadMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            Load More Products
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={quickViewOpen}
        onClose={() => {
          setQuickViewOpen(false);
          setTimeout(() => setSelectedProduct(null), 300);
        }}
        onNavigate={handleNavigate}
        isMobile={isMobile}
      />
    </>
  );
}