'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Award, 
  Star,
  Timer,
  Eye,
  Flame,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bundle {
  id: string;
  name: string;
  description: string;
  totalPrice: number;
  originalPrice: number;
  savings: number;
  modelImage: string;
  slug: string;
  featured?: boolean;
  popularity?: number;
  aiScore?: number;
  rating?: number;
  limitedStock?: boolean;
  trending?: boolean;
  suit?: { name: string; image: string; };
  shirt?: { name: string; image: string; };
  tie?: { name: string; image: string; };
}

interface EnhancedDarkBundleCarouselProps {
  bundles: Bundle[];
  autoPlay?: boolean;
  showParticles?: boolean;
  autoPlayInterval?: number;
}

// Optimized floating particle component
const FloatingParticle = ({ index, color }: { index: number; color: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useSpring(0.1 + (index % 3) * 0.1);

  useEffect(() => {
    const initialX = Math.random() * 100;
    const initialY = Math.random() * 100;
    x.set(initialX);
    y.set(initialY);
    
    const interval = setInterval(() => {
      x.set(Math.random() * 100);
      y.set(Math.random() * 100);
    }, 3000 + index * 500);

    return () => clearInterval(interval);
  }, [x, y, index]);

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full blur-[0.5px] will-change-transform"
      style={{
        left: useTransform(x, [0, 100], ['10%', '90%']),
        top: useTransform(y, [0, 100], ['10%', '90%']),
        backgroundColor: color,
        opacity,
      }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{
        duration: 2 + index * 0.5,
        repeat: Infinity,
        delay: index * 0.3
      }}
    />
  );
};

// Improved glass morphism card with better performance
const GlassMorphCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "relative backdrop-blur-xl bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-800/60",
    "border border-gray-700/30 rounded-2xl shadow-2xl",
    "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-white/5",
    "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-transparent after:via-white/5 after:to-transparent",
    "will-change-transform",
    className
  )}>
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
);

export function EnhancedDarkBundleCarouselStable({ 
  bundles, 
  autoPlay = true, 
  showParticles = true,
  autoPlayInterval = 6000
}: EnhancedDarkBundleCarouselProps) {
  // Validate bundles prop
  if (!bundles || bundles.length === 0) {
    return (
      <div className="flex items-center justify-center h-[700px] bg-gray-900 rounded-3xl">
        <p className="text-gray-400">No bundles available</p>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [quickViewBundle, setQuickViewBundle] = useState<Bundle | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout>();
  const mouseRafId = useRef<number>();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check for mobile and touch devices
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Optimized mouse tracking for parallax effects
  useEffect(() => {
    if (isReducedMotion || isTouch) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRafId.current) cancelAnimationFrame(mouseRafId.current);
      
      mouseRafId.current = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMousePosition({
            x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
            y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
          });
        }
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        if (mouseRafId.current) cancelAnimationFrame(mouseRafId.current);
      };
    }
  }, [isReducedMotion, isTouch]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying || isReducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bundles.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, bundles.length, autoPlayInterval, isReducedMotion]);

  // Navigation handlers with improved timeout management
  const handleNavigation = useCallback((direction: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev - 1 + bundles.length) % bundles.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % bundles.length);
    }
    
    // Clear existing timeout
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    
    // Resume auto-play after user interaction
    if (autoPlay) {
      autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
    }
  }, [bundles.length, autoPlay]);

  const handlePrevious = () => handleNavigation('prev');
  const handleNext = () => handleNavigation('next');

  // Touch gesture handling for mobile
  const handleTouchStart = useRef<{ x: number; y: number } | null>(null);
  
  const handleSwipeStart = (e: React.TouchEvent) => {
    handleTouchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  
  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (!handleTouchStart.current) return;
    
    const deltaX = e.changedTouches[0].clientX - handleTouchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - handleTouchStart.current.y;
    
    // Check if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
    
    handleTouchStart.current = null;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  // Optimized card transform calculation
  const getCardTransform = useCallback((index: number, mouseX: number, mouseY: number) => {
    const diff = index - currentIndex;
    const totalCards = bundles.length;
    
    const adjustedDiff = diff > totalCards / 2 ? diff - totalCards : 
                        diff < -totalCards / 2 ? diff + totalCards : diff;
    
    // Reduced parallax for better performance
    const parallaxX = isReducedMotion ? 0 : (mouseX - 0.5) * 10;
    const parallaxY = isReducedMotion ? 0 : (mouseY - 0.5) * 5;

    const transforms = {
      0: { // Center card
        x: parallaxX,
        y: parallaxY * 0.5,
        scale: 1,
        z: 200,
        rotateY: isReducedMotion ? 0 : parallaxX * 0.5,
        rotateX: isReducedMotion ? 0 : -parallaxY * 0.3,
        opacity: 1,
        blur: 0,
      },
      1: { // Adjacent cards
        x: adjustedDiff * (isMobile ? 280 : 320) + parallaxX * 0.5,
        y: parallaxY * 0.3,
        scale: isMobile ? 0.8 : 0.85,
        z: 100,
        rotateY: isReducedMotion ? 0 : adjustedDiff * -20 + parallaxX * 0.3,
        rotateX: isReducedMotion ? 0 : -parallaxY * 0.2,
        opacity: 0.8,
        blur: 1,
      },
      2: { // Outer cards
        x: adjustedDiff * (isMobile ? 200 : 240) + parallaxX * 0.3,
        y: parallaxY * 0.2,
        scale: 0.7,
        z: 50,
        rotateY: isReducedMotion ? 0 : adjustedDiff * -35 + parallaxX * 0.2,
        rotateX: isReducedMotion ? 0 : -parallaxY * 0.15,
        opacity: isMobile ? 0 : 0.4,
        blur: 3,
      }
    };

    const absAdjustedDiff = Math.abs(adjustedDiff);
    
    if (absAdjustedDiff === 0) return transforms[0];
    if (absAdjustedDiff === 1) return transforms[1];
    if (absAdjustedDiff === 2) return transforms[2];
    
    // Hidden cards
    return {
      x: adjustedDiff * 180,
      y: 0,
      scale: 0.6,
      z: 0,
      rotateY: isReducedMotion ? 0 : adjustedDiff * -45,
      rotateX: 0,
      opacity: 0,
      blur: 8,
    };
  }, [currentIndex, bundles.length, isReducedMotion, isMobile]);

  const currentBundle = bundles[currentIndex];

  // Error boundary for image loading
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-bundle.jpg'; // Fallback image
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[700px] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden rounded-3xl"
      onTouchStart={handleSwipeStart}
      onTouchEnd={handleSwipeEnd}
      role="region"
      aria-label="Bundle carousel"
      aria-live="polite"
    >
      {/* Ambient particle system (optimized for performance) */}
      {showParticles && !isReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {Array.from({ length: isMobile ? 8 : 15 }).map((_, i) => (
            <FloatingParticle 
              key={i} 
              index={i} 
              color={i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#8B0000' : '#4B5563'} 
            />
          ))}
        </div>
      )}

      {/* Dynamic gradient background */}
      {!isReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-3xl opacity-20"
            animate={{
              background: currentBundle?.featured 
                ? 'radial-gradient(circle, #D4AF37, #8B0000, transparent)'
                : 'radial-gradient(circle, #8B0000, #4B5563, transparent)',
            }}
            transition={{ duration: 2 }}
          />
        </div>
      )}

      {/* Main carousel container */}
      <div className="relative h-[700px] flex items-center justify-center" style={{ perspective: isReducedMotion ? 'none' : '2000px' }}>
        
        {/* Featured badge */}
        <AnimatePresence>
          {currentBundle?.featured && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="absolute top-12 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full blur-lg opacity-70" />
                <div className="relative flex items-center gap-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-6 py-3 rounded-full shadow-2xl border border-yellow-300">
                  <Crown className="w-5 h-5" />
                  <span className="font-bold text-sm uppercase tracking-wider">Bundle of the Week</span>
                  <Crown className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bundle cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          {bundles.map((bundle, index) => {
            const transform = getCardTransform(index, mousePosition.x, mousePosition.y);
            const isCurrent = index === currentIndex;
            const isHovered = hoveredCard === bundle.id;

            return (
              <motion.div
                key={bundle.id}
                className="absolute w-[340px] h-[500px] cursor-pointer"
                style={{
                  x: transform.x,
                  y: transform.y,
                  z: transform.z,
                  scale: transform.scale,
                  rotateY: transform.rotateY,
                  rotateX: transform.rotateX,
                  opacity: transform.opacity,
                  filter: transform.blur > 0 ? `blur(${transform.blur}px)` : 'none',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  x: transform.x,
                  y: transform.y,
                  scale: transform.scale,
                  rotateY: transform.rotateY,
                  rotateX: transform.rotateX,
                  opacity: transform.opacity,
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  mass: 1
                }}
                onMouseEnter={() => !isTouch && setHoveredCard(bundle.id)}
                onMouseLeave={() => !isTouch && setHoveredCard(null)}
                onClick={() => isCurrent && setQuickViewBundle(bundle)}
              >
                <GlassMorphCard className="w-full h-full overflow-hidden">
                  {/* Image section */}
                  <div className="relative h-[60%] overflow-hidden">
                    <Image
                      src={bundle.modelImage}
                      alt={bundle.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 340px, 340px"
                      priority={isCurrent}
                      onError={handleImageError}
                    />
                    
                    {/* Badges overlay */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {bundle.trending && (
                        <div className="flex items-center gap-1 bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                          <Flame className="w-3 h-3" />
                          TRENDING
                        </div>
                      )}
                      
                      {bundle.limitedStock && (
                        <div className="flex items-center gap-1 bg-orange-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                          <Timer className="w-3 h-3" />
                          LIMITED
                        </div>
                      )}
                      
                      {bundle.aiScore && bundle.aiScore > 90 && (
                        <div className="flex items-center gap-1 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                          <Award className="w-3 h-3" />
                          AI PICK
                        </div>
                      )}
                    </div>

                    {/* Popularity indicator */}
                    {bundle.popularity && (
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1 text-white">
                          <Eye className="w-3 h-3" />
                          <span className="text-xs font-medium">{bundle.popularity}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content section */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900/95 via-gray-800/90 to-transparent backdrop-blur-sm">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-serif font-bold text-white mb-1">{bundle.name}</h3>
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {bundle.description}
                          </p>
                        </div>
                        
                        {bundle.rating && (
                          <div className="flex items-center gap-1 ml-3">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="text-sm text-amber-400 font-medium">{bundle.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-amber-400">${bundle.totalPrice}</div>
                          <div className="text-sm text-gray-400 line-through">${bundle.originalPrice}</div>
                        </div>
                        
                        {isCurrent && (
                          <Link href={`/bundles/${bundle.slug}`}>
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold"
                            >
                              View Bundle
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </div>

                      {/* Savings badge */}
                      <div className="absolute -top-4 left-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        Save ${bundle.savings}
                      </div>
                    </div>
                  </div>
                </GlassMorphCard>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-8 z-40 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Previous bundle"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-8 z-40 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Next bundle"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Carousel indicators */}
      <div className="flex justify-center gap-3 mt-8 pb-8" role="tablist">
        {bundles.map((bundle, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
              if (autoPlayTimeoutRef.current) {
                clearTimeout(autoPlayTimeoutRef.current);
              }
              if (autoPlay) {
                autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
              }
            }}
            className={cn(
              "relative overflow-hidden rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900",
              index === currentIndex
                ? "w-12 h-3 bg-gradient-to-r from-amber-500 to-yellow-500"
                : "w-3 h-3 bg-gray-600 hover:bg-gray-500"
            )}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to ${bundle.name}`}
          >
            {/* Auto-play progress indicator */}
            {index === currentIndex && isAutoPlaying && !isReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/60 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}