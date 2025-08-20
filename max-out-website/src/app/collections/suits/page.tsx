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
  return {
    id: unifiedProduct.id,
    name: unifiedProduct.name,
    price: unifiedProduct.price,
    image: unifiedProduct.imageUrl,
    category: unifiedProduct.category || 'suits',
    subcategory: unifiedProduct.tags?.find(tag => 
      ['two-piece', 'three-piece', 'tuxedos', 'double-breasted', 'modern', 'classic', 'slim-fit'].includes(tag)
    ) || 'general',
    description: unifiedProduct.description,
    images: unifiedProduct.images || [unifiedProduct.imageUrl],
    sizes: unifiedProduct.size || ['38R', '40R', '42R', '44R'],
    sku: unifiedProduct.sku,
    sale_price: unifiedProduct.originalPrice ? unifiedProduct.price : undefined
  };
}

// Helper function to generate categories from products
function generateSuitsCategories(products: CollectionProduct[]): CategoryInfo[] {
  const subcategoryCounts = products.reduce((acc, product) => {
    const subcat = product.subcategory || 'general';
    acc[subcat] = (acc[subcat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryMapping: Record<string, string> = {
    'two-piece': 'Two-Piece Suits',
    'three-piece': 'Three-Piece Suits',
    'tuxedos': 'Tuxedos',
    'double-breasted': 'Double-Breasted',
    'modern': 'Modern Fit',
    'classic': 'Classic Fit',
    'slim-fit': 'Slim Fit',
    'general': 'All Suits'
  };

  return [
    {
      id: 'all',
      name: 'All Suits',
      count: products.length,
      image: null,
      bgColor: 'from-slate-900 to-slate-700'
    },
    ...Object.entries(subcategoryCounts)
      .filter(([, count]) => count > 0)
      .map(([subcat, count]) => ({
        id: subcat,
        name: categoryMapping[subcat] || formatCategoryName(subcat),
        count,
        image: null
      }))
  ];
}

// Helper function to format category names
function formatCategoryName(subcategory: string): string {
  return subcategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to filter products by category
function filterProductsByCategory(products: CollectionProduct[], selectedCategory: string): CollectionProduct[] {
  if (selectedCategory === 'all') {
    return products;
  }
  return products.filter(product => product.subcategory === selectedCategory);
}

function SuitsContent() {
  // Fetch products from API using the unified shop hook with suits filter
  const { products: unifiedProducts, loading, error } = useUnifiedShop({
    initialFilters: { 
      category: ['suits'],
      includeIndividual: true 
    },
    autoFetch: true,
    debounceDelay: 300
  });

  // Transform UnifiedProducts to CollectionProduct format
  const allProducts = useMemo(() => {
    return unifiedProducts.map(mapUnifiedProductToCollectionProduct);
  }, [unifiedProducts]);

  // Generate categories from actual products
  const categories = useMemo(() => {
    return generateSuitsCategories(allProducts);
  }, [allProducts]);
  
  // UI state
  const [selectedCategory, setSelectedCategory] = useState('all');
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
      trackCollectionView('Suits Collection', allProducts);
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

  // Filter products based on selected category
  const filteredProducts = filterProductsByCategory(allProducts, selectedCategory);

  // Track category filter changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      trackFilterChange('Suits Collection', { category: selectedCategory });
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
      description: product.description || 'Premium quality suit tailored to perfection'
    });
    setSelectedSize('');
    setQuantity(1);
    
    // Track quick view
    trackQuickViewModal(product);
    trackProductClick(product, 'Suits Collection');
  };

  // Close modal when clicking outside
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedProduct(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading suits collection...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Unable to load suits</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
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
                onClick={() => setSelectedCategory(category.id)}
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
            {filteredProducts.length} products
          </span>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <Grid3X3 className="w-4 h-4" />
            <span>Grid View</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Product Grid - 3x3 on mobile */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-2 p-1 md:p-3">
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
                className="object-cover"
                sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.jpg';
                }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Product Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                <h3 className="text-white font-serif text-xs md:text-sm mb-0.5 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-white/90 text-xs md:text-sm font-medium">
                  ${product.price}
                </p>
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

export default function SuitsCollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading suits collection...</p>
          </div>
        </div>
      </div>
    }>
      <SuitsContent />
    </Suspense>
  );
}