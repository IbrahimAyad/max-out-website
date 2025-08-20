"use client"

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

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
  onError
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Prevent console error logging for expected external image failures
    e.preventDefault()
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  // Get valid image URL with fallbacks
  const getValidImageUrl = (url: string | undefined): string => {
    if (!url || url.trim() === '') return '/placeholder-product.svg'
    
    // Check for common invalid patterns
    if (url === 'image' || url === 'about' || url === 'favorites' || url === 'pattern.svg') {
      return '/placeholder-product.svg'
    }
    
    // Check if URL looks valid
    try {
      const urlObj = new URL(url)
      // Only allow http/https URLs for external images
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        return url
      }
      return '/placeholder-product.svg'
    } catch {
      // If not a valid URL, check if it's a valid relative path
      if (url.startsWith('/') && !url.includes('..')) {
        // Check if it's a known valid local image
        const validLocalImages = ['/placeholder-product.svg', '/placeholder-suit.jpg', '/placeholder-shirt.jpg', '/placeholder-shoes.jpg', '/placeholder-tie.jpg']
        if (validLocalImages.includes(url)) {
          return url
        }
      }
      return '/placeholder-product.svg'
    }
  }

  const imageSrc = imageError ? '/placeholder-product.svg' : getValidImageUrl(src)
  const isPlaceholder = imageError || imageSrc === '/placeholder-product.svg'

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
  )
}