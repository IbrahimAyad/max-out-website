'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Filter, 
  Sparkles,
  TrendingUp,
  Tag,
  Heart,
  ShoppingBag,
  PartyPopper,
  Calendar,
  Star,
  Award
} from 'lucide-react';
import { promBundles } from '@/lib/products/promBundles';
import { Button } from '@/components/ui/button';
import PromBundleQuickView from '@/components/bundles/PromBundleQuickView';

export default function PromBundlesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'classic' | 'modern' | 'bold' | 'unique'>('all');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [showQuickView, setShowQuickView] = useState<string | null>(null);

  // Filter bundles by category
  const filteredBundles = selectedCategory === 'all' 
    ? promBundles.bundles 
    : promBundles.bundles.filter(bundle => bundle.category === selectedCategory);

  // Sort bundles
  const sortedBundles = [...filteredBundles].sort((a, b) => {
    switch (selectedSort) {
      case 'trending':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      case 'price-low':
        return a.bundlePrice - b.bundlePrice;
      case 'price-high':
        return b.bundlePrice - a.bundlePrice;
      case 'ai-score':
        return (b.aiScore || 0) - (a.aiScore || 0);
      default:
        return 0;
    }
  });

  const categories = [
    { id: 'all', name: 'All Styles', count: promBundles.bundles.length },
    { id: 'classic', name: 'Classic', count: promBundles.bundles.filter(b => b.category === 'classic').length },
    { id: 'modern', name: 'Modern', count: promBundles.bundles.filter(b => b.category === 'modern').length },
    { id: 'bold', name: 'Bold', count: promBundles.bundles.filter(b => b.category === 'bold').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <PartyPopper className="w-96 h-96 text-white/5" />
          </div>
        </div>
        
        <div className="container-main relative z-10">
          <Link 
            href="/occasions" 
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Occasions
          </Link>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-gold mb-6">
              <PartyPopper className="w-6 h-6" />
              <span className="text-sm font-semibold tracking-widest uppercase">Prom Collection 2024</span>
              <PartyPopper className="w-6 h-6" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
              Stand Out on Your
              <span className="block text-gold mt-2">Special Night</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Premium tuxedo bundles designed to make you look and feel your best at prom. 
              Save up to $50 when you choose a complete look.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Tag className="w-4 h-4 text-gold" />
                <span>Student Discounts Available</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-gold" />
                <span>Premium Tuxedos</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Award className="w-4 h-4 text-gold" />
                <span>Best Dressed Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container-main py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

            {/* Sort Options */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              <option value="trending">Trending First</option>
              <option value="ai-score">AI Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Bundle Grid */}
      <section className="py-12">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBundles.map((bundle, index) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col transform hover:scale-[1.02]">
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={bundle.imageUrl}
                      alt={bundle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {bundle.trending && (
                        <span className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Trending
                        </span>
                      )}
                      {bundle.aiScore && bundle.aiScore >= 95 && (
                        <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          AI Pick {bundle.aiScore}%
                        </span>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-xs font-medium capitalize">
                        {bundle.category}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-white/95 backdrop-blur-sm text-black hover:bg-white shadow-lg py-3 text-base font-semibold"
                          onClick={() => setShowQuickView(bundle.id)}
                        >
                          Quick View
                        </Button>
                        <button className="p-3 bg-white/95 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold mb-3">{bundle.name}</h3>
                    
                    {/* Color Combination */}
                    <p className="text-base text-gray-600 mb-4">
                      {bundle.suit.color} Tuxedo • {bundle.shirt.color} Shirt • {bundle.tie.color} {bundle.tie.style}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 line-clamp-3 flex-1 leading-relaxed">
                      {bundle.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl font-bold">${bundle.bundlePrice}</span>
                        <span className="text-lg text-gray-400 line-through">${bundle.originalPrice}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Tag className="w-4 h-4" />
                        <span className="font-medium">Save ${bundle.savings} with bundle</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <Link href={`/bundles/${bundle.id}`}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        View Bundle
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prom Tips Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <PartyPopper className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-4xl font-serif mb-6">Prom Night Success Tips</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Make your prom night unforgettable with these essential style tips
            </p>
            
            {/* Tips Grid */}
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Calendar className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Order Early</h3>
                <p className="text-sm text-gray-600">
                  Order your tuxedo 4-6 weeks before prom to ensure perfect fit and availability.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Star className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Coordinate Colors</h3>
                <p className="text-sm text-gray-600">
                  Match your date's dress color with your tie or pocket square for perfect photos.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md">
                <Award className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-semibold mb-2">Complete the Look</h3>
                <p className="text-sm text-gray-600">
                  Don't forget cufflinks, dress shoes, and a boutonniere to complete your formal look.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group Discount CTA */}
      <section className="py-12 bg-white">
        <div className="container-main">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Going with Friends?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Get exclusive group discounts when 4+ friends order together. 
              Perfect for coordinating your squad's prom looks!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/prom-groups">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8">
                  Get Group Discount
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {showQuickView && (
        <PromBundleQuickView
          bundle={promBundles.bundles.find(b => b.id === showQuickView)!}
          onClose={() => setShowQuickView(null)}
        />
      )}
    </div>
  );
}