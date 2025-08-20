'use client';

import { Suspense, useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Eye,
  Grid3X3,
  Filter,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGA4 } from '@/hooks/useGA4';
import { useUnifiedShop } from '@/hooks/useUnifiedShop';
import { UnifiedProduct } from '@/types/unified-shop';
import { getMasterCollection } from '@/lib/config/master-collections';
import { useSmartCollectionRouting, smartFilterProducts, trackSmartFilter } from '@/lib/utils/smart-collection-routing';

// Types for the existing UI
interface CollectionProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  description?: string;
  images?: string[];
  sizes?: string[];
  sku?: string;
  sale_price?: number;
}

interface CategoryInfo {
  id: string;
  name: string;
  count: number;
  image: string | null;
  bgColor?: string;
}

// Helper function to map UnifiedProduct to CollectionProduct format
function mapUnifiedProductToCollectionProduct(unifiedProduct: UnifiedProduct): CollectionProduct {
  // Handle various image URL formats
  const getImageUrl = (product: UnifiedProduct): string => {
    // Try imageUrl first
    if (product.imageUrl && product.imageUrl !== '/placeholder-product.jpg') {
      return product.imageUrl;
    }
    
    // Try first image in images array
    if (product.images?.length && product.images[0] !== '/placeholder-product.jpg') {
      return product.images[0];
    }
    
    // For bundles, try to get the bundle's main image
    if (product.isBundle && product.bundleComponents?.suit?.image) {
      return product.bundleComponents.suit.image;
    }
    
    // Fallback to placeholder
    return '/placeholder-product.jpg';
  };
  
  // Handle sizes - convert from various formats
  const getSizes = (product: UnifiedProduct): string[] => {
    if (product.size && Array.isArray(product.size)) {
      return product.size;
    }
    if (typeof product.size === 'string') {
      return product.size.split(',').map(s => s.trim());
    }
    // Default sizes for suits/formal wear
    return ['36R', '38R', '40R', '42R', '44R', '46R'];
  };
  
  return {
    id: unifiedProduct.id,
    name: unifiedProduct.name,
    price: typeof unifiedProduct.price === 'string' ? parseFloat(unifiedProduct.price) : unifiedProduct.price,
    image: getImageUrl(unifiedProduct),
    category: unifiedProduct.category || 'prom',
    subcategory: unifiedProduct.tags?.find(tag => 
      ['prom-tuxedos', 'sparkle-blazers', 'colored-suits', 'prom-shoes', 'tuxedo', 'blazer', 'formal'].includes(tag.toLowerCase())
    ) || 'general',
    description: unifiedProduct.description || `Premium ${unifiedProduct.name} perfect for prom and special occasions`,
    images: unifiedProduct.images && unifiedProduct.images.length > 0 ? unifiedProduct.images : [getImageUrl(unifiedProduct)],
    sizes: getSizes(unifiedProduct),
    sku: unifiedProduct.sku,
    sale_price: unifiedProduct.originalPrice && unifiedProduct.originalPrice > unifiedProduct.price ? unifiedProduct.originalPrice : undefined
  };
}

// Helper function to generate categories from master collection config
function generatePromCategories(): CategoryInfo[] {
  const masterCollection = getMasterCollection('prom');
  if (!masterCollection) return [];
  
  return masterCollection.subCollections.map(sub => ({
    id: sub.id,
    name: sub.name,
    count: sub.count || 0,
    image: sub.image || null,
    bgColor: sub.id === 'all-prom' ? 'from-purple-900 to-purple-700' : undefined
  }));
}


function PromContent() {
  // Fetch products from API using the unified shop hook with prom filter
  const masterCollection = getMasterCollection('prom');
  const allPromCategories = masterCollection?.subCollections
    .find(sub => sub.id === 'all-prom')?.filterParams.tags || ['prom', 'prom-2025'];
  
  // Smart filtering: Use broader categories to get more products
  const allPromDbCategories = [
    'Tuxedos', 'Blazers', 'Suits', 'Sport Coats', 'Dress Shoes',
    'Classic 2-Piece Suits', 'Classic 3-Piece Suits', 'Slim Fit Suits', 'Modern Fit Suits'
  ];
  
  const { products: unifiedProducts, loading, error } = useUnifiedShop({
    initialFilters: { 
      category: allPromDbCategories,
      tags: [...allPromCategories, 'formal', 'special-occasion', 'evening'],
      includeIndividual: true,
      includeBundles: true // Explicitly include bundles for more products
    },
    autoFetch: true,
    debounceDelay: 300
  });

  // Transform UnifiedProducts to CollectionProduct format
  const allProducts = useMemo(() => {
    return unifiedProducts.map(mapUnifiedProductToCollectionProduct);
  }, [unifiedProducts]);

  // Generate categories from master collection config
  const categories = useMemo(() => {
    return generatePromCategories();
  }, []);
  
  // Smart routing for URL-based filtering
  const { currentFilter, updateFilter } = useSmartCollectionRouting('prom');
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState(currentFilter || 'all-prom');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // Items per page
  
  // Update selectedCategory when currentFilter changes (URL navigation)
  useEffect(() => {
    setSelectedCategory(currentFilter || 'all-prom');
  }, [currentFilter]);
  const [selectedProduct, setSelectedProduct] = useState<CollectionProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // GA4 tracking
  const {
    trackCollectionView,
    trackProductClick,
    trackQuickViewModal,
    trackAddCart,
    trackWishlistAdd,
    trackFilterChange
  } = useGA4();

  // Track collection view when products load
  useEffect(() => {
    if (allProducts.length > 0) {
      trackCollectionView('Prom Collection', allProducts);
    }
  }, [allProducts, trackCollectionView]);
  
  // Determine if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Header shrink animation values - keeping collapsed state more visible
  const headerHeight = useTransform(
    scrollY,
    [0, 100],
    isMobile ? ['280px', '140px'] : ['300px', '200px']
  );
  
  const headerOpacity = useTransform(
    scrollY,
    [0, 100],
    [1, 0.95]
  );
  
  const productCountOpacity = useTransform(
    scrollY,
    [0, 50],
    isMobile ? [1, 0] : [1, 1]
  );

  const springHeaderHeight = useSpring(headerHeight, { stiffness: 400, damping: 30 });
  const springHeaderOpacity = useSpring(headerOpacity, { stiffness: 400, damping: 30 });
  const springProductCountOpacity = useSpring(productCountOpacity, { stiffness: 400, damping: 30 });
  
  // Track scroll for floating filter button
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smart filter products based on selected category
  const allFilteredProducts = useMemo(() => {
    if (selectedCategory === 'all-prom') {
      return allProducts;
    }
    
    // Get filter config for the selected category
    const categoryConfig = categories.find(cat => cat.id === selectedCategory);
    const subCollection = masterCollection?.subCollections.find(sub => sub.id === selectedCategory);
    
    if (!subCollection) return allProducts;
    
    return allProducts.filter(product => {
      const { categories: filterCategories, tags: filterTags } = subCollection.filterParams;
      
      // Check category match
      if (filterCategories?.length) {
        const hasMatchingCategory = filterCategories.some(cat => 
          product.category?.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(product.category?.toLowerCase() || '')
        );
        if (hasMatchingCategory) return true;
      }
      
      // Check tag match
      if (filterTags?.length) {
        const productTagsStr = product.tags?.join(' ').toLowerCase() || '';
        const productNameStr = product.name.toLowerCase();
        
        const hasMatchingTag = filterTags.some(tag => {
          const tagLower = tag.toLowerCase();
          return productTagsStr.includes(tagLower) || 
                 productNameStr.includes(tagLower) ||
                 product.subcategory?.toLowerCase().includes(tagLower);
        });
        if (hasMatchingTag) return true;
      }
      
      return false;
    });
  }, [allProducts, selectedCategory, categories, masterCollection]);
  
  // Calculate pagination
  const totalPages = Math.ceil(allFilteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const filteredProducts = allFilteredProducts.slice(startIndex, startIndex + itemsPerPage);
  
  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);
  
  // Track smart filtering
  useEffect(() => {
    if (filteredProducts.length > 0) {
      trackSmartFilter('prom', selectedCategory, filteredProducts.length);
    }
  }, [selectedCategory, filteredProducts.length]);

  // Track category filter changes
  useEffect(() => {
    if (selectedCategory !== 'all-prom') {
      trackFilterChange('Prom Collection', { category: selectedCategory });
    }
  }, [selectedCategory, trackFilterChange]);

  // Scroll category nav
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Toggle like
  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
        // Track wishlist add
        const product = allProducts.find(p => p.id === productId);
        if (product) {
          trackWishlistAdd(product);
        }
      }
      return newSet;
    });
  };

  // Handle quick view
  const handleQuickView = (product: CollectionProduct) => {
    setSelectedProduct({
      ...product,
      description: product.description || 'Stand out at prom with this premium quality attire'
    });
    setSelectedSize('');
    setQuantity(1);
    
    // Track quick view
    trackQuickViewModal(product);
    trackProductClick(product, 'Prom Collection');
  };

  // Close modal when clicking outside
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedProduct(null);
    }
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header skeleton */}
        <div className="sticky top-16 z-40 bg-white border-b h-[200px] md:h-[300px]">
          <div className="flex gap-4 p-4 h-full items-center overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-[200px] h-[160px] bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Product grid skeleton */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-2 p-1 md:p-3">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading prom collection...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with better UX
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96 px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to load prom collection</h2>
            <p className="text-gray-600 mb-4 text-sm">
              {error.includes('timeout') 
                ? 'The request took too long. Please check your connection and try again.'
                : error.includes('network') 
                  ? 'Network error. Please check your internet connection.'
                  : 'Something went wrong while loading products. Please try again.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                className="bg-black hover:bg-gray-800"
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">Technical Details</summary>
                <pre className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 rounded overflow-auto">{error}</pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Collapsible Category Filter Navigation */}
      <motion.section 
        className={cn(
          "sticky top-16 z-40 bg-white border-b transition-shadow duration-300",
          scrolled ? "shadow-lg border-b-2" : "shadow-sm"
        )}
        style={{ 
          height: springHeaderHeight,
          opacity: springHeaderOpacity
        }}
      >
        <div className="relative h-full">
          {/* Scroll buttons */}
          <button
            onClick={() => scrollCategories('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-2 shadow-lg rounded-r-lg hover:bg-white transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scrollCategories('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-2 shadow-lg rounded-l-lg hover:bg-white transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Categories - Dynamic sizing based on scroll */}
          <div
            ref={categoryScrollRef}
            className={cn(
              "flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-12 md:px-16 h-full items-center",
              scrolled ? "py-2" : "py-3 md:py-4"
            )}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  updateFilter(category.id);
                }}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={cn(
                  "relative rounded-xl overflow-hidden cursor-pointer group transition-all shadow-lg",
                  scrolled && isMobile 
                    ? "w-[140px] h-[100px]"  // Smaller when scrolled on mobile
                    : isMobile 
                      ? "w-[220px] h-[160px]"  // Large size on mobile
                      : scrolled
                        ? "w-[160px] h-[120px]"  // Smaller when scrolled on desktop
                        : "w-[200px] h-[200px]",  // Normal size on desktop
                  selectedCategory === category.id && "ring-2 ring-black ring-offset-2"
                )}>
                  {category.image ? (
                    <>
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 220px, 200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
                      category.bgColor || "from-gray-900 to-gray-700"
                    )}>
                      <Grid3X3 className="w-10 h-10 text-white" />
                    </div>
                  )}
                  {/* Text positioned at bottom with gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                    <h3 className={cn(
                      "font-semibold",
                      scrolled && isMobile ? "text-sm" : isMobile ? "text-lg" : scrolled ? "text-base" : "text-lg"
                    )}>
                      {category.name}
                    </h3>
                    {/* Hide item count on mobile when scrolled */}
                    {(!scrolled || !isMobile) && (
                      <p className={cn(
                        "opacity-90",
                        scrolled ? "text-xs" : "text-sm"
                      )}>
                        {category.count} items
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product count bar - Hidden on mobile when scrolled */}
        <motion.div 
          className="px-4 md:px-8 py-2 flex justify-between items-center border-t bg-gray-50"
          style={{ opacity: springProductCountOpacity, display: scrolled && isMobile ? 'none' : 'flex' }}
        >
          <span className="text-xs md:text-sm text-gray-600">
            {allFilteredProducts.length} product{allFilteredProducts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all-prom' && (
              <span className="text-gray-400 ml-1">
                in {categories.find(c => c.id === selectedCategory)?.name || 'this category'}
              </span>
            )}
            {totalPages > 1 && (
              <span className="text-gray-400 ml-2">
                • Page {currentPage} of {totalPages}
              </span>
            )}
          </span>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <Grid3X3 className="w-4 h-4" />
            <span>Grid View</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Product Grid - 3x3 on mobile */}
      <div className="p-1 md:p-3">
        {allFilteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <div className="mb-4">
                <Grid3X3 className="h-16 w-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {selectedCategory === 'all-prom' 
                  ? 'We\'re currently updating our prom collection. Please check back soon!'
                  : `No products found in ${categories.find(c => c.id === selectedCategory)?.name || 'this category'}. Try selecting a different category.`
                }
              </p>
              <Button 
                onClick={() => {
                  setSelectedCategory('all-prom');
                  updateFilter('all-prom');
                }}
                variant="outline"
              >
                View All Prom
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-2">
            <AnimatePresence mode="wait">
              {filteredProducts.map((product, index) => (
            <motion.div
              key={`${selectedCategory}-${product.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.02 }}
              className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleQuickView(product)}
            >
              {/* Product Image */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Try different fallback images based on category
                  if (target.src.includes('placeholder-product.jpg')) {
                    return; // Already using final fallback
                  }
                  
                  // Try category-specific placeholder first
                  if (product.category?.toLowerCase().includes('tuxedo')) {
                    target.src = '/placeholder-suit.jpg';
                  } else if (product.category?.toLowerCase().includes('shirt')) {
                    target.src = '/placeholder-shirt.jpg';
                  } else if (product.category?.toLowerCase().includes('shoe')) {
                    target.src = '/placeholder-shoes.jpg';
                  } else if (product.category?.toLowerCase().includes('tie')) {
                    target.src = '/placeholder-tie.jpg';
                  } else {
                    target.src = '/placeholder-product.jpg';
                  }
                }}
                priority={index < 6} // Prioritize first 6 images
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Product Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                <h3 className="text-white font-serif text-xs md:text-sm mb-0.5 line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1">
                  {product.sale_price && (
                    <span className="text-white/60 text-xs line-through">
                      ${product.sale_price}
                    </span>
                  )}
                  <p className="text-white/90 text-xs md:text-sm font-medium">
                    ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </p>
                  {product.sale_price && (
                    <span className="bg-red-500 text-white text-xs px-1 rounded ml-1">
                      SALE
                    </span>
                  )}
                </div>
              </div>

              {/* Like indicator */}
              {likedProducts.has(product.id) && (
                <div className="absolute top-2 right-2 z-10">
                  <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-red-500" />
                </div>
              )}

              {/* Quick View on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button className="bg-white/90 backdrop-blur text-black px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View
                </button>
              </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-8 px-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "w-8 h-8 p-0",
                      currentPage === pageNum && "bg-black text-white"
                    )}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={handleModalClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={selectedProduct.images?.[0] || selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover rounded-t-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-serif mb-1">{selectedProduct.name}</h2>
                    <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                  </div>
                  <button
                    onClick={() => toggleLike(selectedProduct.id)}
                    className="p-2"
                  >
                    <Heart 
                      className={cn(
                        "w-5 h-5 transition-all",
                        likedProducts.has(selectedProduct.id) 
                          ? "text-red-500 fill-red-500" 
                          : "text-gray-400"
                      )} 
                    />
                  </button>
                </div>

                {/* Price */}
                <div className="text-2xl font-semibold mb-4">
                  ${selectedProduct.price}
                </div>

                {/* Size Selector */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProduct.sizes || ['One Size']).map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 border rounded-lg text-sm transition-all",
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Add to Bag Button */}
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white py-3"
                  disabled={!selectedSize}
                  onClick={() => {
                    if (selectedProduct && selectedSize) {
                      const productWithDetails = {
                        ...selectedProduct,
                        size: selectedSize,
                        quantity: quantity
                      };
                      trackAddCart(productWithDetails);
                      // TODO: Actually add to cart
                      setSelectedProduct(null); // Close modal after adding
                    }
                  }}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Bag
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PromCollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading prom collection...</p>
          </div>
        </div>
      </div>
    }>
      <PromContent />
    </Suspense>
  );
}