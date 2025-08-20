'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { EnhancedProduct } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductImage } from '@/components/ui/ProductImage'
import { WishlistButton } from '@/components/products/WishlistButton'
import SizeGuideModal from '@/components/products/SizeGuideModal'
import { SizeSelector } from '@/components/products/SizeSelector'
import { formatPrice } from '@/lib/utils/format'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { type UserMeasurements } from '@/lib/products/sizing'
import { 
  ShoppingBag, 
  Check, 
  Truck, 
  Shield, 
  RefreshCw,
  Ruler,
  ChevronLeft,
  ChevronRight,
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  Package,
  Clock,
  Award,
  Zap,
  Info,
  Loader2
} from 'lucide-react'

interface ProductDetailClientProps {
  product: EnhancedProduct
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
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

  // Set default size on mount
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0])
    }
  }, [availableSizes, selectedSize])

  const handleAddToCart = async () => {
    if (!selectedSize && availableSizes.length > 0) {
      // Special message for dress shirts
      const isDressShirt = product.category?.toLowerCase().includes('shirt') || 
                          product.productType?.toLowerCase().includes('shirt')
      if (isDressShirt) {
        toast.error('Please select neck size and sleeve length')
      } else {
        toast.error('Please select a size')
      }
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
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-gold transition-colors">Shop</Link>
            {product.category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/products?category=${product.category}`} className="hover:text-gold transition-colors">
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div 
              className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in group"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <ProductImage
                src={product.images[selectedImage]}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-300"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Zoom overlay */}
              {isZoomed && (
                <div 
                  className="absolute inset-0 bg-no-repeat pointer-events-none"
                  style={{
                    backgroundImage: `url(${product.images[selectedImage]})`,
                    backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                    backgroundSize: '200%',
                  }}
                />
              )}

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {hasDiscount && (
                  <Badge className="bg-red-500 text-white">{discountPercent}% OFF</Badge>
                )}
                {product.featured && (
                  <Badge className="bg-gold text-black">Featured</Badge>
                )}
                {!product.inStock && (
                  <Badge className="bg-gray-800 text-white">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative aspect-[3/4] bg-gray-100 rounded-md overflow-hidden transition-all",
                      selectedImage === index 
                        ? "ring-2 ring-gold shadow-md" 
                        : "hover:ring-2 hover:ring-gray-300"
                    )}
                  >
                    <ProductImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="object-cover"
                      fill
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              {product.brand && (
                <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
              )}
              <h1 className="text-3xl font-serif font-bold text-gray-900">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8 out of 5)</span>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-600">124 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(compareAtPrice!)}
                  </span>
                )}
              </div>
              {product.inStock && currentVariant && (
                <p className="text-sm text-gray-600">
                  {currentVariant.inventoryQuantity} in stock
                </p>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-1 text-gray-700" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 mx-auto mb-1 text-gray-700" />
                <p className="text-xs text-gray-600">Easy Returns</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-1 text-gray-700" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 mx-auto mb-1 text-gray-700" />
                <p className="text-xs text-gray-600">Quality Assured</p>
              </div>
            </div>

            {/* Smart Size Selection */}
            {availableSizes.length > 0 && (
              <SizeSelector
                category={product.category || product.productType}
                availableSizes={availableSizes}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                onSizeGuideClick={() => setShowSizeGuide(true)}
                userMeasurements={undefined} // TODO: Get from user profile
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
                  <span className="px-4 py-2 min-w-[50px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {currentVariant && currentVariant.inventoryQuantity < 10 && (
                  <p className="text-sm text-orange-600">
                    Only {currentVariant.inventoryQuantity} left!
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className="flex-1 bg-gold hover:bg-gold/90 text-black font-semibold py-6 text-lg"
              >
                {isAddingToCart ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </span>
                )}
              </Button>
              <WishlistButton 
                productId={product.id} 
                variant="outline"
                className="px-6"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="shrink-0"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Urgency indicators */}
            {product.inStock && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Zap className="h-4 w-4" />
                  <span>In high demand - 23 people viewing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Usually ships within 24 hours</span>
                </div>
              </div>
            )}

            {/* Product highlights */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details & Care</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (124)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6 space-y-4">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || `Experience premium quality with our ${product.name}. Crafted with attention to detail and designed for the modern gentleman.`}
                </p>
                {product.additionalInfo?.features && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {product.additionalInfo.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <dl className="space-y-3">
                    {product.sku && (
                      <div>
                        <dt className="text-sm text-gray-600">SKU</dt>
                        <dd className="text-sm font-medium">{product.sku}</dd>
                      </div>
                    )}
                    {product.productType && (
                      <div>
                        <dt className="text-sm text-gray-600">Type</dt>
                        <dd className="text-sm font-medium">{product.productType}</dd>
                      </div>
                    )}
                    {product.weight && (
                      <div>
                        <dt className="text-sm text-gray-600">Weight</dt>
                        <dd className="text-sm font-medium">{product.weight} oz</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm text-gray-600">Shipping</dt>
                      <dd className="text-sm font-medium">
                        {product.requiresShipping ? 'Standard shipping rates apply' : 'Digital delivery'}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Dry clean recommended for best results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Store in a cool, dry place</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Iron on low heat if needed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  Reviews coming soon...
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          category={product.category || 'suits'}
        />
      )}
    </div>
  )
}