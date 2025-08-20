'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface VisualFilter {
  id: string;
  name: string;
  image: string;
  type: 'category' | 'occasion' | 'style';
  count?: number;
  description?: string;
  gradient?: string;
  formality?: string;
}

interface UnifiedVisualFilterProps {
  filters?: VisualFilter[];
  selectedFilters: string[];
  onFilterToggle: (filterId: string) => void;
  onClearAll?: () => void;
  title?: string;
  subtitle?: string;
}

// R2 Bucket Base URL for actual product images
const R2_BASE_URL = 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev';

// Default unified filters - categories and occasions together with REAL product images
const defaultFilters: VisualFilter[] = [
  // Categories - Using actual product images from your R2 bucket
  {
    id: 'suits',
    name: 'Suits',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/navy/navy-main-2.jpg`, // Navy suit - professional look
    type: 'category',
    count: 89
  },
  {
    id: 'shirts',
    name: 'Shirts',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/navy/tie-shirt-navy-main.jpg`, // White shirt with tie
    type: 'category',
    count: 124
  },
  {
    id: 'pants',
    name: 'Pants',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/burgundy/vest+tie+pants+bur.jpg`, // Pants from burgundy set
    type: 'category',
    count: 76
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/tan/tan-main.jpg`, // Tan/casual knitwear look
    type: 'category',
    count: 45
  },
  {
    id: 'jackets',
    name: 'Jackets',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/midnight-blue/midnight-blue-main-open.jpg`, // Open jacket view
    type: 'category',
    count: 58
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/burgundy/vest-tie-main.jpg`, // Vest and tie accessories
    type: 'category',
    count: 93
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/black/main.png`, // Black suit showing shoes
    type: 'category',
    count: 67
  },
  {
    id: 'bundles',
    name: 'Complete Looks',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/indigo/indigo-main.jpg`, // Complete indigo suit bundle
    type: 'category',
    count: 66
  },
  // Occasions - Using appropriate suit styles for each occasion
  {
    id: 'wedding',
    name: 'Wedding Guest',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/burgundy/three-peice-burgundy-main.jpg`, // Burgundy 3-piece for weddings
    type: 'occasion',
    gradient: 'from-rose-600/40 to-pink-600/40',
    formality: 'Formal'
  },
  {
    id: 'business',
    name: 'Business',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg`, // Charcoal grey business suit
    type: 'occasion',
    gradient: 'from-slate-700/40 to-slate-900/40',
    formality: 'Formal'
  },
  {
    id: 'black-tie',
    name: 'Black Tie',
    image: `${R2_BASE_URL}/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.png`, // Black tuxedo
    type: 'occasion',
    gradient: 'from-gray-900/40 to-black/40',
    formality: 'Black-Tie'
  },
  {
    id: 'prom',
    name: 'Prom 2025',
    image: `${R2_BASE_URL}/kct-prodcuts/Tuxedo-Bundles/royal-blue-tuxedo-white-tuxedo-shirt-black-bowtie.png`, // Royal blue tuxedo for prom
    type: 'occasion',
    gradient: 'from-purple-600/40 to-blue-600/40',
    formality: 'Formal'
  },
  {
    id: 'cocktail',
    name: 'Cocktail Party',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/emerlad/emerlad-main.jpg`, // Emerald suit for cocktail events
    type: 'occasion',
    gradient: 'from-amber-600/40 to-orange-600/40',
    formality: 'Semi-Formal'
  },
  {
    id: 'date-night',
    name: 'Date Night',
    image: `${R2_BASE_URL}/kct-prodcuts/suits/french-blue/french-blue-main.jpg`, // French blue for date night
    type: 'occasion',
    gradient: 'from-red-600/40 to-rose-600/40',
    formality: 'Casual'
  }
];

export default function UnifiedVisualFilter({
  filters = defaultFilters,
  selectedFilters,
  onFilterToggle,
  onClearAll,
  title = 'Shop by Style',
  subtitle = 'Click images to filter products'
}: UnifiedVisualFilterProps) {
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

  const isSelected = (filterId: string) => selectedFilters.includes(filterId);

  // Split filters by type for optional separate sections
  const categoryFilters = filters.filter(f => f.type === 'category');
  const occasionFilters = filters.filter(f => f.type === 'occasion');

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        {selectedFilters.length > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-sm text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1"
          >
            Clear filters ({selectedFilters.length})
          </button>
        )}
      </div>

      {/* Unified Grid - All filters in one consistent size */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filters.map((filter, index) => (
          <motion.div
            key={filter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={cn(
              "relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group",
              isSelected(filter.id) ? "ring-2 ring-burgundy-600" : "",
              "transition-all duration-300 hover:scale-105"
            )}
            onClick={() => onFilterToggle(filter.id)}
            onMouseEnter={() => setHoveredFilter(filter.id)}
            onMouseLeave={() => setHoveredFilter(null)}
          >
            {/* Background Image */}
            <Image
              src={filter.image}
              alt={filter.name}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                isSelected(filter.id) && "brightness-90"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            />
            
            {/* Gradient Overlay */}
            <div 
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                filter.gradient 
                  ? `bg-gradient-to-t ${filter.gradient}`
                  : "bg-gradient-to-t from-black/60 via-transparent to-transparent"
              )} 
            />
            
            {/* Selection Indicator */}
            {isSelected(filter.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-7 h-7 bg-burgundy-600 rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-3 flex flex-col justify-end">
              <div className="text-white">
                <h3 className="text-sm font-semibold leading-tight">{filter.name}</h3>
                {filter.formality && (
                  <p className="text-xs text-white/80 mt-0.5">{filter.formality}</p>
                )}
                {filter.count !== undefined && (
                  <p className="text-xs text-white/70 mt-0.5">{filter.count} items</p>
                )}
              </div>
            </div>
            
            {/* Hover Overlay */}
            <div className={cn(
              "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300",
              hoveredFilter === filter.id ? "opacity-100" : "opacity-0"
            )}>
              <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-xs font-medium text-black">
                  {isSelected(filter.id) ? 'Remove' : 'Select'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}