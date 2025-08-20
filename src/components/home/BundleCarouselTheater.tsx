'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Award } from 'lucide-react';
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
}

interface BundleCarouselTheaterProps {
  bundles: Bundle[];
}

export function BundleCarouselTheater({ bundles }: BundleCarouselTheaterProps) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bundles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, bundles.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + bundles.length) % bundles.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % bundles.length);
  };

  const getCardTransform = (index: number) => {
    const diff = index - currentIndex;
    const totalCards = bundles.length;
    
    // Handle wrapping
    const adjustedDiff = diff > totalCards / 2 ? diff - totalCards : 
                        diff < -totalCards / 2 ? diff + totalCards : diff;
    
    if (adjustedDiff === 0) {
      // Center card
      return {
        x: 0,
        scale: 1,
        z: 100,
        rotateY: 0,
        opacity: 1,
        blur: 0,
      };
    } else if (Math.abs(adjustedDiff) === 1) {
      // Adjacent cards
      return {
        x: adjustedDiff * 280,
        scale: 0.85,
        z: 50,
        rotateY: adjustedDiff * -15,
        opacity: 0.9,
        blur: 0,
      };
    } else if (Math.abs(adjustedDiff) === 2) {
      // Outer cards
      return {
        x: adjustedDiff * 220,
        scale: 0.7,
        z: 0,
        rotateY: adjustedDiff * -25,
        opacity: 0.5,
        blur: 2,
      };
    } else {
      // Hidden cards
      return {
        x: adjustedDiff * 180,
        scale: 0.6,
        z: -50,
        rotateY: adjustedDiff * -30,
        opacity: 0,
        blur: 4,
      };
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-burgundy/10 via-burgundy/5 to-transparent blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-radial from-gold/10 via-gold/5 to-transparent blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Main carousel container */}
      <div className="relative h-[600px] flex items-center justify-center perspective-1000">
        {/* Bundle of the Week Badge */}
        {bundles[currentIndex]?.featured && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 bg-gradient-to-r from-gold to-amber-400 text-black px-4 py-2 rounded-full shadow-lg">
              <Award className="w-4 h-4" />
              <span className="text-sm font-bold">Bundle of the Week</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </motion.div>
        )}

        {/* Cards */}
        <div className="relative w-full h-full flex items-center justify-center">
          {bundles.map((bundle, index) => {
            const transform = getCardTransform(index);
            const isCurrent = index === currentIndex;

            return (
              <motion.div
                key={bundle.id}
                className="absolute w-[320px] h-[480px]"
                animate={{
                  x: transform.x,
                  scale: transform.scale,
                  z: transform.z,
                  rotateY: transform.rotateY,
                  opacity: transform.opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  filter: transform.blur ? `blur(${transform.blur}px)` : 'none',
                }}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <Link href={`/bundles/${bundle.slug}`}>
                  <div className={cn(
                    "relative h-full bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-500",
                    isCurrent && "ring-2 ring-burgundy ring-offset-4"
                  )}>
                    {/* Popularity indicator */}
                    {bundle.popularity && bundle.popularity > 80 && (
                      <div className="absolute top-4 right-4 z-20 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        🔥 Trending
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-[65%] overflow-hidden">
                      <Image
                        src={bundle.modelImage}
                        alt={bundle.name}
                        fill
                        className="object-cover object-top transition-transform duration-700 hover:scale-105"
                        sizes="320px"
                        priority={isCurrent}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white">
                      <h3 className="text-xl font-serif font-bold mb-2">{bundle.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bundle.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-burgundy">${bundle.totalPrice}</div>
                          <div className="text-sm text-gray-500 line-through">${bundle.originalPrice}</div>
                        </div>
                        
                        {isCurrent && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Button size="sm" className="bg-burgundy hover:bg-burgundy-700">
                              View Bundle
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </motion.div>
                        )}
                      </div>

                      {/* Savings badge */}
                      <div className="absolute -top-3 left-6 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Save ${bundle.savings}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-8 z-40 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
          aria-label="Previous bundle"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-8 z-40 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
          aria-label="Next bundle"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {bundles.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-8 bg-burgundy"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            aria-label={`Go to bundle ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}