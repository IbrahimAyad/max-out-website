'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Filter, 
  Calendar,
  Sparkles,
  TrendingUp,
  Leaf,
  Sun,
  Tag,
  Heart,
  ShoppingBag,
  Users,
  Info
} from 'lucide-react';
import { weddingBundles } from '@/lib/products/weddingBundles';
import { Button } from '@/components/ui/button';
import WeddingBundleQuickView from '@/components/bundles/WeddingBundleQuickView';

export default function WeddingBundlesPage() {
  const [selectedSeason, setSelectedSeason] = useState<'all' | 'fall' | 'spring' | 'summer'>('all');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [showQuickView, setShowQuickView] = useState<string | null>(null);

  // Filter bundles by season
  const filteredBundles = selectedSeason === 'all' 
    ? weddingBundles.bundles 
    : weddingBundles.bundles.filter(bundle => bundle.season === selectedSeason);

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

  const seasonIcons = {
    fall: <Leaf className="w-5 h-5" />,
    spring: <Sparkles className="w-5 h-5" />,
    summer: <Sun className="w-5 h-5" />
  };

  const seasonColors = {
    fall: 'border-orange-500 bg-orange-50 text-orange-700',
    spring: 'border-green-500 bg-green-50 text-green-700',
    summer: 'border-blue-500 bg-blue-50 text-blue-700'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
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
              <Users className="w-6 h-6" />
              <span className="text-sm font-semibold tracking-widest uppercase">Wedding Collection</span>
              <Users className="w-6 h-6" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
              Wedding Party
              <span className="block text-gold mt-2">Style Bundles</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Expertly curated suit, shirt, and tie combinations for every wedding season. 
              Save up to 15% when you choose a complete look.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Tag className="w-4 h-4 text-gold" />
                <span>Save up to $50 per bundle</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 text-gold" />
                <span>Seasonal Collections</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-gold" />
                <span>Group Discounts Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container-main py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Season Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSeason('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedSeason === 'all'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  All Seasons ({weddingBundles.bundles.length})
                </button>
                <button
                  onClick={() => setSelectedSeason('fall')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedSeason === 'fall'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Leaf className="w-4 h-4" />
                  Fall ({weddingBundles.bundles.filter(b => b.season === 'fall').length})
                </button>
                <button
                  onClick={() => setSelectedSeason('spring')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedSeason === 'spring'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Spring ({weddingBundles.bundles.filter(b => b.season === 'spring').length})
                </button>
                <button
                  onClick={() => setSelectedSeason('summer')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedSeason === 'summer'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Summer ({weddingBundles.bundles.filter(b => b.season === 'summer').length})
                </button>
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
                      <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border-2 ${seasonColors[bundle.season]}`}>
                        {seasonIcons[bundle.season]}
                        {bundle.season.charAt(0).toUpperCase() + bundle.season.slice(1)}
                      </span>
                      {bundle.trending && (
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Trending
                        </span>
                      )}
                      {bundle.aiScore && bundle.aiScore >= 95 && (
                        <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
                          AI Pick {bundle.aiScore}%
                        </span>
                      )}
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
                      {bundle.suit.color} • {bundle.shirt.color} • {bundle.tie.color}
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
                        <span className="font-medium">Save ${bundle.savings}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <Link href={`/bundles/${bundle.id}`}>
                      <Button className="w-full bg-black hover:bg-gray-800 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
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

      {/* Wedding Party CTA */}
      <section className="py-20 bg-gradient-to-br from-gold/10 to-white">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="text-4xl font-serif mb-6">Planning a Wedding Party?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get exclusive group discounts when you outfit your entire wedding party. 
              Our style consultants will help coordinate looks for the groom, groomsmen, and fathers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/wedding">
                <Button size="lg" className="bg-gold hover:bg-gold/90 text-black px-8">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Wedding Consultation
                </Button>
              </Link>
              <Link href="/bundles">
                <Button size="lg" variant="outline" className="px-8">
                  View All Bundles
                </Button>
              </Link>
            </div>
            
            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-semibold mb-2">Group Discounts</h3>
                <p className="text-sm text-gray-600">Save 20% when you outfit 5+ groomsmen</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-semibold mb-2">Style Coordination</h3>
                <p className="text-sm text-gray-600">Expert help matching your wedding theme</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-semibold mb-2">Timeline Management</h3>
                <p className="text-sm text-gray-600">We'll ensure everything arrives on time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Style Tips */}
      <section className="py-12 bg-white">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-serif mb-6 text-center">Wedding Style Tips by Season</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Fall Tips */}
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <div className="flex items-center gap-2 text-orange-700 mb-4">
                  <Leaf className="w-5 h-5" />
                  <h4 className="font-semibold">Fall Weddings</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Rich, warm colors like burgundy, burnt orange, and deep browns</li>
                  <li>• Consider heavier fabrics for outdoor ceremonies</li>
                  <li>• Earth tones complement autumn venues perfectly</li>
                  <li>• Three-piece suits add sophistication</li>
                </ul>
              </div>

              {/* Spring Tips */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-4">
                  <Sparkles className="w-5 h-5" />
                  <h4 className="font-semibold">Spring Weddings</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Soft pastels like dusty pink and sage green</li>
                  <li>• Lighter weight fabrics for comfort</li>
                  <li>• Fresh, romantic color combinations</li>
                  <li>• Perfect for garden and outdoor venues</li>
                </ul>
              </div>

              {/* Summer Tips */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-4">
                  <Sun className="w-5 h-5" />
                  <h4 className="font-semibold">Summer Weddings</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Light colors and breathable fabrics</li>
                  <li>• Coral and light blue accents for beach weddings</li>
                  <li>• Consider linen or lightweight wool</li>
                  <li>• Two-piece suits for hot weather comfort</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {showQuickView && (
        <WeddingBundleQuickView
          bundle={weddingBundles.bundles.find(b => b.id === showQuickView)!}
          onClose={() => setShowQuickView(null)}
        />
      )}
    </div>
  );
}