'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, RotateCcw, Maximize } from 'lucide-react';
import { ProductImageGallery, ProductImage } from '@/lib/products/enhanced/types';

interface EnhancedImageGalleryProps {
  images: ProductImageGallery;
  productName: string;
  className?: string;
  showThumbnails?: boolean;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
}

export function EnhancedImageGallery({
  images,
  productName,
  className = '',
  showThumbnails = true,
  enableZoom = true,
  enableFullscreen = true
}: EnhancedImageGalleryProps) {
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get all available images
  const getAllImages = useCallback((): ProductImage[] => {
    const allImages: ProductImage[] = [];
    
    // Add primary image
    if (images.primary) {
      allImages.push(images.primary);
    }
    
    // Add gallery images
    if (images.gallery && Array.isArray(images.gallery)) {
      allImages.push(...images.gallery);
    }
    
    // Add variant images if selected
    if (selectedVariant && images.variants) {
      const variantSet = images.variants.find(v => v.variant_id === selectedVariant);
      if (variantSet) {
        allImages.push(...variantSet.images);
      }
    }
    
    // Add lifestyle images
    if (images.lifestyle && Array.isArray(images.lifestyle)) {
      allImages.push(...images.lifestyle);
    }
    
    // Add detail shots
    if (images.detail_shots && Array.isArray(images.detail_shots)) {
      allImages.push(...images.detail_shots);
    }
    
    // Sort by sort_order
    return allImages.sort((a, b) => a.sort_order - b.sort_order);
  }, [images, selectedVariant]);

  const allImages = getAllImages();
  const currentImage = allImages[currentImageIndex];

  // Image URL with fallback logic
  const getImageUrl = (image: ProductImage, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xl' = 'large'): string => {
    // Try responsive URLs first
    if (image.responsive_urls && image.responsive_urls[size]) {
      return image.responsive_urls[size];
    }
    
    // Try CDN URL
    if (image.cdn_url && !imageLoadErrors.has(image.cdn_url)) {
      return image.cdn_url;
    }
    
    // Try original URL
    if (image.url && !imageLoadErrors.has(image.url)) {
      return image.url;
    }
    
    // Fallback to placeholder
    return '/placeholder-product.jpg';
  };

  // Handle image load error
  const handleImageError = (imageUrl: string) => {
    setImageLoadErrors(prev => new Set([...prev, imageUrl]));
  };

  // Navigation
  const goToPrevious = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(prev => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Variant selection
  const handleVariantChange = (variantId: string | null) => {
    setSelectedVariant(variantId);
    setCurrentImageIndex(0); // Reset to first image when switching variants
  };

  if (!currentImage) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded"></div>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Variant Selector */}
      {images.variants && images.variants.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleVariantChange(null)}
            className={`px-3 py-1 text-sm rounded border ${
              selectedVariant === null 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            All Images
          </button>
          {images.variants.map((variant) => (
            <button
              key={variant.variant_id}
              onClick={() => handleVariantChange(variant.variant_id)}
              className={`px-3 py-1 text-sm rounded border ${
                selectedVariant === variant.variant_id 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {variant.variant_name}
            </button>
          ))}
        </div>
      )}

      {/* Main Image Display */}
      <div className="relative group bg-gray-50 rounded-lg overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={getImageUrl(currentImage, 'large')}
            alt={currentImage.alt_text || productName}
            fill
            className="object-cover"
            priority={currentImageIndex === 0}
            onError={() => handleImageError(getImageUrl(currentImage, 'large'))}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Actions */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {enableZoom && (
              <button
                className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full"
                title="Zoom"
              >
                <ZoomIn size={16} />
              </button>
            )}
            {enableFullscreen && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full"
                title="Fullscreen"
              >
                <Maximize size={16} />
              </button>
            )}
          </div>

          {/* Image Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-sm px-2 py-1 rounded">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {showThumbnails && allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={`${image.id}-${index}`}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 relative w-16 h-16 rounded border-2 overflow-hidden ${
                index === currentImageIndex 
                  ? 'border-black' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Image
                src={getImageUrl(image, 'thumbnail')}
                alt={image.alt_text || `${productName} ${index + 1}`}
                fill
                className="object-cover"
                onError={() => handleImageError(getImageUrl(image, 'thumbnail'))}
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {images.lifestyle && images.lifestyle.length > 0 && (
          <div className="text-center">
            <p className="font-medium text-gray-900">Lifestyle</p>
            <p className="text-gray-500">{images.lifestyle.length} photos</p>
          </div>
        )}
        {images.detail_shots && images.detail_shots.length > 0 && (
          <div className="text-center">
            <p className="font-medium text-gray-900">Details</p>
            <p className="text-gray-500">{images.detail_shots.length} photos</p>
          </div>
        )}
        {images.size_guide && images.size_guide.length > 0 && (
          <div className="text-center">
            <p className="font-medium text-gray-900">Size Guide</p>
            <p className="text-gray-500">{images.size_guide.length} photos</p>
          </div>
        )}
        {images.three_sixty && images.three_sixty.length > 0 && (
          <div className="text-center">
            <p className="font-medium text-gray-900">360° View</p>
            <p className="text-gray-500">{images.three_sixty.length} frames</p>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <span className="sr-only">Close</span>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={getImageUrl(currentImage, 'xl')}
              alt={currentImage.alt_text || productName}
              fill
              className="object-contain"
              onError={() => handleImageError(getImageUrl(currentImage, 'xl'))}
            />
          </div>
          
          {/* Fullscreen Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}