'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Expand, 
  Eye,
  RotateCcw,
  Share2,
  Heart
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'

interface LuxuryImageGalleryProps {
  images: string[]
  productName: string
  badges?: {
    isBundle?: boolean
    trending?: boolean
    aiScore?: number
  }
  onImageChange?: (index: number) => void
  className?: string
}

interface TouchPosition {
  x: number
  y: number
}

export function LuxuryImageGallery({ 
  images, 
  productName, 
  badges = {},
  onImageChange,
  className 
}: LuxuryImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null)
  const [isSwiping, setIsSwiping] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [isLoaded, setIsLoaded] = useState<boolean[]>(new Array(images.length).fill(false))
  
  const galleryRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Animation springs for smooth interactions
  const x = useSpring(0, { stiffness: 300, damping: 30 })
  const scale = useSpring(1, { stiffness: 300, damping: 30 })
  const opacity = useSpring(1, { stiffness: 300, damping: 30 })

  // Transform values for gesture animations
  const rotateX = useTransform(x, [-100, 100], [-5, 5])
  const rotateY = useTransform(x, [-100, 100], [5, -5])

  useEffect(() => {
    setViewCount(prev => prev + 1)
  }, [selectedImage])

  const handleImageSelect = useCallback((index: number) => {
    if (index === selectedImage) return
    
    setSelectedImage(index)
    onImageChange?.(index)
    
    // Smooth transition animation
    x.set(index > selectedImage ? 100 : -100)
    x.set(0)
  }, [selectedImage, onImageChange, x])

  const handlePrevious = useCallback(() => {
    const newIndex = selectedImage === 0 ? images.length - 1 : selectedImage - 1
    handleImageSelect(newIndex)
  }, [selectedImage, images.length, handleImageSelect])

  const handleNext = useCallback(() => {
    const newIndex = (selectedImage + 1) % images.length
    handleImageSelect(newIndex)
  }, [selectedImage, images.length, handleImageSelect])

  // Touch gesture handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    })
    setIsSwiping(false)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return

    const currentTouch = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }

    const diffX = touchStart.x - currentTouch.x
    const diffY = touchStart.y - currentTouch.y

    // Determine if this is a horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
      setIsSwiping(true)
      x.set(-diffX * 0.5) // Smooth follow gesture
    }
  }, [touchStart, x])

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !isSwiping) {
      setTouchStart(null)
      setIsSwiping(false)
      x.set(0)
      return
    }

    const currentX = x.get()
    
    if (Math.abs(currentX) > 50) {
      if (currentX > 0) {
        handlePrevious()
      } else {
        handleNext()
      }
    }
    
    x.set(0)
    setTouchStart(null)
    setIsSwiping(false)
  }, [touchStart, isSwiping, x, handlePrevious, handleNext])

  // Zoom functionality
  const handleZoomToggle = useCallback(() => {
    setIsZoomed(!isZoomed)
    scale.set(isZoomed ? 1 : 2)
  }, [isZoomed, scale])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isZoomed || !imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }, [isZoomed])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFullscreen) {
        switch (e.key) {
          case 'ArrowLeft':
            handlePrevious()
            break
          case 'ArrowRight':
            handleNext()
            break
          case 'Escape':
            setIsFullscreen(false)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen, handlePrevious, handleNext])

  const handleImageLoad = useCallback((index: number) => {
    setIsLoaded(prev => {
      const newLoaded = [...prev]
      newLoaded[index] = true
      return newLoaded
    })
  }, [])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image Container */}
      <div 
        ref={galleryRef}
        className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 group shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ 
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{ x, rotateX, rotateY }}
            className="relative w-full h-full"
          >
            <div className="relative w-full h-full">
              {/* Loading Skeleton */}
              {!isLoaded[selectedImage] && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-xl" />
              )}
              
              <Image
                ref={imageRef}
                src={images[selectedImage]}
                alt={`${productName} - View ${selectedImage + 1}`}
                fill
                className={cn(
                  "object-cover transition-all duration-500 rounded-xl",
                  isZoomed ? "cursor-zoom-out scale-200" : "cursor-zoom-in",
                  !isLoaded[selectedImage] && "opacity-0"
                )}
                style={isZoomed ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                } : undefined}
                priority={selectedImage === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                onLoad={() => handleImageLoad(selectedImage)}
                onMouseMove={handleMouseMove}
                onClick={handleZoomToggle}
                quality={95}
              />
              
              {/* Zoom indicator */}
              {!isZoomed && (
                <div className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ZoomIn className="h-4 w-4" />
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 border border-gray-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 border border-gray-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </motion.button>
          </>
        )}

        {/* Product Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {badges.isBundle && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-burgundy-600 text-white shadow-lg border-0">
                Complete Look
              </Badge>
            </motion.div>
          )}
          {badges.trending && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-red-500 text-white shadow-lg border-0">
                Trending
              </Badge>
            </motion.div>
          )}
          {badges.aiScore && badges.aiScore >= 85 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="bg-gradient-to-r from-gold-500 to-yellow-500 text-black shadow-lg border-0">
                AI Score: {badges.aiScore}
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10"
          >
            {selectedImage + 1} / {images.length}
          </motion.div>
        )}

        {/* Fullscreen Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-4 left-4 p-2 bg-black/70 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/10"
          aria-label="View fullscreen"
        >
          <Expand className="h-4 w-4" />
        </motion.button>

        {/* Touch indicator for mobile */}
        {isSwiping && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleImageSelect(index)}
              className={cn(
                "relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 transition-all duration-300",
                selectedImage === index 
                  ? "ring-2 ring-burgundy-600 ring-offset-2 shadow-lg" 
                  : "hover:opacity-80 hover:shadow-md"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
                quality={80}
              />
              
              {/* Active indicator */}
              {selectedImage === index && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 ring-2 ring-burgundy-600 ring-offset-2 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 rounded-lg" />
            </motion.button>
          ))}
        </div>
      )}

      {/* View Counter (Hidden but tracked for analytics) */}
      <div className="sr-only">
        Image views: {viewCount}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[selectedImage]}
                  alt={`${productName} - Fullscreen view`}
                  width={1200}
                  height={1600}
                  className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg"
                  quality={100}
                />
              </motion.div>
              
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
                aria-label="Close fullscreen"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LuxuryImageGallery