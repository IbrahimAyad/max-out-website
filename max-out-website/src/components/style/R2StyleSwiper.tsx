'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, X, Sparkles, TrendingUp, Zap, ShoppingBag } from 'lucide-react';
import { StyleSwiperImage, StyleSwiperProduct, SwipeAnalytics } from '@/lib/types';
import { cn } from '@/lib/utils';

// Demo images for Style Swiper - defined outside component to prevent re-creation
const DEMO_IMAGES: StyleSwiperImage[] = [
  { id: '1', url: '/Swiper-v1/Season-1-bundles/navy-suit-white-burgunndy.webp', category: 'suits', metadata: { tags: ['formal', 'business'], productId: 'navy-suit-1' } },
  { id: '2', url: '/Swiper-v1/Season-1-bundles/black-suit-black-shirt-black.webp', category: 'suits', metadata: { tags: ['formal', 'evening'], productId: 'black-suit-1' } },
  { id: '3', url: '/Swiper-v1/Season-1-bundles/light-grey-2p-pink.webp', category: 'suits', metadata: { tags: ['casual', 'summer'], productId: 'grey-suit-1' } },
  { id: '4', url: '/Swiper-v1/casual-bundles/navy-white-shirt-white-pocket-sqaure.webp', category: 'casual', metadata: { tags: ['casual', 'business-casual'], productId: 'navy-casual-1' } },
  { id: '5', url: '/Swiper-v1/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.webp', category: 'formal', metadata: { tags: ['formal', 'black-tie'], productId: 'tuxedo-1' } },
  { id: '6', url: '/Swiper-v1/Season-1-bundles/burgundy-black-black.webp', category: 'suits', metadata: { tags: ['bold', 'evening'], productId: 'burgundy-suit-1' } },
  { id: '7', url: '/Swiper-v1/Fall Wedding Bundles/brown-suit-white-shirt-burgundy-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'fall'], productId: 'brown-suit-1' } },
  { id: '8', url: '/Swiper-v1/Spring Wedding Bundles/indigo-2p-white-sage-green.webp', category: 'wedding', metadata: { tags: ['wedding', 'spring'], productId: 'indigo-suit-1' } },
  { id: '9', url: '/Swiper-v1/Summer Wedding Bundles/light-grey-suit-white-shirt-sage-dusty-pink-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'summer'], productId: 'light-grey-2' } },
  { id: '10', url: '/Swiper-v1/Season-1-bundles/navy-3p-white-red.webp', category: 'suits', metadata: { tags: ['business', 'power'], productId: 'navy-3piece-1' } },
  { id: '11', url: '/Swiper-v1/casual-bundles/black-suit-burgundy-shirt-burgundy-pocket-sqaure.webp', category: 'casual', metadata: { tags: ['casual', 'evening'], productId: 'black-casual-1' } },
  { id: '12', url: '/Swiper-v1/Tuxedo-Bundles/midnight-blue-tuxedo-white-tuxedo-shirt-black-bowtie.webp', category: 'formal', metadata: { tags: ['formal', 'luxury'], productId: 'midnight-tux-1' } },
  { id: '13', url: '/Swiper-v1/Season-1-bundles/indigo-2p-white-red.webp', category: 'suits', metadata: { tags: ['business', 'modern'], productId: 'indigo-suit-2' } },
  { id: '14', url: '/Swiper-v1/Fall Wedding Bundles/hunter-green-3p-suit-white-shirt-burgundy-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'fall', 'unique'], productId: 'green-suit-1' } },
  { id: '15', url: '/Swiper-v1/casual-bundles/french-blue-black-shirt-black-pocket-sqaure.webp', category: 'casual', metadata: { tags: ['casual', 'modern'], productId: 'french-blue-1' } },
  { id: '16', url: '/Swiper-v1/Season-1-bundles/brown-pink-navy.webp', category: 'suits', metadata: { tags: ['business', 'creative'], productId: 'brown-suit-2' } },
  { id: '17', url: '/Swiper-v1/Summer Wedding Bundles/sand-suit-white-shirt-sage-green-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'summer', 'beach'], productId: 'sand-suit-1' } },
  { id: '18', url: '/Swiper-v1/Tuxedo-Bundles/royal-blue-tuxedo-white-tuxedo-shirt-black-bowtie.webp', category: 'formal', metadata: { tags: ['formal', 'bold'], productId: 'royal-tux-1' } },
  { id: '19', url: '/Swiper-v1/Season-1-bundles/dark-grey-white-silver.webp', category: 'suits', metadata: { tags: ['business', 'classic'], productId: 'dark-grey-1' } },
  { id: '20', url: '/Swiper-v1/Fall Wedding Bundles/burgundy-suit-white-shirt-mustard-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'fall', 'rich'], productId: 'burgundy-wedding-1' } }
];

interface R2StyleSwiperProps {
  category?: string;
  onSwipe?: (image: StyleSwiperImage, direction: 'left' | 'right', velocity?: number) => void;
  onComplete?: (likedImages: StyleSwiperImage[], analytics: SwipeAnalytics) => void;
  onProductClick?: (productId: string) => void;
  enableHaptics?: boolean;
  preloadImages?: boolean;
}

export function R2StyleSwiper({ 
  category = 'all',
  onSwipe, 
  onComplete,
  onProductClick,
  enableHaptics = true,
  preloadImages = true
}: R2StyleSwiperProps) {
  const [images, setImages] = useState<StyleSwiperImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedImages, setLikedImages] = useState<StyleSwiperImage[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<Array<{ image: StyleSwiperImage; direction: 'left' | 'right' }>>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  // Enhanced animation transforms for full swipe
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 400;
  const rotateZ = useTransform(dragX, [-screenWidth, 0, screenWidth], [-45, 0, 45]);
  const scale = useTransform(dragX, [-screenWidth, -100, 0, 100, screenWidth], [0.5, 0.9, 1, 0.9, 0.5]);
  const opacity = useTransform(dragX, [-screenWidth, -screenWidth/2, 0, screenWidth/2, screenWidth], [0, 1, 1, 1, 0]);
  
  // Color overlay for visual feedback
  const likeOpacity = useTransform(dragX, [0, 50, 150], [0, 0.5, 1]);
  const nopeOpacity = useTransform(dragX, [-150, -50, 0], [1, 0.5, 0]);

  // Fetch images from R2 or use demo images
  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      
      // Always use demo images for now since R2 is not set up
      const filteredImages = category === 'all' 
        ? DEMO_IMAGES 
        : DEMO_IMAGES.filter(img => img.category === category);
      
      // Set images with a small delay to ensure smooth loading
      setTimeout(() => {
        setImages(filteredImages.length > 0 ? filteredImages : DEMO_IMAGES);
        setLoading(false);
      }, 100);
    };

    loadImages();
  }, [category]);
  
  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setLikedImages([]);
    setSwipeHistory([]);
    // Reset drag values to ensure clean state
    dragX.set(0);
    dragY.set(0);
    setIsAnimating(false);
  }, [category, dragX, dragY]);
  
  // Preload next images for smooth transitions
  useEffect(() => {
    if (preloadImages && currentIndex < images.length - 1) {
      const nextImage = images[currentIndex + 1];
      if (nextImage?.url) {
        const img = new Image();
        img.src = nextImage.url;
      }
    }
  }, [currentIndex, images, preloadImages]);

  // Cleanup effect to reset drag values on unmount
  useEffect(() => {
    return () => {
      dragX.set(0);
      dragY.set(0);
    };
  }, [dragX, dragY]);

  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    if (enableHaptics && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, [enableHaptics]);

  const handleSwipe = useCallback((direction: 'left' | 'right', velocity: number = 0, fromButton: boolean = false) => {
    if (!images[currentIndex] || isAnimating) return;
    
    setIsAnimating(true);
    const currentImage = images[currentIndex];
    const swipeTime = Date.now() - swipeStartTime.current;
    
    // Haptic feedback
    triggerHaptic(direction === 'right' ? [10, 50, 10] : 30);
    
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
        [currentImage.category]: (prev.categoryPreferences[currentImage.category] || 0) + (direction === 'right' ? 1 : -1)
      }
    }));
    
    // Update swipe history
    setSwipeHistory(prev => [...prev, { image: currentImage, direction }]);
    
    // Call parent handler
    onSwipe?.(currentImage, direction, velocity);
    
    if (direction === 'right') {
      setLikedImages(prev => [...prev, currentImage]);
    }
    
    // For button clicks, animate the card exit first before resetting drag values
    if (fromButton) {
      // Animate the card out with proper direction
      const exitX = direction === 'left' ? -600 : 600;
      dragX.set(exitX, { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.3 
      });
      
      // Also animate slight vertical movement for more natural feel
      dragY.set(-20, {
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.3 
      });
      
      // Reset drag values after animation with a slight delay to ensure smooth transition
      setTimeout(() => {
        dragX.set(0);
        dragY.set(0);
      }, 380);
    } else {
      // For swipe gestures, don't reset immediately - let the exit animation handle it
      // The dragEnd handler will manage the reset
    }
    
    // Move to next card or complete
    setTimeout(() => {
      if (currentIndex >= images.length - 1) {
        // Complete the swiper session
        onComplete?.(
          direction === 'right' ? [...likedImages, currentImage] : likedImages,
          analytics
        );
      } else {
        setCurrentIndex(prev => prev + 1);
      }
      setIsAnimating(false);
    }, fromButton ? 400 : 350);
  }, [currentIndex, images, likedImages, analytics, isAnimating, onSwipe, onComplete, triggerHaptic]);

  const handleDragStart = () => {
    swipeStartTime.current = Date.now();
    triggerHaptic(5);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    // Haptic feedback at thresholds
    const absX = Math.abs(info.offset.x);
    if (absX === 50 || absX === 100) {
      triggerHaptic(5);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (isAnimating) {
      // Don't reset during animation to prevent conflicts
      return;
    }
    
    const threshold = 75;
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    // Calculate momentum for more natural physics
    const momentum = Math.abs(offset) * Math.abs(velocity) * 0.001;
    
    // Velocity-based swiping with momentum consideration
    if (Math.abs(velocity) > 200 || momentum > 50) {
      handleSwipe(velocity > 0 ? 'right' : 'left', velocity, false);
      // Don't reset drag values here - let the animation complete naturally
    } else if (Math.abs(offset) > threshold) {
      handleSwipe(offset > 0 ? 'right' : 'left', velocity, false);
      // Don't reset drag values here - let the animation complete naturally
    } else {
      // Spring back to center if not swiped - this is safe since no animation is happening
      dragX.set(0, { type: "spring", stiffness: 200, damping: 30 });
      dragY.set(0, { type: "spring", stiffness: 200, damping: 30 });
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0 && swipeHistory.length > 0) {
      triggerHaptic([10, 30, 10]);
      const lastSwipe = swipeHistory[swipeHistory.length - 1];
      
      setCurrentIndex(prev => prev - 1);
      setSwipeHistory(prev => prev.slice(0, -1));
      
      if (lastSwipe.direction === 'right') {
        setLikedImages(prev => prev.filter(img => img.id !== lastSwipe.image.id));
      }
      
      setAnalytics(prev => ({
        ...prev,
        undoCount: prev.undoCount + 1
      }));
    }
  };

  const currentImage = images[currentIndex];
  const progress = images.length > 0 ? ((currentIndex + 1) / images.length) * 100 : 0;
  const hasMoreCards = currentIndex < images.length - 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-gold-50 to-burgundy-50 rounded-3xl border border-gold-200">
        <div className="text-center p-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-gold-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-burgundy animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gold-400 to-burgundy-400 rounded-full animate-bounce"></div>
          </div>
          <h3 className="text-2xl font-serif text-burgundy mb-2">Curating Your Styles</h3>
          <p className="text-black-600">Loading luxury inspirations...</p>
          <div className="mt-4 h-2 bg-gold-100 rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="h-full bg-gradient-to-r from-burgundy to-gold animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentImage || images.length === 0) {
    return (
      <motion.div 
        className="flex items-center justify-center h-[600px] bg-gradient-to-br from-gold-50 via-white to-burgundy-50 rounded-3xl shadow-2xl border border-gold-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gold-100 to-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-burgundy" />
            </div>
          </motion.div>
          <h3 className="text-4xl font-serif mb-6 bg-gradient-to-r from-burgundy via-black to-burgundy bg-clip-text text-transparent">Style Discovery Complete!</h3>
          <div className="bg-white/70 rounded-2xl p-6 mb-6 border border-gold-200">
            <p className="text-black-700 mb-3 text-lg">You discovered <strong className="text-burgundy">{likedImages.length}</strong> favorite styles out of <strong>{images.length}</strong> total</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-gold-50 rounded-lg">
                <p className="text-black-500">Average Time</p>
                <p className="font-bold text-burgundy">{(analytics.averageSwipeTime / 1000).toFixed(1)}s</p>
              </div>
              <div className="text-center p-2 bg-burgundy-50 rounded-lg">
                <p className="text-black-500">Love Rate</p>
                <p className="font-bold text-gold">{((analytics.rightSwipes / analytics.totalSwipes) * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onComplete?.(likedImages, analytics)}
            className="bg-gradient-to-r from-burgundy to-burgundy-600 hover:from-burgundy-600 hover:to-burgundy-700 text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl border border-burgundy-400 text-lg"
          >
            View Your Style Profile
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Enhanced Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-burgundy rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-black-700 tracking-wide">Style Discovery Journey</span>
          </div>
          <div className="bg-gradient-to-r from-burgundy-100 to-gold-100 px-3 py-1 rounded-full border border-burgundy-200">
            <span className="text-sm font-bold text-burgundy">{currentIndex + 1}</span>
            <span className="text-xs text-black-500 mx-1">of</span>
            <span className="text-sm font-bold text-gold">{images.length}</span>
          </div>
        </div>
        <div className="h-3 bg-gradient-to-r from-gold-100 to-burgundy-100 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-r from-burgundy via-burgundy-600 to-gold shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-black-500">Getting to know you...</span>
          <span className="text-burgundy font-medium">{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative h-[600px] perspective-1000 overflow-hidden">
        {/* Background cards preview */}
        {hasMoreCards && images[currentIndex + 1] && (
          <div className="absolute inset-0 scale-95 opacity-40 translate-y-4">
            <img
              src={images[currentIndex + 1].url}
              alt="Next"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {currentImage && (
            <motion.div
              key={`card-${currentImage.id}-${currentIndex}`}
              className="absolute inset-0 cursor-grab active:cursor-grabbing will-change-transform"
              style={{
                x: dragX,
                y: dragY,
                rotateZ,
                scale,
                opacity
              }}
              drag={!isAnimating}
              dragConstraints={{ left: -400, right: 400, top: -30, bottom: 30 }}
              dragElastic={0.1}
              dragTransition={{ bounceStiffness: 300, bounceDamping: 25 }}
              dragMomentum={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 0.95 }}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }
              }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                y: 50,
                transition: { 
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
            >
            <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl bg-white border border-gold-200">
              {/* Product Image */}
              <img
                src={currentImage.url}
                alt={`Style ${currentIndex + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
              
              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-burgundy/10 to-transparent" />
              
              {/* Like Overlay */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                style={{ opacity: likeOpacity }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/50 via-green-500/40 to-gold-400/30" />
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    style={{ scale: likeOpacity }}
                    className="relative"
                  >
                    <Heart className="w-40 h-40 text-white fill-white drop-shadow-2xl" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                      <span className="text-4xl font-bold text-white drop-shadow-2xl font-serif tracking-wide">LOVE IT!</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Nope Overlay */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                style={{ opacity: nopeOpacity }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/50 via-rose-500/40 to-burgundy-400/30" />
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    style={{ scale: nopeOpacity }}
                    className="relative"
                  >
                    <X className="w-40 h-40 text-white drop-shadow-2xl stroke-[3]" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                      <span className="text-4xl font-bold text-white drop-shadow-2xl font-serif tracking-wide">PASS!</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {/* Category & Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gradient-to-r from-burgundy/80 to-gold/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold capitalize border border-white/20 shadow-lg">
                    {currentImage.category}
                  </span>
                  {currentImage.metadata?.tags?.map((tag, i) => (
                    <span key={i} className="bg-white/25 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Shop Product Button if linked */}
                {currentImage.metadata?.productId && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick?.(currentImage.metadata!.productId!);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-white to-gold-50 text-black px-5 py-3 rounded-full font-bold text-sm hover:from-gold-50 hover:to-white transition-all shadow-xl hover:shadow-2xl border border-gold-200 transform hover:scale-105"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop This Look
                  </motion.button>
                )}
              </div>
              
              {/* Enhanced Style Match Indicator */}
              {likedImages.some(img => img.category === currentImage.category) && (
                <motion.div 
                  className="absolute top-6 right-6 bg-gradient-to-r from-gold-500 to-burgundy-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl border border-white/20 backdrop-blur-sm"
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.3, duration: 0.6 }}
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-serif">Perfect Match</span>
                </motion.div>
              )}
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center items-center gap-6">
        {/* Enhanced Undo Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleUndo}
          disabled={currentIndex === 0}
          className={cn(
            "w-14 h-14 rounded-full bg-gradient-to-br from-white to-gold-50 shadow-xl border border-gold-200 flex items-center justify-center transition-all",
            currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl hover:border-gold-300"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-burgundy" />
        </motion.button>

        {/* Enhanced Dislike Button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: -10 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => handleSwipe('left', 0, true)}
          className="w-18 h-18 rounded-full bg-gradient-to-br from-white to-red-50 shadow-2xl border border-red-200 flex items-center justify-center hover:shadow-3xl transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 to-red-200/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <X className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform relative z-10 stroke-2" />
        </motion.button>

        {/* Premium Super Like Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            triggerHaptic([10, 30, 10, 30, 10]);
            handleSwipe('right', 1000, true);
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-burgundy-500 shadow-2xl border-2 border-white flex items-center justify-center hover:shadow-3xl transition-all relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold-300 to-burgundy-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Zap className="w-7 h-7 text-white relative z-10 drop-shadow-lg" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full opacity-80 animate-ping"></div>
        </motion.button>

        {/* Enhanced Like Button */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.85 }}
          onClick={() => handleSwipe('right', 0, true)}
          className="w-18 h-18 rounded-full bg-gradient-to-br from-white to-green-50 shadow-2xl border border-green-200 flex items-center justify-center hover:shadow-3xl transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-emerald-200/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Heart className="w-8 h-8 text-green-500 group-hover:scale-110 group-hover:fill-green-500 transition-all relative z-10" />
        </motion.button>

        {/* Enhanced Skip Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
          disabled={!hasMoreCards}
          className={cn(
            "w-14 h-14 rounded-full bg-gradient-to-br from-white to-gold-50 shadow-xl border border-gold-200 flex items-center justify-center transition-all",
            !hasMoreCards ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl hover:border-gold-300"
          )}
        >
          <ChevronRight className="w-6 h-6 text-burgundy" />
        </motion.button>
      </div>

      {/* Enhanced Tips */}
      <motion.div 
        className="mt-24 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-gold-50 to-burgundy-50 rounded-2xl p-6 border border-gold-200 shadow-lg max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 bg-burgundy rounded-full"></div>
            <span className="text-sm font-semibold text-black-700 tracking-wide">Style Guide</span>
            <div className="w-2 h-2 bg-gold rounded-full"></div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-black-600">
              <span className="font-bold text-green-600">→</span> Swipe right to add to favorites
            </p>
            <p className="text-black-600">
              <span className="font-bold text-red-500">←</span> Swipe left to pass
            </p>
            <p className="text-xs text-burgundy font-medium bg-gold-100 px-3 py-2 rounded-full inline-block mt-3">
              ⚡ Tap the golden lightning for instant love!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}