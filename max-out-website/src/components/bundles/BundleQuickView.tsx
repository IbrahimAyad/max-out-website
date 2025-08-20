'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Heart, ShoppingBag, Sparkles, Tag, Clock, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface BundleQuickViewProps {
  bundle: any; // Changed to any to support multiple bundle types
  onClose: () => void;
}

export default function BundleQuickView({ bundle, onClose }: BundleQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addItem } = useCart();

  const sizes = ['36S', '38S', '40R', '42R', '44R', '46L', '48L'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      id: bundle.id,
      name: bundle.name,
      price: bundle.bundlePrice,
      image: bundle.imageUrl,
      quantity: 1,
      category: 'bundle',
      size: selectedSize,
      metadata: {
        suit: bundle.suit,
        shirt: bundle.shirt,
        tie: bundle.tie,
        pocketSquare: bundle.pocketSquare,
        originalPrice: bundle.originalPrice,
        savings: bundle.savings
      }
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">{bundle.name}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-8 p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={bundle.imageUrl}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                  priority
                />
                {bundle.trending && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Trending
                  </span>
                )}
                {bundle.aiScore && bundle.aiScore >= 95 && (
                  <span className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Pick
                  </span>
                )}
              </div>

              {/* Thumbnail Preview */}
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                  {bundle.suit.color} Suit
                </div>
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                  {bundle.shirt.color} Shirt
                </div>
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                  {bundle.tie ? `${bundle.tie.color} Tie` : bundle.pocketSquare ? `${bundle.pocketSquare.color} Pocket Square` : ''}
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              {/* Price */}
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-3xl font-bold">${bundle.bundlePrice}</span>
                  <span className="text-xl text-gray-400 line-through">${bundle.originalPrice}</span>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Save ${bundle.savings}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {Math.round((bundle.savings / bundle.originalPrice) * 100)}% off bundle price
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600">{bundle.description}</p>
              </div>

              {/* Bundle Contents with Images */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  This Bundle Includes:
                </h3>
                <div className="space-y-3">
                  {/* Suit */}
                  <div className="flex items-start gap-3">
                    {bundle.suit.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border">
                        <Image
                          src={bundle.suit.image}
                          alt={`${bundle.suit.color} Suit`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="font-medium">{bundle.suit.color} {bundle.suit.type} Suit</span>
                      <p className="text-sm text-gray-600">Premium wool blend, tailored fit</p>
                    </div>
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  </div>
                  
                  {/* Shirt */}
                  <div className="flex items-start gap-3">
                    {bundle.shirt.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border">
                        <Image
                          src={bundle.shirt.image}
                          alt={`${bundle.shirt.color} Shirt`}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className="font-medium">{bundle.shirt.color} {bundle.shirt.fit} Fit Shirt</span>
                      <p className="text-sm text-gray-600">100% cotton, wrinkle-resistant</p>
                    </div>
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  </div>
                  
                  {/* Tie or Pocket Square */}
                  {bundle.tie ? (
                    <div className="flex items-start gap-3">
                      {bundle.tie.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border">
                          <Image
                            src={bundle.tie.image}
                            alt={`${bundle.tie.color} Tie`}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <span className="font-medium">{bundle.tie.color} {bundle.tie.style}</span>
                        <p className="text-sm text-gray-600">Silk blend, handcrafted</p>
                      </div>
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    </div>
                  ) : bundle.pocketSquare ? (
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{bundle.pocketSquare.color} {bundle.pocketSquare.pattern} Pocket Square</span>
                        <p className="text-sm text-gray-600">Premium silk, elegant finish</p>
                      </div>
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Select Suit Size</h3>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasions */}
              <div>
                <h3 className="font-semibold mb-3">Perfect For:</h3>
                <div className="flex flex-wrap gap-2">
                  {(bundle?.occasions || []).map((occasion) => (
                    <span
                      key={occasion}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Free Express Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-gray-400" />
                    <span>Easy 30-Day Returns</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedSize
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add Bundle to Cart
                </button>
                <Link
                  href={`/bundles/${bundle.id}`}
                  className="w-full py-4 border-2 border-black rounded-lg font-semibold hover:bg-gray-50 transition-colors block text-center"
                >
                  View Full Details
                </Link>
              </div>

              {/* Customization CTA */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Want to customize this combination?
                </p>
                <Link
                  href="/custom-suits"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create Your Own Bundle →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}