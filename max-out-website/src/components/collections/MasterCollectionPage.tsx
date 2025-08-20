'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  ShoppingBag,
  X,
  Grid,
  Grid2X2,
  Eye,
  Grid3X3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UltraMinimalProductCard from '@/components/products/UltraMinimalProductCard';
import ProductQuickView from '@/components/products/ProductQuickView';

interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  tags: string[];
  isNew?: boolean;
  isSale?: boolean;
}

interface MasterCollectionPageProps {
  title: string;
  subtitle: string;
  description: string;
  categories: Category[];
  products: Product[];
  heroImage?: string;
}

export function MasterCollectionPage({
  title,
  subtitle,
  description,
  categories,
  products,
  heroImage
}: MasterCollectionPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [visibleProducts, setVisibleProducts] = useState(16);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
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
    isMobile ? ['220px', '120px'] : ['250px', '180px']
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
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
    setVisibleProducts(16); // Reset visible products on category change
  }, [selectedCategory, products]);

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
      }
      return newSet;
    });
  };

  // Load more products
  const loadMore = () => {
    setVisibleProducts(prev => prev + 16);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Collapsible Category Filter Navigation */}
      <motion.section 
        className={cn(
          "sticky top-0 z-40 bg-white border-b transition-shadow duration-300",
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

          {/* Categories - Match suit collection page sizing */}
          <div
            ref={categoryScrollRef}
            className={cn(
              "flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-12 md:px-16 h-full items-center",
              scrolled ? "py-2" : "py-3 md:py-4"
            )}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Products - Match suit collection sizing */}
            <motion.button
              onClick={() => setSelectedCategory('all')}
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer group transition-all shadow-lg",
                scrolled && isMobile 
                  ? "w-[160px] h-[90px]"  // Smaller when scrolled but still visible
                  : isMobile 
                    ? "w-[280px] h-[180px]"  // Large size matching suit collection
                    : "w-[200px] h-[200px]",
                selectedCategory === 'all' && "ring-2 ring-burgundy"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-burgundy to-burgundy-700">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                    <p className={cn(
                      "font-semibold",
                      scrolled && isMobile ? "text-sm" : isMobile ? "text-xl" : "text-lg"
                    )}>
                      All Products
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Category Cards - Match suit collection sizing */}
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
                    ? "w-[160px] h-[90px]"  // Smaller when scrolled but still visible
                    : isMobile 
                      ? "w-[280px] h-[180px]"  // Large size matching suit collection
                      : "w-[200px] h-[200px]",
                  selectedCategory === category.id && "ring-2 ring-burgundy"
                )}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-center">
                    <h3 className={cn(
                      "font-semibold",
                      scrolled && isMobile ? "text-sm" : isMobile ? "text-xl" : "text-lg"
                    )}>
                      {category.name}
                    </h3>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Count Bar - Hidden on mobile when scrolled */}
        <motion.div 
          className="px-4 md:px-8 py-2 flex justify-between items-center border-t bg-gray-50"
          style={{ opacity: springProductCountOpacity, display: scrolled && isMobile ? 'none' : 'flex' }}
        >
          <span className="text-xs md:text-sm text-gray-600">
            {filteredProducts.length} products
          </span>
        </motion.div>
      </motion.section>

      {/* Floating Filter Button - Appears when header shrinks on mobile */}
      <AnimatePresence>
        {scrolled && isMobile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setShowFilters(true)}
            className="fixed top-20 right-4 z-50 bg-black text-white p-3 rounded-full shadow-2xl"
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Filter content here */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid - Minimal design matching reference */}
      <section className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
          >
            {filteredProducts.slice(0, visibleProducts).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02, duration: 0.3 }}
              >
                <UltraMinimalProductCard
                  product={{
                    ...product,
                    imageUrl: product.image,
                    primary_image: product.image,
                    images: product.hoverImage ? [{ src: product.hoverImage }] : [],
                    available: true
                  }}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More */}
        {visibleProducts < filteredProducts.length && (
          <div className="text-center mt-8 md:mt-12">
            <Button
              onClick={loadMore}
              variant="outline"
              className="px-8 py-3 border-gray-300 hover:border-gray-400"
            >
              Load More ({filteredProducts.length - visibleProducts} remaining)
            </Button>
          </div>
        )}
      </section>

      {/* Quick View Modal - Using new ProductQuickView component */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigate={(direction) => {
          if (!selectedProduct) return;
          const currentIndex = filteredProducts.findIndex(p => p.id === selectedProduct.id);
          let newIndex = currentIndex;
          
          if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : filteredProducts.length - 1;
          } else {
            newIndex = currentIndex < filteredProducts.length - 1 ? currentIndex + 1 : 0;
          }
          
          setSelectedProduct(filteredProducts[newIndex]);
        }}
        isMobile={isMobile}
      />
    </div>
  );
}