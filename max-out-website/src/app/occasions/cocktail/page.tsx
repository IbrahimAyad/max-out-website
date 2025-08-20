'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Filter, 
  X, 
  ChevronDown,
  Sparkles,
  Clock,
  Tag,
  Martini,
  Wine
} from 'lucide-react';
import { casualBundles } from '@/lib/products/casualBundles';
import { addProductImages } from '@/lib/products/bundleImageMapping';
import CasualBundleQuickView from '@/components/bundles/CasualBundleQuickView';
import PageTransition from '@/components/motion/PageTransition';

export default function CocktailPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<any>(null);

  // Add individual product images to bundles
  const bundlesWithImages = casualBundles.bundles.map(bundle => addProductImages(bundle));

  // Filter bundles
  const filteredBundles = selectedCategory === 'all' 
    ? bundlesWithImages 
    : bundlesWithImages.filter(bundle => bundle.category === selectedCategory);

  // Sort bundles
  const sortedBundles = [...filteredBundles].sort((a, b) => {
    switch (selectedSort) {
      case 'trending':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      case 'price-low':
        return a.bundlePrice - b.bundlePrice;
      case 'price-high':
        return b.bundlePrice - a.bundlePrice;
      case 'newest':
        return b.aiScore! - a.aiScore!;
      default:
        return 0;
    }
  });

  const categories = [
    { id: 'all', name: 'All Styles', count: casualBundles.bundles.length },
    { id: 'monochrome', name: 'Monochrome', count: casualBundles.bundles.filter(b => b.category === 'monochrome').length },
    { id: 'contrast', name: 'High Contrast', count: casualBundles.bundles.filter(b => b.category === 'contrast').length },
    { id: 'subtle', name: 'Subtle Elegance', count: casualBundles.bundles.filter(b => b.category === 'subtle').length },
    { id: 'bold', name: 'Bold Statement', count: casualBundles.bundles.filter(b => b.category === 'bold').length },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-[50vh] bg-gray-900 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=1920&q=80"
              alt="Cocktail party atmosphere"
              fill
              className="object-cover opacity-60"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80" />
          
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Martini className="w-10 h-10" />
                <h1 className="text-5xl md:text-6xl font-bold">Cocktail Hour</h1>
                <Wine className="w-10 h-10" />
              </div>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                Sophisticated casual bundles for evening events
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  All bundles $199.99
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  No tie required
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/occasions"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Occasions</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors md:hidden"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="trending">Trending</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Category Filters */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Style Categories</h2>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="trending">Trending</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Special Offer Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Cocktail Bundle Special</h3>
                <p className="text-purple-100">
                  Get any 3 cocktail bundles for $549 - Perfect for multiple events!
                </p>
              </div>
              <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                Shop Bundle Deal
              </button>
            </div>
          </motion.div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Sort By</h4>
                    <select
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="trending">Trending</option>
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Categories</h4>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setShowFilters(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${
                          selectedCategory === category.id
                            ? 'bg-purple-100 text-purple-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bundle Grid */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory === 'all' ? 'All Cocktail Bundles' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600">{sortedBundles.length} bundles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedBundles.map((bundle, index) => (
                  <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedBundle(bundle)}
                  >
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 mb-4">
                      <Image
                        src={bundle.imageUrl}
                        alt={bundle.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {bundle.trending && (
                        <span className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Trending
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <button className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 rounded-lg font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Quick View
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-purple-600 transition-colors">
                      {bundle.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {bundle.suit.color} Suit • {bundle.shirt.color} Shirt • {bundle.pocketSquare.color} Pocket Square
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">${bundle.bundlePrice}</span>
                        <span className="text-sm text-gray-400 line-through ml-2">${bundle.originalPrice}</span>
                      </div>
                      <span className="text-sm text-green-600 font-medium">Save ${bundle.savings}</span>
                    </div>
                  </motion.div>
                ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gray-900 text-white rounded-xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-lg mb-6 text-gray-300">
              Our style experts can help you find the perfect cocktail outfit
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                Book Virtual Styling Session
              </button>
              <Link 
                href="/custom-suits"
                className="px-8 py-3 border border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-semibold"
              >
                Create Custom Bundle
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Quick View Modal */}
        {selectedBundle && (
          <CasualBundleQuickView
            bundle={selectedBundle}
            onClose={() => setSelectedBundle(null)}
          />
        )}
      </div>
    </PageTransition>
  );
}