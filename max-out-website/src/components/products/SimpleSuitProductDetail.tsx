'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Truck, Shield, RefreshCw, Ruler, MessageCircle, Star, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/hooks/useCart';
import { availableSizes } from '@/lib/services/stripeProductService';
import { getSuitImages } from '@/lib/data/suitImages';
import SizeGuideModal from './SizeGuideModal';
import { CheckoutButton } from '../cart/CheckoutButton';
import MobileSuitSelector from './MobileSuitSelector';
import { ModernSizeBot } from '@/components/sizing/ModernSizeBot';

interface SimpleSuitProductDetailProps {
  color: string;
  suitData: {
    productId: string;
    twoPiece: string;
    threePiece: string;
  };
}

export default function SimpleSuitProductDetail({ color, suitData }: SimpleSuitProductDetailProps) {
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState<'twoPiece' | 'threePiece'>('twoPiece');
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAISizeBot, setShowAISizeBot] = useState(false);
  
  // Product details
  const productName = `${color.charAt(0).toUpperCase() + color.slice(1).replace(/([A-Z])/g, ' $1')} Suit`;
  const price = selectedOption === 'twoPiece' ? 179.99 : 199.99;
  const stripePriceId = selectedOption === 'twoPiece' ? suitData.twoPiece : suitData.threePiece;
  
  // Get suit images
  const suitImageData = getSuitImages(color);
  
  // Filter images based on selected option
  const displayImages = useMemo(() => {
    const allImages = suitImageData.gallery;
    
    if (selectedOption === 'twoPiece') {
      // For 2-piece, prioritize images without vest
      const nonVestImages = allImages.filter(img => 
        !img.toLowerCase().includes('vest') && 
        !img.toLowerCase().includes('three') && 
        !img.toLowerCase().includes('3p')
      );
      return nonVestImages.length > 0 ? nonVestImages : allImages;
    } else {
      // For 3-piece, prioritize images with vest
      const vestImages = allImages.filter(img => 
        img.toLowerCase().includes('vest') || 
        img.toLowerCase().includes('three') || 
        img.toLowerCase().includes('3p')
      );
      
      if (vestImages.length > 0) {
        // Show vest images first, then others
        const otherImages = allImages.filter(img => !vestImages.includes(img));
        return [...vestImages, ...otherImages];
      }
      return allImages;
    }
  }, [selectedOption, suitImageData.gallery]);

  // Reset to first image when switching between 2/3 piece
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedOption]);

  // Group sizes by type
  const sizesByType = {
    short: availableSizes.suits.filter(size => size.endsWith('S')),
    regular: availableSizes.suits.filter(size => size.endsWith('R')),
    long: availableSizes.suits.filter(size => size.endsWith('L')),
  };
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    
    const product = {
      id: suitData.productId,
      name: `${productName} - ${selectedOption === 'twoPiece' ? '2 Piece' : '3 Piece'}`,
      category: 'suits',
      price,
      images: [displayImages[0] || suitImageData.main],
      variants: availableSizes.suits.map(size => ({
        size,
        stock: 10,
        price,
      })),
      color,
      description: `Premium ${color} suit`,
      metadata: {
        stripePriceId,
        suitType: selectedOption,
        suitColor: color,
      }
    };
    
    addToCart(product as any, selectedSize, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  // Trust badges data
  const trustBadges = [
    { icon: Truck, text: 'Free Shipping Over $200' },
    { icon: Shield, text: '100% Secure Checkout' },
    { icon: RefreshCw, text: '30-Day Returns' },
    { icon: Ruler, text: 'Free Alterations' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="text-sm">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
            <li><span className="text-gray-400">/</span></li>
            <li><a href="/products/suits" className="text-gray-500 hover:text-gray-700">Suits</a></li>
            <li><span className="text-gray-400">/</span></li>
            <li className="text-gray-900 font-medium">{productName}</li>
          </ol>
        </nav>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={displayImages[currentImageIndex] || '/placeholder-suit.jpg'}
                alt={`${productName} - ${selectedOption === 'twoPiece' ? '2 Piece' : '3 Piece'} - View ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-suit.jpg';
                }}
              />
              
              {/* Navigation Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Image counter */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {displayImages.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {displayImages.slice(0, 8).map((image, index) => (
                <button
                  key={`${selectedOption}-${index}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-[3/4] bg-gray-100 rounded-md overflow-hidden border-2 transition-all ${
                    currentImageIndex === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image || '/placeholder-suit.jpg'}
                    alt={`${productName} - Thumbnail ${index + 1}`}
                    width={100}
                    height={133}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-suit.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h1>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-semibold">${price}</span>
                <span className="text-sm text-gray-500">USD</span>
              </div>
              
              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(127 reviews)</span>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <badge.icon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{badge.text}</span>
                </div>
              ))}
            </div>
            
            {/* Style Options - Now changes images */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Style</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedOption('twoPiece')}
                  className={`relative border-2 rounded-lg p-4 text-left transition-all ${
                    selectedOption === 'twoPiece' 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">2-Piece Suit</div>
                  <div className="text-sm text-gray-500">Jacket & Pants</div>
                  <div className="font-semibold mt-1">$179.99</div>
                  {selectedOption === 'twoPiece' && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => setSelectedOption('threePiece')}
                  className={`relative border-2 rounded-lg p-4 text-left transition-all ${
                    selectedOption === 'threePiece' 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">3-Piece Suit</div>
                  <div className="text-sm text-gray-500">Jacket, Vest & Pants</div>
                  <div className="font-semibold mt-1">$199.99</div>
                  {selectedOption === 'threePiece' && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </button>
              </div>
              {selectedOption === 'threePiece' && displayImages.length === suitImageData.gallery.length && (
                <p className="text-xs text-gray-500 mt-2">
                  Note: 3-piece images with vest will be shown when available
                </p>
              )}
            </div>
            
            {/* Size Selection - Desktop */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Ruler className="h-4 w-4 mr-1" />
                  Size Guide
                </button>
              </div>
              
              {/* AI Size Recommendation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">Size Recommendation</p>
                      <p className="text-blue-700">Based on your previous orders, we recommend size 40R</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowAISizeBot(true)}
                    size="sm"
                    className="bg-burgundy hover:bg-burgundy-700 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    AI Size Assistant
                  </Button>
                </div>
              </div>
              
              {/* Size Grid */}
              <div className="space-y-3">
                {Object.entries(sizesByType).map(([type, sizes]) => (
                  <div key={type}>
                    <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                      {type} ({type === 'short' ? '5\'4" - 5\'7"' : type === 'regular' ? '5\'8" - 6\'1"' : '6\'2" +'})
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSelectedSize(size);
                            setShowSizeError(false);
                          }}
                          className={`py-2 px-3 text-sm font-medium rounded-md transition-all ${
                            selectedSize === size
                              ? 'bg-black text-white'
                              : 'bg-white border border-gray-300 hover:border-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {showSizeError && (
                <p className="text-red-600 text-sm mt-2">Please select a size</p>
              )}
            </div>
            
            {/* Mobile Size/Style Selection */}
            <div className="md:hidden">
              <MobileSuitSelector
                onSizeSelect={setSelectedSize}
                onStyleSelect={setSelectedOption}
                selectedSize={selectedSize}
                selectedStyle={selectedOption}
              />
            </div>
            
            {/* Add to Cart & Checkout */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 px-6 rounded-md font-medium transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center">
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart
                  </span>
                ) : (
                  'Add to Cart'
                )}
              </button>
              
              {/* Quick Checkout Option */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <CheckoutButton />
            </div>
            
            {/* Urgency Indicators */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-green-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Order in the next 2 hours for same-day processing</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MessageCircle className="h-4 w-4 mr-2" />
                <button className="underline hover:text-gray-900">
                  Chat with a style expert
                </button>
              </div>
            </div>
            
            {/* Product Details Accordion */}
            <div className="border-t pt-6 space-y-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="font-medium">Product Details</h3>
                  <ChevronRight className="h-5 w-5 transform group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 text-sm text-gray-600 space-y-2">
                  <p>• Premium wool blend fabric (Super 120s)</p>
                  <p>• Modern slim fit with natural stretch</p>
                  <p>• Half-canvas construction for superior drape</p>
                  <p>• Functional buttonholes on jacket sleeves</p>
                  <p>• Dual back vents for ease of movement</p>
                  <p>• Interior pockets with signature lining</p>
                  {selectedOption === 'threePiece' && (
                    <>
                      <p className="font-medium mt-2">3-Piece includes:</p>
                      <p>• Matching vest with adjustable back strap</p>
                      <p>• 5-button vest front with welt pockets</p>
                    </>
                  )}
                </div>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="font-medium">Shipping & Returns</h3>
                  <ChevronRight className="h-5 w-5 transform group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 text-sm text-gray-600 space-y-2">
                  <p>• Free shipping on orders over $200</p>
                  <p>• Standard shipping: 5-7 business days</p>
                  <p>• Express shipping: 2-3 business days</p>
                  <p>• 30-day return policy</p>
                  <p>• Free exchanges on sizing</p>
                </div>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="font-medium">Care Instructions</h3>
                  <ChevronRight className="h-5 w-5 transform group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 text-sm text-gray-600 space-y-2">
                  <p>• Dry clean only</p>
                  <p>• Hang on wooden hangers</p>
                  <p>• Steam to remove wrinkles</p>
                  <p>• Store in breathable garment bag</p>
                </div>
              </details>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16 border-t pt-16">
          <h2 className="text-2xl font-bold mb-8">Complete the Look</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dress Shirt */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/placeholder-shirt.jpg"
                  alt="White Dress Shirt"
                  width={300}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium">Classic White Dress Shirt</h3>
              <p className="text-gray-600">$39.99</p>
            </div>
            
            {/* Tie */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/placeholder-tie.jpg"
                  alt="Burgundy Tie"
                  width={300}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium">Burgundy Silk Tie</h3>
              <p className="text-gray-600">$24.99</p>
            </div>
            
            {/* Shoes */}
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src="/placeholder-shoes.jpg"
                  alt="Black Oxford Shoes"
                  width={300}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium">Black Oxford Shoes</h3>
              <p className="text-gray-600">$149.99</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
      
      {/* Modern AI Size Bot Modal */}
      {showAISizeBot && (
        <ModernSizeBot
          productType="suit"
          onClose={() => setShowAISizeBot(false)}
          onSizeSelected={(recommendation) => {
            if (recommendation.primarySize) {
              setSelectedSize(recommendation.primarySize);
              setShowAISizeBot(false);
            }
          }}
          isModal={true}
        />
      )}
      
      {/* Floating AI Size Assistant Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setShowAISizeBot(true)}
        className="fixed bottom-6 right-6 bg-burgundy hover:bg-burgundy-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40 group"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Size Assistant
        </span>
      </motion.button>
    </div>
  );
}