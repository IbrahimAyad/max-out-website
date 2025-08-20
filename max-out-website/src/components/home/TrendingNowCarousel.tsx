'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  base_price: number;
  compare_at_price?: number;
  images?: {
    hero?: { url: string; alt: string };
    primary?: { url: string; cdn_url: string; alt_text: string };
    gallery?: Array<{ cdn_url: string; alt_text: string }>;
  };
  image_url?: string;
  additional_images?: string[];
  slug?: string;
  category?: string;
}

interface TrendingNowCarouselProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

const TrendingNowCarousel = ({ 
  products, 
  title = "Trending Now", 
  subtitle = "Discover what's capturing attention" 
}: TrendingNowCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with center item
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(0);

  // Auto-scroll when not hovering (luxury brands often have subtle auto-scroll)
  useEffect(() => {
    if (!isHovering && !isDragging && products.length > 3) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % products.length);
      }, 4000); // 4 second intervals
      return () => clearInterval(interval);
    }
  }, [isHovering, isDragging, products.length]);

  // Get display products (5 items for desktop)
  const getDisplayProducts = useCallback(() => {
    if (products.length === 0) return [];
    if (products.length <= 5) return products;
    
    const result = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + products.length) % products.length;
      result.push({ ...products[index], displayIndex: i });
    }
    return result;
  }, [currentIndex, products]);

  const displayProducts = getDisplayProducts();

  // Handle navigation
  const goToNext = useCallback(() => {
    if (products.length > 3) {
      setCurrentIndex(prev => (prev + 1) % products.length);
    }
  }, [products.length]);

  const goToPrevious = useCallback(() => {
    if (products.length > 3) {
      setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
    }
  }, [products.length]);

  // Touch/Mouse drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 80; // Minimum drag distance to trigger navigation
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    setDragOffset(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = touch.clientX;
    handleDragStart(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Get product image with fallbacks
  const getProductImage = (product: Product): string => {
    if (product.images?.hero?.url) return product.images.hero.url;
    if (product.images?.primary?.cdn_url) return product.images.primary.cdn_url;
    if (product.images?.primary?.url) return product.images.primary.url;
    if (product.images?.gallery?.[0]?.cdn_url) return product.images.gallery[0].cdn_url;
    if (product.image_url) return product.image_url;
    if (product.additional_images?.[0]) return product.additional_images[0];
    return 'https://cdn.kctmenswear.com/placeholder/product.webp';
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (products.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-gray-500">
            Loading trending products...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header - Hugo Boss Style */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            {title}
          </h2>
          <div className="w-12 h-px bg-gray-300 mx-auto mb-6" />
          <p className="text-gray-600 text-base md:text-lg font-light max-w-md mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="relative select-none cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Desktop/Tablet Layout (5 items) */}
          <div className="hidden md:block">
            <div className="flex items-center justify-center space-x-6 lg:space-x-8">
              {displayProducts.map((product, index) => {
                const isCenter = index === 2;
                const distance = Math.abs(index - 2);
                
                return (
                  <motion.div
                    key={`${product.id}-${product.displayIndex}`}
                    className={`
                      relative transition-all duration-300 ease-out
                      ${isCenter 
                        ? 'w-72 lg:w-80' // Center item 20% larger
                        : distance === 1 
                          ? 'w-60 lg:w-64' // Adjacent items
                          : 'w-48 lg:w-52 opacity-60' // Outer items
                      }
                    `}
                    style={{
                      transform: `translateX(${dragOffset * 0.5}px)`,
                    }}
                    animate={{
                      scale: isCenter ? 1.0 : distance === 1 ? 0.9 : 0.8,
                      opacity: distance <= 1 ? 1 : 0.6
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <Link href={`/products/${product.slug || product.id}`}>
                      <div className="group">
                        {/* Product Image */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                          <Image
                            src={getProductImage(product)}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes={isCenter ? "320px" : "240px"}
                            priority={isCenter}
                          />
                          
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                        
                        {/* Product Info */}
                        <div className="text-center space-y-2">
                          <h3 className="text-sm md:text-base font-light text-gray-900 tracking-wide line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-center space-x-2 text-sm">
                            {product.compare_at_price && product.compare_at_price > product.base_price && (
                              <span className="text-gray-400 line-through font-light">
                                {formatPrice(product.compare_at_price)}
                              </span>
                            )}
                            <span className="text-gray-900 font-medium">
                              {formatPrice(product.base_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile Layout (1 item center) */}
          <div className="md:hidden">
            <div className="flex items-center justify-center">
              <motion.div
                className="w-80 max-w-[90vw]"
                style={{
                  transform: `translateX(${dragOffset}px)`,
                }}
              >
                <Link href={`/products/${products[currentIndex]?.slug || products[currentIndex]?.id}`}>
                  <div className="group">
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4">
                      <Image
                        src={getProductImage(products[currentIndex])}
                        alt={products[currentIndex]?.name || 'Product'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="320px"
                        priority
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    
                    {/* Product Info */}
                    <div className="text-center space-y-3">
                      <h3 className="text-lg font-light text-gray-900 tracking-wide">
                        {products[currentIndex]?.name}
                      </h3>
                      <div className="flex items-center justify-center space-x-2">
                        {products[currentIndex]?.compare_at_price && 
                         products[currentIndex]?.compare_at_price > products[currentIndex]?.base_price && (
                          <span className="text-gray-400 line-through font-light">
                            {formatPrice(products[currentIndex].compare_at_price)}
                          </span>
                        )}
                        <span className="text-gray-900 font-medium text-lg">
                          {formatPrice(products[currentIndex]?.base_price || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Minimal Progress Indicators */}
          {products.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index === currentIndex 
                      ? 'bg-gray-900 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                    }
                  `}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingNowCarousel;