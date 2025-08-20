'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, X, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { Product, StylePreferences } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EnhancedStyleSwiperProps {
  products: Product[];
  onSwipe: (product: Product, direction: 'left' | 'right', velocity?: number) => void;
  onComplete?: (likedProducts: Product[], analytics: SwipeAnalytics) => void;
  enableHaptics?: boolean;
  preloadImages?: boolean;
}

interface SwipeAnalytics {
  totalSwipes: number;
  leftSwipes: number;
  rightSwipes: number;
  averageSwipeTime: number;
  swipeVelocities: number[];
  undoCount: number;
  categoryPreferences: Record<string, number>;
}

export function EnhancedStyleSwiper({ 
  products, 
  onSwipe, 
  onComplete,
  enableHaptics = true,
  preloadImages = true
}: EnhancedStyleSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<Array<{ product: Product; direction: 'left' | 'right' }>>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [removedCards, setRemovedCards] = useState<Set<string>>(new Set());
  const [analytics, setAnalytics] = useState<SwipeAnalytics>({
    totalSwipes: 0,
    leftSwipes: 0,
    rightSwipes: 0,
    averageSwipeTime: 0,
    swipeVelocities: [],
    undoCount: 0,
    categoryPreferences: {}
  });
  
  const swipeStartTime = useRef<number>(0);
  
  // Color overlay for visual feedback
  const likeOpacity = useMotionValue(0);
  const nopeOpacity = useMotionValue(0);
  
  // Preload next images for smooth transitions
  useEffect(() => {
    if (preloadImages && currentIndex < products.length - 1) {
      const nextProduct = products[currentIndex + 1];
      if (nextProduct?.images?.[0]) {
        const img = new Image();
        img.src = nextProduct.images[0];
      }
    }
  }, [currentIndex, products, preloadImages]);

  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if (enableHaptics && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [enableHaptics]);

  const handleSwipe = useCallback((productId: string, direction: 'left' | 'right', velocity: number = 0) => {
    const product = products.find(p => p.id === productId);
    if (!product || isAnimating || removedCards.has(productId)) return;
    
    setIsAnimating(true);
    const swipeTime = Date.now() - swipeStartTime.current;
    
    // Haptic feedback
    triggerHaptic(direction === 'right' ? [10, 50, 10] : 30);
    
    // Mark card as removed
    setRemovedCards(prev => new Set([...prev, productId]));
    
    // Update analytics
    setAnalytics(prev => ({
      ...prev,
      totalSwipes: prev.totalSwipes + 1,
      leftSwipes: prev.leftSwipes + (direction === 'left' ? 1 : 0),
      rightSwipes: prev.rightSwipes + (direction === 'right' ? 1 : 0),
      averageSwipeTime: (prev.averageSwipeTime * prev.totalSwipes + swipeTime) / (prev.totalSwipes + 1),
      swipeVelocities: [...prev.swipeVelocities, Math.abs(velocity)],
      categoryPreferences: {
        ...prev.categoryPreferences,
        [product.category]: (prev.categoryPreferences[product.category] || 0) + (direction === 'right' ? 1 : -1)
      }
    }));
    
    // Update swipe history
    setSwipeHistory(prev => [...prev, { product, direction }]);
    
    // Call parent handler
    onSwipe(product, direction, velocity);
    
    if (direction === 'right') {
      setLikedProducts(prev => [...prev, product]);
    }
    
    // Check if we're done
    setTimeout(() => {
      if (removedCards.size + 1 === products.length) {
        onComplete?.(
          direction === 'right' ? [...likedProducts, product] : likedProducts,
          analytics
        );
      }
      setIsAnimating(false);
    }, 500);
  }, [products, likedProducts, analytics, isAnimating, removedCards, onSwipe, onComplete, triggerHaptic]);

  // Create a card component for each product
  const Card = ({ product, index }: { product: Product; index: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateZ = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
    
    // Update overlay opacities based on drag
    useEffect(() => {
      const unsubscribeX = x.onChange((latest) => {
        if (latest > 0) {
          likeOpacity.set(Math.min(latest / 150, 1));
          nopeOpacity.set(0);
        } else {
          nopeOpacity.set(Math.min(Math.abs(latest) / 150, 1));
          likeOpacity.set(0);
        }
      });
      
      return () => {
        unsubscribeX();
      };
    }, []);

    const handleDragEnd = (event: any, info: PanInfo) => {
      const threshold = 100;
      const velocity = info.velocity.x;
      const offset = info.offset.x;
      
      if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
        const direction = offset > 0 ? 'right' : 'left';
        handleSwipe(product.id, direction, velocity);
      } else {
        // Spring back
        x.set(0);
        y.set(0);
        likeOpacity.set(0);
        nopeOpacity.set(0);
      }
    };

    if (removedCards.has(product.id)) {
      return null;
    }

    return (
      <motion.div
        key={product.id}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{
          x,
          y,
          rotateZ,
          opacity,
          zIndex: products.length - index,
        }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={1}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
        onDragStart={() => {
          swipeStartTime.current = Date.now();
          triggerHaptic(5);
        }}
        onDrag={(_, info) => {
          const absX = Math.abs(info.offset.x);
          if (absX === 50 || absX === 100) {
            triggerHaptic(5);
          }
        }}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05 }}
        initial={{ scale: 0.95 - index * 0.02, y: index * 8 }}
        animate={{ 
          scale: removedCards.has(product.id) ? 0 : 1 - index * 0.02,
          y: removedCards.has(product.id) ? 0 : index * 8,
          x: removedCards.has(product.id) ? 
            (swipeHistory.find(h => h.product.id === product.id)?.direction === 'left' ? -window.innerWidth : window.innerWidth) : 0,
          rotate: removedCards.has(product.id) ?
            (swipeHistory.find(h => h.product.id === product.id)?.direction === 'left' ? -45 : 45) : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl bg-white">
          {/* Product Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Like Overlay */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: index === 0 ? likeOpacity : 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/40 via-green-500/30 to-emerald-600/40" />
            <div className="flex items-center justify-center h-full">
              <motion.div className="relative">
                <Heart className="w-40 h-40 text-white fill-white drop-shadow-2xl" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <span className="text-4xl font-bold text-white drop-shadow-lg">LIKE!</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Nope Overlay */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: index === 0 ? nopeOpacity : 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/40 via-red-500/30 to-rose-600/40" />
            <div className="flex items-center justify-center h-full">
              <motion.div className="relative">
                <X className="w-40 h-40 text-white drop-shadow-2xl stroke-[3]" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <span className="text-4xl font-bold text-white drop-shadow-lg">NOPE!</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Product Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <motion.h3 className="text-3xl font-serif mb-2">
              {product.name}
            </motion.h3>
            <motion.div className="flex items-center gap-4">
              <span className="text-2xl font-bold">${(product.price / 100).toFixed(0)}</span>
              <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full capitalize">
                {product.category}
              </span>
            </motion.div>
          </div>
          
          {/* Match Indicator */}
          {likedProducts.some(p => p.category === product.category) && (
            <motion.div 
              className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <TrendingUp className="w-4 h-4" />
              Matches your style
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  };

  const handleUndo = () => {
    if (swipeHistory.length > 0) {
      triggerHaptic([10, 30, 10]);
      const lastSwipe = swipeHistory[swipeHistory.length - 1];
      
      // Remove the product from removed cards
      setRemovedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(lastSwipe.product.id);
        return newSet;
      });
      
      setSwipeHistory(prev => prev.slice(0, -1));
      
      if (lastSwipe.direction === 'right') {
        setLikedProducts(prev => prev.filter(p => p.id !== lastSwipe.product.id));
      }
      
      setAnalytics(prev => ({
        ...prev,
        undoCount: prev.undoCount + 1,
        totalSwipes: prev.totalSwipes - 1,
        leftSwipes: prev.leftSwipes - (lastSwipe.direction === 'left' ? 1 : 0),
        rightSwipes: prev.rightSwipes - (lastSwipe.direction === 'right' ? 1 : 0)
      }));
    }
  };

  const visibleProducts = products.filter(p => !removedCards.has(p.id));
  const progress = (removedCards.size / products.length) * 100;

  if (removedCards.size === products.length) {
    return (
      <motion.div 
        className="flex items-center justify-center h-[600px] bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Sparkles className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-3xl font-serif mb-4">Style Profile Complete!</h3>
          <p className="text-gray-600 mb-2">You liked {likedProducts.length} out of {products.length} items</p>
          <p className="text-sm text-gray-500 mb-6">
            Average swipe time: {(analytics.averageSwipeTime / 1000).toFixed(1)}s
          </p>
          <button
            onClick={() => onComplete?.(likedProducts, analytics)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            View Your Style Profile
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Style Discovery</span>
          <span className="text-sm text-gray-500">{removedCards.size} / {products.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative h-[600px] perspective-1000">
        {/* Render all cards in reverse order (bottom card first) */}
        {products.slice().reverse().map((product, reversedIndex) => {
          const index = products.length - 1 - reversedIndex;
          return <Card key={product.id} product={product} index={index} />;
        })}
      </div>

      {/* Enhanced Action Buttons */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center items-center gap-6">
        {/* Undo Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleUndo}
          disabled={swipeHistory.length === 0}
          className={cn(
            "w-12 h-12 rounded-full bg-gray-100 shadow-lg flex items-center justify-center transition-all",
            swipeHistory.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
          )}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </motion.button>

        {/* Dislike Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            const topCard = visibleProducts[0];
            if (topCard) handleSwipe(topCard.id, 'left');
          }}
          disabled={visibleProducts.length === 0}
          className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-red-50 transition-all group"
        >
          <X className="w-7 h-7 text-red-500 group-hover:scale-110 transition-transform" />
        </motion.button>

        {/* Super Like Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const topCard = visibleProducts[0];
            if (topCard) {
              triggerHaptic([10, 30, 10, 30, 10]);
              handleSwipe(topCard.id, 'right', 1000);
            }
          }}
          disabled={visibleProducts.length === 0}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl flex items-center justify-center hover:shadow-2xl transition-all"
        >
          <Zap className="w-6 h-6 text-white" />
        </motion.button>

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            const topCard = visibleProducts[0];
            if (topCard) handleSwipe(topCard.id, 'right');
          }}
          disabled={visibleProducts.length === 0}
          className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-green-50 transition-all group"
        >
          <Heart className="w-7 h-7 text-green-500 group-hover:scale-110 transition-transform" />
        </motion.button>

        {/* Skip Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            const topCard = visibleProducts[0];
            if (topCard) handleSwipe(topCard.id, 'left', 0);
          }}
          disabled={visibleProducts.length === 0}
          className={cn(
            "w-12 h-12 rounded-full bg-gray-100 shadow-lg flex items-center justify-center transition-all",
            visibleProducts.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
          )}
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Tips */}
      <motion.div 
        className="mt-20 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Swipe right to like, left to pass</p>
        <p className="text-xs mt-1">Tap the ⚡ for items you love!</p>
      </motion.div>
    </div>
  );
}