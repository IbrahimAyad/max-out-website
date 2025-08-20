'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Check, Plus, Minus, Sparkles, Star, Zap } from 'lucide-react';

interface BundleOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice: number;
  image: string;
  features: string[];
  category: 'suits' | 'shirts' | 'accessories' | 'shoes';
  popular?: boolean;
  premium?: boolean;
}

interface Bundle {
  id: string;
  name: string;
  price: number;
  description: string;
  badge?: string;
  savings: number;
  includes: string[];
  options: {
    suits: BundleOption[];
    shirts: BundleOption[];
    accessories: BundleOption[];
    shoes: BundleOption[];
  };
}

const bundles: Bundle[] = [
  {
    id: 'essential',
    name: 'Essential Package',
    price: 199,
    description: 'Perfect starter package for any occasion',
    savings: 89,
    includes: ['Suit', 'Dress Shirt', 'Tie', 'Basic Alterations'],
    options: {
      suits: [
        {
          id: 'navy-classic',
          name: 'Navy Classic Suit',
          description: 'Timeless navy wool blend',
          basePrice: 149,
          originalPrice: 179,
          image: 'https://cdn.kctmenswear.com/suits/navy-classic/main.webp',
          features: ['Wool Blend', 'Classic Fit', 'Two Button'],
          category: 'suits',
          popular: true
        },
        {
          id: 'charcoal-business',
          name: 'Charcoal Business Suit',
          description: 'Professional charcoal grey',
          basePrice: 149,
          originalPrice: 179,
          image: 'https://cdn.kctmenswear.com/suits/charcoal-business/main.webp',
          features: ['Wool Blend', 'Modern Fit', 'Two Button'],
          category: 'suits'
        }
      ],
      shirts: [
        {
          id: 'white-classic',
          name: 'Classic White Shirt',
          description: 'Crisp white cotton dress shirt',
          basePrice: 39,
          originalPrice: 49,
          image: 'https://cdn.kctmenswear.com/shirts/white-classic/main.webp',
          features: ['100% Cotton', 'Spread Collar', 'French Cuffs'],
          category: 'shirts',
          popular: true
        },
        {
          id: 'light-blue',
          name: 'Light Blue Shirt',
          description: 'Subtle light blue dress shirt',
          basePrice: 39,
          originalPrice: 49,
          image: 'https://cdn.kctmenswear.com/shirts/light-blue/main.webp',
          features: ['100% Cotton', 'Point Collar', 'Barrel Cuffs'],
          category: 'shirts'
        }
      ],
      accessories: [
        {
          id: 'silk-tie-navy',
          name: 'Navy Silk Tie',
          description: 'Premium silk tie in navy',
          basePrice: 29,
          originalPrice: 39,
          image: 'https://cdn.kctmenswear.com/accessories/ties/navy-silk/main.webp',
          features: ['100% Silk', 'Classic Width', 'Hand Finished'],
          category: 'accessories',
          popular: true
        },
        {
          id: 'burgundy-tie',
          name: 'Burgundy Tie',
          description: 'Rich burgundy silk tie',
          basePrice: 29,
          originalPrice: 39,
          image: 'https://cdn.kctmenswear.com/accessories/ties/burgundy/main.webp',
          features: ['100% Silk', 'Classic Width', 'Hand Finished'],
          category: 'accessories'
        }
      ],
      shoes: [
        {
          id: 'black-oxford',
          name: 'Black Oxford Shoes',
          description: 'Classic leather oxford shoes',
          basePrice: 89,
          originalPrice: 119,
          image: 'https://cdn.kctmenswear.com/shoes/black-oxford/main.webp',
          features: ['Genuine Leather', 'Classic Last', 'Rubber Sole'],
          category: 'shoes'
        }
      ]
    }
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: 229,
    description: 'Enhanced package with premium selections',
    badge: 'Most Popular',
    savings: 141,
    includes: ['Premium Suit', 'Dress Shirt', 'Tie & Pocket Square', 'Premium Alterations', 'Garment Bag'],
    options: {
      suits: [
        {
          id: 'navy-premium',
          name: 'Navy Premium Suit',
          description: 'Premium wool navy suit',
          basePrice: 179,
          originalPrice: 229,
          image: 'https://cdn.kctmenswear.com/suits/navy-premium/main.webp',
          features: ['100% Wool', 'Slim Fit', 'Half Canvas'],
          category: 'suits',
          premium: true
        },
        {
          id: 'grey-premium',
          name: 'Grey Premium Suit',
          description: 'Premium charcoal grey wool',
          basePrice: 179,
          originalPrice: 229,
          image: 'https://cdn.kctmenswear.com/suits/grey-premium/main.webp',
          features: ['100% Wool', 'Modern Fit', 'Half Canvas'],
          category: 'suits',
          premium: true
        }
      ],
      shirts: [
        {
          id: 'premium-white',
          name: 'Premium White Shirt',
          description: 'Luxury cotton dress shirt',
          basePrice: 59,
          originalPrice: 79,
          image: 'https://cdn.kctmenswear.com/shirts/premium-white/main.webp',
          features: ['Egyptian Cotton', 'Spread Collar', 'Mother of Pearl Buttons'],
          category: 'shirts',
          premium: true
        }
      ],
      accessories: [
        {
          id: 'premium-tie-set',
          name: 'Premium Tie Set',
          description: 'Silk tie with matching pocket square',
          basePrice: 49,
          originalPrice: 69,
          image: 'https://cdn.kctmenswear.com/accessories/premium-tie-set/main.webp',
          features: ['Italian Silk', 'Matching Pocket Square', 'Gift Box'],
          category: 'accessories',
          premium: true
        }
      ],
      shoes: [
        {
          id: 'premium-oxford',
          name: 'Premium Oxford Shoes',
          description: 'Italian leather oxford shoes',
          basePrice: 129,
          originalPrice: 179,
          image: 'https://cdn.kctmenswear.com/shoes/premium-oxford/main.webp',
          features: ['Italian Leather', 'Blake Construction', 'Leather Sole'],
          category: 'shoes',
          premium: true
        }
      ]
    }
  },
  {
    id: 'luxury',
    name: 'Luxury Package',
    price: 249,
    description: 'Ultimate luxury experience with exclusive pieces',
    badge: 'Luxury',
    savings: 201,
    includes: ['Designer Suit', 'Premium Shirt', 'Complete Accessories', 'White Glove Service', 'Luxury Garment Care'],
    options: {
      suits: [
        {
          id: 'designer-navy',
          name: 'Designer Navy Suit',
          description: 'Designer wool with premium construction',
          basePrice: 219,
          originalPrice: 299,
          image: 'https://cdn.kctmenswear.com/suits/designer-navy/main.webp',
          features: ['Super 120s Wool', 'Full Canvas', 'Hand Padded Lapels'],
          category: 'suits',
          premium: true
        }
      ],
      shirts: [
        {
          id: 'luxury-white',
          name: 'Luxury White Shirt',
          description: 'Handcrafted luxury dress shirt',
          basePrice: 89,
          originalPrice: 129,
          image: 'https://cdn.kctmenswear.com/shirts/luxury-white/main.webp',
          features: ['Sea Island Cotton', 'Hand-Set Sleeves', 'Custom Monogram'],
          category: 'shirts',
          premium: true
        }
      ],
      accessories: [
        {
          id: 'luxury-accessories',
          name: 'Luxury Accessories Set',
          description: 'Complete luxury accessories package',
          basePrice: 89,
          originalPrice: 139,
          image: 'https://cdn.kctmenswear.com/accessories/luxury-set/main.webp',
          features: ['Silk Tie & Pocket Square', 'Cufflinks', 'Tie Bar', 'Boutonniere'],
          category: 'accessories',
          premium: true
        }
      ],
      shoes: [
        {
          id: 'luxury-oxford',
          name: 'Luxury Oxford Shoes',
          description: 'Handcrafted Italian leather shoes',
          basePrice: 189,
          originalPrice: 249,
          image: 'https://cdn.kctmenswear.com/shoes/luxury-oxford/main.webp',
          features: ['Hand-Lasted', 'Goodyear Welted', 'Cedar Shoe Trees'],
          category: 'shoes',
          premium: true
        }
      ]
    }
  }
];

interface InteractiveBundleBuilderProps {
  onBundleSelect?: (bundle: Bundle, selections: Record<string, BundleOption>) => void;
}

const InteractiveBundleBuilder = ({ onBundleSelect }: InteractiveBundleBuilderProps) => {
  const [selectedBundle, setSelectedBundle] = useState<Bundle>(bundles[1]); // Default to Premium
  const [selections, setSelections] = useState<Record<string, BundleOption>>({});
  const [step, setStep] = useState<'bundles' | 'customize'>('bundles');

  // Initialize with default selections
  useEffect(() => {
    if (selectedBundle) {
      const defaultSelections: Record<string, BundleOption> = {};
      Object.entries(selectedBundle.options).forEach(([category, options]) => {
        const popularOption = options.find(opt => opt.popular) || options[0];
        if (popularOption) {
          defaultSelections[category] = popularOption;
        }
      });
      setSelections(defaultSelections);
    }
  }, [selectedBundle]);

  const handleBundleSelect = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setStep('customize');
  };

  const handleOptionSelect = (category: string, option: BundleOption) => {
    setSelections(prev => ({ ...prev, [category]: option }));
  };

  const handleAddToCart = () => {
    if (onBundleSelect) {
      onBundleSelect(selectedBundle, selections);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (step === 'bundles') {
    return (
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Build Your Perfect Look
            </h2>
            <div className="w-12 h-px bg-gray-300 mx-auto mb-6" />
            <p className="text-gray-600 text-base md:text-lg font-light max-w-md mx-auto">
              Choose your package and customize every detail
            </p>
          </div>

          {/* Bundle Cards */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-12">
            {bundles.map((bundle, index) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative bg-white border-2 rounded-lg p-8 cursor-pointer transition-all duration-300
                  ${selectedBundle.id === bundle.id 
                    ? 'border-gray-900 shadow-luxury' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                  ${bundle.badge ? 'ring-2 ring-gold-400 ring-opacity-20' : ''}
                `}
                onClick={() => handleBundleSelect(bundle)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Badge */}
                {bundle.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gold-400 text-gray-900 px-4 py-1 rounded-full text-xs font-medium tracking-wide">
                      {bundle.badge}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    {bundle.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {bundle.description}
                  </p>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-light text-gray-900 mb-1">
                      {formatPrice(bundle.price)}
                    </div>
                    <div className="text-sm text-green-600">
                      Save {formatPrice(bundle.savings)}
                    </div>
                  </div>

                  {/* Includes */}
                  <div className="space-y-2 mb-8">
                    {bundle.includes.map((item, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-gray-900 text-white py-3 font-light tracking-wide hover:bg-gray-800 transition-colors duration-300">
                    Choose Package
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Customize step
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <button 
            onClick={() => setStep('bundles')}
            className="text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            ← Back to Packages
          </button>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Customize Your {selectedBundle.name}
          </h2>
          <div className="w-12 h-px bg-gray-300 mx-auto mb-6" />
          <p className="text-gray-600 text-lg">
            Total: <span className="font-medium">{formatPrice(selectedBundle.price)}</span>
          </p>
        </div>

        {/* Customization Categories */}
        <div className="space-y-12">
          {Object.entries(selectedBundle.options).map(([category, options]) => (
            <div key={category}>
              <h3 className="text-xl font-light text-gray-900 mb-6 capitalize">
                Choose Your {category.slice(0, -1)}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {options.map((option) => (
                  <motion.div
                    key={option.id}
                    className={`
                      relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-300
                      ${selections[category]?.id === option.id 
                        ? 'border-gray-900 bg-white shadow-luxury' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                    `}
                    onClick={() => handleOptionSelect(category, option)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {option.popular && (
                        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          Popular
                        </div>
                      )}
                      {option.premium && (
                        <div className="bg-gold-100 text-gold-700 px-2 py-1 rounded text-xs font-medium">
                          Premium
                        </div>
                      )}
                    </div>

                    {/* Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <Image
                        src={option.image}
                        alt={option.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {option.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {option.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-1 mb-4">
                        {option.features.map((feature, idx) => (
                          <div key={idx} className="text-xs text-gray-500">
                            • {feature}
                          </div>
                        ))}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-500 line-through mr-2">
                            {formatPrice(option.originalPrice)}
                          </span>
                          <span className="font-medium text-gray-900">
                            {formatPrice(option.basePrice)}
                          </span>
                        </div>
                        {selections[category]?.id === option.id && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add to Cart */}
        <div className="text-center mt-16">
          <motion.button
            onClick={handleAddToCart}
            className="bg-gray-900 text-white px-12 py-4 font-light tracking-wide hover:bg-gray-800 transition-colors duration-300 shadow-luxury"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add to Cart - {formatPrice(selectedBundle.price)}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBundleBuilder;