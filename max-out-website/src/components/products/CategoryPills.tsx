'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PRODUCT_CATEGORIES } from '@/lib/supabase/types';

interface CategoryPill {
  id: string;
  name: string;
  count?: number;
  slug?: string;
}

interface CategoryPillsProps {
  categories?: CategoryPill[];
  selectedCategory?: string;
  onCategorySelect: (category: string | null) => void;
  className?: string;
  showCounts?: boolean;
  variant?: 'default' | 'minimal' | 'premium';
}

const DEFAULT_CATEGORIES: CategoryPill[] = [
  { id: 'all', name: 'All Products' },
  ...PRODUCT_CATEGORIES.map(cat => ({
    id: cat.toLowerCase().replace(/\s+/g, '-'),
    name: cat
  }))
];

export function CategoryPills({
  categories = DEFAULT_CATEGORIES,
  selectedCategory,
  onCategorySelect,
  className,
  showCounts = true,
  variant = 'default'
}: CategoryPillsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container || isScrolling) return;

    setIsScrolling(true);
    const scrollAmount = 240;
    const scrollPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    setTimeout(() => {
      setIsScrolling(false);
      checkScrollButtons();
    }, 300);
  };

  const handleCategoryClick = (categoryId: string) => {
    const category = categoryId === 'all' ? null : categoryId;
    onCategorySelect(category);
  };

  const getPillStyles = (categoryId: string) => {
    const isSelected = selectedCategory === categoryId || 
      (selectedCategory === null && categoryId === 'all');
    
    const baseStyles = "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer select-none";
    
    switch (variant) {
      case 'minimal':
        return cn(
          baseStyles,
          isSelected
            ? "bg-black text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        );
      
      case 'premium':
        return cn(
          baseStyles,
          "border-2 shadow-sm",
          isSelected
            ? "bg-gold text-black border-gold shadow-md scale-105"
            : "bg-white text-gray-700 border-gray-200 hover:border-gold/50 hover:shadow-md hover:scale-105"
        );
      
      default:
        return cn(
          baseStyles,
          "border",
          isSelected
            ? "bg-gold text-black border-gold shadow-sm"
            : "bg-white text-gray-700 border-gray-300 hover:border-gold hover:bg-gold/5"
        );
    }
  };

  const getCountBadgeStyles = (categoryId: string) => {
    const isSelected = selectedCategory === categoryId || 
      (selectedCategory === null && categoryId === 'all');
    
    switch (variant) {
      case 'minimal':
        return cn(
          "text-xs px-2 py-0.5 rounded-full",
          isSelected 
            ? "bg-white/20 text-white" 
            : "bg-gray-300 text-gray-600"
        );
      
      case 'premium':
        return cn(
          "text-xs px-2 py-0.5 rounded-full font-semibold",
          isSelected 
            ? "bg-black/10 text-black" 
            : "bg-gray-100 text-gray-600"
        );
      
      default:
        return cn(
          "text-xs px-2 py-0.5 rounded-full",
          isSelected 
            ? "bg-black/10 text-black" 
            : "bg-gray-100 text-gray-600"
        );
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Left Scroll Button */}
      <button
        onClick={() => scroll('left')}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full border transition-all duration-300",
          "hover:shadow-xl hover:scale-110",
          canScrollLeft 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none",
          "hidden md:block"
        )}
        disabled={!canScrollLeft || isScrolling}
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </button>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll('right')}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-lg rounded-full border transition-all duration-300",
          "hover:shadow-xl hover:scale-110",
          canScrollRight 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none",
          "hidden md:block"
        )}
        disabled={!canScrollRight || isScrolling}
        aria-label="Scroll categories right"
      >
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </button>

      {/* Pills Container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth",
          "px-1 py-2",
          // Add padding for scroll buttons on desktop
          "md:px-12"
        )}
        onScroll={checkScrollButtons}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id || 
            (selectedCategory === null && category.id === 'all');
          
          return (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                getPillStyles(category.id),
                "group relative overflow-hidden"
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(category.id);
                }
              }}
            >
              {/* Background animation for premium variant */}
              {variant === 'premium' && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-gold/20 to-gold/30 transition-all duration-300",
                  isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )} />
              )}

              <span className="relative z-10">{category.name}</span>
              
              {showCounts && category.count !== undefined && category.count > 0 && (
                <span className={cn(
                  getCountBadgeStyles(category.id),
                  "relative z-10"
                )}>
                  {category.count}
                </span>
              )}

              {/* Hover indicator */}
              <div className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold transition-all duration-300",
                isSelected ? "w-full" : "w-0 group-hover:w-1/2"
              )} />
            </div>
          );
        })}
      </div>

      {/* Mobile scroll indicator */}
      <div className="flex justify-center mt-2 md:hidden">
        {categories.length > 3 && (
          <div className="flex gap-1">
            {Array.from({ length: Math.ceil(categories.length / 3) }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gray-300"
              />
            ))}
          </div>
        )}
      </div>

      {/* Category count summary */}
      {showCounts && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            {categories.reduce((total, cat) => total + (cat.count || 0), 0)} products
            {selectedCategory && selectedCategory !== 'all' && (
              <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

// Custom CSS for hiding scrollbar - add to your global styles
export const categoryPillsStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
    -webkit-scrollbar: {
      display: none;
    }
  }
`;