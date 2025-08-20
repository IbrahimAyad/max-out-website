'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, Minus, ShoppingBag, Star, Check, X, Sparkles, ArrowRight } from 'lucide-react';

interface BundleItem {
  id: string;
  name: string;
  category: 'suit' | 'shirt' | 'tie' | 'shoes' | 'accessories';
  price: number;
  image: string;
  description: string;
  colors?: string[];
  sizes?: string[];
  premium?: boolean;
}

interface BundleOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  bundlePrice: number;
  savings: number;
  items: BundleItem[];
  popular?: boolean;
}

const bundleOptions: BundleOption[] = [
  {
    id: 'essential',
    name: 'Essential',
    description: 'Complete professional look with quality basics',
    basePrice: 249,
    bundlePrice: 199,
    savings: 50,
    items: [
      {
        id: 'navy-suit',
        name: 'Navy Business Suit',
        category: 'suit',
        price: 149,
        image: '/placeholder-suit.jpg',
        description: 'Classic navy wool blend suit with modern fit',
        colors: ['Navy', 'Charcoal', 'Black'],
        sizes: ['38R', '40R', '42R', '44R']
      },
      {
        id: 'white-shirt',
        name: 'White Dress Shirt',
        category: 'shirt',
        price: 49,
        image: '/placeholder-shirt.jpg',
        description: 'Crisp cotton dress shirt with French cuffs',
        colors: ['White', 'Light Blue'],
        sizes: ['15.5', '16', '16.5', '17']
      },
      {
        id: 'silk-tie',
        name: 'Silk Tie',
        category: 'tie',
        price: 29,
        image: '/placeholder-tie.jpg',
        description: 'Premium silk tie in classic patterns',
        colors: ['Burgundy', 'Navy', 'Gold', 'Silver']
      },
      {
        id: 'leather-shoes',
        name: 'Leather Dress Shoes',
        category: 'shoes',
        price: 89,
        image: '/placeholder-shoes.jpg',
        description: 'Genuine leather Oxford dress shoes',
        colors: ['Black', 'Brown'],
        sizes: ['8', '9', '10', '11', '12']
      }
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Elevated style with designer details',
    basePrice: 299,
    bundlePrice: 229,
    savings: 70,
    popular: true,
    items: [
      {
        id: 'designer-suit',
        name: 'Designer Wool Suit',
        category: 'suit',
        price: 199,
        image: '/placeholder-suit.jpg',
        description: '100% wool designer suit with premium construction',
        colors: ['Charcoal', 'Navy', 'Black', 'Gray'],
        sizes: ['38R', '40R', '42R', '44R'],
        premium: true
      },
      {
        id: 'premium-shirt',
        name: 'Premium Dress Shirt',
        category: 'shirt',
        price: 69,
        image: '/placeholder-shirt.jpg',
        description: 'Egyptian cotton shirt with mother-of-pearl buttons',
        colors: ['White', 'Light Blue', 'Lavender'],
        sizes: ['15.5', '16', '16.5', '17'],
        premium: true
      },
      {
        id: 'luxury-tie',
        name: 'Luxury Silk Tie',
        category: 'tie',
        price: 49,
        image: '/placeholder-tie.jpg',
        description: 'Hand-finished luxury silk tie',
        colors: ['Burgundy', 'Navy', 'Gold', 'Silver', 'Emerald'],
        premium: true
      },
      {
        id: 'premium-shoes',
        name: 'Italian Leather Shoes',
        category: 'shoes',
        price: 149,
        image: '/placeholder-shoes.jpg',
        description: 'Handcrafted Italian leather dress shoes',
        colors: ['Black', 'Brown', 'Burgundy'],
        sizes: ['8', '9', '10', '11', '12'],
        premium: true
      },
      {
        id: 'cufflinks',
        name: 'Premium Cufflinks',
        category: 'accessories',
        price: 39,
        image: '/placeholder-product.jpg',
        description: 'Sterling silver cufflinks with elegant design',
        premium: true
      }
    ]
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Ultimate sophistication with bespoke touches',
    basePrice: 399,
    bundlePrice: 249,
    savings: 150,
    items: [
      {
        id: 'bespoke-suit',
        name: 'Bespoke Wool Suit',
        category: 'suit',
        price: 299,
        image: '/placeholder-suit.jpg',
        description: 'Made-to-measure suit with premium wool fabric',
        colors: ['Charcoal', 'Navy', 'Black', 'Gray', 'Pinstripe'],
        sizes: ['Custom Fit'],
        premium: true
      },
      {
        id: 'luxury-shirt',
        name: 'Bespoke Dress Shirt',
        category: 'shirt',
        price: 99,
        image: '/placeholder-shirt.jpg',
        description: 'Custom-tailored shirt with monogramming',
        colors: ['White', 'Light Blue', 'Lavender', 'Pink'],
        sizes: ['Custom Fit'],
        premium: true
      },
      {
        id: 'designer-tie',
        name: 'Designer Silk Tie',
        category: 'tie',
        price: 79,
        image: '/placeholder-tie.jpg',
        description: 'Limited edition designer silk tie',
        colors: ['Burgundy', 'Navy', 'Gold', 'Silver', 'Emerald', 'Royal Blue'],
        premium: true
      },
      {
        id: 'luxury-shoes',
        name: 'Handmade Dress Shoes',
        category: 'shoes',
        price: 249,
        image: '/placeholder-shoes.jpg',
        description: 'Handmade leather shoes with Goodyear welt construction',
        colors: ['Black', 'Brown', 'Burgundy', 'Navy'],
        sizes: ['8', '9', '10', '11', '12'],
        premium: true
      },
      {
        id: 'luxury-accessories',
        name: 'Luxury Accessories Set',
        category: 'accessories',
        price: 99,
        image: '/placeholder-product.jpg',
        description: 'Premium cufflinks, tie clip, and pocket square',
        premium: true
      }
    ]
  }
];

interface LuxuryBundleBuilderProps {
  onAddToCart?: (bundle: BundleOption, selectedOptions: Record<string, any>) => void;
}

export function LuxuryBundleBuilder({ onAddToCart }: LuxuryBundleBuilderProps) {
  const [selectedBundle, setSelectedBundle] = useState<BundleOption>(bundleOptions[1]); // Start with Premium
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleBundleSelect = (bundle: BundleOption) => {
    setSelectedBundle(bundle);
    setSelectedOptions({});
    setCurrentStep(0);
    setIsCustomizing(false);
  };

  const handleOptionSelect = (itemId: string, option: string, value: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [option]: value
      }
    }));
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(selectedBundle, selectedOptions);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h1 className="text-5xl md:text-6xl font-light text-gray-900">
            Bundle Builder
          </h1>
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
        <div className="w-24 h-px bg-gray-300 mx-auto mb-6" />
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Create your perfect ensemble with our curated bundles. Choose from our signature collections 
          and customize every detail to match your style.
        </p>
      </motion.div>

      {/* Bundle Selection */}
      <section className="mb-16">
        <h2 className="text-3xl font-light text-center mb-12">Choose Your Collection</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {bundleOptions.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-pointer transition-all duration-500 ${
                selectedBundle.id === bundle.id
                  ? 'transform scale-105 z-10'
                  : 'hover:transform hover:scale-102'
              }`}
              onClick={() => handleBundleSelect(bundle)}
            >
              {/* Popular Badge */}
              {bundle.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              <div className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ${
                selectedBundle.id === bundle.id
                  ? 'ring-4 ring-gray-900 shadow-2xl'
                  : 'shadow-lg hover:shadow-xl border border-gray-200'
              }`}>
                {/* Header */}
                <div className={`p-8 text-center ${
                  selectedBundle.id === bundle.id
                    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white'
                    : 'bg-gradient-to-br from-gray-50 to-white'
                }`}>
                  <h3 className="text-2xl font-semibold mb-2">{bundle.name}</h3>
                  <p className={`text-sm mb-6 ${
                    selectedBundle.id === bundle.id ? 'text-gray-200' : 'text-gray-600'
                  }`}>
                    {bundle.description}
                  </p>
                  
                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      <span className={`text-3xl font-bold ${
                        selectedBundle.id === bundle.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        ${bundle.bundlePrice}
                      </span>
                      <span className={`text-lg line-through ${
                        selectedBundle.id === bundle.id ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        ${bundle.basePrice}
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${
                      selectedBundle.id === bundle.id ? 'text-green-300' : 'text-green-600'
                    }`}>
                      Save ${bundle.savings}
                    </p>
                  </div>
                </div>
                
                {/* Items Preview */}
                <div className="p-6">
                  <div className="space-y-3">
                    {bundle.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedBundle.id === bundle.id
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        {item.premium && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Select Button */}
                <div className="p-6 pt-0">
                  <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedBundle.id === bundle.id
                      ? 'bg-gray-900 text-white transform scale-105 shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    {selectedBundle.id === bundle.id ? 'Selected' : 'Select Bundle'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Customization Section */}
      <AnimatePresence>
        {selectedBundle && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-16"
          >
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-light">Customize Your {selectedBundle.name} Bundle</h2>
                <button
                  onClick={() => setIsCustomizing(!isCustomizing)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {isCustomizing ? 'Hide Options' : 'Customize'}
                  <ArrowRight className={`w-4 h-4 transition-transform ${
                    isCustomizing ? 'rotate-90' : ''
                  }`} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedBundle.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <span className="text-lg font-bold text-gray-900">${item.price}</span>
                      </div>
                    </div>

                    {/* Color Selection */}
                    {item.colors && isCustomizing && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {item.colors.map((color) => (
                            <button
                              key={color}
                              onClick={() => handleOptionSelect(item.id, 'color', color)}
                              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                                selectedOptions[item.id]?.color === color
                                  ? 'bg-gray-900 text-white border-gray-900'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Selection */}
                    {item.sizes && isCustomizing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {item.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => handleOptionSelect(item.id, 'size', size)}
                              className={`px-3 py-1 text-xs rounded-full border transition-all ${
                                selectedOptions[item.id]?.size === size
                                  ? 'bg-gray-900 text-white border-gray-900'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Summary & Checkout */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {selectedBundle.name} Bundle Selected
            </h3>
            <p className="text-gray-600 mb-4">{selectedBundle.description}</p>
            
            <div className="flex items-center gap-4 justify-center lg:justify-start">
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-900">
                  ${selectedBundle.bundlePrice}
                </span>
                <p className="text-sm text-gray-500">Bundle Price</p>
              </div>
              <div className="text-center">
                <span className="text-xl text-gray-500 line-through">
                  ${selectedBundle.basePrice}
                </span>
                <p className="text-sm text-gray-500">Regular Price</p>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold text-green-600">
                  ${selectedBundle.savings}
                </span>
                <p className="text-sm text-gray-500">You Save</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              Add Bundle to Cart
            </button>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>Free alterations included</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}