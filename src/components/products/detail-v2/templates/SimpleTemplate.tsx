'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/hooks/useCart';
import { TemplateProps } from '../types';

const SimpleTemplate: React.FC<TemplateProps> = ({ product, className = '' }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity,
      stripePriceId: product.stripePriceId || '',
      selectedSize: selectedSize || 'One Size',
      category: product.category,
    });
  };

  // Simple size options for basic items
  const sizeOptions = ['One Size', 'Small', 'Medium', 'Large'];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {product.name}
        </h1>
        
        {product.description && (
          <p className="text-gray-600">
            {product.description}
          </p>
        )}

        {/* Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {[...Array(4)].map((_, i) => (
              <StarIcon key={i} className="h-4 w-4 text-gold-400" />
            ))}
            <StarIcon className="h-4 w-4 text-gray-300" />
            <span className="text-sm text-gray-600 ml-1">(23 reviews)</span>
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
          </div>
          <p className="text-sm text-gray-600">
            Free shipping on orders over $75
          </p>
        </div>

        {/* Simple Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            In Stock
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
            Fast Shipping
          </div>
        </div>
      </div>

      {/* Simple Size Selection (if applicable) */}
      {product.category !== 'accessories' && (
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">
            Size
          </label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-md border transition-all ${
                  selectedSize === size
                    ? 'border-burgundy-500 bg-burgundy-50 text-burgundy-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pack Quantities (for basic items like socks, etc.) */}
      {product.category === 'accessories' && (
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">
            Pack Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { pack: '3-Pack', price: product.price, savings: 0 },
              { pack: '6-Pack', price: product.price * 1.8, savings: product.price * 0.2 },
              { pack: '12-Pack', price: product.price * 3.2, savings: product.price * 0.8 }
            ].map((option) => (
              <div
                key={option.pack}
                className="border border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-burgundy-500 transition-colors"
              >
                <div className="font-semibold text-gray-900">{option.pack}</div>
                <div className="text-burgundy-600 font-bold">${option.price.toFixed(2)}</div>
                {option.savings > 0 && (
                  <div className="text-xs text-green-600">Save ${option.savings.toFixed(2)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selection */}
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

      {/* Add to Cart */}
      <div className="space-y-3">
        <motion.button
          onClick={handleAddToCart}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-burgundy-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-burgundy-700 transition-colors"
        >
          Add to Cart - ${(product.price * quantity).toFixed(2)}
        </motion.button>
        
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center space-x-2 border border-burgundy-600 text-burgundy-600 py-2 px-4 rounded-lg font-medium hover:bg-burgundy-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Save</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Basic Features */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
        <div className="space-y-2">
          {[
            'High-quality materials',
            'Comfortable and durable',
            'Available in multiple options',
            'Great value for money'
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-burgundy-100 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 text-burgundy-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Simple Product Details */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 mb-1 text-sm">Description</h4>
            <p className="text-sm text-gray-600">
              {product.description || `Quality ${product.category} designed for everyday use. Made with attention to detail and built to last.`}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-1 text-sm">Specifications</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Category: {product.category}</li>
              <li>• Material: Premium quality materials</li>
              <li>• Care: Follow care instructions</li>
              <li>• Origin: Quality crafted</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-900">Satisfaction Guaranteed</h4>
            <p className="text-sm text-green-700">30-day return policy • Free shipping over $75 • Customer support</p>
          </div>
        </div>
      </div>

      {/* Simple Reviews */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Customer Reviews</h3>
          <div className="flex items-center space-x-1">
            {[...Array(4)].map((_, i) => (
              <StarIcon key={i} className="h-4 w-4 text-gold-400" />
            ))}
            <StarIcon className="h-4 w-4 text-gray-300" />
            <span className="text-sm text-gray-600 ml-1">4.0 (23 reviews)</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded p-3">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-sm text-gray-900">Recent Buyer</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-3 w-3 text-gold-400" />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600">Great product at a fair price. Exactly what I needed!</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleTemplate;