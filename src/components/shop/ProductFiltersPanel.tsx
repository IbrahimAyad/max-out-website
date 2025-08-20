"use client"

import { useState } from 'react'
import { ProductFilters } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Filter,
  Palette,
  Tag,
  DollarSign,
  Calendar,
  Star,
  Package
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface FilterMetadata {
  categories: string[]
  vendors: string[]
  colors: string[]
  priceRange: { min: number; max: number }
}

interface ProductFiltersPanelProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  metadata: FilterMetadata
  onClear: () => void
  activeCount: number
  className?: string
}

interface FilterSectionProps {
  title: string
  icon: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  count?: number
}

function FilterSection({ title, icon, isOpen, onToggle, children, count }: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-0 text-left hover:text-gold transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium">{title}</span>
          {count !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-96 pb-4" : "max-h-0"
      )}>
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  )
}

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(parseInt(e.target.value), value[1] - 1)
    onChange([newMin, value[1]])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(parseInt(e.target.value), value[0] + 1)
    onChange([value[0], newMax])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Min</label>
          <input
            type="number"
            value={value[0]}
            onChange={handleMinChange}
            min={min}
            max={max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">Max</label>
          <input
            type="number"
            value={value[1]}
            onChange={handleMaxChange}
            min={min}
            max={max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-600">
        <span>${value[0]}</span>
        <span>${value[1]}</span>
      </div>
    </div>
  )
}

export function ProductFiltersPanel({ 
  filters, 
  onFiltersChange, 
  metadata,
  onClear,
  activeCount,
  className 
}: ProductFiltersPanelProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    colors: false,
    vendors: false,
    occasions: false,
    availability: false
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilters = (updates: Partial<ProductFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      updateFilters({ category })
    } else {
      const { category: _, ...rest } = filters
      onFiltersChange(rest)
    }
  }

  const handleVendorChange = (vendor: string, checked: boolean) => {
    if (checked) {
      updateFilters({ vendor })
    } else {
      const { vendor: _, ...rest } = filters
      onFiltersChange(rest)
    }
  }

  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      updateFilters({ color })
    } else {
      const { color: _, ...rest } = filters
      onFiltersChange(rest)
    }
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    updateFilters({
      minPrice: range[0],
      maxPrice: range[1]
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  // Use the activeCount prop passed from parent
  // const getActiveFilterCount = () => {
  //   let count = 0
  //   if (filters.category) count++
  //   if (filters.vendor) count++
  //   if (filters.color) count++
  //   if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++
  //   if (filters.inStock !== undefined) count++
  //   if (filters.featured !== undefined) count++
  //   return count
  // }

  return (
    <Card className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-lg">Filters</h3>
          {activeCount > 0 && (
            <Badge className="bg-gold text-black">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-0">
        {/* Categories */}
        <FilterSection
          title="Categories"
          icon={<Tag className="h-4 w-4" />}
          isOpen={openSections.categories}
          onToggle={() => toggleSection('categories')}
          count={filters.category ? 1 : 0}
        >
          <div className="space-y-3">
            {(metadata.categories || []).map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.category === category}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          icon={<DollarSign className="h-4 w-4" />}
          isOpen={openSections.price}
          onToggle={() => toggleSection('price')}
        >
          <PriceRangeSlider
            min={metadata.priceRange?.min || 0}
            max={metadata.priceRange?.max || 1000}
            value={[
              filters.minPrice || metadata.priceRange?.min || 0,
              filters.maxPrice || metadata.priceRange?.max || 1000
            ]}
            onChange={handlePriceRangeChange}
          />
        </FilterSection>

        {/* Colors */}
        {metadata.colors && metadata.colors.length > 0 && (
          <FilterSection
            title="Colors"
            icon={<Palette className="h-4 w-4" />}
            isOpen={openSections.colors}
            onToggle={() => toggleSection('colors')}
            count={filters.color ? 1 : 0}
          >
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {(metadata.colors || []).map(color => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={filters.color === color}
                    onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
                  />
                  <label
                    htmlFor={`color-${color}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                  >
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {color}
                  </label>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Vendors */}
        {metadata.vendors && metadata.vendors.length > 0 && (
          <FilterSection
            title="Vendors"
            icon={<Star className="h-4 w-4" />}
            isOpen={openSections.vendors}
            onToggle={() => toggleSection('vendors')}
            count={filters.vendor ? 1 : 0}
          >
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {(metadata.vendors || []).map(vendor => (
                <div key={vendor} className="flex items-center space-x-2">
                  <Checkbox
                    id={`vendor-${vendor}`}
                    checked={filters.vendor === vendor}
                    onCheckedChange={(checked) => handleVendorChange(vendor, checked as boolean)}
                  />
                  <label
                    htmlFor={`vendor-${vendor}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {vendor}
                  </label>
                </div>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Availability */}
        <FilterSection
          title="Availability"
          icon={<Package className="h-4 w-4" />}
          isOpen={openSections.availability}
          onToggle={() => toggleSection('availability')}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock === true}
                onCheckedChange={(checked) => 
                  updateFilters({ inStock: checked ? true : undefined })
                }
              />
              <label
                htmlFor="in-stock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                In Stock Only
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured === true}
                onCheckedChange={(checked) => 
                  updateFilters({ featured: checked ? true : undefined })
                }
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Featured Products
              </label>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Apply Button (Mobile) */}
      <div className="mt-6 md:hidden">
        <Button className="w-full bg-gold hover:bg-gold/90 text-black">
          Apply Filters
        </Button>
      </div>
    </Card>
  )
}