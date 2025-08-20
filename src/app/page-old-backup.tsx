"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ShoppingBag, Sparkles, TrendingUp, Package, Zap, Brain, Check } from "lucide-react";
import Link from "next/link";
import { ModernBundleCard } from "@/components/home/ModernBundleCard";
import { BuildYourLookShowcase } from "@/components/home/BuildYourLookShowcase";
import HomeCollectionGrid from "@/components/home/HomeCollectionGrid";
import { EnhancedDarkBundleCarousel } from "@/components/home/EnhancedDarkBundleCarousel";
import TrustIndicators from "@/components/home/TrustIndicators";
import TrendingNowSection from "@/components/home/TrendingNowSection";
import AnimatedHeroSection from "@/components/home/AnimatedHeroSection";
import { VelocityGrid } from "@/components/home/VelocityGrid";
import { InteractiveStyleEnvironments } from "@/components/home/InteractiveStyleEnvironments";
import { ServiceJourneyVisualization } from "@/components/home/ServiceJourneyVisualization";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced bundle data with all premium properties for dark mode carousel
const featuredBundles = [
  {
    id: 'bundle-1',
    name: 'Executive Power Bundle',
    description: 'Navy suit, white shirt, burgundy tie - perfect for boardroom dominance and client meetings',
    totalPrice: 229.99,
    originalPrice: 269.99,
    savings: 40,
    suit: {
      name: 'Navy Suit',
      image: 'https://cdn.kctmenswear.com/products/suits/navy/main.png'
    },
    shirt: {
      name: 'White Shirt',
      image: 'https://cdn.kctmenswear.com/products/shirts/white/main.png'
    },
    tie: {
      name: 'Burgundy Tie',
      image: 'https://cdn.kctmenswear.com/products/ties/burgundy/main.png'
    },
    modelImage: 'https://cdn.kctmenswear.com/products/bundles/executive-power/model.png',
    slug: 'executive-power',
    featured: true,
    popularity: 95,
    rating: 4.9,
    trending: true,
    aiScore: 98
  },
  {
    id: 'bundle-2',
    name: 'Wedding Classic Bundle',
    description: 'Charcoal suit, light blue shirt, silver tie - timeless wedding elegance',
    totalPrice: 249.99,
    originalPrice: 299.99,
    savings: 50,
    suit: {
      name: 'Charcoal Suit',
      image: 'https://cdn.kctmenswear.com/products/suits/charcoal/main.png'
    },
    shirt: {
      name: 'Light Blue Shirt',
      image: 'https://cdn.kctmenswear.com/products/shirts/light-blue/main.png'
    },
    tie: {
      name: 'Silver Tie',
      image: 'https://cdn.kctmenswear.com/products/ties/silver/main.png'
    },
    modelImage: 'https://cdn.kctmenswear.com/products/bundles/wedding-classic/model.png',
    slug: 'wedding-classic',
    popularity: 88,
    rating: 4.8,
    limitedStock: true
  },
  {
    id: 'bundle-3',
    name: 'Power Player Premium',
    description: 'Navy 3-piece suit, white shirt, red tie - command the room with executive presence',
    totalPrice: 249.99,
    originalPrice: 299.99,
    savings: 50,
    suit: {
      name: 'Navy 3-Piece Suit',
      image: 'https://cdn.kctmenswear.com/products/suits/navy-3piece/main.png'
    },
    shirt: {
      name: 'White Shirt',
      image: 'https://cdn.kctmenswear.com/products/shirts/white/main.png'
    },
    tie: {
      name: 'Red Tie',
      image: 'https://cdn.kctmenswear.com/products/ties/red/main.png'
    },
    modelImage: 'https://cdn.kctmenswear.com/products/bundles/power-player/model.png',
    slug: 'power-player',
    popularity: 92,
    rating: 4.7,
    trending: true,
    aiScore: 94
  },
  {
    id: 'bundle-4',
    name: 'Triple Black Signature',
    description: 'Black suit, black shirt, black tie - bold fashion statement for evening events',
    totalPrice: 229.99,
    originalPrice: 269.99,
    savings: 40,
    suit: {
      name: 'Black Suit',
      image: 'https://cdn.kctmenswear.com/products/suits/black/main.png'
    },
    shirt: {
      name: 'Black Shirt',
      image: 'https://cdn.kctmenswear.com/products/shirts/black/main.png'
    },
    tie: {
      name: 'Black Tie',
      image: 'https://cdn.kctmenswear.com/products/ties/black/main.png'
    },
    modelImage: 'https://cdn.kctmenswear.com/products/bundles/triple-black/model.png',
    slug: 'triple-black',
    popularity: 90,
    rating: 4.6,
    aiScore: 95
  },
  {
    id: 'bundle-5',
    name: 'Rose Gold Elegance',
    description: 'Light grey suit, pink shirt, navy tie - modern sophistication meets classic style',
    totalPrice: 219.99,
    originalPrice: 259.99,
    savings: 40,
    suit: {
      name: 'Light Grey Suit',
      image: 'https://cdn.kctmenswear.com/products/suits/light-grey/main.png'
    },
    shirt: {
      name: 'Pink Shirt',
      image: 'https://cdn.kctmenswear.com/products/shirts/pink/main.png'
    },
    tie: {
      name: 'Navy Tie',
      image: 'https://cdn.kctmenswear.com/products/ties/navy/main.png'
    },
    modelImage: 'https://cdn.kctmenswear.com/products/bundles/rose-gold/model.png',
    slug: 'rose-gold-elegance',
    popularity: 85,
    rating: 4.8,
    trending: true,
    limitedStock: true
  }
];

// Trending products with actual KCT product images - enhanced with metrics
const trendingProducts = [
  { id: 1, name: 'Navy 2-Piece Suit', category: 'Suits', price: 189, image: 'https://cdn.kctmenswear.com/products/suits/navy/main.png', trending: 'up' as const, hotness: 92, recentlyViewed: 47 },
  { id: 2, name: 'White Dress Shirt', category: 'Shirts', price: 49, image: 'https://cdn.kctmenswear.com/products/shirts/white/main.png', trending: 'up' as const, hotness: 88, recentlyViewed: 35 },
  { id: 3, name: 'Burgundy Silk Tie', category: 'Ties', price: 29, image: 'https://cdn.kctmenswear.com/products/ties/burgundy/main.png', hotness: 75, recentlyViewed: 22 },
  { id: 4, name: 'Charcoal 3-Piece', category: 'Suits', price: 229, image: 'https://cdn.kctmenswear.com/products/suits/charcoal-3piece/main.png', trending: 'up' as const, hotness: 85, recentlyViewed: 31 },
  { id: 5, name: 'Light Blue Shirt', category: 'Shirts', price: 55, image: 'https://cdn.kctmenswear.com/products/shirts/light-blue/main.png', hotness: 70, recentlyViewed: 18 },
  { id: 6, name: 'Silver Tie', category: 'Ties', price: 35, image: 'https://cdn.kctmenswear.com/products/ties/silver/main.png', hotness: 65, recentlyViewed: 15 },
  { id: 7, name: 'Black Tuxedo', category: 'Suits', price: 279, image: 'https://cdn.kctmenswear.com/products/tuxedos/black/main.png', trending: 'up' as const, hotness: 90, recentlyViewed: 42 },
  { id: 8, name: 'Pink Dress Shirt', category: 'Shirts', price: 59, image: 'https://cdn.kctmenswear.com/products/shirts/pink/main.png', hotness: 72, recentlyViewed: 20 },
  { id: 9, name: 'Navy Knit Tie', category: 'Ties', price: 39, image: 'https://cdn.kctmenswear.com/products/ties/navy-knit/main.png', hotness: 68, recentlyViewed: 16 },
  { id: 10, name: 'Light Grey Suit', category: 'Suits', price: 199, image: 'https://cdn.kctmenswear.com/products/suits/light-grey/main.png', trending: 'up' as const, hotness: 82, recentlyViewed: 28 },
  { id: 11, name: 'Lavender Shirt', category: 'Shirts', price: 52, image: 'https://cdn.kctmenswear.com/products/shirts/lavender/main.png', hotness: 66, recentlyViewed: 14 },
  { id: 12, name: 'Black Bow Tie', category: 'Ties', price: 25, image: 'https://cdn.kctmenswear.com/products/bowties/black/main.png', trending: 'up' as const, hotness: 78, recentlyViewed: 24 }
];

// Style categories with enhanced interactive properties
const styleCategories = [
  {
    name: 'Business Professional',
    slug: 'business',
    description: 'Sharp suits for the modern executive',
    backgroundImage: 'https://cdn.kctmenswear.com/collections/business/hero.png',
    particleType: 'fabric' as const,
    borderColor: '#1e3a8a',
    styleDNA: ['Power', 'Confidence', 'Success']
  },
  {
    name: 'Wedding Collection',
    slug: 'wedding',
    description: 'Elegant attire for your special day',
    backgroundImage: 'https://cdn.kctmenswear.com/collections/wedding/hero.png',
    particleType: 'sparkle' as const,
    borderColor: '#D4AF37',
    styleDNA: ['Elegant', 'Timeless', 'Romantic']
  },
  {
    name: 'Black Tie Events',
    slug: 'formal',
    description: 'Tuxedos and formal wear for galas',
    backgroundImage: 'https://cdn.kctmenswear.com/collections/formal/hero.png',
    particleType: 'sparkle' as const,
    borderColor: '#000000',
    styleDNA: ['Luxury', 'Sophisticated', 'Elite']
  },
  {
    name: 'Prom Night',
    slug: 'prom',
    description: 'Stand out styles for your big night',
    backgroundImage: 'https://cdn.kctmenswear.com/collections/prom/hero.png',
    particleType: 'sparkle' as const,
    borderColor: '#ec4899',
    styleDNA: ['Bold', 'Trendy', 'Memorable']
  }
];

export default function ModernHomePage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [showAIGreeting, setShowAIGreeting] = useState(false);

  // Show Atelier AI greeting after a short delay
  useEffect(() => {
    const hasSeenGreeting = sessionStorage.getItem('atelier-ai-greeted');
    if (!hasSeenGreeting) {
      const timer = setTimeout(() => {
        setShowAIGreeting(true);
        sessionStorage.setItem('atelier-ai-greeted', 'true');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
          setShowAIGreeting(false);
        }, 4000);
      }, 1500); // Show after 1.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Animated Hero Section with Mobile Optimization */}
      <AnimatedHeroSection />

      {/* Trust Indicators - Build confidence immediately after hero */}
      <TrustIndicators />

      {/* Shop by Category Grid - Updated Collection Layout */}
      <HomeCollectionGrid />

      {/* Trending Now Section - Replaces Bundle Carousel */}
      <TrendingNowSection />

      {/* Build Your Perfect Ensemble - Moved up after Shop by Style */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-white">
        <BuildYourLookShowcase />
      </section>

      {/* Featured Bundles Section - Enhanced Dark Bundle Carousel - TEMPORARILY DISABLED */}
      {/* <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="container-main">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-gold mb-4"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-widest uppercase">Premium Collections</span>
              <Sparkles className="h-5 w-5" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-3 text-white">
              Luxury Bundles, Exclusive Savings
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Experience our premium dark mode carousel with 3D effects and interactive features
            </p>
          </div>

          <EnhancedDarkBundleCarousel 
            bundles={featuredBundles} 
            autoPlay={true}
            showParticles={true}
          />

          <div className="text-center mt-12">
            <Link href="/bundles">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-black font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Explore All Bundles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section> */}


      {/* Style Categories - Interactive Style Environments */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-burgundy mb-4"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-widest uppercase">Style Experiences</span>
              <Sparkles className="h-5 w-5" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-3">
              Find Your Perfect Occasion
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Interactive style environments that adapt to your needs • Hover to explore
            </p>
          </div>

          {/* Interactive Style Environments Component */}
          <InteractiveStyleEnvironments categories={styleCategories} />
          
          {/* CTA Section - Shop All Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl font-serif mb-4">
                Can't Decide? Explore Everything
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Browse our complete collection of suits, shirts, ties, and accessories. 
                Find exactly what you're looking for with advanced filters and sorting.
              </p>
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-burgundy hover:bg-burgundy-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Shop All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  39+ Products
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  Advanced Filters
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-600" />
                  Bundle Deals
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Atelier AI Greeting Notification */}
      <AnimatePresence>
        {showAIGreeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className="bg-gradient-to-r from-burgundy to-burgundy-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Atelier AI Header */}
              <div className="bg-black/20 px-4 py-2 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white/90 tracking-wide">ATELIER AI</span>
                  <button
                    onClick={() => setShowAIGreeting(false)}
                    className="ml-auto hover:opacity-80 transition-opacity"
                    aria-label="Dismiss"
                  >
                    <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="px-5 py-4">
                <p className="text-white font-medium text-sm leading-relaxed">
                  Welcome to KCT. I'm here to help you discover your perfect style. 
                  <span className="block mt-2 text-white/90">Let's elevate your wardrobe together ✨</span>
                </p>
              </div>
              
              {/* Progress bar */}
              <motion.div
                className="h-0.5 bg-white/30"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}