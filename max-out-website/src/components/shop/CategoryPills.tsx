"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CategoryOption {
  id: string
  label: string
  count?: number
}

interface CategoryPillsProps {
  categories: CategoryOption[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  variant?: 'default' | 'minimal' | 'premium'
  showCounts?: boolean
  className?: string
}

export function CategoryPills({
  categories,
  selectedCategory,
  onCategoryChange,
  variant = 'default',
  showCounts = true,
  className
}: CategoryPillsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Check scroll state
  const checkScrollState = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    checkScrollState()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollState)
      window.addEventListener('resize', checkScrollState)
      return () => {
        container.removeEventListener('scroll', checkScrollState)
        window.removeEventListener('resize', checkScrollState)
      }
    }
  }, [categories])

  // Don't render if no categories provided
  if (!categories || categories.length === 0) {
    return null
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 200
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  const getPillStyles = (categoryId: string) => {
    const isSelected = selectedCategory === categoryId
    
    switch (variant) {
      case 'minimal':
        return cn(
          "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full border-0 bg-transparent",
          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gold/20",
          isSelected
            ? "text-gold after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-gold after:rounded-full"
            : "text-gray-600 hover:text-gray-900"
        )
      
      case 'premium':
        return cn(
          "px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-gold/20 transform hover:scale-105",
          isSelected
            ? "bg-gradient-to-r from-gold to-yellow-400 text-black shadow-lg shadow-gold/25"
            : "bg-white text-gray-700 border border-gray-200 hover:border-gold/50 hover:shadow-md hover:bg-gray-50"
        )
      
      default:
        return cn(
          "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full",
          "focus:outline-none focus:ring-2 focus:ring-gold/20 hover:scale-105",
          isSelected
            ? "bg-gold text-black shadow-md border-gold"
            : "bg-white text-gray-700 border border-gray-300 hover:border-gold/60 hover:bg-gold/5"
        )
    }
  }

  return (
    <div className={cn("relative", className)}>
      {/* Scroll buttons */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white h-8 w-8 p-0 rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {canScrollRight && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md hover:bg-white h-8 w-8 p-0 rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth",
          "pb-2 pt-1", // Add padding for shadows/focus rings
          canScrollLeft && "pl-10",
          canScrollRight && "pr-10"
        )}
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
        }}
      >
        {(categories || []).map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex-shrink-0 flex items-center gap-2",
              getPillStyles(category.id)
            )}
          >
            <span>{category.label}</span>
            {showCounts && category.count !== undefined && (
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs min-w-[20px] h-5 px-1.5",
                  selectedCategory === category.id 
                    ? "bg-black/20 text-black" 
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {category.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Fade gradients for visual scroll indicators */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-5" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-5" />
      )}
    </div>
  )
}

// Preset category configurations for easy use
export const menswearCategories: CategoryOption[] = [
  { id: 'all', label: 'All Products' },
  { id: 'formal wear', label: 'Formal Wear' },
  { id: 'vest & accessory sets', label: 'Vest & Accessories' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'other', label: 'Other' },
]

// Quick filter shortcuts
export const quickFilters: CategoryOption[] = [
  { id: 'featured', label: '⭐ Featured' },
  { id: 'new', label: '🆕 New Arrivals' },
  { id: 'sale', label: '🔥 Sale' },
  { id: 'trending', label: '📈 Trending' },
]