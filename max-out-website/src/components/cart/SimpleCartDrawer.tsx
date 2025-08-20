'use client';

import { useState, useEffect } from 'react';
import { useSimpleCart } from '@/hooks/useSimpleCart';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { CheckoutButton } from './CheckoutButton';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';

export function SimpleCartDrawer() {
  const { items, cartSummary, removeFromCart, clearCart, updateQuantity } = useSimpleCart();
  const { isCartOpen, setIsCartOpen } = useUIStore();
  const [dragProgress, setDragProgress] = useState(0);

  // Haptic feedback
  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, setIsCartOpen]);

  const handleDrag = (_: any, info: PanInfo) => {
    const progress = Math.max(0, Math.min(1, info.offset.x / 300));
    setDragProgress(progress);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 150 || info.velocity.x > 500) {
      setIsCartOpen(false);
      triggerHaptic(30);
    }
    setDragProgress(0);
  };

  return (
    <>
      {/* Mobile: Floating Cart Icon (hidden on desktop where we have nav cart) */}
      {items.length > 0 && (
        <motion.button
          onClick={() => {
            setIsCartOpen(true);
            triggerHaptic();
          }}
          className="fixed top-20 right-4 bg-burgundy text-white p-3 rounded-full shadow-xl z-40 md:hidden hover:bg-burgundy-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:ring-offset-2"
          aria-label={`Open shopping cart with ${items.length} items`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart size={20} aria-hidden="true" />
          <motion.span 
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium" 
            aria-hidden="true"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            key={items.length}
          >
            {items.length > 99 ? '99+' : items.length}
          </motion.span>
        </motion.button>
      )}

      {/* Enhanced Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsCartOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="button"
              tabIndex={0}
              aria-label="Close cart drawer"
              onKeyDown={(e) => e.key === 'Enter' && setIsCartOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div 
              className={cn(
                "absolute right-0 top-0 h-full bg-white shadow-2xl flex flex-col",
                "w-full max-w-md sm:w-96"
              )}
              role="dialog" 
              aria-label="Shopping cart" 
              aria-modal="true"
              initial={{ x: '100%' }}
              animate={{ 
                x: dragProgress > 0 ? `${dragProgress * 100}%` : 0,
                opacity: dragProgress > 0 ? 1 - dragProgress * 0.5 : 1
              }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 300 }}
              dragElastic={0.1}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-serif text-gray-900">Shopping Cart ({items.length})</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 hidden sm:block">Swipe right to close</span>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      triggerHaptic();
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-burgundy-300"
                    aria-label="Close cart drawer"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
              
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                      <p className="mt-1 text-sm text-gray-500">Start adding items to your cart.</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-4 px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-burgundy-700 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-burgundy-300 focus:ring-offset-2"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div 
                        key={`${item.productId}-${item.size}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          {/* Product Image Placeholder */}
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ShoppingCart size={20} className="text-gray-400" />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {item.name || `Product ${item.productId}`}
                            </h3>
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                            <p className="text-sm font-semibold text-gray-900">{item.displayPrice || `$${((item.price || 0) / 100).toFixed(2)}`}</p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateQuantity?.(item.productId, item.size, item.quantity - 1);
                                  }
                                  triggerHaptic();
                                }}
                                className="p-1.5 hover:bg-burgundy-50 hover:text-burgundy-700 rounded-lg disabled:opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-burgundy-300"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => {
                                  updateQuantity?.(item.productId, item.size, item.quantity + 1);
                                  triggerHaptic();
                                }}
                                className="p-1.5 hover:bg-burgundy-50 hover:text-burgundy-700 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-burgundy-300"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            {/* Status */}
                            <div className="text-xs mt-1">
                              {item.stripePriceId ? (
                                <span className="text-green-600">✓ Ready for checkout</span>
                              ) : (
                                <span className="text-red-600">✗ Missing checkout data</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => {
                              removeFromCart(item.productId, item.size);
                              triggerHaptic([10, 50, 10]);
                            }}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            aria-label={`Remove ${item.name || `Product ${item.productId}`} from cart`}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="border-t bg-gray-50 p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total: {cartSummary.totalPriceFormatted}</span>
                  <button
                    onClick={() => {
                      clearCart();
                      triggerHaptic(50);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 px-3 py-1 hover:bg-red-50 rounded-md transition-colors"
                    aria-label="Clear all items from cart"
                  >
                    Clear All
                  </button>
                </div>
                
                <CheckoutButton />
                
                <p className="text-xs text-gray-500 text-center">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}