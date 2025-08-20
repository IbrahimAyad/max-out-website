'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UnifiedProduct } from '@/types/unified-shop'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WishlistButton } from '@/components/products/WishlistButton'
import SizeGuideModal from '@/components/products/SizeGuideModal'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  ChevronLeft,
  ChevronRight,
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Award,
  Package
} from 'lucide-react'

interface UnifiedProductDetailProps {
  product: UnifiedProduct
}

export function UnifiedProductDetail({ product }: UnifiedProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { addToCart } = useCart()

  // Get all images
  const allImages = product.images?.length > 0 
    ? product.images 
    : [product.imageUrl || '/placeholder.jpg'];

  // Get available sizes
  const availableSizes = product.size || ['S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = async () => {
    if (!product.isBundle && !selectedSize && availableSizes.length > 0) {
      toast.error('Please select a size')
      return
    }

    try {
      // For bundles, add all components to cart
      if (product.isBundle && product.bundleComponents) {
        for (const component of product.bundleComponents) {
          await addToCart({
            id: `${product.id}-${component.type}`,
            productId: product.id,
            name: component.name,
            price: product.price / product.bundleComponents.length, // Split price evenly
            image: component.image || product.imageUrl,
            size: selectedSize || 'M',
            quantity: quantity,
            variantId: `${product.id}-${component.type}-${selectedSize || 'M'}`
          } as any);
        }
        toast.success(`Complete look added to cart!`)
      } else {
        // For individual products
        await addToCart({
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          size: selectedSize,
          quantity: quantity,
          variantId: `${product.id}-${selectedSize}`
        } as any);
        toast.success(`${product.name} added to cart!`)
      }
    } catch (error) {
      toast.error('Failed to add to cart')
      console.error('Cart error:', error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={allImages[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Bundle Indicator */}
              {product.isBundle && (
                <div className="absolute top-4 left-4 bg-burgundy-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Complete Look
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 transition-all",
                      selectedImage === index 
                        ? "ring-2 ring-burgundy-600" 
                        : "hover:opacity-75"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Bundle Components Display */}
            {product.isBundle && product.bundleComponents && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">This complete look includes:</h3>
                <div className="space-y-2">
                  {product.bundleComponents.map((component, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {component.image && (
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image
                            src={component.image}
                            alt={component.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{component.name}</p>
                        <p className="text-xs text-gray-500">
                          {component.color && `${component.color} • `}
                          {component.material}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <a href="/products" className="hover:text-gray-700">Products</a>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.category}</span>
            </nav>

            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <Badge variant="destructive">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(124 reviews)</span>
            </div>

            {/* Description */}
            <p className="text-gray-600">{product.description}</p>

            {/* Size Selection */}
            {!product.isBundle && availableSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-900">Size</label>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-burgundy-600 hover:text-burgundy-700"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size.toString())}
                      className={cn(
                        "py-2 px-4 border rounded-lg transition-all",
                        selectedSize === size
                          ? "border-burgundy-600 bg-burgundy-50 text-burgundy-600"
                          : "border-gray-300 hover:border-gray-400"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bundle Size Note */}
            {product.isBundle && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Select your size after adding to cart. Each item in this complete look is available in sizes S-XXL.
                </p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              <WishlistButton
                productId={product.id}
                variant="outline"
                className="px-4"
              />

              <Button
                onClick={handleShare}
                variant="outline"
                size="icon"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 border-t pt-6">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Free shipping on orders over $200</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">30-day return policy</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">2-year warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Premium quality guaranteed</span>
              </div>
            </div>

            {/* Material and Care */}
            {(product.material || product.category) && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Details</h3>
                <dl className="space-y-2">
                  {product.material && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Material</dt>
                      <dd className="text-gray-900">{product.material}</dd>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Category</dt>
                      <dd className="text-gray-900 capitalize">{product.category}</dd>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Color</dt>
                      <dd className="text-gray-900 capitalize">{product.color}</dd>
                    </div>
                  )}
                  {product.isBundle && (
                    <div className="flex justify-between text-sm">
                      <dt className="text-gray-500">Type</dt>
                      <dd className="text-gray-900">Complete Styled Look</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
        />
      )}
    </div>
  )
}