'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/hooks/useCart';
import { TemplateProps } from '../types';
import StyleVariationModule from '../modules/StyleVariationModule';
import BundleBuilderModule from '../modules/BundleBuilderModule';

const AccessoryTemplate: React.FC<TemplateProps> = ({ product, className = '' }) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [bundleMode, setBundleMode] = useState<'single' | 'bundle'>('single');
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedStyle && !selectedColor) {
      alert('Please select a style or color');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity,
      stripePriceId: product.stripePriceId || '',
      selectedSize: selectedStyle,
      selectedColor,
      category: product.category,
      metadata: {
        bundleMode
      }
    });
  };

  const isTie = product.category === 'ties' || product.name.toLowerCase().includes('tie');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex-1">
            {product.name}
          </h1>
          {isTie && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
              <span className="text-sm font-semibold text-purple-700 flex items-center space-x-1">
                <SparklesIcon className="w-4 h-4" />
                <span>Bundle & Save</span>
              </span>
            </div>
          )}
        </div>

        {product.description && (
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Rating & Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="h-4 w-4 text-gold-400" />
            ))}
            <span className="text-sm text-gray-600 ml-1">(156 reviews)</span>
          </div>
          <div className="text-sm text-gray-500">|</div>
          <div className="text-sm text-gray-600">SKU: {product.sku}</div>
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-burgundy-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600">each</span>
          </div>
          <p className="text-sm text-gray-600">
            Free shipping on orders over $75 • Buy more, save more!
          </p>
        </div>

        {/* Accessory Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            Free Shipping
          </div>
          <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
            Mix & Match
          </div>
          {isTie && (
            <div className="bg-gold-50 text-gold-700 px-3 py-1 rounded-full text-sm">
              80+ Colors Available
            </div>
          )}
        </div>
      </div>

      {/* Bundle Builder */}
      {isTie && (
        <BundleBuilderModule
          product={product}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      )}

      {/* Style Variations */}
      <StyleVariationModule
        product={product}
        selectedSize={selectedStyle}
        onSizeSelect={setSelectedStyle}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        {!isTie && (
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-900">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-3 py-2 border-x border-gray-300 min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all ${
              isTie 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                : 'bg-burgundy-600 text-white hover:bg-burgundy-700'
            }`}
          >
            {isTie ? 'Add to Bundle' : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
          </motion.button>
          
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center space-x-2 border border-burgundy-600 text-burgundy-600 py-2 px-4 rounded-lg font-medium hover:bg-burgundy-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Wishlist</span>
            </button>
            <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Color Expansion Section */}
      {isTie && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Explore Our Full Color Collection
            </h3>
            <p className="text-gray-600">
              Choose from over 80 colors and patterns to create your perfect ensemble
            </p>
            <div className="flex justify-center space-x-2">
              {['#FF0000', '#0066CC', '#228B22', '#800080', '#FFA500', '#FF1493'].map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
                <span className="text-xs text-gray-600">74+</span>
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              View All Colors
            </button>
          </div>
        </div>
      )}

      {/* Accessory Features */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Why Choose Our {product.category}?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: (
                <svg className="w-5 h-5 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Premium Materials',
              description: isTie ? 'Silk and polyester blend' : 'High-quality craftsmanship'
            },
            {
              icon: (
                <svg className="w-5 h-5 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2M9 3h6a2 2 0 012 2v12a4 4 0 01-4 4h-2" />
                </svg>
              ),
              title: 'Perfect Fit',
              description: isTie ? 'Adjustable and standard lengths' : 'Multiple size options'
            },
            {
              icon: (
                <svg className="w-5 h-5 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Fast Shipping',
              description: 'Ships within 24 hours'
            },
            {
              icon: (
                <svg className="w-5 h-5 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              ),
              title: 'Perfect for Gifting',
              description: 'Elegant gift packaging available'
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Styling Tips */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">Styling Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Perfect Pairings</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Navy suits for business meetings</li>
              <li>• Charcoal suits for evening events</li>
              <li>• Light colors for daytime occasions</li>
              {isTie && <li>• Mix patterns with solid shirts</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Care Instructions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Spot clean when needed</li>
              <li>• Store properly when not in use</li>
              <li>• Iron on low heat if necessary</li>
              {isTie && <li>• Avoid pulling or stretching</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Favorites */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Customer Favorites</h3>
          <button className="text-sm text-burgundy-600 hover:text-burgundy-500">
            View all reviews
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'David L.', rating: 5, comment: 'Perfect quality and great value! Bought 5 different colors.' },
            { name: 'Sarah M.', rating: 5, comment: 'Excellent for my wedding party. Everyone looked amazing!' }
          ].map((review, index) => (
            <div key={index} className="bg-gray-50 rounded p-3">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm text-gray-900">{review.name}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-3 w-3 ${i < review.rating ? 'text-gold-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccessoryTemplate;