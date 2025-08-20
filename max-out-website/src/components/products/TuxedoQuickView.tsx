'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Check, 
  Truck, 
  Shield,
  Sparkles,
  Calendar
} from 'lucide-react';
import { TuxedoProduct } from '@/lib/products/tuxedoProducts';
import { useCart } from '@/hooks/useCart';

interface TuxedoQuickViewProps {
  tuxedo: TuxedoProduct;
  onClose: () => void;
}

export default function TuxedoQuickView({ tuxedo, onClose }: TuxedoQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const { addItem } = useCart();

  const sizes = ['34S', '36S', '38S', '40R', '42R', '44R', '46L', '48L', '50L', '52L'];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      id: tuxedo.id,
      name: tuxedo.name,
      price: tuxedo.price,
      image: tuxedo.image,
      quantity: 1,
      category: 'tuxedo',
      size: selectedSize,
      metadata: {
        color: tuxedo.color,
        type: '2-piece'
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
                <Sparkles className="w-4 h-4" />
                Statement Tuxedo
              </span>
              <h2 className="text-2xl font-bold">{tuxedo.name}</h2>
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
                  src={tuxedo.image}
                  alt={tuxedo.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Features */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Premium Features</h4>
                <ul className="space-y-2">
                  {tuxedo.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Details */}
            <div className="space-y-6">
              {/* Price */}
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-3xl font-bold">${tuxedo.price}</span>
                  <span className="text-sm text-gray-500">2-Piece Tuxedo</span>
                </div>
                <p className="text-gray-600">{tuxedo.description}</p>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Select Size</h3>
                  <Link href="/size-guide" className="text-sm text-blue-600 hover:underline">
                    Size Guide
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-2">
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

              {/* Perfect For */}
              <div>
                <h3 className="font-semibold mb-3">Perfect For:</h3>
                <div className="flex flex-wrap gap-2">
                  {['Prom', 'Weddings', 'Black Tie Events', 'Galas', 'Formal Dinners'].map((occasion) => (
                    <span
                      key={occasion}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Free Express Shipping</p>
                    <p className="text-xs text-gray-500">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-500">30-day guarantee</p>
                  </div>
                </div>
              </div>

              {/* Rush Delivery */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-700 mb-1">
                  <Calendar className="w-5 h-5" />
                  <h4 className="font-semibold">Need it for an event?</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Rush delivery available. Order by 2PM EST for next-day shipping.
                </p>
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
                  Add to Cart
                </button>
                <Link
                  href={`/products/tuxedos/${tuxedo.id}`}
                  className="w-full py-4 border-2 border-black text-black rounded-lg font-semibold hover:bg-gray-50 transition-colors block text-center"
                >
                  View Full Details
                </Link>
              </div>

              {/* Group Order CTA */}
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Ordering for a group?
                </p>
                <Link
                  href="/prom-groups"
                  className="text-purple-600 font-medium hover:underline"
                >
                  Get Special Group Pricing →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}