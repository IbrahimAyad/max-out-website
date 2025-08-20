'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Plus, Minus } from 'lucide-react';
import { Product } from '@/lib/types';

interface Bundle {
  id: string;
  name: string;
  occasion: string;
  description: string;
  image: string;
  savings: number;
  products: BundleProduct[];
  totalPrice: number;
}

interface BundleProduct extends Product {
  bundlePrice: number;
  required: boolean;
}

interface OccasionBundlesProps {
  bundles: Bundle[];
  onAddToCart: (bundle: Bundle, selectedProducts: BundleProduct[]) => void;
}

export function OccasionBundles({ bundles, onAddToCart }: OccasionBundlesProps) {
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const occasions = Array.from(new Set((bundles || []).map(b => b.occasion)));

  const handleProductToggle = (productId: string, required: boolean) => {
    if (required) return;
    
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const calculateBundleTotal = (bundle: Bundle) => {
    return (bundle.products || [])
      .filter(p => p.required || selectedProducts.has(p.id))
      .reduce((total, product) => total + product.bundlePrice, 0);
  };

  const handleAddBundle = (bundle: Bundle) => {
    const productsToAdd = (bundle.products || []).filter(
      p => p.required || selectedProducts.has(p.id)
    );
    onAddToCart(bundle, productsToAdd);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-4">Occasion Bundles</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete outfits curated for your special occasions. Save up to 20% when you bundle.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {(occasions || []).map((occasion) => (
          <button
            key={occasion}
            className="px-6 py-2 border-2 border-black hover:bg-black hover:text-white transition-colors capitalize"
          >
            {occasion}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(bundles || []).map((bundle, index) => (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-64">
              <img
                src={bundle.image}
                alt={bundle.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-burgundy text-white px-3 py-1 rounded-full text-sm font-semibold">
                Save ${bundle.savings}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-serif mb-2">{bundle.name}</h3>
              <p className="text-gray-600 mb-4">{bundle.description}</p>

              <div className="space-y-2 mb-6">
                {(bundle.products || []).map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleProductToggle(product.id, product.required)}
                        disabled={product.required}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          product.required || selectedProducts.has(product.id)
                            ? 'bg-gold border-gold'
                            : 'border-gray-300 hover:border-gold'
                        } ${product.required ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {(product.required || selectedProducts.has(product.id)) && (
                          <Check className="w-3 h-3 text-black" />
                        )}
                      </button>
                      <span className={product.required ? 'font-semibold' : ''}>
                        {product.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      ${(product.bundlePrice / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-semibold">
                  Total: ${(calculateBundleTotal(bundle) / 100).toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${(bundle.totalPrice / 100).toFixed(2)}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedBundle(bundle);
                  handleAddBundle(bundle);
                }}
                className="w-full bg-gold hover:bg-gold/90 text-black px-6 py-3 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add Bundle to Cart
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedBundle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBundle(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-serif mb-2">Bundle Added!</h3>
              <p className="text-gray-600 mb-6">
                {selectedBundle.name} has been added to your cart
              </p>
              <button
                onClick={() => setSelectedBundle(null)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-sm font-semibold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}