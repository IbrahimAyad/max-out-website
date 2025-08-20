'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProductSkeletonProps {
  variant?: 'default' | 'compact' | 'featured' | 'list';
  count?: number;
  className?: string;
  showFilters?: boolean;
}

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

// Base skeleton component with shimmer animation
const Skeleton = ({ className, children }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
      "bg-[length:200%_100%] animate-shimmer rounded",
      className
    )}
  >
    {children}
  </div>
);

// Single product card skeleton
const ProductCardSkeleton = ({ 
  variant = 'default' 
}: { 
  variant?: 'default' | 'compact' | 'featured' | 'list' 
}) => {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';
  const isList = variant === 'list';

  if (isList) {
    return (
      <div className="group bg-white rounded-lg border border-gray-100 p-4">
        <div className="flex gap-4">
          {/* Image */}
          <Skeleton className="w-24 h-32 flex-shrink-0" />
          
          {/* Content */}
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <Skeleton className="w-16 h-3" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-3/4 h-4" />
            </div>
            
            <div className="flex items-center gap-2">
              <Skeleton className="w-20 h-5" />
              <Skeleton className="w-16 h-4" />
            </div>
            
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-12 h-3" />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-20 h-8 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "group bg-white rounded-lg border border-gray-100 overflow-hidden",
      isCompact ? "aspect-[3/4]" : "aspect-[3/5]",
      isFeatured && "ring-2 ring-gold/20"
    )}>
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-gray-100">
        <Skeleton className="w-full h-full" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Skeleton className="w-16 h-5 rounded" />
          {isFeatured && <Skeleton className="w-20 h-5 rounded" />}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>

        {/* Quick Add Button */}
        <div className="absolute inset-x-3 bottom-3">
          <Skeleton className="w-full h-8 rounded" />
        </div>
      </div>

      {/* Product Info */}
      <div className={cn(
        "p-4 space-y-3",
        isCompact ? "p-3 space-y-2" : "p-4 space-y-3"
      )}>
        {/* Category & Brand */}
        <div className="flex items-center justify-between">
          <Skeleton className="w-20 h-3" />
          <Skeleton className="w-16 h-3" />
        </div>

        {/* Product Name */}
        <div className="space-y-1">
          <Skeleton className={cn(
            "w-full",
            isCompact ? "h-4" : "h-5"
          )} />
          <Skeleton className={cn(
            "w-3/4",
            isCompact ? "h-4" : "h-5"
          )} />
        </div>

        {/* Product Type */}
        <Skeleton className="w-1/2 h-3" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className={cn(
            "w-16",
            isCompact ? "h-4" : "h-5"
          )} />
          <Skeleton className="w-12 h-4" />
        </div>

        {/* Color & Tags */}
        {!isCompact && (
          <>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="w-12 h-3" />
            </div>
            
            <div className="flex gap-1">
              <Skeleton className="w-16 h-6 rounded" />
              <Skeleton className="w-20 h-6 rounded" />
            </div>
          </>
        )}
      </div>

      {/* Gold shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite] pointer-events-none" />
    </div>
  );
};

// Filter panel skeleton
const FilterPanelSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-fit">
    {/* Header */}
    <div className="p-4 border-b border-gray-100">
      <Skeleton className="w-20 h-6" />
    </div>

    {/* Filter sections */}
    <div className="space-y-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border-b border-gray-100 last:border-b-0">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-4 h-4" />
            </div>
            
            <div className="space-y-2">
              {Array.from({ length: 3 + (i % 3) }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-6 h-3 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Category pills skeleton
const CategoryPillsSkeleton = () => (
  <div className="flex gap-3 overflow-hidden px-1 py-2">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={cn(
          "h-10 rounded-full flex-shrink-0",
          i === 0 ? "w-24" : i === 1 ? "w-32" : i === 2 ? "w-28" : "w-20"
        )}
      />
    ))}
  </div>
);

// Main ProductSkeleton component
export function ProductSkeleton({
  variant = 'default',
  count = 8,
  className,
  showFilters = false
}: ProductSkeletonProps) {
  const skeletonCards = Array.from({ length: count }, (_, i) => (
    <ProductCardSkeleton key={i} variant={variant} />
  ));

  if (variant === 'list') {
    return (
      <div className={cn("space-y-4", className)}>
        {skeletonCards}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Category Pills Skeleton */}
      <div className="mb-6">
        <CategoryPillsSkeleton />
      </div>

      <div className="flex gap-6">
        {/* Filters Skeleton */}
        {showFilters && (
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <FilterPanelSkeleton />
          </div>
        )}

        {/* Products Grid Skeleton */}
        <div className="flex-1">
          {/* Sort & View Options Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="w-32 h-6" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-24 h-8" />
              <div className="flex gap-1">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={cn(
            "grid gap-6",
            variant === 'compact' 
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
            {skeletonCards}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export individual skeleton components for flexibility
export { ProductCardSkeleton, FilterPanelSkeleton, CategoryPillsSkeleton };