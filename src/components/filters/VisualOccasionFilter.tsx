'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface VisualOccasion {
  id: string;
  name: string;
  image: string;
  icon?: React.ReactNode;
  gradient: string;
  description?: string;
  season?: string;
  formality?: 'casual' | 'semi-formal' | 'formal' | 'black-tie';
}

interface VisualOccasionFilterProps {
  occasions?: VisualOccasion[];
  selectedOccasions: string[];
  onOccasionToggle: (occasionId: string) => void;
  onClearAll?: () => void;
  variant?: 'cards' | 'compact' | 'hero';
}

// Default occasions with curated imagery
const defaultOccasions: VisualOccasion[] = [
  {
    id: 'wedding',
    name: 'Wedding Guest',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    gradient: 'from-rose-600 to-pink-600',
    description: 'Elegant attire for ceremonies',
    formality: 'formal',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'business',
    name: 'Business',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    gradient: 'from-slate-700 to-slate-900',
    description: 'Professional & polished',
    formality: 'formal',
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 'black-tie',
    name: 'Black Tie',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    gradient: 'from-gray-900 to-black',
    description: 'Tuxedos & formal evening wear',
    formality: 'black-tie',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'prom',
    name: 'Prom 2025',
    image: 'https://images.unsplash.com/photo-1519073454383-324977baf09d?w=800&q=80',
    gradient: 'from-purple-600 to-blue-600',
    description: 'Stand out styles',
    formality: 'formal',
    season: 'Spring',
    icon: <Calendar className="w-5 h-5" />
  },
  {
    id: 'cocktail',
    name: 'Cocktail Party',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    gradient: 'from-amber-600 to-orange-600',
    description: 'Smart casual elegance',
    formality: 'semi-formal'
  },
  {
    id: 'date-night',
    name: 'Date Night',
    image: 'https://images.unsplash.com/photo-1490195117352-aa267f47f2d9?w=800&q=80',
    gradient: 'from-red-600 to-rose-600',
    description: 'Sophisticated & stylish',
    formality: 'casual'
  }
];

export default function VisualOccasionFilter({
  occasions = defaultOccasions,
  selectedOccasions,
  onOccasionToggle,
  onClearAll,
  variant = 'cards'
}: VisualOccasionFilterProps) {
  const [hoveredOccasion, setHoveredOccasion] = useState<string | null>(null);

  const isSelected = (occasionId: string) => selectedOccasions.includes(occasionId);

  if (variant === 'hero') {
    // Hero variant - large featured cards
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((occasion, index) => (
            <motion.div
              key={occasion.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative h-80 rounded-2xl overflow-hidden cursor-pointer group",
                isSelected(occasion.id) && "ring-4 ring-burgundy-600"
              )}
              onClick={() => onOccasionToggle(occasion.id)}
              onMouseEnter={() => setHoveredOccasion(occasion.id)}
              onMouseLeave={() => setHoveredOccasion(null)}
            >
              {/* Background Image */}
              <Image
                src={occasion.image}
                alt={occasion.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-700",
                  hoveredOccasion === occasion.id && "scale-110"
                )}
              />
              
              {/* Gradient Overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t opacity-60",
                `bg-gradient-to-t ${occasion.gradient}`
              )} />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  {occasion.icon && (
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      {occasion.icon}
                    </div>
                  )}
                  {isSelected(occasion.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-burgundy-600" />
                    </motion.div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-2">{occasion.name}</h3>
                  <p className="text-white/90">{occasion.description}</p>
                  {occasion.formality && (
                    <span className="inline-block mt-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs uppercase tracking-wide">
                      {occasion.formality}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className={cn(
                "absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )}>
                <div className="bg-white px-6 py-3 rounded-full shadow-xl">
                  <span className="text-black font-medium">
                    {isSelected(occasion.id) ? 'Remove Filter' : 'Shop ' + occasion.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    // Compact variant - smaller clickable pills with images
    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-3">
          {occasions.map((occasion) => (
            <motion.button
              key={occasion.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative overflow-hidden rounded-full transition-all",
                isSelected(occasion.id) 
                  ? "ring-2 ring-burgundy-600 ring-offset-2" 
                  : "hover:shadow-lg"
              )}
              onClick={() => onOccasionToggle(occasion.id)}
            >
              <div className="flex items-center gap-3 pr-4">
                {/* Mini Image */}
                <div className="relative w-12 h-12 overflow-hidden rounded-full">
                  <Image
                    src={occasion.image}
                    alt={occasion.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Text */}
                <span className={cn(
                  "font-medium",
                  isSelected(occasion.id) ? "text-burgundy-700" : "text-gray-700"
                )}>
                  {occasion.name}
                </span>
                
                {/* Check */}
                {isSelected(occasion.id) && (
                  <Check className="w-4 h-4 text-burgundy-600" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Default cards variant
  return (
    <div className="w-full">
      {selectedOccasions.length > 0 && onClearAll && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onClearAll}
            className="text-sm text-burgundy-600 hover:text-burgundy-700"
          >
            Clear occasion filters ({selectedOccasions.length})
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {occasions.map((occasion, index) => (
          <motion.div
            key={occasion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group",
              isSelected(occasion.id) ? "ring-2 ring-burgundy-600 scale-95" : "hover:scale-105",
              "transition-all duration-300"
            )}
            onClick={() => onOccasionToggle(occasion.id)}
          >
            {/* Image */}
            <Image
              src={occasion.image}
              alt={occasion.name}
              fill
              className="object-cover"
            />
            
            {/* Gradient */}
            <div className={cn(
              "absolute inset-0",
              `bg-gradient-to-t ${occasion.gradient}`,
              "opacity-40 group-hover:opacity-60 transition-opacity"
            )} />
            
            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
              <h4 className="font-bold text-sm">{occasion.name}</h4>
              {occasion.formality && (
                <span className="text-xs opacity-90 capitalize">{occasion.formality}</span>
              )}
            </div>
            
            {/* Selected Indicator */}
            {isSelected(occasion.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-burgundy-600" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}