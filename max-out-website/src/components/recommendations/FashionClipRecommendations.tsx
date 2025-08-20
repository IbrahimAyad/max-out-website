'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Palette, Users } from 'lucide-react';
import { fashionClipService, ProductRecommendation } from '@/lib/services/fashionClipService';
import { Product } from '@/lib/types';

interface FashionClipRecommendationsProps {
  currentProduct?: Product;
  userStyle?: string[];
  occasion?: string;
  className?: string;
}

interface RecommendationSection {
  title: string;
  icon: React.ReactNode;
  items: ProductRecommendation[];
  type: 'similar' | 'outfit' | 'trending' | 'color';
}

export function FashionClipRecommendations({ 
  currentProduct, 
  userStyle = [], 
  occasion,
  className 
}: FashionClipRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    loadRecommendations();
  }, [currentProduct, userStyle, occasion]);

  const loadRecommendations = async () => {
    setIsLoading(true);

    try {
      const sections: RecommendationSection[] = [];

      // Similar Items Section
      if (currentProduct) {
        const similar = await fashionClipService.findSimilarProducts(currentProduct.id);
        sections.push({
          title: 'Similar Styles',
          icon: <TrendingUp className="w-5 h-5" />,
          items: similar,
          type: 'similar'
        });

        // Complete the Outfit Section
        const outfit = await fashionClipService.getOutfitRecommendations(currentProduct.id);
        const outfitItems = [
          ...outfit.shirts,
          ...outfit.ties,
          ...outfit.shoes,
          ...outfit.accessories
        ];

        if (outfitItems.length > 0) {
          sections.push({
            title: 'Complete the Look',
            icon: <Sparkles className="w-5 h-5" />,
            items: outfitItems,
            type: 'outfit'
          });
        }
      }

      // Trending Styles Section
      sections.push({
        title: 'Trending Now',
        icon: <TrendingUp className="w-5 h-5" />,
        items: [
          {
            productId: 'trending-1',
            similarity: 0.91,
            confidence: 0.87,
            reason: 'Popular this season'
          },
          {
            productId: 'trending-2',
            similarity: 0.88,
            confidence: 0.84,
            reason: 'Frequently bought together'
          }
        ],
        type: 'trending'
      });

      // Color Coordinated Section
      sections.push({
        title: 'Perfect Color Matches',
        icon: <Palette className="w-5 h-5" />,
        items: [
          {
            productId: 'color-1',
            similarity: 0.94,
            confidence: 0.91,
            reason: 'Complementary color palette'
          },
          {
            productId: 'color-2',
            similarity: 0.89,
            confidence: 0.86,
            reason: 'Seasonal color harmony'
          }
        ],
        type: 'color'
      });

      setRecommendations(sections);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const mockProducts: Record<string, Product> = {
    'trending-1': {
      id: 'trending-1',
      sku: 'TREND-001',
      name: 'Modern Fit Navy Suit',
      price: 79900,
      images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9b127676-6911-450b-0bbb-b5eb670de800/public'],
      category: 'suits',
      stock: { '40R': 5 },
      variants: [],
    },
    'trending-2': {
      id: 'trending-2',
      sku: 'TREND-002',
      name: 'Charcoal Wool Blend',
      price: 69900,
      images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/5aa4d62a-c0dc-476d-09e7-c4c1da0b9700/public'],
      category: 'suits',
      stock: { '42R': 3 },
      variants: [],
    },
    'color-1': {
      id: 'color-1',
      sku: 'COLOR-001',
      name: 'Wedding Tuxedo',
      price: 119900,
      images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/3859e360-f63d-40d5-35ec-223ffc67f000/public'],
      category: 'suits',
      stock: { '40R': 2 },
      variants: [],
    },
    'color-2': {
      id: 'color-2',
      sku: 'COLOR-002',
      name: 'Double Breasted Suit',
      price: 89900,
      images: ['https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/48fa7dfa-1160-4c02-bb59-2a6ae977ed00/public'],
      category: 'suits',
      stock: { '38R': 4 },
      variants: [],
    },
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-gold animate-pulse" />
          <h3 className="text-xl font-serif">AI Recommendations</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-20 h-24 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-gold" />
        <h3 className="text-xl font-serif">AI-Powered Recommendations</h3>
        <div className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Fashion CLIP
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {recommendations.map((section, index) => (
          <button
            key={index}
            onClick={() => setActiveSection(index)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeSection === index
                ? 'bg-gold text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {section.icon}
            {section.title}
          </button>
        ))}
      </div>

      {/* Current Section Content */}
      {recommendations[activeSection] && (
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {recommendations[activeSection].items.slice(0, 4).map((item, index) => {
            const product = mockProducts[item.productId];
            if (!product) return null;

            return (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow group cursor-pointer"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-24 object-cover rounded group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate group-hover:text-gold transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    SKU: {product.sku}
                  </p>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    {item.reason}
                  </p>

                  {/* Match Score */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-green-600 font-medium">
                        {Math.round(item.similarity * 100)}% match
                      </div>
                      <div className="w-12 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${item.similarity * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* View All Button */}
          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gold hover:text-gold transition-colors">
            View All {recommendations[activeSection].title}
          </button>
        </motion.div>
      )}

      {/* AI Insights */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" />
          AI Insights
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded">
            <div className="font-medium text-blue-900">Style Confidence</div>
            <div className="text-blue-700">94% accuracy</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="font-medium text-green-900">Match Quality</div>
            <div className="text-green-700">Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
}