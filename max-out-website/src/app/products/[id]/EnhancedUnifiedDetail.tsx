'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UnifiedProduct } from '@/types/unified-shop'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WishlistButton } from '@/components/products/WishlistButton'
import SizeGuideModal from '@/components/products/SizeGuideModal'
import { useCart } from '@/hooks/useCart'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import LuxuryImageGallery from '@/components/products/enhanced/LuxuryImageGallery'
import LuxurySizeSelector from '@/components/products/enhanced/LuxurySizeSelector'
import PremiumTrustSignals from '@/components/products/enhanced/PremiumTrustSignals'
import StickyMobileCTA from '@/components/products/enhanced/StickyMobileCTA'
import PremiumProductInfo from '@/components/products/enhanced/PremiumProductInfo'
import { 
  ShoppingCart, 
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
  Package,
  Heart,
  Check,
  Info,
  Sparkles,
  Lock,
  Scissors
} from 'lucide-react'

interface EnhancedUnifiedDetailProps {
  product: UnifiedProduct
}

// Standard sizes for suits and blazers
const SUIT_SIZES = {
  SHORT: ['34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S'],
  REGULAR: ['34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R'],
  LONG: ['38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L']
};

// Blazer specific sizes
const BLAZER_SIZES = ['36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R'];

export function EnhancedUnifiedDetail({ product }: EnhancedUnifiedDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedStyle, setSelectedStyle] = useState<'2-piece' | '3-piece'>('2-piece')
  const [quantity, setQuantity] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { addItem } = useCart()

  // Get all images
  const allImages = product.images?.length > 0 
    ? product.images 
    : [product.imageUrl || '/placeholder.jpg'];

  // Determine product type
  const isSuit = product.category?.toLowerCase().includes('suit') || 
                 product.name?.toLowerCase().includes('suit');
  
  const isBlazer = product.category?.toLowerCase().includes('blazer') || 
                   product.name?.toLowerCase().includes('blazer');

  // Get available sizes based on product type
  const getAvailableSizes = () => {
    if (isBlazer && !product.isBundle) {
      return BLAZER_SIZES;
    }
    if (isSuit || product.isBundle) {
      // For suits, combine all size categories into a single array
      return [
        ...SUIT_SIZES.SHORT,
        ...SUIT_SIZES.REGULAR,
        ...SUIT_SIZES.LONG
      ];
    }
    return product.size || ['S', 'M', 'L', 'XL', 'XXL'];
  };

  const availableSizes = getAvailableSizes();

  // Add to Cart function - adds product to cart state
  const handleAddToCart = async () => {
    if (!selectedSize && !product.isBundle) {
      toast.error('Please select a size')
      return
    }

    try {
      // Add the product to cart
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price * 100, // Convert to cents for cart
        image: product.imageUrl || product.images?.[0] || '/placeholder.jpg',
        quantity: quantity,
        selectedSize: selectedSize || 'M',
        stripePriceId: product.stripePriceId,
        category: product.category,
        enhanced: product.enhanced || false
      };

      const success = addItem(cartItem);
      
      if (success) {
        toast.success(`Added ${quantity} ${product.name} to cart`);
        // Optional: Show cart drawer or navigate to cart
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

  // Buy Now function - direct checkout
  const handleBuyNow = async () => {
    if (!selectedSize && !product.isBundle) {
      toast.error('Please select a size')
      return
    }

    try {
      // Show loading state
      toast.loading('Creating checkout session...');
      
      // Use unified checkout API with express checkout endpoint
      const response = await fetch('/api/checkout/unified', {
        method: 'PUT', // PUT method for express checkout
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          size: selectedSize,
          enhanced: product.enhanced || false
        })
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        toast.dismiss(); // Clear loading toast
        toast.success('Redirecting to checkout...');
        window.location.href = data.url;
      } else {
        // If express checkout fails, fall back to adding to cart
        console.error('Express checkout not available:', data.error);
        toast.dismiss();
        
        // For products without express checkout support, add to cart and go to cart page
        handleAddToCart();
        setTimeout(() => {
          toast.success('Item added to cart. Redirecting...');
          window.location.href = '/cart';
        }, 1000);
      }
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error('Failed to process checkout');
    }
  };

  // Keep the original bundle handling for Add to Cart
  const handleBundleAddToCart = () => {
    try {
      // For bundles, add all components
      if (product.isBundle && product.bundleComponents) {
        let allAdded = true;
        for (const component of product.bundleComponents) {
          const added = addItem({
            id: `${product.id}-${component.type}`,
            name: `${component.name} (${product.name})`,
            price: Math.round(product.price / product.bundleComponents.length * 100), // Convert to cents
            image: component.image || product.imageUrl || '/placeholder-product.svg',
            quantity: quantity,
            selectedSize: selectedSize || 'M',
            stripePriceId: product.stripePriceId,
            category: product.category,
            bundleId: product.id,
            metadata: {
              bundleName: product.name,
              componentType: component.type
            }
          });
          if (!added) allAdded = false;
        }
        if (allAdded) {
          toast.success(
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Complete look added to cart!</span>
            </div>
          );
        }
      } else {
        // For individual products
        const priceInDollars = selectedStyle === '3-piece' && isSuit 
          ? product.price + 20 // Add $20 for vest
          : product.price;
        
        const priceInCents = Math.round(priceInDollars * 100);

        const added = addItem({
          id: product.id,
          name: product.name,
          price: priceInCents, // Price in cents
          image: product.imageUrl || '/placeholder-product.svg',
          quantity: quantity,
          selectedSize: selectedSize,
          stripePriceId: product.stripePriceId || '',
          category: product.category,
          metadata: {
            style: isSuit ? selectedStyle : undefined,
            productType: product.type || 'catalog'
          }
        });
        
        if (added) {
          toast.success(`${product.name} added to cart!`);
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
    }
  };

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

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from wishlist' : 'Added to wishlist')
  }

  // Mock AI recommendation for demonstration
  const aiRecommendation = {
    size: '42R',
    confidence: 92,
    reason: 'Based on your height (5\'10"), chest measurement (42"), and previous purchases'
  }

  // Mock user profile
  const userProfile = {
    height: '5\'10"',
    weight: '175 lbs',
    preferredFit: 'regular' as const
  }

  // Handle scroll visibility for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Show sticky CTA when scrolled past hero section
      setShowStickyCTA(scrollPosition > windowHeight * 0.3)
      
      // Hide when near bottom (to avoid footer overlap)
      const nearBottom = scrollPosition + windowHeight > documentHeight - 200
      setIsVisible(!nearBottom)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white" role="main" aria-label="Product details">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Breadcrumb with ARIA */}
        <nav aria-label="Product navigation breadcrumb" className="text-sm mb-8">
          <ol className="flex items-center space-x-2" role="list">
            <li role="listitem">
              <Link 
                href="/products" 
                className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy-500 rounded"
                aria-label="Go to products page"
              >
                Products
              </Link>
            </li>
            <li role="separator" aria-hidden="true">
              <span className="text-gray-400">/</span>
            </li>
            {product.category && (
              <>
                <li role="listitem">
                  <Link 
                    href={`/products?category=${product.category}`} 
                    className="text-gray-500 hover:text-gray-700 capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-burgundy-500 rounded"
                    aria-label={`View all ${product.category}`}
                  >
                    {product.category}
                  </Link>
                </li>
                <li role="separator" aria-hidden="true">
                  <span className="text-gray-400">/</span>
                </li>
              </>
            )}
            <li className="text-gray-900 font-medium" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <LuxuryImageGallery
              images={allImages}
              productName={product.name}
              badges={{
                isBundle: product.isBundle,
                trending: product.trending,
                aiScore: product.aiScore
              }}
              onImageChange={setSelectedImage}
            />

            {/* Bundle Components */}
            {product.isBundle && product.bundleComponents && (
              <div className="bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-burgundy-600" />
                  Included Items
                </h3>
                <div className="space-y-3">
                  {product.bundleComponents.map((component, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white rounded-lg p-3">
                      {component.image && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={component.image}
                            alt={component.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{component.name}</p>
                        <p className="text-sm text-gray-600">
                          {component.color && `${component.color} • `}
                          {component.material}
                        </p>
                      </div>
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Enhanced Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Premium Product Information - without expandable sections */}
            <PremiumProductInfo
              product={{
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                description: product.description,
                category: product.category,
                occasions: product.occasions,
                isBundle: product.isBundle,
                enhanced: product.enhanced,
                material: product.material,
                careInstructions: ['Dry clean only for best results', 'Steam to remove wrinkles', 'Store on padded hangers', 'Professional pressing recommended'],
                features: ['Half-canvas construction', 'Natural shoulder line', 'Functional button holes', 'Peak lapels', 'Two-button closure']
              }}
              selectedStyle={selectedStyle}
              rating={4.8}
              reviewCount={127}
              showExpandableSections={false}
            />

            {/* Style Selection (for suits) */}
            {isSuit && !product.isBundle && (
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">Style</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedStyle('2-piece')}
                    className={cn(
                      "p-4 border-2 rounded-lg transition-all",
                      selectedStyle === '2-piece'
                        ? "border-burgundy-600 bg-burgundy-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="font-medium">2-Piece Suit</div>
                    <div className="text-sm text-gray-500">Jacket & Pants</div>
                    <div className="text-lg font-bold mt-1">${product.price.toFixed(2)}</div>
                  </button>
                  <button
                    onClick={() => setSelectedStyle('3-piece')}
                    className={cn(
                      "p-4 border-2 rounded-lg transition-all",
                      selectedStyle === '3-piece'
                        ? "border-burgundy-600 bg-burgundy-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="font-medium">3-Piece Suit</div>
                    <div className="text-sm text-gray-500">Jacket, Vest & Pants</div>
                    <div className="text-lg font-bold mt-1">${(product.price + 20).toFixed(2)}</div>
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced Size Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <LuxurySizeSelector
                productType={isBlazer ? 'blazer' : isSuit ? 'suit' : 'shirt'}
                sizes={availableSizes}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                aiRecommendation={aiRecommendation}
                userProfile={userProfile}
                onSizeGuideOpen={() => setShowSizeGuide(true)}
                onAIAssistantOpen={() => setShowAIAssistant(true)}
              />
            </motion.div>

            {/* Enhanced Quantity and Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg" role="group" aria-label="Quantity selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-burgundy-500"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span 
                  className="px-4 font-medium min-w-[50px] text-center" 
                  role="status" 
                  aria-live="polite" 
                  aria-label={`Quantity: ${quantity}`}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-burgundy-500"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-white hover:bg-gray-50 text-burgundy-600 border-2 border-burgundy-600 py-6 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 transition-all"
                size="lg"
                aria-describedby={!selectedSize && !product.isBundle ? "size-required" : undefined}
              >
                <ShoppingCart className="h-5 w-5 mr-2" aria-hidden="true" />
                Add to Cart
              </Button>

              {/* Buy Now Button */}
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white py-6 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2 transition-all"
                size="lg"
                aria-describedby={!selectedSize && !product.isBundle ? "size-required" : undefined}
              >
                <Lock className="h-5 w-5 mr-2" aria-hidden="true" />
                Buy Now
              </Button>
            </div>

            {/* Enhanced Secondary Actions */}
            <div className="flex gap-3" role="group" aria-label="Product actions">
              <Button
                onClick={handleFavorite}
                variant="outline"
                className={cn(
                  "flex-1 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2",
                  isFavorited && "border-red-500 text-red-500"
                )}
                aria-pressed={isFavorited}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={cn("h-4 w-4 mr-2", isFavorited && "fill-current")} aria-hidden="true" />
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:ring-offset-2"
                aria-label="Share this product"
              >
                <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                Share
              </Button>
            </div>
            
            {/* Screen reader notification for size requirement */}
            {!selectedSize && !product.isBundle && (
              <div id="size-required" className="sr-only" aria-live="polite">
                Please select a size before adding to cart
              </div>
            )}

            {/* Premium Trust Signals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <PremiumTrustSignals
                productName={product.name}
                rating={4.8}
                reviewCount={127}
                deliveryLocation="Metro Detroit"
              />
            </motion.div>


            {/* Bundle Savings */}
            {product.isBundle && product.savings && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-900">Bundle Savings</p>
                  <p className="text-sm text-green-700">Up to 15% off when purchased as a complete look</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Product Details Section - Moved below main product area */}
        <div className="mt-16 border-t pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Product Information</h2>
            
            {/* Expandable Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Info className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Product Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Material</span>
                    <span className="text-sm text-gray-900">{product.material || 'Premium Wool Blend'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Category</span>
                    <span className="text-sm text-gray-900 capitalize">{product.category || 'Suits'}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Fit</span>
                    <span className="text-sm text-gray-900">Modern Tailored</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Season</span>
                    <span className="text-sm text-gray-900">All Season</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-600">Care</span>
                    <span className="text-sm text-gray-900">Dry Clean Only</span>
                  </div>
                </div>
              </div>

              {/* Care Instructions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Scissors className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Care Instructions</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-burgundy-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Dry clean only for best results</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-burgundy-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Steam to remove wrinkles</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-burgundy-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Store on padded hangers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-burgundy-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Professional pressing recommended</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-burgundy-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Avoid direct sunlight storage</span>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Award className="h-5 w-5 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Key Features</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Half-canvas construction</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Natural shoulder line</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Functional button holes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Peak lapels</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Two-button closure</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA
        productName={product.name}
        price={selectedStyle === '3-piece' && isSuit ? product.price + 20 : product.price}
        originalPrice={product.originalPrice}
        isEnhanced={product.enhanced}
        isBundle={product.isBundle}
        inStock={product.inStock}
        selectedSize={selectedSize}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleFavorite}
        onShare={handleShare}
        isFavorited={isFavorited}
        isVisible={showStickyCTA && isVisible}
      />

      {/* Enhanced Modals */}
      {showSizeGuide && (
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
        />
      )}
      
      {/* AI Assistant Modal - placeholder for future implementation */}
      {showAIAssistant && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-assistant-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 id="ai-assistant-title" className="text-lg font-semibold mb-4">
              AI Size Assistant
            </h2>
            <p className="text-gray-600 mb-4">
              Our AI assistant will be available soon to help you find the perfect size based on your measurements and preferences.
            </p>
            <Button 
              onClick={() => setShowAIAssistant(false)}
              className="w-full"
              autoFocus
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}