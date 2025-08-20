'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/hooks/useCart';
import { TemplateProps } from '../types';
import StandardSizingModule from '../modules/StandardSizingModule';

const StandardTemplate: React.FC<TemplateProps> = ({ product, className = '' }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFit, setSelectedFit] = useState<string>('');
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
      metadata: {
        selectedFit
      }
    });
  };

  const originalPrice = product.originalPrice || product.price * 1.2;
  const savings = originalPrice - product.price;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">
          {product.name}
        </h1>
        {product.description && (
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Rating & Basic Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="h-4 w-4 text-gold-400" />
            ))}
            <span className="text-sm text-gray-600 ml-1">(89 reviews)</span>
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
            {savings > 0 && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  Save ${savings.toFixed(2)}
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Free shipping on orders over $75
          </p>
        </div>

        {/* Standard Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            Free Shipping
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
            Easy Returns
          </div>
          {product.inStock && (
            <div className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm">
              In Stock
            </div>
          )}
        </div>
      </div>

      {/* Size Selection */}
      <StandardSizingModule
        product={product}
        selectedSize={selectedSize}
        selectedFit={selectedFit}
        onSizeSelect={setSelectedSize}
        onFitSelect={setSelectedFit}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />

      {/* Color Options (if applicable) */}
      {product.color && (
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">
            Color
          </label>
          <div className="flex space-x-2">
            {[product.color, 'White', 'Light Blue'].map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 ${
                  selectedColor === color
                    ? 'border-burgundy-500 ring-2 ring-burgundy-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ 
                  backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                 color.toLowerCase() === 'light blue' ? '#87CEEB' :
                                 color.toLowerCase() 
                }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
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

        <div className="space-y-3">
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-burgundy-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-burgundy-700 transition-colors"
          >
            Add to Cart - ${(product.price * quantity).toFixed(2)}
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

      {/* Product Features */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Product Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: (
                <svg className="w-5 h-5 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Quality Materials',
              description: 'Premium cotton blend fabric'
            },
            {
              icon: (
                <svg className="w-5 h-5 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ),
              title: 'Easy Care',
              description: 'Machine washable and wrinkle-resistant'
            },
            {
              icon: (
                <svg className="w-5 h-5 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Fast Shipping',
              description: 'Ships within 1-2 business days'
            },
            {
              icon: (
                <svg className="w-5 h-5 text-burgundy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: '1 Year Guarantee',
              description: 'Quality assurance and satisfaction guarantee'
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

      {/* Product Details */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Specifications</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Material: Cotton blend</li>
              <li>• Fit: Available in multiple fits</li>
              <li>• Care: Machine washable</li>
              <li>• Season: Year-round</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2 text-sm">Sizing</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• True to size fit</li>
              <li>• Consult size chart for best fit</li>
              <li>• Available in S-XXL</li>
              <li>• Model wears size M</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Reviews Preview */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Customer Reviews</h3>
          <button className="text-sm text-burgundy-600 hover:text-burgundy-500">
            View all reviews
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'John D.', rating: 5, comment: 'Great quality and perfect fit. Very happy with this purchase!' },
            { name: 'Mike S.', rating: 4, comment: 'Good value for money. The fabric feels premium.' }
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

export default StandardTemplate;