"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, Heart, Share2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { EnhancedProduct } from '@/lib/supabase/types'
import { toast } from 'sonner'

interface MobileProductRecommendationsProps {
  products: EnhancedProduct[]
  title?: string
  subtitle?: string
  onProductClick?: (product: EnhancedProduct) => void
  className?: string
}

export function MobileProductRecommendations({
  products,
  title = "Recommended for You",
  subtitle = "Based on your style preferences",
  onProductClick,
  className
}: MobileProductRecommendationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const x = useMotionValue(0)
  const scale = useTransform(x, [-100, 0, 100], [0.9, 1, 0.9])
  const rotate = useTransform(x, [-100, 0, 100], [-5, 0, 5])

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else if (direction === 'left' && currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
        toast.success('Removed from favorites')
      } else {
        newFavorites.add(productId)
        toast.success('Added to favorites')
      }
      return newFavorites
    })
  }

  const handleShare = async (product: EnhancedProduct) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} from KCT Menswear`,
          url: window.location.origin + `/products/${product.id}`
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.origin + `/products/${product.id}`)
      toast.success('Link copied to clipboard')
    }
  }

  if (!products || products.length === 0) return null

  const currentProduct = products[currentIndex]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            {title}
          </h2>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>
        <Badge variant="secondary" className="bg-gold/10 text-gold border-gold/20">
          Atelier AI
        </Badge>
      </div>

      {/* Swipeable Product Cards */}
      <div className="relative h-[450px] overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x > 100) {
                handleSwipe('right')
              } else if (offset.x < -100) {
                handleSwipe('left')
              }
            }}
            style={{ x, scale, rotate }}
          >
            <Card className="h-full overflow-hidden bg-white shadow-xl">
              {/* Product Image */}
              <div className="relative h-2/3">
                <img
                  src={currentProduct.images[0]?.url || '/placeholder.jpg'}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/90 backdrop-blur-sm"
                    onClick={() => handleFavorite(currentProduct.id)}
                  >
                    <Heart className={cn(
                      "h-4 w-4",
                      favorites.has(currentProduct.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-gray-600"
                    )} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/90 backdrop-blur-sm"
                    onClick={() => handleShare(currentProduct)}
                  >
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-black/80 text-white border-0 text-lg px-3 py-1">
                    ${(currentProduct.price / 100).toFixed(2)}
                  </Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 h-1/3 flex flex-col">
                <h3 className="font-semibold text-lg line-clamp-1">{currentProduct.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {currentProduct.description}
                </p>
                
                {/* Quick Actions */}
                <div className="mt-auto flex gap-2">
                  <Button 
                    className="flex-1 bg-gold hover:bg-gold/90 text-black"
                    onClick={() => onProductClick?.(currentProduct)}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      // Quick add to cart
                      toast.success('Added to cart')
                    }}
                  >
                    Quick Add
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
            onClick={() => handleSwipe('right')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        {currentIndex < products.length - 1 && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
            onClick={() => handleSwipe('left')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1.5">
        {products.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === currentIndex
                ? "w-8 bg-gold"
                : "w-1.5 bg-gray-300"
            )}
          />
        ))}
      </div>

      {/* Suggestion Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <Badge 
          variant="outline" 
          className="whitespace-nowrap cursor-pointer hover:bg-gold/10"
          onClick={() => {
            // Filter by similar style
            toast.info('Showing similar styles')
          }}
        >
          Similar Styles
        </Badge>
        <Badge 
          variant="outline" 
          className="whitespace-nowrap cursor-pointer hover:bg-gold/10"
          onClick={() => {
            // Show complete the look
            toast.info('Complete the look suggestions')
          }}
        >
          Complete the Look
        </Badge>
        <Badge 
          variant="outline" 
          className="whitespace-nowrap cursor-pointer hover:bg-gold/10"
          onClick={() => {
            // Show in different colors
            toast.info('Available in other colors')
          }}
        >
          More Colors
        </Badge>
      </div>
    </div>
  )
}

// Compact recommendation strip for inline suggestions
export function RecommendationStrip({
  products,
  title = "You might also like",
  className
}: {
  products: EnhancedProduct[]
  title?: string
  className?: string
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-gold" />
        {title}
      </h3>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {products.slice(0, 5).map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Card className="w-32 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img
                  src={product.images[0]?.url || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute bottom-1 right-1 text-xs bg-black/80 text-white">
                  ${(product.price / 100).toFixed(0)}
                </Badge>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium line-clamp-2">{product.name}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}