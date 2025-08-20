'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  Clock, 
  Package,
  Wine,
  Martini
} from 'lucide-react';
import { CasualBundle } from '@/lib/products/casualBundles';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

interface CasualBundleQuickViewProps {
  bundle: CasualBundle;
  onClose: () => void;
}

export default function CasualBundleQuickView({ bundle, onClose }: CasualBundleQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
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
      category: 'casual-bundle',
      size: selectedSize,
      metadata: {
        suit: bundle.suit,
        shirt: bundle.shirt,
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
            <div className="flex items-center gap-3">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Wine className="w-4 h-4" />
                Cocktail Collection
              </span>
              <h2 className="text-2xl font-bold">{bundle.name}</h2>
            </div>
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
            {/* Left: Image */}
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
                  <span className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Trending
                  </span>
                )}
                {bundle.aiScore && bundle.aiScore >= 90 && (
                  <span className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Pick
                  </span>
                )}
              </div>

              {/* Style Note */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  <Martini className="w-5 h-5" />
                  <h4 className="font-semibold">Style Note</h4>
                </div>
                <p className="text-sm text-gray-700">
                  This relaxed cocktail look features a matching pocket square instead of a tie, 
                  perfect for evening events where you want to look polished but not overly formal.
                </p>
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
                    {Math.round((bundle.savings / bundle.originalPrice) * 100)}% off cocktail bundle
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600">{bundle.description}</p>
              </div>

              {/* Bundle Contents */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  This Bundle Includes:
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{bundle.suit.color} {bundle.suit.type} Suit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{bundle.shirt.color} {bundle.shirt.fit} Fit Shirt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{bundle.pocketSquare.color} Pocket Square</span>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Select Suit Size</h3>
                  <Link href="/size-guide" className="text-sm text-blue-600 hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 border rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'border-purple-600 bg-purple-600 text-white'
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
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>No tie required - Perfect for relaxed elegance</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedSize
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add Bundle to Cart
                </Button>
                <Link
                  href={`/bundles/${bundle.id}`}
                  className="w-full py-4 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors block text-center"
                >
                  View Full Details
                </Link>
              </div>

              {/* Bundle Deal CTA */}
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Need multiple outfits?
                </p>
                <Link
                  href="/bundles"
                  className="text-purple-600 font-medium hover:underline"
                >
                  Get 3 bundles for $549 →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}