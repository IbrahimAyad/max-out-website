"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { extractProductImages, hasMultipleImages } from "@/lib/products/image-helpers";
import { formatPrice } from "@/lib/utils/format";

interface UniversalProductCardProps {
  product: any;
  priority?: boolean;
  onClick?: () => void;
  index?: number;
}

export function UniversalProductCard({ 
  product, 
  priority = false,
  onClick,
  index = 0
}: UniversalProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Extract all images using our helper
  const images = extractProductImages(product);
  const hasMultiple = images.length > 1;

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle hover image cycling
  useEffect(() => {
    if (!isHovered || !hasMultiple || isMobile) {
      setCurrentImageIndex(0);
      return;
    }

    // Cycle through images while hovering
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 1000); // Change image every second

    return () => clearInterval(interval);
  }, [isHovered, hasMultiple, images.length, isMobile]);

  // Handle touch for mobile
  const handleTouchStart = () => {
    if (isMobile && hasMultiple) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  // Get product URL
  const productUrl = `/products/${product.slug || product.id}`;

  // Format price
  const price = product.base_price || product.price || 0;
  const comparePrice = product.compare_at_price || product.compareAtPrice;
  const hasDiscount = comparePrice && comparePrice > price;
  const discountPercentage = hasDiscount 
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  return (
    <article 
      className="group relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        href={productUrl}
        onClick={onClick}
        className="block w-full"
      >
        {/* Image Container - Tall aspect ratio like fashion brands */}
        <div 
          className="relative w-full overflow-hidden bg-gray-50"
          style={{ aspectRatio: '3/4' }}
          onTouchStart={handleTouchStart}
        >
          {/* Main Image */}
          {!imageError ? (
            <>
              <img
                src={images[currentImageIndex].url}
                alt={images[currentImageIndex].alt}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                loading={priority ? "eager" : "lazy"}
                onError={() => setImageError(true)}
              />
              
              {/* Image Dots Indicator - Only on desktop hover or mobile with multiple images */}
              {hasMultiple && (isHovered || isMobile) && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentImageIndex 
                          ? 'bg-white w-4' 
                          : 'bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Sale Badge - Minimal design */}
              {hasDiscount && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-red-600 text-white text-xs font-medium px-2 py-1">
                    -{discountPercentage}%
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Product Info - Minimal like fashion brands */}
        <div className="pt-3 pb-2">
          {/* Product Name */}
          <h3 className="text-sm font-normal text-gray-900 leading-tight mb-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
              {formatPrice(price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(comparePrice)}
              </span>
            )}
          </div>

          {/* Colors indicator - Optional, minimal */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1 mt-2">
              {(product.colors || []).slice(0, 5).map((color: string, idx: number) => (
                <div
                  key={idx}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Quick Add - Only on desktop hover */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-black text-white text-sm py-3 hover:bg-gray-900 transition-colors">
            Quick Add
          </button>
        </div>
      )}
    </article>
  );
}

// Grid wrapper component for consistent layouts
export function UniversalProductGrid({ 
  products, 
  className = "" 
}: { 
  products: any[]; 
  className?: string;
}) {
  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];
  
  if (safeProducts.length === 0) {
    return null;
  }
  
  return (
    <div className={`
      grid gap-x-3 gap-y-8
      grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4
      ${className}
    `}>
      {safeProducts.map((product, index) => (
        <UniversalProductCard
          key={product.id || index}
          product={product}
          priority={index < 4} // Prioritize first 4 images
          index={index}
        />
      ))}
    </div>
  );
}