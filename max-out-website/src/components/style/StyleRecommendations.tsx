'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, TrendingUp } from 'lucide-react';
import { Product, StylePreferences } from '@/lib/types';

interface RecommendationReason {
  type: 'color' | 'fit' | 'occasion' | 'trending' | 'bestseller';
  description: string;
}

interface RecommendedProduct extends Product {
  matchScore: number;
  reasons: RecommendationReason[];
}

interface StyleRecommendationsProps {
  products: RecommendedProduct[];
  stylePreferences: StylePreferences;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function StyleRecommendations({
  products,
  stylePreferences,
  onProductClick,
  onAddToCart,
}: StyleRecommendationsProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const getReasonIcon = (type: RecommendationReason['type']) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'bestseller':
        return '🔥';
      default:
        return '✓';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-gold bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-serif mb-2">Your Style Recommendations</h2>
            <p className="text-gray-600">
              Based on your preference for {stylePreferences.fit} fit and {stylePreferences.occasions.join(', ')} occasions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-sm transition-colors ${
                viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-sm transition-colors ${
                viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={viewMode === 'grid' ? '' : 'bg-white rounded-lg shadow-md overflow-hidden'}
          >
            {viewMode === 'grid' ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-80">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                      }`}
                    />
                  </button>
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(product.matchScore)}`}>
                    {product.matchScore}% Match
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold mb-4">${(product.price / 100).toFixed(2)}</p>

                  <div className="space-y-2 mb-4">
                    {product.reasons.slice(0, 2).map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{getReasonIcon(reason.type)}</span>
                        <span>{reason.description}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onAddToCart(product)}
                      className="flex-1 bg-gold hover:bg-gold/90 text-black px-4 py-2 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onProductClick(product)}
                      className="px-4 py-2 border-2 border-black hover:bg-black hover:text-white rounded-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-6 p-6">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="text-2xl font-bold">${(product.price / 100).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(product.matchScore)}`}>
                        {product.matchScore}% Match
                      </span>
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        <span>{getReasonIcon(reason.type)}</span>
                        <span>{reason.description}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onAddToCart(product)}
                      className="bg-gold hover:bg-gold/90 text-black px-6 py-2 rounded-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onProductClick(product)}
                      className="px-6 py-2 border-2 border-black hover:bg-black hover:text-white rounded-sm transition-colors"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}