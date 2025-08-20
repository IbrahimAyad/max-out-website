'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, X, RefreshCw } from 'lucide-react';
import { Product } from '@/lib/types';

interface TinderStyleSwiperProps {
  products: Product[];
  onSwipe: (product: Product, direction: 'left' | 'right') => void;
  onComplete?: (likedProducts: Product[]) => void;
}

export function TinderStyleSwiper({ products, onSwipe, onComplete }: TinderStyleSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  
  const constraintsRef = useRef(null);

  const currentProduct = products[currentIndex];
  const nextProduct = products[currentIndex + 1];
  const hasMoreProducts = currentIndex < products.length;

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentProduct || currentIndex >= products.length) return;

    setExitDirection(direction);
    onSwipe(currentProduct, direction);

    const updatedLikedProducts = direction === 'right' 
      ? [...likedProducts, currentProduct] 
      : likedProducts;

    if (direction === 'right') {
      setLikedProducts(updatedLikedProducts);
    }

    setTimeout(() => {
      setExitDirection(null);
      if (currentIndex === products.length - 1) {
        onComplete?.(updatedLikedProducts);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }, 250);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) >= 500) {
      handleSwipe(velocity > 0 ? 'right' : 'left');
    } else if (Math.abs(offset) > threshold) {
      handleSwipe(offset > 0 ? 'right' : 'left');
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (likedProducts.some(p => p.id === products[currentIndex - 1].id)) {
        setLikedProducts(likedProducts.filter(p => p.id !== products[currentIndex - 1].id));
      }
    }
  };

  if (!hasMoreProducts) {
    return (
      <div className="flex items-center justify-center h-[700px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
        <div className="text-center p-8">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-12 h-12 text-gold" />
            </div>
            <h3 className="text-3xl font-serif mb-2">Style Profile Complete!</h3>
            <p className="text-gray-600 text-lg">
              We've analyzed your preferences and found {likedProducts.length} items you'll love
            </p>
          </div>
          <button
            onClick={() => onComplete?.(likedProducts)}
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105"
          >
            View Your Personalized Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md md:max-w-xl mx-auto pb-16" ref={constraintsRef}>
      {/* Card Stack Container */}
      <div className="relative h-[600px] md:h-[750px] flex items-center justify-center">
        {/* Background card preview */}
        {nextProduct && (
          <div className="absolute inset-0 scale-95 opacity-40">
            <div className="h-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={nextProduct.images[0] || '/placeholder-suit.jpg'}
                alt={nextProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Main swipeable card */}
        <AnimatePresence mode="wait">
          {currentProduct && currentIndex < products.length && (
            <motion.div
              key={currentProduct.id}
              className="absolute w-full h-full cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={constraintsRef}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              exit={{
                x: exitDirection === 'right' ? 500 : -500,
                opacity: 0,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
            >
              <div className="relative h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Product Image */}
                <div className="relative h-3/4">
                  <img
                    src={currentProduct.images[0] || '/placeholder-suit.jpg'}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', currentProduct.images[0]);
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-suit.jpg';
                    }}
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                </div>
                
                {/* Product Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-white p-6">
                  <h3 className="text-2xl font-serif mb-2">{currentProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="bg-burgundy/10 text-burgundy px-3 py-1 rounded-full text-sm font-medium">
                      Complete Outfit Bundle
                    </span>
                    <p className="text-gray-600 text-sm">Swipe to rate this look</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleUndo}
          disabled={currentIndex === 0}
          className="w-14 h-14 rounded-full bg-gray-100 shadow-lg flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left')}
          className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-red-50 transition-colors group"
        >
          <X className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right')}
          className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-green-50 transition-colors group"
        >
          <Heart className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-gray-500 text-sm mb-16">
        <p>Swipe right to like, left to pass</p>
        <p className="text-xs mt-1">Viewing complete outfit bundles</p>
      </div>
    </div>
  );
}