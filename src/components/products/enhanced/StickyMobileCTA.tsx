'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Lock, 
  Heart, 
  Share2, 
  Package, 
  ChevronUp,
  X,
  Plus,
  Minus,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

interface StickyMobileCTAProps {
  productName: string
  price: number
  originalPrice?: number
  isEnhanced?: boolean
  isBundle?: boolean
  inStock?: boolean
  selectedSize?: string
  quantity: number
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
  onToggleFavorite: () => void
  onShare: () => void
  isFavorited?: boolean
  isVisible?: boolean
  className?: string
}

export function StickyMobileCTA({
  productName,
  price,
  originalPrice,
  isEnhanced = false,
  isBundle = false,
  inStock = true,
  selectedSize,
  quantity,
  onQuantityChange,
  onAddToCart,
  onToggleFavorite,
  onShare,
  isFavorited = false,
  isVisible = true,
  className
}: StickyMobileCTAProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const lastScrollY = useRef(0)

  // Handle scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down')
      } else {
        setScrollDirection('up')
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-hide expanded state when scrolling down
  useEffect(() => {
    if (scrollDirection === 'down' && isExpanded) {
      setIsExpanded(false)
    }
  }, [scrollDirection, isExpanded])

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    
    try {
      await onAddToCart()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Add to cart error:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      onQuantityChange(newQuantity)
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop for expanded state */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Sticky CTA Container */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : 100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 md:hidden",
          "bg-white border-t border-gray-200 shadow-2xl",
          className
        )}
      >
        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden border-b border-gray-200"
            >
              <div className="p-4 space-y-4">
                {/* Product Summary */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                      {productName}
                    </h3>
                    {selectedSize && (
                      <p className="text-sm text-gray-600 mt-1">Size: {selectedSize}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Quantity</span>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </motion.button>
                    <span className="px-4 font-medium min-w-[50px] text-center">{quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Secondary Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onToggleFavorite}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 rounded-xl transition-all font-medium",
                      isFavorited 
                        ? "border-red-500 bg-red-50 text-red-600" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                    <span className="text-sm">{isFavorited ? 'Saved' : 'Save'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all font-medium"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm">Share</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main CTA Bar */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* Price and Expand Button */}
            <div className="flex-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-left w-full"
              >
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${price.toFixed(2)}
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {selectedSize && (
                    <p className="text-xs text-gray-600">Size: {selectedSize}</p>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                </motion.div>
              </button>
            </div>

            {/* Add to Cart Button */}
            <motion.div
              className="flex-1"
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart || (!selectedSize && !isBundle)}
                className={cn(
                  "w-full py-4 text-base font-semibold transition-all duration-300 relative overflow-hidden",
                  isEnhanced 
                    ? "bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800" 
                    : "bg-burgundy-600 hover:bg-burgundy-700",
                  "text-white shadow-lg hover:shadow-xl",
                  !inStock && "bg-gray-400 cursor-not-allowed"
                )}
              >
                <AnimatePresence mode="wait">
                  {showSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <Check className="h-5 w-5" />
                      <span>Added!</span>
                    </motion.div>
                  ) : isAddingToCart ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Adding...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      {isEnhanced ? (
                        <>
                          <Lock className="h-5 w-5" />
                          <span>Buy Now</span>
                        </>
                      ) : (
                        <>
                          {isBundle ? <Package className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                          <span>{isBundle ? 'Add Bundle' : 'Add to Cart'}</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Animated background for enhanced products */}
                {isEnhanced && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-yellow-500/20"
                    animate={{ 
                      opacity: [0, 0.3, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Button>
            </motion.div>
          </div>

          {/* Stock Status */}
          {!inStock && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-red-600 mt-2 font-medium"
            >
              Out of Stock
            </motion.p>
          )}

          {/* Size Selection Reminder */}
          {!selectedSize && !isBundle && inStock && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-sm text-amber-600 mt-2 font-medium"
            >
              Please select a size above
            </motion.p>
          )}
        </div>

        {/* Bundle Savings Indicator */}
        {isBundle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-2"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center justify-center gap-2">
              <Package className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Bundle saves up to 15%
              </span>
            </div>
          </motion.div>
        )}

        {/* Safe area padding for devices with home indicator */}
        <div className="pb-safe" />
      </motion.div>
    </>
  )
}

export default StickyMobileCTA