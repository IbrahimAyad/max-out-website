"use client"

import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

interface Color {
  id: string
  name: string
  hex: string
  family?: string
}

interface MobileColorPickerProps {
  colors: Color[]
  selectedColor?: string
  onColorChange: (colorId: string) => void
  className?: string
}

// Premium color palette for menswear
const defaultColors: Color[] = [
  { id: 'black', name: 'Black', hex: '#000000', family: 'neutrals' },
  { id: 'charcoal', name: 'Charcoal', hex: '#36454F', family: 'neutrals' },
  { id: 'gray', name: 'Gray', hex: '#808080', family: 'neutrals' },
  { id: 'navy', name: 'Navy', hex: '#000080', family: 'blues' },
  { id: 'midnight', name: 'Midnight Blue', hex: '#191970', family: 'blues' },
  { id: 'royal', name: 'Royal Blue', hex: '#4169E1', family: 'blues' },
  { id: 'white', name: 'White', hex: '#FFFFFF', family: 'neutrals' },
  { id: 'ivory', name: 'Ivory', hex: '#FFFFF0', family: 'neutrals' },
  { id: 'burgundy', name: 'Burgundy', hex: '#800020', family: 'reds' },
  { id: 'maroon', name: 'Maroon', hex: '#800000', family: 'reds' },
  { id: 'brown', name: 'Brown', hex: '#964B00', family: 'earth' },
  { id: 'tan', name: 'Tan', hex: '#D2B48C', family: 'earth' },
  { id: 'olive', name: 'Olive', hex: '#708238', family: 'greens' },
  { id: 'forest', name: 'Forest Green', hex: '#228B22', family: 'greens' },
  { id: 'gold', name: 'Gold', hex: '#FFD700', family: 'accents' },
  { id: 'silver', name: 'Silver', hex: '#C0C0C0', family: 'accents' },
]

export function MobileColorPicker({
  colors = defaultColors,
  selectedColor,
  onColorChange,
  className
}: MobileColorPickerProps) {
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null)
  
  // Group colors by family
  const colorFamilies = colors.reduce((acc, color) => {
    const family = color.family || 'other'
    if (!acc[family]) acc[family] = []
    acc[family].push(color)
    return acc
  }, {} as Record<string, Color[]>)

  const familyNames: Record<string, string> = {
    neutrals: 'Neutrals',
    blues: 'Blues',
    reds: 'Reds & Burgundy',
    earth: 'Earth Tones',
    greens: 'Greens',
    accents: 'Accents',
    other: 'Other'
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-green-500" />
        <span>Color</span>
        {selectedColor && (
          <span className="text-xs text-gray-500">
            ({colors.find(c => c.id === selectedColor)?.name})
          </span>
        )}
      </div>

      {/* Quick access popular colors */}
      <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
        {colors.slice(0, 8).map((color) => (
          <motion.button
            key={color.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onColorChange(color.id)}
            className={cn(
              "relative flex-shrink-0 w-12 h-12 rounded-xl border-2 transition-all duration-200",
              "shadow-sm hover:shadow-md",
              selectedColor === color.id
                ? "border-gold ring-2 ring-gold/20"
                : "border-gray-200"
            )}
            style={{ backgroundColor: color.hex }}
            aria-label={`Select ${color.name}`}
          >
            {selectedColor === color.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className={cn(
                  "h-5 w-5 font-bold",
                  color.hex === '#FFFFFF' || color.hex === '#FFFFF0' 
                    ? "text-gray-800" 
                    : "text-white"
                )} />
              </motion.div>
            )}
          </motion.button>
        ))}
        
        {/* Show more button */}
        <button
          onClick={() => setExpandedFamily(expandedFamily ? null : 'all')}
          className="flex-shrink-0 w-12 h-12 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-gold hover:text-gold transition-colors"
        >
          <span className="text-xs font-medium">+{colors.length - 8}</span>
        </button>
      </div>

      {/* Expanded color families */}
      <AnimatePresence>
        {expandedFamily && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-2 border-t border-gray-100">
              {Object.entries(colorFamilies).map(([family, familyColors]) => (
                <div key={family} className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {familyNames[family]}
                  </h4>
                  <div className="grid grid-cols-6 gap-2">
                    {familyColors.map((color) => (
                      <motion.button
                        key={color.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onColorChange(color.id)
                          setExpandedFamily(null)
                        }}
                        className={cn(
                          "relative aspect-square rounded-lg border-2 transition-all duration-200",
                          "shadow-sm hover:shadow-md",
                          selectedColor === color.id
                            ? "border-gold ring-2 ring-gold/20"
                            : "border-gray-200"
                        )}
                        style={{ backgroundColor: color.hex }}
                        aria-label={color.name}
                      >
                        {selectedColor === color.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Check className={cn(
                              "h-4 w-4 font-bold",
                              color.hex === '#FFFFFF' || color.hex === '#FFFFF0' 
                                ? "text-gray-800" 
                                : "text-white"
                            )} />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Color Match */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          // Trigger AI color matching
          onColorChange('ai-match')
        }}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-gold/10 to-yellow-50 border border-gold/30 rounded-lg text-sm font-medium text-gray-800 hover:from-gold/20 hover:to-yellow-100 transition-all duration-200"
      >
        <Sparkles className="h-4 w-4 text-gold" />
        <span>AI Color Match</span>
      </motion.button>
    </div>
  )
}

// Smart color suggestions based on context
export function getSmartColorSuggestions(
  occasion?: string,
  season?: string,
  timeOfDay?: string
): string[] {
  const suggestions: Record<string, string[]> = {
    // Occasions
    business: ['navy', 'charcoal', 'gray', 'black'],
    wedding: ['navy', 'charcoal', 'midnight', 'burgundy'],
    casual: ['brown', 'tan', 'olive', 'navy'],
    formal: ['black', 'midnight', 'charcoal'],
    
    // Seasons
    fall: ['burgundy', 'brown', 'olive', 'forest'],
    winter: ['charcoal', 'black', 'navy', 'burgundy'],
    spring: ['tan', 'gray', 'navy', 'olive'],
    summer: ['tan', 'white', 'ivory', 'gray'],
    
    // Time of day
    evening: ['black', 'midnight', 'charcoal', 'burgundy'],
    daytime: ['navy', 'gray', 'tan', 'brown']
  }

  const allSuggestions = new Set<string>()
  
  if (occasion && suggestions[occasion]) {
    suggestions[occasion].forEach(color => allSuggestions.add(color))
  }
  if (season && suggestions[season]) {
    suggestions[season].forEach(color => allSuggestions.add(color))
  }
  if (timeOfDay && suggestions[timeOfDay]) {
    suggestions[timeOfDay].forEach(color => allSuggestions.add(color))
  }

  return Array.from(allSuggestions)
}