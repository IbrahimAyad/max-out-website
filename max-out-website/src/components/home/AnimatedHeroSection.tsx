'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { OptimizedBanner } from '@/components/ui/OptimizedBanner';

export default function AnimatedHeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax effect for the image
  const imageY = useTransform(scrollY, [0, 300], [0, -50]);
  const imageScale = useTransform(scrollY, [0, 300], [1.05, 1.15]);
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Animated Background Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ 
          y: imageY,
          scale: imageScale
        }}
      >
        <div className="w-full h-full relative">
          {/* Mobile-optimized image with Ken Burns effect */}
          {isMobile ? (
            <motion.div
              className="w-full h-full"
              animate={{
                scale: [1, 1.03, 1.01, 1],
                x: [0, -5, 2, 0],
                y: [0, -5, 2, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <OptimizedBanner 
                alt="KCT Menswear Premium Collection"
                className="w-full h-full"
                priority={true}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full scale-105 transition-transform duration-700 hover:scale-100">
              <OptimizedBanner 
                alt="KCT Menswear Premium Collection"
                className="w-full h-full"
                priority={true}
              />
            </div>
          )}
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 md:from-black/50 md:via-black/20 md:to-black/50" />
          
          {/* Mobile-specific gradient for better text readability */}
          {isMobile && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          )}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-5xl mx-auto">
          {/* Tagline */}
          <motion.div 
            className="space-y-2 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="h-px w-24 bg-gold mx-auto"></div>
            <p className="text-gold text-xs md:text-sm tracking-[0.3em] uppercase font-light">
              Excellence in Every Stitch
            </p>
            <div className="h-px w-24 bg-gold mx-auto"></div>
          </motion.div>

          {/* Main Title with staggered animation */}
          <div className="overflow-hidden">
            <motion.h1 
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-6 tracking-tight leading-[0.9]"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <span className="block">Elevate Your</span>
              <motion.span 
                className="block text-gold"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                Style
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 font-light max-w-3xl mx-auto leading-relaxed text-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Premium men's formal wear crafted with uncompromising attention to detail
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="/collections">
              <Button 
                size="lg" 
                className="group bg-burgundy hover:bg-burgundy-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
            
            <Link href="/style-swiper-r2">
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-gold to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-gold/25 transition-all duration-300 transform hover:scale-105 border-2 border-gold hover:border-gold-700 w-full sm:w-auto"
              >
                <div className="relative z-10 flex items-center justify-center">
                  Atelier AI
                  <Sparkles className="ml-2 h-5 w-5 text-black group-hover:animate-pulse" />
                </div>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div 
            className="w-px h-12 bg-white/50"
            animate={{ scaleY: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Mobile-specific floating elements for visual interest */}
      {isMobile && (
        <>
          <motion.div
            className="absolute top-20 right-4 w-20 h-20 bg-gold/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-32 left-4 w-16 h-16 bg-burgundy/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </>
      )}
    </section>
  );
}