'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductModuleProps } from '../types';
import OptimizedImage from '@/components/ui/OptimizedImage';

const AIRecommendationModule: React.FC<ProductModuleProps> = ({
  product,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('');

  // AI-generated recommendations based on product type
  const recommendations = [
    {
      id: 'complete-look',
      title: 'Complete the Look',
      items: [
        {
          name: 'White Dress Shirt',
          image: '/placeholder-shirt.jpg',
          price: 79.99,
          confidence: 95
        },
        {
          name: 'Black Leather Shoes', 
          image: '/placeholder-shoes.jpg',
          price: 149.99,
          confidence: 92
        },
        {
          name: 'Silver Cufflinks',
          image: '/placeholder-product.svg',
          price: 39.99,
          confidence: 88
        }
      ],
      totalPrice: 269.97,
      savings: 30.00
    },
    {
      id: 'occasion-based',
      title: 'Perfect for Wedding',
      description: 'AI matched this ensemble for wedding occasions',
      confidence: 96,
      features: [
        'Formal dress code compliant',
        'Seasonal color coordination', 
        'Body type optimized fit',
        'Venue style appropriate'
      ]
    },
    {
      id: 'style-analysis',
      title: 'Your Style Profile',
      description: 'Based on your shopping history and preferences',
      insights: [
        {
          category: 'Preferred Colors',
          items: ['Navy', 'Charcoal', 'Burgundy'],
          confidence: 89
        },
        {
          category: 'Body Type Match',
          items: ['Classic fit recommended', 'Regular length ideal'],
          confidence: 92
        },
        {
          category: 'Occasion Fit', 
          items: ['Business formal', 'Wedding guest', 'Date night'],
          confidence: 87
        }
      ]
    }
  ];

  const aiInsights = {
    sizeConfidence: 94,
    styleMatch: 91,
    occasionFit: 96,
    valueScore: 88
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main AI Recommendation Card */}
      <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          {/* AI Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">AI Style Assistant</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                96% Match
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">
              Perfect for your upcoming wedding! I've analyzed your style preferences and this {product.name} 
              matches your formal wear needs with 96% confidence.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              {Object.entries(aiInsights).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{value}%</div>
                  <div className="text-xs text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center space-x-1"
            >
              <span>{isExpanded ? 'Show Less' : 'Show Details'}</span>
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded AI Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Recommendations Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {recommendations.map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => setSelectedRecommendation(
                      selectedRecommendation === rec.id ? '' : rec.id
                    )}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedRecommendation === rec.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {rec.title}
                  </button>
                ))}
              </nav>
            </div>

            {/* Complete the Look */}
            {selectedRecommendation === 'complete-look' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Recommended Items</h4>
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-semibold">
                      Save ${recommendations[0].savings.toFixed(2)} as bundle
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ${(recommendations[0].totalPrice - recommendations[0].savings).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recommendations[0].items.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="aspect-square w-full bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        <OptimizedImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      </div>
                      <h5 className="font-medium text-gray-900 text-sm mb-1">{item.name}</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-burgundy-600 font-semibold">${item.price}</span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          {item.confidence}% match
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all">
                  Add Complete Look to Cart
                </button>
              </motion.div>
            )}

            {/* Occasion-Based Recommendation */}
            {selectedRecommendation === 'occasion-based' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">💒</span>
                  <h4 className="font-semibold text-gray-900">Wedding Guest Outfit</h4>
                  <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {recommendations[1].confidence}% Match
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{recommendations[1].description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations[1].features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Style Analysis */}
            {selectedRecommendation === 'style-analysis' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h4 className="font-semibold text-gray-900 mb-4">AI Style Analysis</h4>
                
                {recommendations[2].insights?.map((insight, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{insight.category}</h5>
                      <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {insight.items.map((item, itemIndex) => (
                        <span 
                          key={itemIndex}
                          className="bg-white text-gray-700 text-sm px-3 py-1 rounded-full border"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Action Buttons */}
      <div className="flex space-x-3">
        <button className="flex-1 bg-indigo-100 text-indigo-700 py-2 px-4 rounded-lg font-medium hover:bg-indigo-200 transition-colors">
          Get Size Recommendation
        </button>
        <button className="flex-1 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-200 transition-colors">
          Style Consultation
        </button>
      </div>
    </div>
  );
};

export default AIRecommendationModule;