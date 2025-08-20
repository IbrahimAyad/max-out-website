'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { bundleProductsWithImages } from '@/lib/products/bundleProductsWithImages';

const featuredBundles = bundleProductsWithImages.bundles.filter(b => b.trending).slice(0, 3);

export default function BundleHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredBundles.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredBundles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredBundles.length) % featuredBundles.length);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-navy-900 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">AI-Curated Style Collections</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Perfectly Curated.
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Professionally Styled.
                </span>
                <br />
                Personally Yours.
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-300 max-w-lg">
                Discover our expertly matched suit, shirt, and tie combinations. 
                Each bundle is crafted to make you look your absolute best, 
                with savings up to 15% off individual prices.
              </p>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-3xl font-bold text-yellow-400">66</p>
                  <p className="text-sm text-gray-400">Curated Styles</p>
                </div>
                <div className="w-px h-12 bg-gray-700" />
                <div>
                  <p className="text-3xl font-bold text-yellow-400">15%</p>
                  <p className="text-sm text-gray-400">Bundle Savings</p>
                </div>
                <div className="w-px h-12 bg-gray-700" />
                <div>
                  <p className="text-3xl font-bold text-yellow-400">95%</p>
                  <p className="text-sm text-gray-400">Style Match</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#bundles"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-lg font-semibold hover:from-yellow-500 hover:to-amber-600 transition-all transform hover:scale-105"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Shop Bundles
                </a>
                <Link
                  href="/custom-suits"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all"
                >
                  Create Your Own
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right: Featured Bundle Carousel */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={featuredBundles[currentIndex].imageUrl}
                    alt={featuredBundles[currentIndex].name}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Bundle Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-yellow-400">
                        Featured Bundle
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {featuredBundles[currentIndex].name}
                    </h3>
                    <p className="text-gray-300 mb-4 text-sm">
                      {featuredBundles[currentIndex].suit.color} • 
                      {featuredBundles[currentIndex].shirt.color} • 
                      {featuredBundles[currentIndex].tie?.color || 'Pocket Square'}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">
                        ${featuredBundles[currentIndex].bundlePrice}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        ${featuredBundles[currentIndex].originalPrice}
                      </span>
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Save ${featuredBundles[currentIndex].savings}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Previous bundle"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Next bundle"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {featuredBundles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'w-8 bg-white' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to bundle ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll anchor */}
      <div id="bundles" className="absolute bottom-0" />
    </div>
  );
}