"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  Star,
  Palette,
  Tag,
  DollarSign,
  Sun,
  Snowflake,
  Leaf,
  Flower
} from 'lucide-react'
import { 
  generateSmartFilterSuggestions, 
  SmartFilterSuggestion,
  getCurrentSeason,
  getDynamicPriceRanges
} from '@/lib/services/smartFilters'
import { EnhancedProduct, ProductFilters } from '@/lib/supabase/types'
import { cn } from '@/lib/utils/cn'

interface SmartFiltersProps {
  products: EnhancedProduct[]
  currentFilters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  className?: string
}

const getSeasonIcon = (season: string) => {
  switch (season) {
    case 'spring': return <Flower className="h-4 w-4" />
    case 'summer': return <Sun className="h-4 w-4" />
    case 'fall': return <Leaf className="h-4 w-4" />
    case 'winter': return <Snowflake className="h-4 w-4" />
    default: return <Calendar className="h-4 w-4" />
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'seasonal': return getSeasonIcon(getCurrentSeason())
    case 'weather': return <Calendar className="h-4 w-4" />
    case 'occasion': return <Star className="h-4 w-4" />
    case 'trending': return <TrendingUp className="h-4 w-4" />
    case 'ai-recommended': return <Sparkles className="h-4 w-4" />
    default: return <Tag className="h-4 w-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'seasonal': return 'bg-gold-100 text-gold-800 border-gold-300'
    case 'weather': return 'bg-burgundy-100 text-burgundy-800 border-burgundy-300'
    case 'occasion': return 'bg-purple-100 text-purple-800 border-purple-300'
    case 'trending': return 'bg-rose-100 text-rose-800 border-rose-300'
    case 'ai-recommended': return 'bg-gradient-to-r from-gold-100 to-burgundy-100 text-burgundy-800 border-burgundy-300'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function SmartFilters({
  products,
  currentFilters,
  onFiltersChange,
  className
}: SmartFiltersProps) {
  const [suggestions, setSuggestions] = useState<SmartFilterSuggestion[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const newSuggestions = generateSmartFilterSuggestions(products, currentFilters)
    setSuggestions(newSuggestions)
  }, [products, currentFilters])

  const applySuggestion = (suggestion: SmartFilterSuggestion) => {
    const newFilters = { ...currentFilters, ...suggestion.filters }
    onFiltersChange(newFilters)
  }

  const clearSmartFilters = () => {
    onFiltersChange({})
  }

  const isFilterActive = (suggestion: SmartFilterSuggestion) => {
    return Object.entries(suggestion.filters).some(([key, value]) => {
      const currentValue = currentFilters[key as keyof ProductFilters]
      if (Array.isArray(value)) {
        return Array.isArray(currentValue) && 
          value.some(v => currentValue.includes(v))
      }
      return currentValue === value
    })
  }

  const displayedSuggestions = showAll ? suggestions : suggestions.slice(0, 3)

  if (suggestions.length === 0) return null

  return (
    <Card className={cn("p-5 mb-6 bg-gradient-to-br from-white via-gold-50/20 to-burgundy-50/10 border-2 border-gold-200/50 shadow-lg shadow-gold-100/20", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-serif text-lg text-burgundy-800">Smart Suggestions</h3>
          <Badge className="bg-gold-100 text-burgundy-700 border-gold-300 text-xs font-semibold">
            Atelier AI
          </Badge>
        </div>
        
        {Object.keys(currentFilters).length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSmartFilters}
            className="text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50 font-medium"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {displayedSuggestions.map((suggestion, index) => (
          <div
            key={`${suggestion.type}-${index}`}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer",
              isFilterActive(suggestion) 
                ? "border-burgundy-300 bg-gradient-to-r from-burgundy-50 to-gold-50 shadow-burgundy-100/20" 
                : "border-gold-200/50 hover:border-burgundy-200 bg-white/80"
            )}
            onClick={() => applySuggestion(suggestion)}
          >
            <div className="flex items-start gap-3 flex-1">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border",
                getTypeColor(suggestion.type)
              )}>
                {getTypeIcon(suggestion.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {suggestion.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getTypeColor(suggestion.type))}
                  >
                    {suggestion.type.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {suggestion.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2">
              {isFilterActive(suggestion) && (
                <Badge className="bg-burgundy-500 text-white text-xs font-semibold">
                  Active
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs px-3 py-1.5 h-auto text-burgundy-700 hover:bg-burgundy-50 font-medium"
              >
                Apply
              </Button>
            </div>
          </div>
        ))}
      </div>

      {suggestions.length > 3 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-burgundy-600 hover:text-burgundy-800 hover:bg-gold-50 font-medium"
          >
            {showAll ? 'Show Less' : `Show ${suggestions.length - 3} More`}
          </Button>
        </div>
      )}
    </Card>
  )
}

// Quick price filter component
interface QuickPriceFiltersProps {
  products: EnhancedProduct[]
  currentFilters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  className?: string
}

export function QuickPriceFilters({
  products,
  currentFilters,
  onFiltersChange,
  className
}: QuickPriceFiltersProps) {
  const priceRanges = getDynamicPriceRanges(products)

  const applyPriceRange = (min: number, max: number) => {
    onFiltersChange({
      ...currentFilters,
      minPrice: min,
      maxPrice: max
    })
  }

  const isRangeActive = (min: number, max: number) => {
    return currentFilters.minPrice === min && currentFilters.maxPrice === max
  }

  return (
    <div className={cn("flex flex-wrap gap-2 p-3 bg-gradient-to-r from-gold-50/50 to-burgundy-50/30 rounded-xl border border-gold-200/40", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-burgundy-700">
        <div className="p-1.5 bg-gold-200 rounded-lg">
          <DollarSign className="h-3 w-3 text-burgundy-700" />
        </div>
        <span>Quick Price:</span>
      </div>
      
      {priceRanges.map((range, index) => (
        <Button
          key={index}
          variant={isRangeActive(range.min, range.max) ? "default" : "outline"}
          size="sm"
          onClick={() => applyPriceRange(range.min, range.max)}
          className={cn(
            "text-xs font-medium transition-all",
            isRangeActive(range.min, range.max) 
              ? "bg-burgundy-600 hover:bg-burgundy-700 text-white border-burgundy-600" 
              : "border-burgundy-200 hover:border-burgundy-300 hover:bg-burgundy-50 text-burgundy-700"
          )}
        >
          {range.label}
          <span className="ml-1 opacity-70">
            ${Math.round(range.min)}-${Math.round(range.max)}
          </span>
        </Button>
      ))}
    </div>
  )
}