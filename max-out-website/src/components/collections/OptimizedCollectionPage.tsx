'use client';

import { useState, useRef, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGA4 } from '@/hooks/useGA4';
import { useCart } from '@/hooks/useCart';
import { useInView } from 'react-intersection-observer';

// Product Card Component - Memoized for performance
const ProductCard = memo(({ 
  product, 
  onQuickView, 
  onToggleLike, 
  isLiked,
  onProductClick,
  index 
}: any) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading={index < 8 ? "eager" : "lazy"}
          onClick={() => onProductClick(product)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike(product.id);
            }}
            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-all",
                isLiked ? "text-red-500 fill-red-500" : "text-gray-700"
              )} 
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        
        {/* Product Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs font-medium mb-1 opacity-90">{product.category}</p>
          <h3 className="font-serif text-sm mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm font-semibold">${product.price}</p>
        </div>
      </div>
      
      {/* Mobile-friendly info (always visible on mobile) */}
      <div className="mt-2 md:hidden">
        <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-600">${product.price}</p>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

// Category Navigation Component
const CategoryNav = memo(({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className="relative mb-8">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      
      {/* Category Cards */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category: any) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex-shrink-0 relative w-40 h-24 rounded-xl overflow-hidden transition-all duration-300",
              selectedCategory === category.id 
                ? "ring-2 ring-black scale-105" 
                : "hover:scale-105"
            )}
          >
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="160px"
                className="object-cover"
              />
            ) : (
              <div className={cn(
                "w-full h-full bg-gradient-to-br",
                category.bgColor || "from-gray-700 to-gray-900"
              )} />
            )}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
              <p className="text-sm font-semibold">{category.name}</p>
              <p className="text-xs opacity-90">{category.count} items</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

CategoryNav.displayName = 'CategoryNav';

// Main Optimized Collection Page Component
interface OptimizedCollectionPageProps {
  title: string;
  categories: any[];
  products: any[];
  heroImage?: string;
  description?: string;
}

export function OptimizedCollectionPage({
  title,
  categories,
  products,
  heroImage,
  description
}: OptimizedCollectionPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { addToCart } = useCart();
  const {
    trackCollectionView,
    trackProductClick,
    trackQuickViewModal,
    trackAddCart,
    trackWishlistAdd,
    trackFilterChange
  } = useGA4();

  // Track collection view on mount
  useEffect(() => {
    trackCollectionView(title, products);
  }, [title]);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.subcategory === selectedCategory);

  // Track category filter changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      trackFilterChange(title, { category: selectedCategory });
    }
  }, [selectedCategory, title]);

  // Toggle like with tracking
  const toggleLike = useCallback((productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
        const product = products.find(p => p.id === productId);
        if (product) {
          trackWishlistAdd(product);
        }
      }
      return newSet;
    });
  }, [products, trackWishlistAdd]);

  // Handle quick view with tracking
  const handleQuickView = useCallback((product: any) => {
    const fullProduct = {
      ...product,
      images: [product.image],
      sizes: ['36', '38', '40', '42', '44', '46', '48'],
      description: product.description || 'Premium quality tailored to perfection'
    };
    setSelectedProduct(fullProduct);
    setSelectedSize('');
    setQuantity(1);
    trackQuickViewModal(product);
  }, [trackQuickViewModal]);

  // Handle product click with tracking
  const handleProductClick = useCallback((product: any) => {
    trackProductClick(product, title);
    // Navigate to product page or open quick view
    handleQuickView(product);
  }, [title, trackProductClick, handleQuickView]);

  // Handle add to cart with tracking
  const handleAddToCart = useCallback(() => {
    if (selectedProduct && selectedSize) {
      const cartItem = {
        ...selectedProduct,
        size: selectedSize,
        quantity: quantity
      };
      addToCart(cartItem);
      trackAddCart(cartItem);
      setSelectedProduct(null);
    }
  }, [selectedProduct, selectedSize, quantity, addToCart, trackAddCart]);

  // Close modal when clicking outside
  const handleModalClick = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedProduct(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section (Optional) */}
      {heroImage && (
        <div className="relative h-64 md:h-96 mb-8">
          <Image
            src={heroImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-5xl font-serif mb-2">{title}</h1>
              {description && (
                <p className="text-lg opacity-90 max-w-2xl mx-auto px-4">{description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Collection Header */}
      {!heroImage && (
        <div className="px-4 md:px-8 py-8 border-b">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif">{title}</h1>
              <p className="text-gray-600 mt-1">{filteredProducts.length} products</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Navigation */}
      <div className="px-4 md:px-8 py-6">
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Products Grid */}
      <div className="px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' 
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1"
          )}>
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isLiked={likedProducts.has(product.id)}
                onQuickView={handleQuickView}
                onToggleLike={toggleLike}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleModalClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
                <h2 className="font-serif text-lg">Quick View</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
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
                    {selectedProduct.sizes.map((size: string) => (
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
                  onClick={handleAddToCart}
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