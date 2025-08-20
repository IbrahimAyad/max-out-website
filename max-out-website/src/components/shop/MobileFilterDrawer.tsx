"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  TrendingUp,
  Sun,
  Moon,
  Calendar,
  Shirt,
  Users,
  DollarSign,
  Palette,
  Ruler
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils/cn'
import { ProductFilters } from '@/lib/supabase/types'
import { MobileColorPicker } from './MobileColorPicker'
import { FilterMetadata } from '@/app/products/page'
import { Slider } from '@/components/ui/slider'

interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  metadata: FilterMetadata
  onClear: () => void
  activeCount: number
}

// Enhanced filter categories for mobile
const filterCategories = [
  { id: 'smart', label: 'Smart Filters', icon: Sparkles },
  { id: 'category', label: 'Category', icon: Shirt },
  { id: 'price', label: 'Price', icon: DollarSign },
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'size', label: 'Size', icon: Ruler },
  { id: 'occasion', label: 'Occasion', icon: Calendar },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
]

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  metadata,
  onClear,
  activeCount
}: MobileFilterDrawerProps) {
  const [activeSection, setActiveSection] = useState('smart')
  const [aiEnabled, setAiEnabled] = useState(true)
  
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-5 w-5 text-gray-700" />
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeCount > 0 && (
                  <Badge variant="secondary" className="bg-gold text-black">
                    {activeCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* AI Toggle */}
            <div className="p-4 border-b bg-gradient-to-r from-gold/5 to-yellow-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span className="text-sm font-medium">Atelier AI Suggestions</span>
                </div>
                <Switch
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Get personalized recommendations based on trends and your style
              </p>
            </div>

            {/* Category Tabs */}
            <div className="border-b">
              <div className="flex overflow-x-auto scrollbar-hide p-2 gap-2">
                {filterCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveSection(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                      activeSection === cat.id
                        ? "bg-gold text-black shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence mode="wait">
                {activeSection === 'smart' && (
                  <motion.div
                    key="smart"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-gold" />
                      Smart Suggestions
                    </h3>
                    
                    {/* Seasonal */}
                    <Card 
                      className={cn(
                        "p-4 cursor-pointer transition-all",
                        filters.seasonal === currentSeason
                          ? "ring-2 ring-gold bg-gold/5"
                          : "hover:shadow-md"
                      )}
                      onClick={() => updateFilter('seasonal', 
                        filters.seasonal === currentSeason ? undefined : currentSeason
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {currentSeason === 'fall' ? <Calendar className="h-5 w-5 text-orange-600" /> :
                           currentSeason === 'winter' ? <Moon className="h-5 w-5 text-blue-600" /> :
                           currentSeason === 'spring' ? <Sun className="h-5 w-5 text-green-600" /> :
                           <Sun className="h-5 w-5 text-yellow-600" />}
                          <div>
                            <p className="font-medium">Perfect for {currentSeason}</p>
                            <p className="text-xs text-gray-600">
                              {currentSeason === 'fall' ? 'Darker colors, layering pieces' :
                               currentSeason === 'winter' ? 'Heavy fabrics, warm tones' :
                               currentSeason === 'spring' ? 'Light colors, breathable fabrics' :
                               'Lightweight, cool materials'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Trending */}
                    <Card 
                      className={cn(
                        "p-4 cursor-pointer transition-all",
                        filters.trending
                          ? "ring-2 ring-gold bg-gold/5"
                          : "hover:shadow-md"
                      )}
                      onClick={() => updateFilter('trending', !filters.trending)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Trending Now</p>
                            <p className="text-xs text-gray-600">Most popular this week</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Hot
                        </Badge>
                      </div>
                    </Card>

                    {/* Wedding Season */}
                    <Card 
                      className={cn(
                        "p-4 cursor-pointer transition-all",
                        filters.occasion === 'wedding'
                          ? "ring-2 ring-gold bg-gold/5"
                          : "hover:shadow-md"
                      )}
                      onClick={() => updateFilter('occasion', 
                        filters.occasion === 'wedding' ? undefined : 'wedding'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Wedding Ready</p>
                            <p className="text-xs text-gray-600">Guest & groomsmen attire</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {activeSection === 'category' && (
                  <motion.div
                    key="category"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <h3 className="font-medium text-gray-900">Categories</h3>
                    <div className="space-y-2">
                      {(metadata.categories || []).map((category) => (
                        <button
                          key={category}
                          onClick={() => updateFilter('category', 
                            filters.category === category ? undefined : category
                          )}
                          className={cn(
                            "w-full text-left px-4 py-3 rounded-lg transition-all",
                            filters.category === category
                              ? "bg-gold text-black font-medium"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeSection === 'price' && (
                  <motion.div
                    key="price"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-gray-900">Price Range</h3>
                    
                    {/* Quick price ranges */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Under $100', min: 0, max: 100 },
                        { label: '$100-$200', min: 100, max: 200 },
                        { label: '$200-$500', min: 200, max: 500 },
                        { label: '$500+', min: 500, max: 10000 }
                      ].map((range) => (
                        <button
                          key={range.label}
                          onClick={() => {
                            updateFilter('minPrice', range.min)
                            updateFilter('maxPrice', range.max)
                          }}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            filters.minPrice === range.min && filters.maxPrice === range.max
                              ? "bg-gold text-black"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom slider */}
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">${filters.minPrice || metadata.priceRange?.min || 0}</span>
                        <span className="font-medium">${filters.maxPrice || metadata.priceRange?.max || 1000}</span>
                      </div>
                      <Slider
                        value={[
                          filters.minPrice || metadata.priceRange?.min || 0,
                          filters.maxPrice || metadata.priceRange?.max || 1000
                        ]}
                        onValueChange={([min, max]) => {
                          updateFilter('minPrice', min)
                          updateFilter('maxPrice', max)
                        }}
                        min={metadata.priceRange?.min || 0}
                        max={metadata.priceRange?.max || 1000}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  </motion.div>
                )}

                {activeSection === 'color' && (
                  <motion.div
                    key="color"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-gray-900">Color Selection</h3>
                    <MobileColorPicker
                      selectedColor={filters.color}
                      onColorChange={(color) => updateFilter('color', 
                        color === 'ai-match' ? undefined : color
                      )}
                    />
                  </motion.div>
                )}

                {activeSection === 'size' && (
                  <motion.div
                    key="size"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="font-medium text-gray-900">Size</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'].map((size) => (
                        <button
                          key={size}
                          onClick={() => updateFilter('size', 
                            filters.size === size ? undefined : size
                          )}
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            filters.size === size
                              ? "bg-gold text-black"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClear}
                  className="flex-1"
                  disabled={activeCount === 0}
                >
                  Clear All
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 bg-gold hover:bg-gold/90 text-black"
                >
                  Apply Filters ({activeCount})
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}