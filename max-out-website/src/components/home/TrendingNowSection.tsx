'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, ShoppingBag, Clock, Flame } from 'lucide-react';
import UltraMinimalProductCard from '@/components/products/UltraMinimalProductCard';
import ProductQuickView from '@/components/products/ProductQuickView';
import { createClient } from '@/lib/supabase/client';

// Demo products for trending section
const demoTrendingProducts = [
  {
    id: '1',
    name: 'Navy Double Breasted',
    price: 299,
    primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    views: 247,
    trending: true,
    hotness: 95
  },
  {
    id: '2',
    name: 'Burgundy Velvet Blazer',
    price: 249,
    primary_image: 'https://cdn.kctmenswear.com/blazers/velvet/mens-burgundy-velvet-dinner-jacket/front.webp',
    views: 189,
    trending: true,
    hotness: 88
  },
  {
    id: '3',
    name: 'White Dress Shirt',
    price: 69,
    primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg',
    views: 156,
    hotness: 82
  },
  {
    id: '4',
    name: 'Black Tuxedo',
    price: 349,
    primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.png',
    views: 203,
    trending: true,
    hotness: 91
  },
  {
    id: '5',
    name: 'Sage Vest & Tie',
    price: 89,
    primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/dusty-sage-vest-tie.png',
    views: 134,
    hotness: 76
  },
  {
    id: '6',
    name: 'Sparkle Prom Blazer',
    price: 279,
    primary_image: 'https://cdn.kctmenswear.com/blazers/prom/mens-burgundy-sparkle-pattern-prom-blazer/front.webp',
    views: 298,
    trending: true,
    hotness: 94,
    isNew: true
  },
  {
    id: '7',
    name: 'Brown Wedding Suit',
    price: 289,
    primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-suit-white-shirt-brown-tie.png',
    views: 167,
    hotness: 79
  },
  {
    id: '8',
    name: 'Navy Suspenders Set',
    price: 59,
    primary_image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/3000-MM%20(Burgundy)/mm-burgundy-bowtie.jpg',
    views: 112,
    hotness: 71
  }
];

export default function TrendingNowSection() {
  const [products, setProducts] = useState(demoTrendingProducts);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'new'>('all');

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter products based on active filter
  const filteredProducts = products.filter(product => {
    if (activeFilter === 'hot') return product.hotness && product.hotness > 85;
    if (activeFilter === 'new') return product.isNew;
    return true;
  });

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedProduct) return;
    const currentIndex = products.findIndex(p => p.id === selectedProduct.id);
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + products.length) % products.length
      : (currentIndex + 1) % products.length;
    setSelectedProduct(products[newIndex]);
  };

  return (
    <>
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-2"
              >
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Trending Now
                </h2>
                <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-red-50 rounded-full">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-semibold text-red-600">HOT</span>
                </div>
              </motion.div>
              <p className="text-gray-600">
                Most viewed items in the last 24 hours
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Items', icon: null },
                { value: 'hot', label: 'Hot', icon: Flame },
                { value: 'new', label: 'New', icon: Clock }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value as any)}
                  className={`
                    px-4 py-2 rounded-full font-medium text-sm transition-all
                    flex items-center gap-1
                    ${activeFilter === filter.value
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 border hover:bg-gray-50'
                    }
                  `}
                >
                  {filter.icon && <filter.icon className="w-3.5 h-3.5" />}
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative"
              >
                {/* Trending Indicators */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                  {product.trending && (
                    <div className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </div>
                  )}
                  {product.isNew && (
                    <div className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                      New
                    </div>
                  )}
                  {product.hotness && product.hotness > 90 && (
                    <div className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      Hot
                    </div>
                  )}
                </div>

                {/* Views Counter */}
                <div className="absolute top-2 right-2 z-10 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {product.views}
                </div>

                <UltraMinimalProductCard
                  product={product}
                  onQuickView={handleQuickView}
                />
              </motion.div>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-8">
            <motion.a
              href="/collections"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-gray-900 font-semibold border-b-2 border-gray-900 hover:border-gray-600 transition-colors"
            >
              View All Trending Items
              <TrendingUp className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Live Activity Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>47 people are viewing trending items right now</span>
          </motion.div>
        </div>
      </section>

      {/* Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        isOpen={quickViewOpen}
        onClose={() => {
          setQuickViewOpen(false);
          setTimeout(() => setSelectedProduct(null), 300);
        }}
        onNavigate={handleNavigate}
        isMobile={isMobile}
      />
    </>
  );
}