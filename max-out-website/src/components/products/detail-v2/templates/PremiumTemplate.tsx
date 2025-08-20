'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/hooks/useCart';
import { TemplateProps } from '../types';
import ComplexSizingModule from '../modules/ComplexSizingModule';
import AIRecommendationModule from '../modules/AIRecommendationModule';

const PremiumTemplate: React.FC<TemplateProps> = ({ product, className = '' }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity,
      stripePriceId: product.stripePriceId || '',
      selectedSize,
      selectedColor,
      category: product.category,
    });
  };

  const originalPrice = product.originalPrice || product.price * 1.3;
  const savings = originalPrice - product.price;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Product Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-lg text-gray-600 mt-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="h-5 w-5 text-gold-400" />
            ))}
            <span className="text-sm text-gray-600 ml-2">(124 reviews)</span>
          </div>
          <div className="text-sm text-gray-500">|</div>
          <div className="text-sm text-gray-600">SKU: {product.sku}</div>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-burgundy-600">
              ${product.price.toFixed(2)}
            </span>
            {savings > 0 && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Save ${savings.toFixed(2)}
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Or pay in 4 interest-free installments of ${(product.price / 4).toFixed(2)} with Klarna
          </p>
        </div>

        {/* Premium Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-1 bg-burgundy-50 text-burgundy-700 px-3 py-1 rounded-full text-sm">
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Premium Quality</span>
          </div>
          <div className="bg-gold-50 text-gold-700 px-3 py-1 rounded-full text-sm">
            Free Alterations
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            Free Shipping Over $200
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <AIRecommendationModule 
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />

      {/* Size Selection */}
      <ComplexSizingModule
        product={product}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-900">Quantity:</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
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

        <div className="space-y-3">
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:from-burgundy-700 hover:to-burgundy-800 transition-all shadow-lg"
          >
            Add to Cart - ${(product.price * quantity).toFixed(2)}
          </motion.button>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center space-x-2 border-2 border-burgundy-600 text-burgundy-600 py-3 px-4 rounded-lg font-semibold hover:bg-burgundy-50 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Wishlist</span>
            </button>
            <button className="flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Premium Features */}
      <div className="bg-gradient-to-r from-burgundy-50 to-gold-50 border border-burgundy-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: (
                <svg className="w-6 h-6 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              ),
              title: 'Master Craftsmanship',
              description: 'Hand-tailored by expert artisans with 20+ years experience'
            },
            {
              icon: (
                <svg className="w-6 h-6 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              ),
              title: 'Premium Fabrics',
              description: 'Italian wool and luxury materials sourced globally'
            },
            {
              icon: (
                <svg className="w-6 h-6 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Express Alterations',
              description: 'Professional alterations available in 24-48 hours'
            },
            {
              icon: (
                <svg className="w-6 h-6 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: 'Lifetime Guarantee',
              description: 'Satisfaction guaranteed with lifetime quality promise'
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Material: 100% Italian Wool</li>
              <li>• Weight: 260gsm Super 120s</li>
              <li>• Construction: Half-canvas</li>
              <li>• Origin: Crafted in Italy</li>
              <li>• Season: Year-round</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Care Instructions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Dry clean only</li>
              <li>• Store on wooden hangers</li>
              <li>• Press with pressing cloth</li>
              <li>• Professional steaming recommended</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumTemplate;