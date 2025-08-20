'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Heart, Check, Truck, Shield } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/hooks/useCart';

interface ProductQuickViewProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  isMobile?: boolean;
}

export default function ProductQuickView({
  product,
  isOpen,
  onClose,
  onNavigate,
  isMobile = false
}: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addItem } = useCart();
  
  // Swipe gesture values for mobile
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0.5]);

  // Get product images
  const getProductImages = () => {
    const images = [];
    if (product?.primary_image) images.push(product.primary_image);
    if (product?.imageUrl) images.push(product.imageUrl);
    if (product?.featured_image?.src) images.push(product.featured_image.src);
    if (product?.images?.length) {
      product.images.forEach((img: any) => {
        if (img.src) images.push(img.src);
      });
    }
    return images.length > 0 ? images : ['/placeholder-product.jpg'];
  };

  const images = getProductImages();

  // Get available sizes from variants
  const getSizes = () => {
    if (product?.variants?.length > 0) {
      return product.variants
        .filter((v: any) => v.option1 && v.option1 !== 'Default Size' && v.inventory_quantity > 0)
        .map((v: any) => v.option1);
    }
    if (product?.sizes?.length > 0) {
      return product.sizes;
    }
    return ['S', 'M', 'L', 'XL', '2XL']; // Default sizes
  };

  const sizes = getSizes();

  // Format price
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedSize && sizes.length > 0) {
      // Highlight size selection
      document.getElementById('size-selector')?.classList.add('ring-2', 'ring-red-500');
      setTimeout(() => {
        document.getElementById('size-selector')?.classList.remove('ring-2', 'ring-red-500');
      }, 2000);
      return;
    }

    setIsAddingToCart(true);
    
    // Add to cart
    addItem({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: images[0],
      quantity: 1,
      size: selectedSize,
      category: product.category || 'product'
    });

    // Show success state
    setTimeout(() => {
      setIsAddingToCart(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (isMobile) {
          onClose(); // Auto close on mobile after success
        }
      }, 1500);
    }, 500);
  };

  // Handle drag end for mobile
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  // Reset state when product changes
  useEffect(() => {
    setSelectedSize('');
    setSelectedImageIndex(0);
    setShowSuccess(false);
  }, [product]);

  if (!product) return null;

  const content = (
    <div className={cn(
      "flex flex-col h-full",
      isMobile ? "bg-white rounded-t-3xl" : "bg-white"
    )}>
      {/* Mobile Drag Handle */}
      {isMobile && (
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Quick View</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 overflow-y-auto",
        isMobile ? "flex flex-col" : "grid grid-cols-2 gap-6 p-6"
      )}>
        {/* Image Gallery */}
        <div className={isMobile ? "relative h-80" : "space-y-4"}>
          {/* Main Image */}
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={images[selectedImageIndex]}
              alt={product.name || product.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Image Navigation for Desktop */}
            {!isMobile && images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(Math.min(images.length - 1, selectedImageIndex + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery - Desktop Only */}
          {!isMobile && images.length > 1 && (
            <div className="flex gap-2">
              {images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImageIndex === index ? "border-black" : "border-gray-200"
                  )}
                >
                  <Image
                    src={img}
                    alt={`View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={isMobile ? "p-4 space-y-4" : "space-y-6"}>
          {/* Name and Price */}
          <div>
            <h1 className="text-2xl font-semibold mb-2">
              {product.name || product.title}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Size Selector */}
          <div id="size-selector" className="space-y-2 transition-all">
            <label className="text-sm font-medium text-gray-700">
              Size {selectedSize && <span className="text-black">: {selectedSize}</span>}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "py-3 px-4 border-2 rounded-lg transition-all",
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Benefits */}
          <div className="space-y-2 py-3 border-y">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-600" />
              <span>In Stock - Ready to Ship</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Free Shipping on Orders $150+</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>30-Day Return Policy</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || showSuccess}
              className={cn(
                "w-full py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2",
                showSuccess
                  ? "bg-green-600 text-white"
                  : isAddingToCart
                  ? "bg-gray-200 text-gray-500"
                  : "bg-black text-white hover:bg-gray-800"
              )}
            >
              {showSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart!
                </>
              ) : isAddingToCart ? (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>

            <button className="w-full py-3 border-2 border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              Save to Favorites
            </button>
          </div>

          {/* View Full Details Link */}
          <a
            href={`/products/${product.handle || product.id}`}
            className="block text-center text-sm text-gray-600 underline hover:text-black transition-colors"
          >
            View Full Product Details
          </a>
        </div>
      </div>

      {/* Product Navigation - Desktop Only */}
      {!isMobile && onNavigate && (
        <div className="border-t p-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('prev')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={() => onNavigate('next')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  // Mobile Bottom Sheet
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ opacity }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Side Drawer
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />
          
          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden"
          >
            {content}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}