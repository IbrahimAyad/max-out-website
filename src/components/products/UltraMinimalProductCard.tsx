'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface UltraMinimalProductCardProps {
  product: {
    id: string;
    name: string;
    title?: string;
    price: number | string;
    imageUrl?: string;
    primary_image?: string;
    featured_image?: { src: string };
    images?: Array<{ src: string }>;
    category?: string;
    available?: boolean;
    inventory_quantity?: number;
  };
  onQuickView: (product: any) => void;
  className?: string;
}

export default function UltraMinimalProductCard({ 
  product, 
  onQuickView,
  className 
}: UltraMinimalProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Get the best available image
  const getProductImage = () => {
    if (product.primary_image) return product.primary_image;
    if (product.imageUrl) return product.imageUrl;
    if (product.featured_image?.src) return product.featured_image.src;
    if (product.images?.[0]?.src) return product.images[0].src;
    return '/placeholder-product.jpg';
  };

  // Format price
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(0)}`; // Clean price without decimals
  };

  // Handle touch for mobile
  const handleTouch = () => {
    setIsTouched(true);
    setTimeout(() => setIsTouched(false), 2000);
  };

  const isInStock = product.available !== false && (product.inventory_quantity === undefined || product.inventory_quantity > 0);

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-lg bg-gray-100",
        "cursor-pointer transition-all duration-300",
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onQuickView(product)}
      onTouchStart={handleTouch}
    >
      {/* Image Container - Full bleed, takes entire card */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        
        {/* Product Image */}
        <Image
          src={getProductImage()}
          alt={product.name || product.title || 'Product'}
          fill
          className={cn(
            "object-cover object-center transition-all duration-700",
            imageLoaded ? "opacity-100" : "opacity-0",
            (isHovered || isTouched) && "scale-110"
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onLoad={() => setImageLoaded(true)}
          priority={false}
        />

        {/* Bottom Gradient - Subtle, only for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Product Info - Minimal, overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
          <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-1 mb-0.5">
            {product.name || product.title}
          </h3>
          <p className="text-white text-sm sm:text-base font-semibold">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Desktop Expand Indicator - Shows on hover */}
        <AnimatePresence>
          {(isHovered && !isTouched) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
              transition={{ duration: 0.2, type: "spring" }}
              className="hidden lg:block absolute top-3 right-3"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <Maximize2 className="w-4 h-4 text-gray-800" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Tap Indicator - Subtle pulse in corner */}
        <div className="lg:hidden">
          <AnimatePresence>
            {!isTouched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-12 sm:bottom-16 right-2 sm:right-3"
              >
                <motion.div
                  className="bg-white/30 backdrop-blur-sm rounded-full p-0.5 sm:p-1"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Touch Feedback - Shows when tapped */}
          <AnimatePresence>
            {isTouched && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-3 right-3"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg">
                  <Maximize2 className="w-4 h-4 text-gray-800" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Out of Stock Overlay - Clean and minimal */}
        {!isInStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 text-gray-900 text-xs font-medium px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}