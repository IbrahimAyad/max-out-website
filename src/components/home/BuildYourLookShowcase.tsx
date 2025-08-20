'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
// import { R2Image } from '@/components/ui/R2Image';
import { ArrowRight, Sparkles, ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Product data using R2 CDN images for better performance
const productRotations = {
  suits: [
    { color: 'Navy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg', fallbackColor: '#1e3a8a' },
    { color: 'Black', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png', fallbackColor: '#000000' },
    { color: 'Light Grey', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg', fallbackColor: '#d1d5db' },
    { color: 'Burgundy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/two-peice-main-bur.jpg', fallbackColor: '#800020' },
    { color: 'Emerald', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerlad/emerlad-main.jpg', fallbackColor: '#50c878' },
  ],
  shirts: [
    { color: 'White', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg', fallbackColor: '#ffffff' },
    { color: 'Light Blue', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light-Blue-Dress-Shirt.jpg', fallbackColor: '#93c5fd' },
    { color: 'Light Pink', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light%20Pink-Dress-Shirt.jpg', fallbackColor: '#FFB6C1' },
    { color: 'Burgundy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Burgundy-Dress-Shirt.jpg', fallbackColor: '#800020' },
    { color: 'Navy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Navy-Dress-Shirt.jpg', fallbackColor: '#000080' },
  ],
  ties: [
    { color: 'True Red', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/classic-tie.jpg', fallbackColor: '#c00000' },
    { color: 'Navy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/skinny-tie-collection.jpg', fallbackColor: '#000080' },
    { color: 'Burgundy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/skinny-tie-2.jpg', fallbackColor: '#800020' },
    { color: 'Black', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/bowtie.jpg', fallbackColor: '#000000' },
    { color: 'Gold', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/5-tie-bundle.jpg', fallbackColor: '#FFD700' },
  ],
};

export function BuildYourLookShowcase() {
  const [currentIndices, setCurrentIndices] = useState({
    suits: 0,
    shirts: 0,
    ties: 0,
  });
  const [selectedItems, setSelectedItems] = useState({
    suits: false,
    shirts: false,
    ties: false,
  });

  // Rotate products every 3 seconds with staggered timing
  useEffect(() => {
    const intervals = {
      suits: setInterval(() => {
        setCurrentIndices(prev => ({
          ...prev,
          suits: (prev.suits + 1) % productRotations.suits.length,
        }));
      }, 3000),
      shirts: setInterval(() => {
        setCurrentIndices(prev => ({
          ...prev,
          shirts: (prev.shirts + 1) % productRotations.shirts.length,
        }));
      }, 3500),
      ties: setInterval(() => {
        setCurrentIndices(prev => ({
          ...prev,
          ties: (prev.ties + 1) % productRotations.ties.length,
        }));
      }, 4000),
    };

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, []);

  const productCategories = [
    {
      key: 'suits',
      title: 'Designer Suits',
      subtitle: 'Bundle Essential',
      badge: 'MOST POPULAR',
      products: productRotations.suits,
      currentIndex: currentIndices.suits,
      priceRange: 'Bundle from $199',
      savings: 'Save $100+',
      href: '/products/suits',
      order: 1,
    },
    {
      key: 'shirts',
      title: 'Perfect Match Shirts',
      subtitle: 'Completes Your Look',
      products: productRotations.shirts,
      currentIndex: currentIndices.shirts,
      priceRange: 'Add to bundle',
      savings: '+$39',
      href: '/collections/dress-shirts',
      order: 2,
    },
    {
      key: 'ties',
      title: 'Signature Ties',
      subtitle: 'The Finishing Touch',
      products: productRotations.ties,
      currentIndex: currentIndices.ties,
      priceRange: 'Complete the look',
      savings: '+$24',
      href: '/collections/ties',
      order: 3,
    },
  ].sort((a, b) => a.order - b.order);

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-main relative z-10">
        {/* Section Header with Bundle Savings */}
        <div className="text-center mb-8">
          {/* Bundle Savings Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-burgundy to-burgundy-700 text-white py-2 px-4 rounded-full inline-flex items-center gap-2 mb-4"
          >
            <span className="text-sm font-bold">🎯 BUNDLE DEALS: Save up to 40%</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 text-burgundy mb-4"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Create Your Look</span>
            <Sparkles className="h-5 w-5" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif mb-3"
          >
            Complete Your Look
            <span className="text-burgundy block">For Less</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-gray-600 text-lg"
          >
            Join 10,000+ satisfied customers • Bundle & Save
          </motion.p>
        </div>

        {/* Product Grid - Mobile: 3 columns for side-by-side display */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 mb-12">
          {productCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + categoryIndex * 0.1 }}
              className="group"
            >
              <Link 
                href={category.href}
                onClick={(e) => {
                  // On mobile, toggle selection instead of navigating immediately
                  if (window.innerWidth < 768) {
                    e.preventDefault();
                    setSelectedItems(prev => ({
                      ...prev,
                      [category.key]: !prev[category.key as keyof typeof prev]
                    }));
                  }
                }}
              >
                <div className={`relative bg-white rounded-lg md:rounded-2xl shadow-md md:shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  selectedItems[category.key as keyof typeof selectedItems] ? 'ring-2 ring-burgundy' : ''
                }`}>
                  {/* Image Container */}
                  <div className="relative h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden bg-gray-100">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${category.key}-${category.currentIndex}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={category.products[category.currentIndex].image}
                          alt={`${category.products[category.currentIndex].color} ${category.title}`}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.backgroundColor = category.products[category.currentIndex].fallbackColor;
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Color indicator dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {category.products.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === category.currentIndex
                              ? 'bg-white w-8'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Mobile-friendly CTA - always visible on mobile */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 md:transition-opacity md:duration-500 touch:opacity-100">
                      <div className="bg-white text-black px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <span className="hidden sm:inline">Quick Add to Bundle</span>
                        <span className="sm:hidden">Add</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                    
                    {/* Badge for popular items */}
                    {category.badge && (
                      <div className="absolute top-4 left-4 bg-gold text-white px-3 py-1 rounded-full text-xs font-bold">
                        {category.badge}
                      </div>
                    )}
                  </div>

                  {/* Product Info with Bundle Focus */}
                  <div className="p-2 sm:p-4 md:p-6">
                    <h3 className="text-sm sm:text-lg md:text-2xl font-serif mb-1 md:mb-2 group-hover:text-burgundy transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1 md:mb-3">{category.subtitle}</p>
                    
                    {/* Bundle Pricing Display */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 md:mb-4">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm md:text-lg font-bold text-burgundy">
                          {category.priceRange}
                        </span>
                        {category.savings && (
                          <span className="text-[10px] sm:text-xs text-green-600 font-semibold">
                            {category.savings}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 sm:mt-0">
                        <span className="text-[10px] sm:text-xs text-yellow-600">⭐⭐⭐⭐⭐</span>
                        <span className="text-[10px] sm:text-xs text-gray-500">(2.5k)</span>
                      </div>
                    </div>

                    {/* Available colors preview - Mobile responsive */}
                    <div className="flex gap-1 sm:gap-2">
                      {category.products.map((product, index) => (
                        <div
                          key={index}
                          className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border transition-all duration-300 ${
                            index === category.currentIndex
                              ? 'border-burgundy scale-110 border-2'
                              : 'border-gray-300'
                          }`}
                          style={{
                            backgroundColor: product.fallbackColor || '#9ca3af'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link href="/custom-suits">
            <Button 
              size="lg" 
              className="bg-burgundy hover:bg-burgundy-700 text-white px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Build Complete Look - Save $89
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-gray-600">
            ✓ Free Alterations • ✓ 30-Day Perfect Fit Guarantee • ✓ Free Shipping Over $200
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-2 text-sm text-burgundy font-semibold"
          >
            ⏰ Limited Time: Bundle prices end in 48 hours
          </motion.p>
        </motion.div>
        
        {/* Mobile Bundle Builder Indicator - Fixed at bottom on mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-burgundy" />
              <span className="font-semibold">Your Bundle:</span>
              <div className="flex gap-1">
                {Object.entries(selectedItems).map(([key, selected]) => (
                  <div
                    key={key}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      selected ? 'bg-burgundy text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {selected ? <Check className="h-4 w-4" /> : key[0].toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
            <Link href="/custom-suits">
              <Button size="sm" className="bg-burgundy text-white">
                View Bundle
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}