'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, Star, Zap, ShoppingCart, Heart, ChevronRight,
  Tag, Users, TrendingUp, Sparkles, Check, X, Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SmartBundle, BundleItem } from '@/lib/services/smartBundles';

interface SmartBundleCardProps {
  bundle: SmartBundle;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  onSaveBundle?: () => void;
  showCompatibilityDetails?: boolean;
  className?: string;
}

export function SmartBundleCard({
  bundle,
  onAddToCart,
  onViewDetails,
  onSaveBundle,
  showCompatibilityDetails = false,
  className = ""
}: SmartBundleCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(
    new Set((bundle?.items || []).map(item => item?.product?.id).filter(Boolean))
  );

  const toggleItemSelection = (productId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedItems(newSelection);
  };

  const getSelectedPrice = () => {
    const selectedProducts = bundle.items.filter(item => 
      selectedItems.has(item.product.id)
    );
    const totalPrice = selectedProducts.reduce((sum, item) => sum + item.product.price, 0);
    const discount = totalPrice * (bundle.discountPercentage / 100);
    return totalPrice - discount;
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompatibilityText = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    return 'Fair';
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{bundle.name}</h3>
              <p className="text-xs text-gray-600">{bundle.items.length} items</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCompatibilityColor(bundle.compatibility.overall)}`}>
              <Sparkles className="w-3 h-3 inline mr-1" />
              {getCompatibilityText(bundle.compatibility.overall)}
            </div>
            {bundle.discountPercentage > 0 && (
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                -{bundle.discountPercentage}%
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">{bundle.description}</p>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${getSelectedPrice().toFixed(2)}
            </span>
            {bundle.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ${bundle.totalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">AI Curated</span>
          </div>
        </div>
      </div>

      {/* Bundle Items */}
      <div className="p-4">
        <div className="space-y-3">
          {(bundle?.items || []).map((item, index) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                selectedItems.has(item.product.id)
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <button
                onClick={() => toggleItemSelection(item.product.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedItems.has(item.product.id)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {selectedItems.has(item.product.id) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </button>

              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=IMG';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  {item.isCore && (
                    <span className="bg-gold text-black text-xs px-2 py-0.5 rounded-full font-medium">
                      Core
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    ${item.product.price}
                  </span>
                  
                  {showCompatibilityDetails && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">
                        {Math.round(item.compatibilityScore * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {showCompatibilityDetails && (
                  <p className="text-xs text-gray-500 mt-1">{item.reasoning}</p>
                )}
              </div>

              {!item.isCore && (
                <button
                  onClick={() => toggleItemSelection(item.product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove from bundle"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bundle Details */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 p-4 bg-gray-50"
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="font-medium text-sm text-gray-900 mb-2">Occasions</h5>
              <div className="flex flex-wrap gap-1">
                {(bundle?.occasions || []).map((occasion, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {occasion}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-sm text-gray-900 mb-2">Style</h5>
              <div className="flex flex-wrap gap-1">
                {(bundle?.targetCustomer?.style || []).map((style, index) => (
                  <span key={index} className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                    {style}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {showCompatibilityDetails && (
            <div className="mb-4">
              <h5 className="font-medium text-sm text-gray-900 mb-2">Compatibility Scores</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between text-xs">
                  <span>Color Harmony:</span>
                  <span className="font-medium">{Math.round(bundle.compatibility.color * 100)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Style Match:</span>
                  <span className="font-medium">{Math.round(bundle.compatibility.style * 100)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Occasion Fit:</span>
                  <span className="font-medium">{Math.round(bundle.compatibility.occasion * 100)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Fashion-CLIP:</span>
                  <span className="font-medium">{Math.round(bundle.fashionClipScore * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Bundle created on {bundle.createdAt.toLocaleDateString()}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={onAddToCart}
            className="flex-1 bg-gold hover:bg-gold/90 text-black"
            disabled={selectedItems.size === 0}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add Selected to Cart
          </Button>
          
          <Button
            variant="outline"
            onClick={onSaveBundle}
            className="px-3"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 text-sm"
          >
            <Info className="w-4 h-4 mr-2" />
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
          
          <Button
            variant="outline"
            onClick={onViewDetails}
            className="px-3"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {selectedItems.size < bundle.items.length && (
          <p className="text-xs text-center text-gray-500 mt-2">
            {bundle.items.length - selectedItems.size} items excluded • Price updated
          </p>
        )}
      </div>
    </Card>
  );
}