"use client"

import { useState } from 'react'
import { 
  Sparkles, 
  Shirt, 
  DollarSign, 
  Palette,
  SlidersHorizontal,
  ChevronDown,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { ProductFilters } from '@/lib/supabase/types'

interface MobileFilterTabsProps {
  onOpenFilterDrawer: () => void
  activeFilters: ProductFilters
  activeFilterCount: number
  className?: string
}

interface FilterTab {
  id: string
  label: string
  icon: React.ElementType
  badge?: string | number
}

export function MobileFilterTabs({
  onOpenFilterDrawer,
  activeFilters,
  activeFilterCount,
  className
}: MobileFilterTabsProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const tabs: FilterTab[] = [
    {
      id: 'smart',
      label: 'Smart Filters',
      icon: Sparkles,
      badge: activeFilters.trending || activeFilters.seasonal ? 'Active' : undefined
    },
    {
      id: 'category',
      label: 'Category',
      icon: Shirt,
      badge: activeFilters.category && activeFilters.category !== 'all' ? '1' : undefined
    },
    {
      id: 'price',
      label: 'Price',
      icon: DollarSign,
      badge: activeFilters.minPrice || activeFilters.maxPrice ? '1' : undefined
    },
    {
      id: 'color',
      label: 'Color',
      icon: Palette,
      badge: activeFilters.color ? '1' : undefined
    }
  ]

  const handleTabClick = (tabId: string) => {
    // For now, all tabs open the full filter drawer
    // In the future, could open specific sections
    onOpenFilterDrawer()
  }

  return (
    <div className={cn("bg-white border-b", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
          {/* All Filters Button - Mobile Only */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenFilterDrawer}
            className="flex-shrink-0 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-gold text-black">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 flex-shrink-0 lg:hidden" />

          {/* Quick Filter Tabs */}
          <div className="flex gap-2 flex-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex-shrink-0 gap-2 relative",
                  tab.badge && "pr-8"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
                {tab.badge && (
                  <Badge 
                    className={cn(
                      "absolute -top-1 -right-1 h-5 min-w-[20px] px-1 text-xs",
                      typeof tab.badge === 'string' 
                        ? "bg-gold text-black" 
                        : "bg-red-500 text-white"
                    )}
                  >
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact inline filter pills for showing active filters
export function ActiveFilterPills({
  filters,
  onRemoveFilter,
  className
}: {
  filters: ProductFilters
  onRemoveFilter: (key: keyof ProductFilters) => void
  className?: string
}) {
  const activeFilters: Array<{ key: keyof ProductFilters; label: string; value: string }> = []

  if (filters.category && filters.category !== 'all') {
    activeFilters.push({ key: 'category', label: 'Category', value: filters.category })
  }
  if (filters.color) {
    activeFilters.push({ key: 'color', label: 'Color', value: filters.color })
  }
  if (filters.minPrice || filters.maxPrice) {
    const priceLabel = filters.minPrice && filters.maxPrice 
      ? `$${filters.minPrice}-$${filters.maxPrice}`
      : filters.minPrice 
        ? `From $${filters.minPrice}`
        : `Up to $${filters.maxPrice}`
    activeFilters.push({ key: 'minPrice', label: 'Price', value: priceLabel })
  }
  if (filters.trending) {
    activeFilters.push({ key: 'trending', label: 'Filter', value: 'Trending' })
  }
  if (filters.seasonal) {
    activeFilters.push({ key: 'seasonal', label: 'Season', value: filters.seasonal })
  }

  if (activeFilters.length === 0) return null

  return (
    <div className={cn("flex gap-2 overflow-x-auto scrollbar-hide py-2", className)}>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="flex-shrink-0 gap-1 pl-3 pr-1 py-1"
        >
          <span className="text-xs">
            {filter.label}: {filter.value}
          </span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="ml-1 hover:bg-gray-300 rounded p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}