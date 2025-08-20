'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/ui/OptimizedImage';

const ProductsV2DemoPage = () => {
  // Demo products showcasing different templates
  const demoProducts = [
    {
      id: 'demo-premium-suit',
      name: 'Premium Navy Suit',
      category: 'suits',
      price: 599.99,
      image: '/placeholder-suit.jpg',
      template: 'Premium',
      description: 'High-end suit with complex sizing, AI recommendations, and premium features',
      complexity: 'premium'
    },
    {
      id: 'demo-dress-shirt',
      name: 'Classic White Dress Shirt',
      category: 'shirts', 
      price: 79.99,
      image: '/placeholder-shirt.jpg',
      template: 'Standard',
      description: 'Standard shirt with fit options and simple sizing',
      complexity: 'standard'
    },
    {
      id: 'demo-silk-tie',
      name: 'Burgundy Silk Tie',
      category: 'ties',
      price: 24.99,
      image: '/placeholder-tie.jpg',
      template: 'Accessory',
      description: 'Tie with style variations and bundle builder',
      complexity: 'accessory'
    },
    {
      id: 'demo-pocket-square',
      name: 'Cotton Pocket Square',
      category: 'accessories',
      price: 12.99,
      image: '/placeholder-product.svg',
      template: 'Simple',
      description: 'Basic accessory with minimal options',
      complexity: 'simple'
    }
  ];

  const templateColors = {
    premium: 'from-purple-500 to-indigo-600',
    standard: 'from-blue-500 to-blue-600', 
    accessory: 'from-pink-500 to-purple-600',
    simple: 'from-gray-500 to-gray-600'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-burgundy-600 to-gold-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Product Detail System V2
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Experience our new modular product detail system with intelligent template selection, 
              advanced sizing modules, and enhanced user experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-4 py-2 rounded-full">🚀 Modular Architecture</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">🤖 AI-Powered Features</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">📱 Mobile-First Design</span>
              <span className="bg-white/20 px-4 py-2 rounded-full">⚡ Performance Optimized</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Demo Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Test Different Product Templates
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Each product type automatically loads the appropriate template with its specialized modules and features. 
            Click on any product to experience the V2 system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {demoProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/products-v2/${product.id}`}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Template Badge */}
                  <div className={`bg-gradient-to-r ${templateColors[product.complexity]} text-white px-4 py-2 text-center`}>
                    <span className="font-semibold text-sm">{product.template} Template</span>
                  </div>
                  
                  {/* Product Image */}
                  <div className="aspect-[4/5] bg-gray-100">
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-burgundy-600">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Features Preview */}
                  <div className="px-6 pb-6">
                    <div className="text-xs text-gray-500 space-y-1">
                      {product.complexity === 'premium' && (
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">AI Sizing</span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Complex Grid</span>
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Alterations</span>
                        </div>
                      )}
                      {product.complexity === 'standard' && (
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Fit Options</span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Size Guide</span>
                        </div>
                      )}
                      {product.complexity === 'accessory' && (
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Bundle Builder</span>
                          <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded">Style Variations</span>
                        </div>
                      )}
                      {product.complexity === 'simple' && (
                        <div className="flex flex-wrap gap-1">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Basic Options</span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Quick Add</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              V2 System Features
            </h2>
            <p className="text-lg text-gray-600">
              Advanced features built into the new modular system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🧩',
                title: 'Modular Architecture',
                description: 'Mix and match components based on product complexity',
                features: ['Template System', 'Dynamic Modules', 'Reusable Components']
              },
              {
                icon: '🤖',
                title: 'AI-Powered Features',
                description: 'Intelligent recommendations and size predictions',
                features: ['Size Assistant', 'Style Matching', 'Outfit Recommendations']
              },
              {
                icon: '📱',
                title: 'Mobile-First Design',
                description: 'Optimized for all screen sizes and touch interactions',
                features: ['Responsive Layout', 'Touch Gestures', 'Fast Performance']
              },
              {
                icon: '🎨',
                title: 'Enhanced UX',
                description: 'Smooth animations and intuitive interactions',
                features: ['Framer Motion', 'Micro-interactions', 'Progressive Enhancement']
              },
              {
                icon: '🛒',
                title: 'Advanced Commerce',
                description: 'Bundle builders and complex product configurations',
                features: ['Bundle Pricing', 'Color Grids', 'Multi-variant Selection']
              },
              {
                icon: '⚡',
                title: 'Performance Optimized',
                description: 'Fast loading and efficient code splitting',
                features: ['Lazy Loading', 'Code Splitting', 'Image Optimization']
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-1">
                  {feature.features.map((item, i) => (
                    <li key={i} className="text-sm text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-burgundy-500 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-burgundy-600 to-gold-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience V2?
          </h2>
          <p className="text-xl mb-8">
            Test the new system with different product types and see how each template adapts to provide the optimal shopping experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/products-v2/demo-premium-suit"
              className="bg-white text-burgundy-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Try Premium Template
            </Link>
            <Link 
              href="/products" 
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Compare with V1
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsV2DemoPage;