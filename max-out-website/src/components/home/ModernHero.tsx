'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function ModernHero() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollY: motionScrollY } = useScroll();
  
  // Parallax effects
  const imageY = useTransform(motionScrollY, [0, 1000], [0, -200]);
  const textY = useTransform(motionScrollY, [0, 500], [0, -100]);
  const textOpacity = useTransform(motionScrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Hero Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: imageY }}
      >
        <div className="w-full h-[110vh] relative">
          <Image
            src="https://images.unsplash.com/photo-1617365976015-e1aec0c5385d?w=1920&q=80"
            alt="KCT Menswear - Tailored Excellence"
            fill
            className="object-cover object-center"
            priority
            quality={95}
            unoptimized
          />
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>
      </motion.div>

      {/* Editorial Text Overlay */}
      <motion.div 
        className="relative z-10 flex items-end justify-start h-full"
        style={{ y: textY, opacity: textOpacity }}
      >
        <div className="container-main pb-24">
          <div className="max-w-2xl">
            {/* Minimal brand identifier */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="w-16 h-px bg-white mb-4" />
              <p className="text-white/90 text-sm font-light tracking-[0.2em] uppercase">
                Detroit's Premier Menswear
              </p>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-white mb-8 leading-[0.9] tracking-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
            >
              Tailored
              <span className="block font-normal italic">Excellence</span>
            </motion.h1>

            {/* Minimal CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            >
              <Link href="/collections">
                <Button 
                  size="lg" 
                  className="group bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-base font-light transition-all duration-500 backdrop-blur-sm"
                >
                  Explore Collection
                  <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollY < 100 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs tracking-[0.2em] uppercase font-light">Scroll</span>
          <div className="w-px h-8 bg-white/60" />
        </motion.div>
      </motion.div>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/20 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-white/30 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </section>
  );
}