'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Camera } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Style options that will auto-swipe
const styleOptions = [
  {
    id: 1,
    title: 'Classic Gentleman',
    image: '/Swiper-v1/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.webp',
    match: 95,
    description: 'Timeless elegance for formal occasions',
    color: '#000000'
  },
  {
    id: 2,
    title: 'Modern Professional',
    image: '/Swiper-v1/Season-1-bundles/navy-suit-white-burgunndy.webp',
    match: 92,
    description: 'Sharp and sophisticated for the office',
    color: '#000080'
  },
  {
    id: 3,
    title: 'Wedding Guest',
    image: '/Swiper-v1/Fall Wedding Bundles/burgundy-suit-white-shirt-mustard-tie.webp',
    match: 88,
    description: 'Stand out at special celebrations',
    color: '#800020'
  },
  {
    id: 4,
    title: 'Cocktail Hour',
    image: '/Swiper-v1/Season-1-bundles/dark-grey-white-silver.webp',
    match: 90,
    description: 'Refined style for evening events',
    color: '#36454F'
  },
  {
    id: 5,
    title: 'Garden Party',
    image: '/Swiper-v1/Summer Wedding Bundles/light-grey-suit-white-shirt-sage-dusty-pink-tie.webp',
    match: 85,
    description: 'Light and fresh for outdoor occasions',
    color: '#D3D3D3'
  }
];

export default function StyleSwipeHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  // Auto-swipe functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % styleOptions.length);
    }, 3500); // Change every 3.5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % styleOptions.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + styleOptions.length) % styleOptions.length);
  };

  const currentStyle = styleOptions[currentIndex];
  
  // Handle touch/drag swipe
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold) {
      handlePrev();
    } else if (info.offset.x < -threshold) {
      handleNext();
    }
  };

  // Swipe animation variants
  const swipeVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)`,
        }} />
      </div>

      <div className="container-main relative px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="relative z-10 px-4 lg:px-0">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-gold" />
              <span className="text-gold font-medium tracking-wide uppercase text-xs md:text-sm">
                Atelier AI
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-2">
              Discover Your
            </h2>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-4 md:mb-6">
              <span className="text-gold">Signature Style</span>
            </h2>
            
            <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
              Take our interactive style quiz and let our AI-powered system
              curate the perfect wardrobe for your unique taste and lifestyle.
              Swipe through styles, get personalized recommendations, and
              build complete outfits with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link 
                href="/style-quiz"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-burgundy text-white font-semibold rounded-lg hover:bg-burgundy-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Start Stylin' Profilin'
                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={() => {/* Visual search handler */}}
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold hover:text-black transition-all duration-300 text-sm sm:text-base"
              >
                <Camera className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Visual Search
              </button>
            </div>

            {/* Style Indicators */}
            <div className="flex items-center gap-2 mt-8">
              {styleOptions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-8 bg-burgundy' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to style ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Image Carousel */}
          <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] mt-8 lg:mt-0">
            {/* Navigation Buttons - Hidden on mobile for cleaner look */}
            <button
              onClick={handlePrev}
              className="hidden sm:block absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Previous style"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            
            <button
              onClick={handleNext}
              className="hidden sm:block absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Next style"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Swipeable Image Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={swipeVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.4 }
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  {/* Background with style color */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundColor: currentStyle.color }}
                  />
                  
                  {/* Product Image */}
                  <Image
                    src={currentStyle.image}
                    alt={currentStyle.title}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Match Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-xl"
                  >
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-black">
                        {currentStyle.match}%
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5 sm:mt-1">Match</div>
                    </div>
                    <div className="hidden sm:block text-xs text-gray-500 mt-2 max-w-[120px]">
                      Find your perfect style with AI recommendations
                    </div>
                  </motion.div>

                  {/* Style Info */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white max-w-[60%] sm:max-w-none"
                  >
                    <h3 className="text-xl sm:text-2xl font-semibold mb-0.5 sm:mb-1">
                      {currentStyle.title}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-90">
                      {currentStyle.description}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Swipe Hint Animation - Show on mobile only initially */}
            {isAutoPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="sm:hidden absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none"
              >
                <motion.div
                  animate={{ x: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg"
                >
                  <span className="text-xs font-medium">← Swipe →</span>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}