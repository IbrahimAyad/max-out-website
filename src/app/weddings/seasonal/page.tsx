'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Calendar, Thermometer, Droplets, Snowflake, Sun, Leaf } from 'lucide-react';

const seasonalCollections = {
  spring: {
    name: 'Spring Romance',
    description: 'Light fabrics and fresh colors for garden ceremonies',
    icon: <Leaf className="w-8 h-8" />,
    color: 'from-green-400 to-emerald-500',
    features: ['Lightweight wool', 'Pastel color options', 'Breathable fabrics', 'Garden-friendly styles'],
    products: [
      { name: 'Light Grey Suit', price: '$299', image: 'https://cdn.kctmenswear.com/spring-grey-suit.jpg' },
      { name: 'Navy Linen Blazer', price: '$199', image: 'https://cdn.kctmenswear.com/spring-navy-blazer.jpg' },
      { name: 'Sage Green Tie Set', price: '$49', image: 'https://cdn.kctmenswear.com/spring-sage-tie.jpg' }
    ]
  },
  summer: {
    name: 'Summer Elegance',
    description: 'Breathable materials perfect for outdoor celebrations',
    icon: <Sun className="w-8 h-8" />,
    color: 'from-yellow-400 to-orange-500',
    features: ['Ultra-breathable linen', 'Moisture-wicking shirts', 'Lighter colors', 'Beach wedding ready'],
    products: [
      { name: 'Linen Suit - Ivory', price: '$349', image: 'https://cdn.kctmenswear.com/summer-linen-suit.jpg' },
      { name: 'Cotton Dress Shirt', price: '$89', image: 'https://cdn.kctmenswear.com/summer-cotton-shirt.jpg' },
      { name: 'Coral Bow Tie', price: '$39', image: 'https://cdn.kctmenswear.com/summer-coral-bow.jpg' }
    ]
  },
  fall: {
    name: 'Autumn Romance',
    description: 'Rich textures and warm tones for autumn romance',
    icon: <Droplets className="w-8 h-8" />,
    color: 'from-orange-500 to-red-600',
    features: ['Rich textures', 'Warm color palette', 'Velvet accents', 'Cozy elegance'],
    products: [
      { name: 'Burgundy Velvet Blazer', price: '$399', image: 'https://cdn.kctmenswear.com/fall-burgundy-blazer.jpg' },
      { name: 'Tweed Vest', price: '$129', image: 'https://cdn.kctmenswear.com/fall-tweed-vest.jpg' },
      { name: 'Gold Paisley Tie', price: '$59', image: 'https://cdn.kctmenswear.com/fall-gold-tie.jpg' }
    ]
  },
  winter: {
    name: 'Winter Majesty',
    description: 'Luxurious fabrics and deep colors for elegant indoor ceremonies',
    icon: <Snowflake className="w-8 h-8" />,
    color: 'from-blue-600 to-purple-700',
    features: ['Premium wool', 'Deep rich colors', 'Luxurious textures', 'Formal elegance'],
    products: [
      { name: 'Midnight Navy Tuxedo', price: '$499', image: 'https://cdn.kctmenswear.com/winter-navy-tux.jpg' },
      { name: 'Silk Dress Shirt', price: '$149', image: 'https://cdn.kctmenswear.com/winter-silk-shirt.jpg' },
      { name: 'Platinum Cufflinks', price: '$89', image: 'https://cdn.kctmenswear.com/winter-cufflinks.jpg' }
    ]
  }
};

export default function SeasonalWeddingsPage() {
  const [selectedSeason, setSelectedSeason] = useState<keyof typeof seasonalCollections>('spring');
  
  const currentCollection = seasonalCollections[selectedSeason];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-green-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/weddings" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Wedding Portal
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Calendar className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl md:text-5xl font-light text-gray-900">Seasonal Wedding Collections</h1>
            <Calendar className="w-8 h-8 text-green-600" />
          </motion.div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the perfect wedding attire for every season of love
          </p>
        </div>

        {/* Season Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.entries(seasonalCollections).map(([season, collection]) => (
            <motion.button
              key={season}
              onClick={() => setSelectedSeason(season as keyof typeof seasonalCollections)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-2xl border-2 transition-all ${
                selectedSeason === season
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300 bg-white'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${collection.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                {collection.icon}
              </div>
              <h3 className="text-lg font-semibold capitalize">{season}</h3>
              <p className="text-sm text-gray-600 mt-1">{collection.name}</p>
            </motion.button>
          ))}
        </div>

        {/* Selected Season Content */}
        <motion.div
          key={selectedSeason}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Hero Section */}
          <div className={`bg-gradient-to-r ${currentCollection.color} p-8 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-serif mb-2">{currentCollection.name}</h2>
                <p className="text-white/90 text-lg">{currentCollection.description}</p>
              </div>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                {currentCollection.icon}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Features */}
            <div className="mb-12">
              <h3 className="text-2xl font-serif mb-6">Collection Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {currentCollection.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Thermometer className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-2xl font-serif mb-6">Featured Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {currentCollection.products.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="group"
                  >
                    <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-2">
                      <div className="aspect-[3/4] bg-gray-200 relative">
                        {/* Product image placeholder */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Product Image</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                        <p className="text-2xl font-bold text-green-600 mb-4">{product.price}</p>
                        <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <Link href={`/collections/wedding/${selectedSeason}`}>
                <button className="px-12 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg">
                  Shop Full {currentCollection.name} Collection
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}