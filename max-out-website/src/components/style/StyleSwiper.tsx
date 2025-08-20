'use client';

import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import { Product, StylePreferences } from '@/lib/types';

interface StyleSwiperProps {
  products: Product[];
  onSwipe: (product: Product, direction: 'left' | 'right') => void;
  onComplete?: (likedProducts: Product[]) => void;
}

export function StyleSwiper({ products, onSwipe, onComplete }: StyleSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [exitX, setExitX] = useState(0);

  const currentProduct = products[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentProduct) return;

    setExitX(direction === 'left' ? -window.innerWidth : window.innerWidth);
    onSwipe(currentProduct, direction);

    if (direction === 'right') {
      setLikedProducts([...likedProducts, currentProduct]);
    }

    if (currentIndex === products.length - 1) {
      onComplete?.(direction === 'right' ? [...likedProducts, currentProduct] : likedProducts);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
  };

  if (!currentProduct) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <h3 className="text-2xl font-serif mb-4">Style Profile Complete!</h3>
          <p className="text-gray-600 mb-6">We've curated {likedProducts.length} items based on your preferences.</p>
          <button
            onClick={() => onComplete?.(likedProducts)}
            className="bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-sm font-semibold transition-colors"
          >
            View Recommendations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative h-[600px] bg-gray-50 rounded-lg overflow-hidden shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            className="absolute inset-0"
            style={{
              x: exitX === 0 ? undefined : exitX,
              rotate: exitX === 0 ? undefined : exitX > 0 ? 20 : -20
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              x: exitX, 
              opacity: 0, 
              scale: 0.8,
              rotate: exitX > 0 ? 30 : -30
            }}
            drag="x"
            dragConstraints={{ left: -200, right: 200 }}
            dragElastic={0.5}
            onDragEnd={handleDragEnd}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="relative h-full">
              <img
                src={currentProduct.images[0]}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-serif mb-2">{currentProduct.name}</h3>
                <p className="text-lg mb-1">${(currentProduct.price / 100).toFixed(2)}</p>
                <p className="text-sm opacity-90 capitalize">{currentProduct.category}</p>
              </div>

              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">
                  {currentIndex + 1} / {products.length}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <X className="w-6 h-6 text-red-500" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-green-50 transition-colors"
          >
            <Heart className="w-6 h-6 text-green-500" />
          </motion.button>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <button
          onClick={() => handleSwipe('right')}
          className="bg-gold hover:bg-gold/90 text-black px-6 py-2 rounded-sm font-semibold transition-colors"
        >
          Skip All
        </button>
      </div>

      <motion.div
        className="absolute -top-10 left-1/2 transform -translate-x-1/2 pointer-events-none"
        initial={{ opacity: 0, y: 0 }}
        animate={
          exitX > 0
            ? { opacity: 1, y: -20 }
            : exitX < 0
            ? { opacity: 1, y: -20 }
            : { opacity: 0, y: 0 }
        }
        transition={{ duration: 0.2 }}
      >
        {exitX > 0 ? (
          <span className="text-green-500 font-bold text-2xl">LIKE!</span>
        ) : exitX < 0 ? (
          <span className="text-red-500 font-bold text-2xl">NOPE!</span>
        ) : null}
      </motion.div>
    </div>
  );
}