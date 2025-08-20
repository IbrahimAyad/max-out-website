'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface VisualCategory {
  id: string;
  name: string;
  image: string;
  count?: number;
  description?: string;
}

interface VisualCategoryFilterProps {
  categories?: VisualCategory[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onClearAll?: () => void;
  variant?: 'grid' | 'carousel' | 'masonry';
  showCounts?: boolean;
}

// Default categories for menswear
const defaultCategories: VisualCategory[] = [
  {
    id: 'suits',
    name: 'Suits',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    count: 89,
    description: 'Classic & Modern Suits'
  },
  {
    id: 'shirts',
    name: 'Shirts',
    image: 'https://images.unsplash.com/photo-1603252109303-2751ce8939db?w=800&q=80',
    count: 124,
    description: 'Dress & Casual Shirts'
  },
  {
    id: 'pants',
    name: 'Pants',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    count: 76,
    description: 'Trousers & Chinos'
  },
  {
    id: 'knitwear',
    name: 'Knitwear & Sweaters',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80',
    count: 45,
    description: 'Sweaters & Cardigans'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    count: 58,
    description: 'Blazers & Outerwear'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=80',
    count: 93,
    description: 'Ties, Belts & More'
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80',
    count: 67,
    description: 'Formal & Casual'
  },
  {
    id: 'bundles',
    name: 'Complete Looks',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    count: 66,
    description: 'Curated Outfits'
  }
];

export default function VisualCategoryFilter({
  categories = defaultCategories,
  selectedCategories,
  onCategoryToggle,
  onClearAll,
  variant = 'grid',
  showCounts = true
}: VisualCategoryFilterProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const isSelected = (categoryId: string) => selectedCategories.includes(categoryId);

  const containerClass = cn(
    "w-full",
    variant === 'grid' && "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4",
    variant === 'carousel' && "flex overflow-x-auto gap-4 pb-4 scrollbar-hide",
    variant === 'masonry' && "columns-2 md:columns-4 gap-4"
  );

  const cardClass = (categoryId: string) => cn(
    "relative cursor-pointer overflow-hidden rounded-lg transition-all duration-300",
    variant === 'carousel' && "flex-shrink-0 w-64",
    variant === 'masonry' && "mb-4 break-inside-avoid",
    isSelected(categoryId) ? "ring-4 ring-burgundy-600 scale-95" : "hover:scale-105",
    "group"
  );

  return (
    <div className="w-full">
      {/* Header */}
      {selectedCategories.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {selectedCategories.length} categories selected
          </span>
          {onClearAll && (
            <button
              onClick={onClearAll}
              className="text-sm text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Category Grid */}
      <div className={containerClass}>
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cardClass(category.id)}
            onClick={() => onCategoryToggle(category.id)}
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  hoveredCategory === category.id ? "scale-110" : "scale-100",
                  isSelected(category.id) && "brightness-75"
                )}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              
              {/* Gradient Overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )} />
              
              {/* Selection Indicator */}
              {isSelected(category.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-burgundy-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}
              
              {/* Category Info Overlay */}
              <div className={cn(
                "absolute bottom-0 left-0 right-0 p-4 text-white",
                "transform transition-transform duration-300",
                hoveredCategory === category.id ? "translate-y-0" : "translate-y-2"
              )}>
                <h3 className="text-lg font-medium mb-1">{category.name}</h3>
                {category.description && (
                  <p className={cn(
                    "text-xs text-white/80 transition-opacity duration-300",
                    hoveredCategory === category.id ? "opacity-100" : "opacity-0"
                  )}>
                    {category.description}
                  </p>
                )}
                {showCounts && category.count && (
                  <span className="text-sm text-white/90">
                    {category.count} items
                  </span>
                )}
              </div>
              
              {/* Hover Action Hint */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )}>
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <span className="text-sm font-medium text-black">
                    {isSelected(category.id) ? 'Remove Filter' : 'Filter by ' + category.name}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}