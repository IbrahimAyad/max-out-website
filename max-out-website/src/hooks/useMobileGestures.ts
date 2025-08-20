"use client"

import { useEffect, useRef, useState } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onTap?: () => void
  onDoubleTap?: () => void
  threshold?: number
  preventScroll?: boolean
}

interface TouchData {
  startX: number
  startY: number
  startTime: number
  lastTap: number
}

export function useMobileGestures<T extends HTMLElement = HTMLElement>(
  handlers: SwipeHandlers
) {
  const ref = useRef<T>(null)
  const touchData = useRef<TouchData>({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTap: 0
  })
  const [isPressed, setIsPressed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const threshold = handlers.threshold || 50
    const tapThreshold = 300 // milliseconds for double tap

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchData.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        lastTap: touchData.current.lastTap
      }
      setIsPressed(true)

      if (handlers.preventScroll) {
        e.preventDefault()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (handlers.preventScroll) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      const endX = touch.clientX
      const endY = touch.clientY
      const endTime = Date.now()

      const deltaX = endX - touchData.current.startX
      const deltaY = endY - touchData.current.startY
      const deltaTime = endTime - touchData.current.startTime

      setIsPressed(false)

      // Check for tap/double tap
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
        const timeSinceLastTap = endTime - touchData.current.lastTap
        
        if (timeSinceLastTap < tapThreshold && handlers.onDoubleTap) {
          handlers.onDoubleTap()
          touchData.current.lastTap = 0
        } else {
          if (handlers.onTap) {
            handlers.onTap()
          }
          touchData.current.lastTap = endTime
        }
        return
      }

      // Check for swipe gestures
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      if (absX > threshold || absY > threshold) {
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > threshold && handlers.onSwipeRight) {
            handlers.onSwipeRight()
          } else if (deltaX < -threshold && handlers.onSwipeLeft) {
            handlers.onSwipeLeft()
          }
        } else {
          // Vertical swipe
          if (deltaY > threshold && handlers.onSwipeDown) {
            handlers.onSwipeDown()
          } else if (deltaY < -threshold && handlers.onSwipeUp) {
            handlers.onSwipeUp()
          }
        }
      }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: !handlers.preventScroll })
    element.addEventListener('touchmove', handleTouchMove, { passive: !handlers.preventScroll })
    element.addEventListener('touchend', handleTouchEnd)

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handlers])

  return { ref, isPressed }
}

// Utility hook for product card gestures
export function useProductCardGestures(
  productId: string,
  onAddToWishlist: () => void,
  onQuickView: () => void,
  onAddToCart?: () => void
) {
  const [showHint, setShowHint] = useState(false)

  const gestures = useMobileGestures<HTMLDivElement>({
    onSwipeLeft: () => {
      onAddToWishlist()
      // Show visual feedback
      setShowHint(true)
      setTimeout(() => setShowHint(false), 1500)
    },
    onSwipeRight: () => {
      onQuickView()
    },
    onDoubleTap: () => {
      if (onAddToCart) {
        onAddToCart()
      }
    },
    threshold: 40
  })

  return {
    ...gestures,
    showHint,
    hints: {
      wishlist: 'Swipe left to add to wishlist',
      quickView: 'Swipe right for quick view',
      addToCart: 'Double tap to add to cart'
    }
  }
}