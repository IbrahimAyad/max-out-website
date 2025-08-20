"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Shirt, 
  Palette,
  ChevronDown,
  SlidersHorizontal,
  Check,
  TrendingUp,
  Sun,
  Calendar,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { ProductFilters } from '@/lib/supabase/types'

interface InlineFilterSectionProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  metadata: {
    categories: string[]
    colors: string[]
  }
  onOpenAllFilters?: () => void
  className?: string
}

type FilterMode = 'smart' | 'category' | 'color' | null

export function InlineFilterSection({
  filters,
  onFiltersChange,
  metadata,
  onOpenAllFilters,
  className
}: InlineFilterSectionProps) {
  const [activeMode, setActiveMode] = useState<FilterMode>('smart')

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    if (value === undefined || value === null || value === '') {
      const { [key]: _, ...rest } = filters
      onFiltersChange(rest)
    } else {
      onFiltersChange({ ...filters, [key]: value })
    }
  }

  // Get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'fall'
    return 'winter'
  }

  const currentSeason = getCurrentSeason()

  return (
    <div className={cn("space-y-3", className)}>
      {/* Tab Buttons */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        <Button
          variant={activeMode === 'smart' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveMode(activeMode === 'smart' ? null : 'smart')}
          className={cn(
            "flex-shrink-0 gap-2",
            activeMode === 'smart' && "bg-gold hover:bg-gold/90 text-black"
          )}
        >
          <Sparkles className="h-4 w-4" />
          Smart Filters
          <ChevronDown className={cn(
            "h-3 w-3 ml-1 transition-transform",
            activeMode === 'smart' && "rotate-180"
          )} />
        </Button>

        <Button
          variant={activeMode === 'category' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveMode(activeMode === 'category' ? null : 'category')}
          className={cn(
            "flex-shrink-0 gap-2",
            activeMode === 'category' && "bg-gold hover:bg-gold/90 text-black"
          )}
        >
          <Shirt className="h-4 w-4" />
          Category
          <ChevronDown className={cn(
            "h-3 w-3 ml-1 transition-transform",
            activeMode === 'category' && "rotate-180"
          )} />
          {filters.category && filters.category !== 'all' && (
            <Badge className="ml-1 h-5 px-1">1</Badge>
          )}
        </Button>

        <Button
          variant={activeMode === 'color' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveMode(activeMode === 'color' ? null : 'color')}
          className={cn(
            "flex-shrink-0 gap-2",
            activeMode === 'color' && "bg-gold hover:bg-gold/90 text-black"
          )}
        >
          <Palette className="h-4 w-4" />
          Color
          <ChevronDown className={cn(
            "h-3 w-3 ml-1 transition-transform",
            activeMode === 'color' && "rotate-180"
          )} />
          {filters.color && (
            <Badge className="ml-1 h-5 px-1">1</Badge>
          )}
        </Button>

        {onOpenAllFilters && (
          <>
            <div className="h-8 w-px bg-gray-200 flex-shrink-0 self-center" />
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAllFilters}
              className="flex-shrink-0 gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              All Filters
            </Button>
          </>
        )}
      </div>

      {/* Dynamic Content Area */}
      <AnimatePresence mode="wait">
        {activeMode && (
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            {activeMode === 'smart' && (
              <SmartFilterContent
                filters={filters}
                onFiltersChange={updateFilter}
                currentSeason={currentSeason}
              />
            )}

            {activeMode === 'category' && (
              <CategoryFilterContent
                categories={metadata.categories}
                selectedCategory={filters.category}
                onCategoryChange={(category) => updateFilter('category', category)}
              />
            )}

            {activeMode === 'color' && (
              <ColorFilterContent
                selectedColor={filters.color}
                onColorChange={(color) => updateFilter('color', color)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Smart Filter Content
function SmartFilterContent({
  filters,
  onFiltersChange,
  currentSeason
}: {
  filters: ProductFilters
  onFiltersChange: (key: keyof ProductFilters, value: any) => void
  currentSeason: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-gold" />
        <h3 className="font-medium">Smart Suggestions</h3>
        <Badge variant="secondary" className="text-xs">Atelier AI</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Seasonal */}
        <Card 
          className={cn(
            "p-3 cursor-pointer transition-all",
            filters.seasonal === currentSeason
              ? "ring-2 ring-gold bg-gold/5"
              : "hover:shadow-md"
          )}
          onClick={() => onFiltersChange('seasonal', 
            filters.seasonal === currentSeason ? undefined : currentSeason
          )}
        >
          <div className="flex items-center gap-3">
            <Sun className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-medium text-sm">Perfect for {currentSeason}</p>
              <p className="text-xs text-gray-600">
                {currentSeason === 'summer' ? 'Lightweight, breathable pieces' :
                 currentSeason === 'fall' ? 'Warm colors, layering options' :
                 currentSeason === 'winter' ? 'Heavy fabrics, warm tones' :
                 'Fresh colors, light fabrics'}
              </p>
            </div>
            {filters.seasonal === currentSeason && (
              <Check className="h-4 w-4 text-gold" />
            )}
          </div>
        </Card>

        {/* Trending */}
        <Card 
          className={cn(
            "p-3 cursor-pointer transition-all",
            filters.trending
              ? "ring-2 ring-gold bg-gold/5"
              : "hover:shadow-md"
          )}
          onClick={() => onFiltersChange('trending', !filters.trending)}
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-sm">Trending Now</p>
              <p className="text-xs text-gray-600">Popular this week</p>
            </div>
            {filters.trending && (
              <Check className="h-4 w-4 text-gold" />
            )}
          </div>
        </Card>

        {/* Wedding */}
        <Card 
          className={cn(
            "p-3 cursor-pointer transition-all",
            filters.occasion === 'wedding'
              ? "ring-2 ring-gold bg-gold/5"
              : "hover:shadow-md"
          )}
          onClick={() => onFiltersChange('occasion', 
            filters.occasion === 'wedding' ? undefined : 'wedding'
          )}
        >
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-purple-600" />
            <div className="flex-1">
              <p className="font-medium text-sm">Wedding Ready</p>
              <p className="text-xs text-gray-600">Guest & groomsmen</p>
            </div>
            {filters.occasion === 'wedding' && (
              <Check className="h-4 w-4 text-gold" />
            )}
          </div>
        </Card>

        {/* Date Night */}
        <Card 
          className={cn(
            "p-3 cursor-pointer transition-all",
            filters.occasion === 'date'
              ? "ring-2 ring-gold bg-gold/5"
              : "hover:shadow-md"
          )}
          onClick={() => onFiltersChange('occasion', 
            filters.occasion === 'date' ? undefined : 'date'
          )}
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium text-sm">Date Night</p>
              <p className="text-xs text-gray-600">Impressive styles</p>
            </div>
            {filters.occasion === 'date' && (
              <Check className="h-4 w-4 text-gold" />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Category Filter Content
function CategoryFilterContent({
  categories,
  selectedCategory,
  onCategoryChange
}: {
  categories: string[]
  selectedCategory?: string
  onCategoryChange: (category: string) => void
}) {
  const categoryOptions = ['all', ...categories]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Shirt className="h-4 w-4" />
        <h3 className="font-medium">Categories</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categoryOptions.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category || (!selectedCategory && category === 'all') ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={cn(
              "justify-start",
              (selectedCategory === category || (!selectedCategory && category === 'all')) &&
              "bg-gold hover:bg-gold/90 text-black"
            )}
          >
            {category === 'all' ? 'All Products' : category}
            {(selectedCategory === category || (!selectedCategory && category === 'all')) && (
              <Check className="h-3 w-3 ml-auto" />
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Color Filter Content
function ColorFilterContent({
  selectedColor,
  onColorChange
}: {
  selectedColor?: string
  onColorChange: (color: string) => void
}) {
  const colors = [
    { id: 'black', name: 'Black', hex: '#000000' },
    { id: 'navy', name: 'Navy', hex: '#000080' },
    { id: 'gray', name: 'Gray', hex: '#808080' },
    { id: 'brown', name: 'Brown', hex: '#964B00' },
    { id: 'burgundy', name: 'Burgundy', hex: '#800020' },
    { id: 'white', name: 'White', hex: '#FFFFFF' },
    { id: 'tan', name: 'Tan', hex: '#D2B48C' },
    { id: 'olive', name: 'Olive', hex: '#708238' },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="h-4 w-4" />
        <h3 className="font-medium">Colors</h3>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorChange(selectedColor === color.id ? '' : color.id)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-lg border-2 transition-all",
                selectedColor === color.id
                  ? "border-gold ring-2 ring-gold/20 scale-110"
                  : "border-gray-300 hover:border-gray-400"
              )}
              style={{ backgroundColor: color.hex }}
            >
              {selectedColor === color.id && (
                <div className="w-full h-full flex items-center justify-center">
                  <Check className={cn(
                    "h-5 w-5 font-bold",
                    color.id === 'white' ? "text-gray-800" : "text-white"
                  )} />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 group-hover:text-gray-900">
              {color.name}
            </span>
          </button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-3"
        onClick={() => onColorChange('ai-match')}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        AI Color Match
      </Button>
    </div>
  )
}