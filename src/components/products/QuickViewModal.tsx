'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImage } from '@/components/ui/ProductImage'
import { SizeSelector } from '@/components/products/SizeSelector'
import { WishlistButton } from '@/components/products/WishlistButton'
import { EnhancedProduct } from '@/lib/supabase/types'
import { formatPrice } from '@/lib/utils/format'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { 
  ShoppingBag, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Truck,
  Shield,
  RefreshCw,
  Star,
  Minus,
  Plus,
  Zap,
  Clock,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface QuickViewModalProps {
  product: EnhancedProduct | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(0)
      setQuantity(1)
      setSelectedSize('')
      setSelectedColor('')
    }
  }, [product])

  if (!product) return null

  // Get available sizes and colors from variants
  const availableVariants = product.variants.filter(v => v.available && v.inventoryQuantity > 0)
  const availableSizes = [...new Set(availableVariants.map(v => v.option1).filter(Boolean))]
  const availableColors = [...new Set(availableVariants.map(v => v.option2).filter(Boolean))]

  // Get current variant based on selection
  const currentVariant = availableVariants.find(v => 
    v.option1 === selectedSize && (!selectedColor || v.option2 === selectedColor)
  ) || availableVariants[0]

  // Update price based on variant
  const displayPrice = currentVariant?.price || product.price
  const compareAtPrice = currentVariant?.compareAtPrice || product.compareAtPrice

  const hasDiscount = compareAtPrice && compareAtPrice > displayPrice
  const discountPercent = hasDiscount 
    ? Math.round(((compareAtPrice - displayPrice) / compareAtPrice) * 100)
    : 0

  // Check inventory for urgency
  const lowStock = currentVariant && currentVariant.inventoryQuantity < 10
  const veryLowStock = currentVariant && currentVariant.inventoryQuantity < 5

  const handleAddToCart = async () => {
    if (!selectedSize && availableSizes.length > 0) {
      toast.error('Please select a size')
      return
    }

    if (availableColors.length > 0 && !selectedColor) {
      toast.error('Please select a color')
      return
    }

    setIsAddingToCart(true)
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, currentVariant?.id || 'default')
      }
      toast.success(`Added ${quantity} ${product.name} to cart`, {
        action: {
          label: 'View Cart',
          onClick: () => window.location.href = '/cart'
        }
      })
      onClose()
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-hidden p-0">
        <DialogTitle className="sr-only">{product.name} - Quick View</DialogTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Image Gallery */}
          <div className="relative bg-gray-50 p-8 flex items-center justify-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Main Image */}
            <div className="relative w-full max-w-md aspect-[3/4]">
              <ProductImage
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      selectedImage === index 
                        ? "bg-gray-800 w-8" 
                        : "bg-gray-400 hover:bg-gray-600"
                    )}
                  />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 space-y-2">
              {hasDiscount && (
                <Badge className="bg-red-500 text-white">{discountPercent}% OFF</Badge>
              )}
              {veryLowStock && (
                <Badge className="bg-orange-500 text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  Only {currentVariant.inventoryQuantity} left!
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh]">
            <div className="space-y-4">
              {/* Header */}
              <div>
                {product.brand && (
                  <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                )}
                <h2 className="text-2xl font-serif font-bold text-gray-900">{product.name}</h2>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-gold fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8) · 124 reviews</span>
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(displayPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(compareAtPrice!)}
                      </span>
                      <Badge className="bg-red-100 text-red-800">Save {formatPrice(compareAtPrice! - displayPrice)}</Badge>
                    </>
                  )}
                </div>
                
                {/* Inventory urgency */}
                {lowStock && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-orange-600 font-medium flex items-center gap-1">
                      <Zap className="h-4 w-4" />
                      {veryLowStock ? 'Almost sold out!' : `Only ${currentVariant.inventoryQuantity} left in stock`}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      23 people are viewing this item
                    </p>
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y">
                <div className="text-center">
                  <Truck className="h-5 w-5 mx-auto mb-1 text-gray-700" />
                  <p className="text-xs text-gray-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="h-5 w-5 mx-auto mb-1 text-gray-700" />
                  <p className="text-xs text-gray-600">Easy Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 mx-auto mb-1 text-gray-700" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
              </div>

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <SizeSelector
                  category={product.category || product.productType}
                  availableSizes={availableSizes}
                  selectedSize={selectedSize}
                  onSizeSelect={setSelectedSize}
                  onSizeGuideClick={() => {}} // Size guide in quick view would be complex
                />
              )}

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-3 py-1.5 border rounded text-sm font-medium transition-all",
                          selectedColor === color
                            ? "border-gold bg-gold/10 text-gray-900"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentVariant?.inventoryQuantity || 10, quantity + 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                      disabled={quantity >= (currentVariant?.inventoryQuantity || 10)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAddingToCart}
                    className="flex-1 bg-gold hover:bg-gold/90 text-black font-semibold py-3"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <WishlistButton 
                    productId={product.id} 
                    variant="outline"
                    className="px-4"
                  />
                </div>
                
                <Link href={`/products/${product.id}`} onClick={onClose}>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-5 w-5 mr-2" />
                    View Full Details
                  </Button>
                </Link>
              </div>

              {/* Quick Description */}
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {product.description || `Premium ${product.category} crafted with attention to detail.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}