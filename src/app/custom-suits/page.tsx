'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Package, ShoppingCart, Sparkles, X } from 'lucide-react';
import { stripeProducts, availableSizes } from '@/lib/services/stripeProductService';
import { getSuitImages } from '@/lib/data/suitImages';
import { dressShirtProducts } from '@/lib/products/dressShirtProducts';
import { tieProducts } from '@/lib/products/tieProducts';
import { useCart } from '@/hooks/useCart';

interface Selection {
  suit: {
    color: string;
    type: '2-piece' | '3-piece';
    size: string;
    price: number;
  } | null;
  shirt: {
    color: string;
    fit: 'slim' | 'classic';
    size: string;
    price: number;
  } | null;
  tie: {
    color: string;
    style: string;
    price: number;
  } | null;
}

export default function CustomSuitsPage() {
  const { addItem } = useCart();
  const [currentStep, setCurrentStep] = useState<'suit' | 'shirt' | 'tie' | 'review'>('suit');
  const [selection, setSelection] = useState<Selection>({
    suit: null,
    shirt: null,
    tie: null,
  });
  
  // Calculate bundle price with discount
  const bundlePrice = useMemo(() => {
    const basePrice = 
      (selection.suit?.price || 0) + 
      (selection.shirt?.price || 0) + 
      (selection.tie?.price || 0);
    
    // Apply 15% discount for complete bundles
    if (selection.suit && selection.shirt && selection.tie) {
      return {
        original: basePrice,
        discounted: basePrice * 0.85,
        savings: basePrice * 0.15
      };
    }
    
    return { original: basePrice, discounted: basePrice, savings: 0 };
  }, [selection]);
  
  const handleAddToCart = () => {
    if (!selection.suit || !selection.shirt || !selection.tie) return;
    
    // Add each item to cart with bundle discount applied
    const discountMultiplier = 0.85; // 15% off
    
    addItem({
      id: `suit-${selection.suit.color}-${selection.suit.type}`,
      name: `${selection.suit.color.charAt(0).toUpperCase() + selection.suit.color.slice(1).replace(/([A-Z])/g, ' $1')} Suit (${selection.suit.type})`,
      price: selection.suit.price * discountMultiplier,
      originalPrice: selection.suit.price,
      image: getSuitImages(selection.suit.color).main,
      size: selection.suit.size,
      quantity: 1
    });
    
    addItem({
      id: `shirt-${selection.shirt.color}-${selection.shirt.fit}`,
      name: `${selection.shirt.color} Dress Shirt (${selection.shirt.fit} fit)`,
      price: selection.shirt.price * discountMultiplier,
      originalPrice: selection.shirt.price,
      image: dressShirtProducts.colors.find(c => c.id === selection.shirt!.color)?.imageUrl || '',
      size: selection.shirt.size,
      quantity: 1
    });
    
    addItem({
      id: `tie-${selection.tie.color}-${selection.tie.style}`,
      name: `${selection.tie.color} ${selection.tie.style === 'bowtie' ? 'Bow Tie' : 'Tie'}`,
      price: selection.tie.price * discountMultiplier,
      originalPrice: selection.tie.price,
      image: tieProducts.colors.find(t => t.displayName === selection.tie!.color)?.imageUrl || '',
      quantity: 1
    });
    
    // Show success message or redirect
    alert('Bundle added to cart!');
  };
  
  const suits = Object.entries(stripeProducts.suits).map(([color, data]) => ({
    color,
    displayName: color.charAt(0).toUpperCase() + color.slice(1).replace(/([A-Z])/g, ' $1'),
    images: getSuitImages(color),
    twoPiecePrice: 179.99,
    threePiecePrice: 199.99,
    ...data
  }));
  
  const steps = [
    { id: 'suit', label: 'Choose Suit', icon: '🤵' },
    { id: 'shirt', label: 'Choose Shirt', icon: '👔' },
    { id: 'tie', label: 'Choose Tie', icon: '👔' },
    { id: 'review', label: 'Review', icon: '✓' },
  ];
  
  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Custom Bundle Builder</h1>
            <div className="flex items-center gap-4">
              {bundlePrice.savings > 0 && (
                <div className="text-sm">
                  <span className="text-green-600 font-semibold">
                    Save ${bundlePrice.savings.toFixed(2)}
                  </span>
                  <span className="text-gray-500 ml-2">(15% off)</span>
                </div>
              )}
              <div className="text-xl font-bold">
                ${bundlePrice.discounted.toFixed(2)}
              </div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (index <= getCurrentStepIndex()) {
                      setCurrentStep(step.id as any);
                    }
                  }}
                  disabled={index > getCurrentStepIndex() && !selection[step.id as keyof Selection]}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    currentStep === step.id
                      ? 'bg-black text-white'
                      : index <= getCurrentStepIndex()
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="text-lg">{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 mx-2 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Suit Selection */}
          {currentStep === 'suit' && (
            <motion.div
              key="suit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Step 1: Choose Your Suit</h2>
                <p className="text-gray-600">Select a color and style for your suit</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {suits.map((suit) => (
                  <div
                    key={suit.color}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selection.suit?.color === suit.color
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelection({
                        ...selection,
                        suit: {
                          color: suit.color,
                          type: selection.suit?.type || '2-piece',
                          size: selection.suit?.size || '40R',
                          price: selection.suit?.type === '3-piece' ? 199.99 : 179.99
                        }
                      });
                    }}
                  >
                    <div className="aspect-[3/4] relative">
                      <Image
                        src={suit.images.main}
                        alt={suit.displayName}
                        fill
                        className="object-cover"
                      />
                      {selection.suit?.color === suit.color && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{suit.displayName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        From $179.99
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {selection.suit && (
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                  <h3 className="font-semibold">Customize Your Selection</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Suit Type</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelection({
                              ...selection,
                              suit: { ...selection.suit!, type: '2-piece', price: 179.99 }
                            });
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg border ${
                            selection.suit.type === '2-piece'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          2-Piece ($179.99)
                        </button>
                        <button
                          onClick={() => {
                            setSelection({
                              ...selection,
                              suit: { ...selection.suit!, type: '3-piece', price: 199.99 }
                            });
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg border ${
                            selection.suit.type === '3-piece'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          3-Piece ($199.99)
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Size</label>
                      <select
                        value={selection.suit.size}
                        onChange={(e) => {
                          setSelection({
                            ...selection,
                            suit: { ...selection.suit!, size: e.target.value }
                          });
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        {availableSizes.suits.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setCurrentStep('shirt')}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Continue to Shirt Selection
                  </button>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Shirt Selection */}
          {currentStep === 'shirt' && (
            <motion.div
              key="shirt"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Step 2: Choose Your Shirt</h2>
                <p className="text-gray-600">Select a color and fit for your dress shirt</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {dressShirtProducts.colors.map((shirt) => (
                  <div
                    key={shirt.id}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selection.shirt?.color === shirt.id
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelection({
                        ...selection,
                        shirt: {
                          color: shirt.id,
                          fit: selection.shirt?.fit || 'slim',
                          size: selection.shirt?.size || '16',
                          price: 39.99
                        }
                      });
                    }}
                  >
                    <div className="aspect-[3/4] relative">
                      <Image
                        src={shirt.imageUrl}
                        alt={shirt.name}
                        fill
                        className="object-cover"
                      />
                      {selection.shirt?.color === shirt.id && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full border-2 border-white shadow-md"
                           style={{ backgroundColor: shirt.hex }} />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm">{shirt.name}</h3>
                      <p className="text-xs text-gray-600 mt-1">$39.99</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {selection.shirt && (
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                  <h3 className="font-semibold">Customize Your Selection</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Fit</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelection({
                              ...selection,
                              shirt: { ...selection.shirt!, fit: 'slim' }
                            });
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg border ${
                            selection.shirt.fit === 'slim'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          Slim Fit
                        </button>
                        <button
                          onClick={() => {
                            setSelection({
                              ...selection,
                              shirt: { ...selection.shirt!, fit: 'classic' }
                            });
                          }}
                          className={`flex-1 py-2 px-4 rounded-lg border ${
                            selection.shirt.fit === 'classic'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          Classic Fit
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Neck Size</label>
                      <select
                        value={selection.shirt.size}
                        onChange={(e) => {
                          setSelection({
                            ...selection,
                            shirt: { ...selection.shirt!, size: e.target.value }
                          });
                        }}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        {availableSizes.shirts.map(size => (
                          <option key={size} value={size}>{size}"</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setCurrentStep('tie')}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Continue to Tie Selection
                  </button>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Tie Selection */}
          {currentStep === 'tie' && (
            <motion.div
              key="tie"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Step 3: Choose Your Tie</h2>
                <p className="text-gray-600">Select a color and style to complete your outfit</p>
              </div>
              
              {/* Style Selection */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Select Tie Style</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'classic', label: 'Classic Tie', icon: '👔', price: 19.99 },
                    { id: 'skinny', label: 'Skinny Tie', icon: '🪢', price: 19.99 },
                    { id: 'bowtie', label: 'Bow Tie', icon: '🎀', price: 24.99 },
                    { id: 'slim', label: 'Slim Tie', icon: '👔', price: 19.99 }
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => {
                        setSelection({
                          ...selection,
                          tie: {
                            color: selection.tie?.color || 'Navy',
                            style: style.id,
                            price: style.price
                          }
                        });
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selection.tie?.style === style.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{style.icon}</div>
                      <div className="font-medium">{style.label}</div>
                      <div className="text-sm text-gray-600">${style.price}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Color Selection */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Select Tie Color</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {tieProducts.colors.slice(0, 24).map((tie) => (
                    <div
                      key={tie.id}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selection.tie?.color === tie.displayName
                          ? 'border-blue-500 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelection({
                          ...selection,
                          tie: {
                            color: tie.displayName,
                            style: selection.tie?.style || 'classic',
                            price: selection.tie?.style === 'bowtie' ? 24.99 : 19.99
                          }
                        });
                      }}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={tie.imageUrl}
                          alt={tie.displayName}
                          fill
                          className="object-cover"
                        />
                        {selection.tie?.color === tie.displayName && (
                          <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="text-xs font-medium text-center">{tie.displayName}</h3>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Link href="/collections/ties" className="inline-flex items-center gap-2 mt-4 text-sm text-blue-600 hover:text-blue-700">
                  View all 80+ tie colors
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              {selection.tie && (
                <button
                  onClick={() => setCurrentStep('review')}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Review Bundle
                </button>
              )}
            </motion.div>
          )}
          
          {/* Review & Checkout */}
          {currentStep === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Review Your Bundle</h2>
                <p className="text-gray-600">Here's your custom outfit combination</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Suit */}
                {selection.suit && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold">Suit</h3>
                      <button
                        onClick={() => setCurrentStep('suit')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="aspect-[3/4] relative mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={getSuitImages(selection.suit.color).main}
                        alt="Selected suit"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Color:</strong> {selection.suit.color.charAt(0).toUpperCase() + selection.suit.color.slice(1).replace(/([A-Z])/g, ' $1')}</p>
                      <p><strong>Type:</strong> {selection.suit.type}</p>
                      <p><strong>Size:</strong> {selection.suit.size}</p>
                      <p className="text-lg font-semibold">${selection.suit.price}</p>
                    </div>
                  </div>
                )}
                
                {/* Shirt */}
                {selection.shirt && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold">Shirt</h3>
                      <button
                        onClick={() => setCurrentStep('shirt')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="aspect-[3/4] relative mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={dressShirtProducts.colors.find(c => c.id === selection.shirt!.color)?.imageUrl || ''}
                        alt="Selected shirt"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Color:</strong> {selection.shirt.color}</p>
                      <p><strong>Fit:</strong> {selection.shirt.fit} fit</p>
                      <p><strong>Size:</strong> {selection.shirt.size}"</p>
                      <p className="text-lg font-semibold">${selection.shirt.price}</p>
                    </div>
                  </div>
                )}
                
                {/* Tie */}
                {selection.tie && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold">Tie</h3>
                      <button
                        onClick={() => setCurrentStep('tie')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="aspect-[3/4] relative mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={tieProducts.colors.find(t => t.displayName === selection.tie!.color)?.imageUrl || ''}
                        alt="Selected tie"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Color:</strong> {selection.tie.color}</p>
                      <p><strong>Style:</strong> {selection.tie.style === 'bowtie' ? 'Bow Tie' : selection.tie.style.charAt(0).toUpperCase() + selection.tie.style.slice(1) + ' Tie'}</p>
                      <p className="text-lg font-semibold">${selection.tie.price}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Price Summary */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Price Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${bundlePrice.original.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Bundle Discount (15%)</span>
                    <span>-${bundlePrice.savings.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${bundlePrice.discounted.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full mt-6 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add Bundle to Cart
                </button>
              </div>
              
              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-100 rounded-lg p-4">
                  <Package className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-gray-600">On all bundle orders</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Style Consultation</p>
                  <p className="text-sm text-gray-600">Free virtual session included</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <Check className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}