'use client';

import { useState, useEffect, useRef } from 'react';
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
}

// Floating particle component for ambient animations
const FloatingParticle = ({ index, color }: { index: number; color: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useSpring(0.1 + (index % 3) * 0.1);

  useEffect(() => {
    const controls = x.set(Math.random() * 100);
    const yControls = y.set(Math.random() * 100);
    
    const interval = setInterval(() => {
      x.set(Math.random() * 100);
      y.set(Math.random() * 100);
    }, 3000 + index * 500);

    return () => clearInterval(interval);
  }, [x, y, index]);

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full blur-[0.5px]"
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

// Glass morphism card component
const GlassMorphCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "relative backdrop-blur-xl bg-gradient-to-br from-gray-800/60 via-gray-900/40 to-gray-800/60",
    "border border-gray-700/30 rounded-2xl shadow-2xl",
    "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-white/5",
    "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-transparent after:via-white/5 after:to-transparent",
    className
  )}>
    <div className="relative z-10 h-full">
      {children}
    </div>
  </div>
);

export function EnhancedDarkBundleCarousel({ 
  bundles, 
  autoPlay = true, 
  showParticles = true 
}: EnhancedDarkBundleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [quickViewBundle, setQuickViewBundle] = useState<Bundle | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
        }
      };
    }
  }, []);

  // Auto-rotate carousel with momentum
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bundles.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, bundles.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + bundles.length) % bundles.length);
    setTimeout(() => setIsAutoPlaying(autoPlay), 10000);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % bundles.length);
    setTimeout(() => setIsAutoPlaying(autoPlay), 10000);
  };

  // Enhanced card transform with 3D perspective and parallax
  const getCardTransform = (index: number, mouseX: number, mouseY: number) => {
    const diff = index - currentIndex;
    const totalCards = bundles.length;
    
    const adjustedDiff = diff > totalCards / 2 ? diff - totalCards : 
                        diff < -totalCards / 2 ? diff + totalCards : diff;
    
    // Parallax effect based on mouse position
    const parallaxX = (mouseX - 0.5) * 20;
    const parallaxY = (mouseY - 0.5) * 10;

    if (adjustedDiff === 0) {
      // Center card with subtle parallax
      return {
        x: parallaxX,
        y: parallaxY * 0.5,
        scale: 1,
        z: 200,
        rotateY: parallaxX * 0.5,
        rotateX: -parallaxY * 0.3,
        opacity: 1,
        blur: 0,
      };
    } else if (Math.abs(adjustedDiff) === 1) {
      // Adjacent cards
      return {
        x: adjustedDiff * 320 + parallaxX * 0.5,
        y: parallaxY * 0.3,
        scale: 0.85,
        z: 100,
        rotateY: adjustedDiff * -20 + parallaxX * 0.3,
        rotateX: -parallaxY * 0.2,
        opacity: 0.8,
        blur: 1,
      };
    } else if (Math.abs(adjustedDiff) === 2) {
      // Outer cards
      return {
        x: adjustedDiff * 240 + parallaxX * 0.3,
        y: parallaxY * 0.2,
        scale: 0.7,
        z: 50,
        rotateY: adjustedDiff * -35 + parallaxX * 0.2,
        rotateX: -parallaxY * 0.15,
        opacity: 0.4,
        blur: 3,
      };
    } else {
      // Hidden cards
      return {
        x: adjustedDiff * 180,
        y: 0,
        scale: 0.6,
        z: 0,
        rotateY: adjustedDiff * -45,
        rotateX: 0,
        opacity: 0,
        blur: 8,
      };
    }
  };

  const currentBundle = bundles[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[700px] bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden rounded-3xl"
    >
      {/* Ambient particle system */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <FloatingParticle 
              key={i} 
              index={i} 
              color={i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#8B0000' : '#4B5563'} 
            />
          ))}
        </div>
      )}

      {/* Dynamic gradient background based on current bundle */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full blur-3xl opacity-20"
          animate={{
            background: currentBundle?.featured 
              ? 'radial-gradient(circle, #D4AF37, #8B0000, transparent)'
              : 'radial-gradient(circle, #8B0000, #4B5563, transparent)',
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Pulsing accent lights */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-2xl"
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-radial from-red-800/10 to-transparent rounded-full blur-2xl"
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main carousel container with perspective */}
      <div className="relative h-[700px] flex items-center justify-center" style={{ perspective: '2000px' }}>
        
        {/* Floating badge for featured bundle */}
        <AnimatePresence>
          {currentBundle?.featured && (
            <motion.div
              initial={{ opacity: 0, y: -40, rotate: -5 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotate: 0,
                x: [0, 10, 0, -10, 0]
              }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ 
                duration: 0.8,
                x: { repeat: Infinity, duration: 4 }
              }}
              className="absolute top-12 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full blur-lg opacity-70 animate-pulse" />
                <div className="relative flex items-center gap-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-6 py-3 rounded-full shadow-2xl border border-yellow-300">
                  <Crown className="w-5 h-5" />
                  <span className="text-sm font-bold tracking-wider">BUNDLE OF THE WEEK</span>
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards with enhanced 3D transforms */}
        <div className="relative w-full h-full flex items-center justify-center">
          {bundles.map((bundle, index) => {
            const transform = getCardTransform(index, mousePosition.x, mousePosition.y);
            const isCurrent = index === currentIndex;
            const isHovered = hoveredCard === bundle.id;

            return (
              <motion.div
                key={bundle.id}
                className="absolute w-[360px] h-[540px] cursor-pointer"
                animate={{
                  x: transform.x,
                  y: transform.y,
                  scale: transform.scale,
                  z: transform.z,
                  rotateY: transform.rotateY,
                  rotateX: transform.rotateX,
                  opacity: transform.opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  filter: transform.blur ? `blur(${transform.blur}px)` : 'none',
                }}
                onMouseEnter={() => {
                  setIsAutoPlaying(false);
                  setHoveredCard(bundle.id);
                }}
                onMouseLeave={() => {
                  setIsAutoPlaying(autoPlay);
                  setHoveredCard(null);
                }}
                onClick={() => isCurrent && setQuickViewBundle(bundle)}
              >
                <GlassMorphCard className={cn(
                  "h-full overflow-hidden transition-all duration-500",
                  isCurrent && "ring-2 ring-amber-500/50 ring-offset-4 ring-offset-gray-900",
                  isHovered && "ring-2 ring-amber-400/70"
                )}>
                  
                  {/* Trending/Stock indicators */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    {bundle.trending && (
                      <motion.div 
                        className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Flame className="w-3 h-3" />
                        HOT
                      </motion.div>
                    )}
                    
                    {bundle.limitedStock && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        <Timer className="w-3 h-3" />
                        LIMITED
                      </div>
                    )}

                    {bundle.popularity && bundle.popularity > 90 && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        <Eye className="w-3 h-3" />
                        {bundle.popularity}%
                      </div>
                    )}
                  </div>

                  {/* Main image with enhanced hover effects */}
                  <div className="relative h-[65%] overflow-hidden">
                    <Image
                      src={bundle.modelImage}
                      alt={bundle.name}
                      fill
                      className={cn(
                        "object-cover object-top transition-all duration-700",
                        isHovered ? "scale-110" : "scale-105"
                      )}
                      sizes="360px"
                      priority={isCurrent}
                    />
                    
                    {/* Dynamic gradient overlay */}
                    <div className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      isHovered 
                        ? "bg-gradient-to-t from-black/80 via-black/20 to-transparent" 
                        : "bg-gradient-to-t from-black/60 via-transparent to-transparent"
                    )} />

                    {/* Quick view on hover */}
                    <AnimatePresence>
                      {isHovered && bundle.suit && bundle.shirt && bundle.tie && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute inset-x-4 bottom-4 bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50"
                        >
                          <p className="text-white text-xs font-medium mb-2">Bundle includes:</p>
                          <div className="flex gap-2">
                            <div className="flex-1 text-center">
                              <div className="w-8 h-8 mx-auto mb-1 rounded overflow-hidden">
                                <Image src={bundle.suit.image} alt="" width={32} height={32} className="object-cover" />
                              </div>
                              <p className="text-[10px] text-gray-300">{bundle.suit.name}</p>
                            </div>
                            <div className="flex-1 text-center">
                              <div className="w-8 h-8 mx-auto mb-1 rounded overflow-hidden">
                                <Image src={bundle.shirt.image} alt="" width={32} height={32} className="object-cover" />
                              </div>
                              <p className="text-[10px] text-gray-300">{bundle.shirt.name}</p>
                            </div>
                            <div className="flex-1 text-center">
                              <div className="w-8 h-8 mx-auto mb-1 rounded overflow-hidden">
                                <Image src={bundle.tie.image} alt="" width={32} height={32} className="object-cover" />
                              </div>
                              <p className="text-[10px] text-gray-300">{bundle.tie.name}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content section with glass morphism */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900/95 via-gray-800/90 to-transparent backdrop-blur-sm">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-serif font-bold text-white mb-1">{bundle.name}</h3>
                          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
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
                        
                        <AnimatePresence>
                          {isCurrent && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Link href={`/bundles/${bundle.slug}`}>
                                <Button 
                                  size="sm" 
                                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                  View Bundle
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Animated savings badge */}
                      <motion.div 
                        className="absolute -top-4 left-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Save ${bundle.savings}
                      </motion.div>
                    </div>
                  </div>
                </GlassMorphCard>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced navigation buttons with glass morphism */}
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          className="absolute left-8 z-40 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl hover:bg-white/20 transition-all duration-300"
          aria-label="Previous bundle"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="absolute right-8 z-40 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl hover:bg-white/20 transition-all duration-300"
          aria-label="Next bundle"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Enhanced dots indicator with progress bars */}
      <div className="flex justify-center gap-3 mt-8 pb-8">
        {bundles.map((bundle, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
              setTimeout(() => setIsAutoPlaying(autoPlay), 10000);
            }}
            className={cn(
              "relative overflow-hidden rounded-full transition-all duration-500",
              index === currentIndex
                ? "w-12 h-3 bg-gradient-to-r from-amber-500 to-yellow-500"
                : "w-3 h-3 bg-gray-600 hover:bg-gray-500"
            )}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to bundle ${index + 1}: ${bundle.name}`}
          >
            {/* Auto-play progress indicator */}
            {index === currentIndex && isAutoPlaying && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/60 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Quick view modal overlay */}
      <AnimatePresence>
        {quickViewBundle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setQuickViewBundle(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{quickViewBundle.name}</h3>
                <p className="text-gray-300 mb-4">{quickViewBundle.description}</p>
                <div className="flex justify-center gap-4 mb-6">
                  <Link href={`/bundles/${quickViewBundle.slug}`}>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300"
                    onClick={() => setQuickViewBundle(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}