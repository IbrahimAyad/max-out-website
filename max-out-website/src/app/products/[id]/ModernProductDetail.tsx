'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { EnhancedProduct } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImage } from '@/components/ui/ProductImage'
import { WishlistButton } from '@/components/products/WishlistButton'
import { SizeSelector } from '@/components/products/SizeSelector'
import SizeGuideModal from '@/components/products/SizeGuideModal'
import { formatPrice } from '@/lib/utils/format'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, 
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Award,
  Zap,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X
} from 'lucide-react'

interface ModernProductDetailProps {
  product: EnhancedProduct
}

export function ModernProductDetail({ product }: ModernProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()

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

  // Check if product has video (for now, no products have videos)
  const hasVideo = false // Will be: product.videoUrl ? true : false
  const videoUrl = '' // Will be: product.videoUrl || ''

  // Set default size on mount
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0])
    }
  }, [availableSizes, selectedSize])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)
      } else if (e.key === 'ArrowRight') {
        setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [product.images.length])

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
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description || '',
        url: window.location.href,
      })
    } catch (error) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="flex flex-col lg:flex-row">
          {/* Full-height Gallery Section */}
          <div className="lg:w-2/3 xl:w-3/4 relative bg-white">
            <div 
              ref={galleryRef}
              className="sticky top-0 h-screen overflow-hidden"
            >
              {/* Main Image/Video Display */}
              <div className="relative h-full flex items-center justify-center bg-gray-50">
                <AnimatePresence mode="wait">
                  {hasVideo && selectedImage === 0 ? (
                    <motion.div
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        loop
                        muted={isMuted}
                        playsInline
                        onClick={toggleVideo}
                      />
                      
                      {/* Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={toggleVideo}
                            className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          >
                            {isPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
                          </button>
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          >
                            {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={selectedImage}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full h-full max-w-4xl cursor-zoom-in"
                      onClick={() => setShowFullscreen(true)}
                    >
                      <ProductImage
                        src={product.images[selectedImage]}
                        alt={product.name}
                        fill
                        priority
                        className="object-contain p-8"
                        sizes="(max-width: 1024px) 100vw, 75vw"
                      />
                      
                      {/* Zoom hint */}
                      <div className="absolute top-6 right-6 p-2 bg-white/90 backdrop-blur-sm rounded-full">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all z-10"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Instagram-style dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        selectedImage === index 
                          ? "bg-white w-8" 
                          : "bg-white/50 hover:bg-white/75"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Strip - Mobile */}
              <div className="lg:hidden absolute bottom-20 left-0 right-0 px-6">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden",
                        selectedImage === index && "ring-2 ring-gold"
                      )}
                    >
                      <ProductImage
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Product Info Panel */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="sticky top-0 h-screen overflow-y-auto">
              <div className="p-6 lg:p-8 space-y-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-gray-600">
                  <Link href="/" className="hover:text-gold">Home</Link>
                  <ChevronRight className="h-3 w-3" />
                  <Link href="/products" className="hover:text-gold">Shop</Link>
                  {product.category && (
                    <>
                      <ChevronRight className="h-3 w-3" />
                      <Link href={`/products?category=${product.category}`} className="hover:text-gold">
                        {product.category}
                      </Link>
                    </>
                  )}
                </nav>

                {/* Product Header */}
                <div>
                  {product.brand && (
                    <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                  )}
                  <h1 className="text-2xl font-serif font-bold text-gray-900">{product.name}</h1>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-gold fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.8)</span>
                    <span className="text-sm text-gray-600">124 reviews</span>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(displayPrice)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(compareAtPrice!)}
                        </span>
                        <Badge className="bg-red-500 text-white">{discountPercent}% OFF</Badge>
                      </>
                    )}
                  </div>
                  {product.inStock && currentVariant && currentVariant.inventoryQuantity < 10 && (
                    <p className="text-sm text-orange-600 mt-1">
                      Only {currentVariant.inventoryQuantity} left in stock
                    </p>
                  )}
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-3 py-4 border-y">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-600" />
                    <span className="text-xs text-gray-600">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-gray-600" />
                    <span className="text-xs text-gray-600">Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-600" />
                    <span className="text-xs text-gray-600">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-600" />
                    <span className="text-xs text-gray-600">Authentic</span>
                  </div>
                </div>

                {/* Size Selection */}
                {availableSizes.length > 0 && (
                  <SizeSelector
                    category={product.category || product.productType}
                    availableSizes={availableSizes}
                    selectedSize={selectedSize}
                    onSizeSelect={setSelectedSize}
                    onSizeGuideClick={() => setShowSizeGuide(true)}
                  />
                )}

                {/* Color Selection */}
                {availableColors.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-900">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "px-4 py-2 border rounded-md text-sm font-medium transition-all",
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
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-900">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-50 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-6 py-2 min-w-[60px] text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="p-2 hover:bg-gray-50 transition-colors"
                        disabled={quantity >= 10}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAddingToCart}
                    className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-4 text-base"
                  >
                    {isAddingToCart ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Adding...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        {product.inStock ? 'Add to Bag' : 'Out of Stock'}
                      </span>
                    )}
                  </Button>
                  
                  <div className="flex gap-3">
                    <WishlistButton 
                      productId={product.id} 
                      variant="outline"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex-1"
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Urgency */}
                {product.inStock && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                      <Zap className="h-4 w-4" />
                      <span>In high demand</span>
                    </div>
                    <p className="text-gray-600">Ships within 24 hours</p>
                  </div>
                )}

                {/* Description */}
                <div className="pt-6 border-t">
                  <h3 className="font-medium mb-3">Description</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {product.description || `Premium ${product.category} crafted with attention to detail.`}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <h3 className="font-medium">Details</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {product.tags?.slice(0, 5).map((tag) => (
                      <li key={tag}>• {tag}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
            onClick={() => setShowFullscreen(false)}
          >
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center p-12">
              <ProductImage
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          category={product.category || 'suits'}
        />
      )}
    </>
  )
}