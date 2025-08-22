"use client"

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { 
  getImageWithFallback, 
  createImageErrorHandler, 
  isValidImageUrl 
} from '@/lib/utils/image-fallback'
import { ImageErrorBoundary } from './ImageErrorBoundary'

interface ProductImageProps {
  src: string | undefined
  alt: string
  className?: string
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
  category?: string
  productType?: string
}

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  fill = true,
  width,
  height,
  priority = false,
  onLoad,
  onError,
  category,
  productType
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = createImageErrorHandler(
    getImageWithFallback(null, { category, productType, useLocalPlaceholder: true }),
    () => {
      setImageError(true)
      setIsLoading(false)
      onError?.()
    }
  )

  const handleImageLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  // Get valid image URL with comprehensive fallbacks
  const imageSrc = getImageWithFallback(src, { 
    category, 
    productType,
    useLocalPlaceholder: imageError 
  })
  
  const isPlaceholder = imageError || !isValidImageUrl(src)

  const imageProps = {
    src: imageSrc,
    alt: alt || 'Product image',
    className: cn(
      'transition-all duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    onError: handleImageError,
    onLoad: handleImageLoad,
    unoptimized: isPlaceholder,
    priority,
    sizes: sizes || (fill ? '(max-width: 768px) 100vw, 300px' : undefined)
  }

  return (
    <ImageErrorBoundary
      fallback={
        <div className={cn("flex items-center justify-center bg-gray-100 rounded-lg", fill && "w-full h-full")}>
          <div className="text-center text-gray-500 p-4">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      }
    >
      <div className={cn("relative", fill && "w-full h-full")}>
        {/* Loading skeleton */}
        {isLoading && (
          <div className={cn(
            'absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse',
            fill && 'w-full h-full'
          )} />
        )}
        
        {/* Image */}
        {fill ? (
          <Image
            {...imageProps}
            fill
            style={{ objectFit: className?.includes('object-contain') ? 'contain' : 'cover' }}
          />
        ) : (
          <Image
            {...imageProps}
            width={width || 300}
            height={height || 400}
          />
        )}
      </div>
    </ImageErrorBoundary>
  )
}