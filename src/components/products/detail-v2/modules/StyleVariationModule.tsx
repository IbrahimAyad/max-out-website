'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductModuleProps } from '../types';
import OptimizedImage from '@/components/ui/OptimizedImage';

const StyleVariationModule: React.FC<ProductModuleProps> = ({
  product,
  selectedSize,
  onSizeSelect,
  className = ''
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('');

  // Style variations for ties
  const styleOptions = [
    {
      id: 'pre-tied',
      name: 'Pre-tied',
      description: 'Adjustable neck strap',
      width: 'Standard',
      image: '/placeholder-tie.jpg',
      features: ['Easy to wear', 'Perfect knot every time', 'Adjustable 14"-18"']
    },
    {
      id: 'classic',
      name: 'Classic Tie',
      description: 'Traditional necktie',
      width: '3.25"',
      image: '/placeholder-tie.jpg',
      features: ['Traditional width', 'Versatile styling', '58" length']
    },
    {
      id: 'skinny',
      name: 'Skinny Tie',
      description: 'Modern narrow style',
      width: '2.75"',
      image: '/placeholder-tie.jpg',
      features: ['Contemporary look', 'Perfect for slim fits', '57" length']
    },
    {
      id: 'slim',
      name: 'Slim Tie',
      description: 'Balanced modern width',
      width: '2.25"',
      image: '/placeholder-tie.jpg',
      features: ['Modern classic', 'Versatile width', '58" length']
    }
  ];

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
    onSizeSelect?.(styleId); // Use size select for style
  };

  // Visual width indicators
  const WidthIndicator = ({ width }: { width: string }) => (
    <div className="flex items-center space-x-2 mt-2">
      <span className="text-xs text-gray-500">Width:</span>
      <div className="flex items-center">
        <div 
          className={`h-1 bg-burgundy-500 rounded ${
            width === '3.25"' ? 'w-6' : 
            width === '2.75"' ? 'w-5' : 
            width === '2.25"' ? 'w-4' : 'w-5'
          }`} 
        />
        <span className="text-xs text-gray-600 ml-2">{width}</span>
      </div>
    </div>
  );

  const isTie = product.category === 'ties' || 
               product.category === 'bowties' ||
               product.name.toLowerCase().includes('tie');

  if (!isTie) {
    // Fallback for non-tie accessories
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-3">
            Style Options
          </label>
          <div className="grid grid-cols-1 gap-3">
            <div className="border border-gray-300 rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Standard</h4>
              <p className="text-sm text-gray-600">Classic styling</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Style Selection */}
      <div>
        <label className="text-sm font-medium text-gray-900 block mb-4">
          Choose Your Style
        </label>
        
        <div className="grid grid-cols-1 gap-4">
          {styleOptions.map((style) => (
            <motion.div
              key={style.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStyleSelect(style.id)}
              className={`cursor-pointer rounded-lg border-2 transition-all ${
                selectedStyle === style.id
                  ? 'border-burgundy-500 bg-burgundy-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Style Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={style.image}
                      alt={style.name}
                      className="w-full h-full object-cover"
                      sizes="64px"
                    />
                  </div>
                  
                  {/* Style Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{style.name}</h4>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        selectedStyle === style.id
                          ? 'border-burgundy-500 bg-burgundy-500'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {selectedStyle === style.id && (
                          <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{style.description}</p>
                    
                    {/* Width Indicator */}
                    <WidthIndicator width={style.width} />
                    
                    {/* Features */}
                    <div className="mt-3">
                      <ul className="text-xs text-gray-500 space-y-1">
                        {style.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Style Comparison */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Width Comparison
        </h4>
        <div className="space-y-2">
          {[
            { name: 'Classic', width: '3.25"', bar: 'w-8' },
            { name: 'Skinny', width: '2.75"', bar: 'w-6' },
            { name: 'Slim', width: '2.25"', bar: 'w-5' }
          ].map((item) => (
            <div key={item.name} className="flex items-center space-x-3">
              <span className="text-xs text-gray-600 w-12">{item.name}</span>
              <div className={`h-2 bg-burgundy-400 rounded ${item.bar}`} />
              <span className="text-xs text-gray-500">{item.width}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Styling Tips */}
      {selectedStyle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Styling Tip
              </h4>
              <p className="text-sm text-gray-600">
                {selectedStyle === 'pre-tied' && "Pre-tied ties are perfect for formal events where you need a consistent, professional look."}
                {selectedStyle === 'classic' && "Classic ties work with all suit styles and are ideal for business and formal occasions."}
                {selectedStyle === 'skinny' && "Skinny ties pair excellently with slim-fit suits and modern blazers."}
                {selectedStyle === 'slim' && "Slim ties offer the perfect balance between classic and contemporary styling."}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected Style Summary */}
      {selectedStyle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-900">
                Selected: {styleOptions.find(s => s.id === selectedStyle)?.name}
              </p>
              <p className="text-xs text-green-700">
                Width: {styleOptions.find(s => s.id === selectedStyle)?.width}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StyleVariationModule;