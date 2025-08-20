'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Eye, 
  Zap, 
  Star,
  TrendingUp,
  Check,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UnifiedProduct } from '@/types/unified-shop'
import { useCart } from '@/hooks/useCart'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ChatProductCardProps {
  product: UnifiedProduct
  reason?: string
  matchScore?: number
  onAction?: (action: 'view' | 'add_to_cart' | 'buy_now', product: UnifiedProduct) => void
  className?: string
  compact?: boolean
}

export function ChatProductCard({
  product,
  reason,
  matchScore = 0,
  onAction,
  className,
  compact = false
}: ChatProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  const handleView = () => {
    if (onAction) {
      onAction('view', product)
    }
    // Navigate to product page
    const productUrl = product.enhanced && product.id.startsWith('enhanced_')
      ? `/products/${product.id}`
      : `/products/${product.slug || product.id}`
    router.push(productUrl)
  }

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price * 100, // Convert to cents
        image: product.imageUrl || product.images?.[0] || '/placeholder.jpg',
        quantity: 1,
        selectedSize: 'M', // Default size, should be selectable
        stripePriceId: product.stripePriceId,
        category: product.category,
        enhanced: product.enhanced || false
      }

      const success = addItem(cartItem)
      if (success) {
        setAddedToCart(true)
        toast.success(`${product.name} added to cart`)
        if (onAction) {
          onAction('add_to_cart', product)
        }
        setTimeout(() => setAddedToCart(false), 2000)
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyNow = async () => {
    setIsLoading(true)
    try {
      // Add to cart first
      await handleAddToCart()
      
      // Then navigate to checkout
      if (onAction) {
        onAction('buy_now', product)
      }
      
      // For enhanced products, use enhanced checkout
      if (product.enhanced) {
        const response = await fetch('/api/checkout/enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id.replace('enhanced_', ''),
            quantity: 1,
            size: 'M', // Default size
            successUrl: `${window.location.origin}/checkout/success`,
            cancelUrl: window.location.href
          })
        })

        if (response.ok) {
          const { url } = await response.json()
          window.location.href = url
        }
      } else {
        // Regular checkout
        router.push('/checkout')
      }
    } catch (error) {
      console.error('Buy now error:', error)
      toast.error('Failed to process checkout')
    } finally {
      setIsLoading(false)
    }
  }

  const getMatchBadgeColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-500'
    if (score >= 0.7) return 'bg-blue-500'
    if (score >= 0.5) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 0.9) return 'Perfect Match'
    if (score >= 0.7) return 'Great Match'
    if (score >= 0.5) return 'Good Match'
    return 'Suggested'
  }

  if (compact) {
    // Compact horizontal layout for chat
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-burgundy/30 transition-all hover:shadow-md",
          className
        )}
      >
        {/* Product Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          {product.imageUrl || product.images?.[0] ? (
            <Image
              src={product.imageUrl || product.images?.[0] || ''}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="h-6 w-6" />
            </div>
          )}
          {matchScore > 0 && (
            <div className={cn(
              "absolute top-1 right-1 w-2 h-2 rounded-full",
              getMatchBadgeColor(matchScore)
            )} />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 truncate">
            {product.name}
          </h4>
          <p className="text-lg font-bold text-burgundy">
            ${product.price.toFixed(2)}
          </p>
          {reason && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
              {reason}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleView}
            className="h-7 px-2"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddToCart}
            disabled={isLoading || addedToCart}
            className="h-7 px-2"
          >
            {addedToCart ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <ShoppingCart className="h-3 w-3" />
            )}
          </Button>
        </div>
      </motion.div>
    )
  }

  // Full card layout
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={cn(
        "bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-burgundy/30 hover:shadow-xl transition-all",
        className
      )}
    >
      {/* Match Score Badge */}
      {matchScore > 0 && (
        <div className="px-4 py-2 bg-gradient-to-r from-burgundy/10 to-transparent">
          <div className="flex items-center justify-between">
            <Badge className={cn(
              "text-white border-0",
              getMatchBadgeColor(matchScore)
            )}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {getMatchLabel(matchScore)}
            </Badge>
            <span className="text-xs text-gray-500">
              {Math.round(matchScore * 100)}% match
            </span>
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-gray-100">
        {product.imageUrl || product.images?.[0] ? (
          <Image
            src={product.imageUrl || product.images?.[0] || ''}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}
        
        {/* Enhanced Badge */}
        {product.enhanced && (
          <Badge className="absolute top-2 left-2 bg-gold text-black border-0">
            <Zap className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleView}
              className="flex-1 bg-white/90 hover:bg-white"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              onClick={handleBuyNow}
              disabled={isLoading}
              className="flex-1 bg-burgundy hover:bg-burgundy-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1" />
                  Buy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-burgundy">
              ${product.price.toFixed(2)}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>

        {/* Recommendation Reason */}
        {reason && (
          <p className="text-sm text-gray-600 mb-3 italic">
            "{reason}"
          </p>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isLoading || addedToCart}
          className={cn(
            "w-full",
            addedToCart 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-burgundy hover:bg-burgundy-700"
          )}
        >
          {addedToCart ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added to Cart
            </>
          ) : isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </motion.div>
  )
}