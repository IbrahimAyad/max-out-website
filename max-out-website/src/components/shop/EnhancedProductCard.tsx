"use client"

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { EnhancedProduct } from '@/lib/supabase/types'
import { WishlistButton } from '@/components/products/WishlistButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImage } from '@/components/ui/ProductImage'
import { QuickViewModal } from '@/components/products/QuickViewModal'
import { 
  ShoppingBag, 
  Eye, 
  Star, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Heart,
  MoveRight
} from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from 'sonner'
import { useProductCardGestures } from '@/hooks/useMobileGestures'
import { useWishlist } from '@/lib/hooks/useWishlist'

interface EnhancedProductCardProps {
  product: EnhancedProduct
  viewMode?: 'grid' | 'list'
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

export function EnhancedProductCard({ 
  product, 
  viewMode = 'grid',
  variant = 'default',
  className 
}: EnhancedProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [showSizeSelector, setShowSizeSelector] = useState(false)
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const imageInterval = useRef<NodeJS.Timeout>()
  
  // Mobile gesture support
  const { ref: gestureRef, showHint, hints } = useProductCardGestures(
    product.id,
    () => {
      toggleWishlist(product.id)
      toast.success(isWishlisted(product.id) ? 'Removed from wishlist' : 'Added to wishlist', {
        icon: <Heart className={cn("h-4 w-4", isWishlisted(product.id) ? "" : "fill-burgundy text-burgundy")} />,
        description: product.name
      })
    },
    () => setShowQuickView(true),
    handleQuickAdd
  )

  // Auto-cycle images on hover
  const startImageCycle = () => {
    if (product.images.length > 1) {
      imageInterval.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
      }, 1500)
    }
  }

  const stopImageCycle = () => {
    if (imageInterval.current) {
      clearInterval(imageInterval.current)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    startImageCycle()
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    stopImageCycle()
    setCurrentImageIndex(0)
  }

  const handleQuickAdd = () => {
    if (!selectedSize && product.variants?.length > 0) {
      setShowSizeSelector(true)
      return
    }
    
    try {
      addToCart(product, selectedSize || 'default')
      toast.success('Added to cart', {
        description: `${product.name} has been added to your cart`,
        action: {
          label: 'View Cart',
          onClick: () => window.location.href = '/cart'
        }
      })
      setShowSizeSelector(false)
      setSelectedSize('')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const currentImage = product.images[currentImageIndex] || product.primaryImage
  
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  // Inventory and urgency
  const totalInventory = product.totalInventory || 0
  const lowStock = totalInventory > 0 && totalInventory < 10
  const veryLowStock = totalInventory > 0 && totalInventory < 5

  // Smart badges
  const isNew = product.tags?.includes('new') || 
    (product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  const isTrending = product.tags?.includes('trending') || product.tags?.includes('bestseller')
  const isExclusive = product.tags?.includes('exclusive') || product.tags?.includes('limited')

  if (viewMode === 'grid') {
    return (
      <>
        <motion.div
          ref={gestureRef}
          className={cn(
            "group relative bg-white rounded-lg overflow-hidden",
            "border border-gray-200 hover:border-gold/30",
            "transition-all duration-300 hover:shadow-xl",
            className
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileHover={{ y: -4 }}
        >
          {/* Image Container */}
          <Link href={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <ProductImage
                  src={currentImage}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  fill
                />
              </motion.div>
            </AnimatePresence>

            {/* Image Navigation Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      index === currentImageIndex 
                        ? "bg-white w-4" 
                        : "bg-white/50 hover:bg-white/75"
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentImageIndex(index)
                    }}
                  />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {hasDiscount && (
                <Badge className="bg-red-500 text-white border-0">
                  -{discountPercent}%
                </Badge>
              )}
              {isNew && (
                <Badge className="bg-gold text-black border-0">
                  NEW
                </Badge>
              )}
              {isTrending && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {isExclusive && (
                <Badge className="bg-black text-white border-0">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Exclusive
                </Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-full group-hover:translate-x-0">
              <WishlistButton
                productId={product.id}
                className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
              />
              <Button
                size="icon"
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
                onClick={(e) => {
                  e.preventDefault()
                  setShowQuickView(true)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium">Out of Stock</span>
              </div>
            )}
            {veryLowStock && product.inStock && (
              <div className="absolute bottom-0 inset-x-0 bg-red-500 text-white text-xs py-1 text-center">
                <Zap className="inline h-3 w-3 mr-1" />
                Only {totalInventory} left!
              </div>
            )}
            
            {/* Mobile Gesture Hints */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm md:hidden pointer-events-none"
                >
                  <div className="bg-white rounded-lg p-4 mx-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-burgundy fill-burgundy" />
                      <MoveRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">Added to Wishlist!</p>
                    <p className="text-xs text-gray-500 mt-1">Swipe right for quick view</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Content */}
          <div className="p-4">
            {/* Brand & Name */}
            <div className="mb-2">
              {product.brand && (
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-0.5">
                  {product.brand}
                </p>
              )}
              <Link href={`/products/${product.id}`}>
                <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-gold transition-colors">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < Math.floor(product.rating!)
                          ? "fill-gold text-gold"
                          : "fill-gray-200 text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-semibold">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Size Selector (shown when needed) */}
            <AnimatePresence>
              {showSizeSelector && product.variants && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3"
                >
                  <p className="text-xs text-gray-600 mb-2">Select Size:</p>
                  <div className="grid grid-cols-4 gap-1">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedSize(variant.id)}
                        disabled={!variant.availableForSale}
                        className={cn(
                          "py-1.5 text-xs border rounded transition-all",
                          selectedSize === variant.id
                            ? "border-gold bg-gold text-black"
                            : "border-gray-300 hover:border-gold",
                          !variant.availableForSale && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {variant.size || variant.title}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add to Cart Button */}
            <Button
              className="w-full bg-gold hover:bg-gold/90 text-black font-medium"
              size="sm"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {showSizeSelector && !selectedSize ? 'Select Size' : 'Quick Add'}
            </Button>
          </div>
        </motion.div>

        {/* Quick View Modal */}
        <QuickViewModal
          product={product}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      </>
    )
  }

  // List view remains similar but with enhanced features
  return null // Implement list view if needed
}