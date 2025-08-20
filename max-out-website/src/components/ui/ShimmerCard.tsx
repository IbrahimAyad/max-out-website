"use client"

import { cn } from '@/lib/utils/cn'

interface ShimmerCardProps {
  className?: string
  variant?: 'product' | 'category' | 'banner'
}

export function ShimmerCard({ className, variant = 'product' }: ShimmerCardProps) {
  if (variant === 'product') {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Image skeleton */}
          <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Brand */}
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
            
            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 w-3 bg-gray-200 rounded-sm" />
              ))}
              <div className="h-3 bg-gray-200 rounded w-8 ml-1" />
            </div>
            
            {/* Price */}
            <div className="flex gap-2 items-baseline">
              <div className="h-5 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            
            {/* Button */}
            <div className="h-9 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'category') {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <div className="p-4">
            <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="bg-gray-200 rounded-lg aspect-[16/9] relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    )
  }

  return null
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ShimmerCard key={i} variant="product" />
      ))}
    </div>
  )
}