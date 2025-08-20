import { EnhancedProduct } from '@/lib/supabase/types'

export interface SeasonalRecommendation {
  season: 'spring' | 'summer' | 'fall' | 'winter'
  recommendedCategories: string[]
  recommendedColors: string[]
  recommendedFabrics: string[]
  description: string
}

export interface SmartFilterSuggestion {
  type: 'seasonal' | 'weather' | 'occasion' | 'trending' | 'ai-recommended'
  title: string
  description: string
  filters: Record<string, any>
  priority: number
}

// Get current season based on date
export function getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'fall'
  return 'winter'
}

// Seasonal recommendations
export const SEASONAL_RECOMMENDATIONS: Record<string, SeasonalRecommendation> = {
  spring: {
    season: 'spring',
    recommendedCategories: ['Suits', 'Shirts', 'Casual'],
    recommendedColors: ['Navy', 'Light Blue', 'Gray', 'White'],
    recommendedFabrics: ['cotton', 'lightweight wool', 'linen blend'],
    description: 'Light, fresh colors and breathable fabrics perfect for spring weather'
  },
  summer: {
    season: 'summer',
    recommendedCategories: ['Shirts', 'Casual', 'Accessories'],
    recommendedColors: ['White', 'Light Blue', 'Tan', 'Navy'],
    recommendedFabrics: ['linen', 'cotton', 'moisture-wicking'],
    description: 'Lightweight, breathable pieces to stay cool in summer heat'
  },
  fall: {
    season: 'fall',
    recommendedCategories: ['Suits', 'Jackets', 'Vest & Tie Sets'],
    recommendedColors: ['Burgundy', 'Brown', 'Dark Green', 'Navy'],
    recommendedFabrics: ['wool', 'flannel', 'tweed'],
    description: 'Rich colors and warmer fabrics for cooler autumn weather'
  },
  winter: {
    season: 'winter',
    recommendedCategories: ['Suits', 'Tuxedos', 'Formal'],
    recommendedColors: ['Black', 'Navy', 'Charcoal', 'Burgundy'],
    recommendedFabrics: ['wool', 'cashmere', 'heavy cotton'],
    description: 'Formal pieces and rich colors perfect for winter events'
  }
}

// Generate smart filter suggestions
export function generateSmartFilterSuggestions(
  products: EnhancedProduct[] = [],
  currentFilters: Record<string, any> = {}
): SmartFilterSuggestion[] {
  const suggestions: SmartFilterSuggestion[] = []
  const currentSeason = getCurrentSeason()
  const seasonalRec = SEASONAL_RECOMMENDATIONS[currentSeason]

  // Seasonal suggestion
  suggestions.push({
    type: 'seasonal',
    title: `Perfect for ${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}`,
    description: seasonalRec.description,
    filters: {
      colors: seasonalRec.recommendedColors,
      categories: seasonalRec.recommendedCategories
    },
    priority: 1
  })

  // Weather-based suggestions
  const currentMonth = new Date().getMonth() + 1
  if (currentMonth >= 11 || currentMonth <= 2) { // Nov-Feb (Formal season)
    suggestions.push({
      type: 'weather',
      title: 'Formal Event Season',
      description: 'Perfect for holiday parties, galas, and winter weddings',
      filters: {
        category: 'Tuxedos',
        colors: ['Black', 'Navy']
      },
      priority: 2
    })
  }

  if (currentMonth >= 4 && currentMonth <= 6) { // Apr-Jun (Wedding season)
    suggestions.push({
      type: 'occasion',
      title: 'Wedding Season Essentials',
      description: 'Popular choices for spring and summer weddings',
      filters: {
        category: 'Suits',
        colors: ['Navy', 'Gray', 'Light Blue']
      },
      priority: 2
    })
  }

  if (currentMonth >= 3 && currentMonth <= 5) { // Mar-May (Prom season)
    suggestions.push({
      type: 'occasion',
      title: 'Prom Season Favorites',
      description: 'Stand out styles for prom and formal dances',
      filters: {
        category: 'Tuxedos',
        featured: true
      },
      priority: 3
    })
  }

  // Trending suggestions based on product data
  if (products.length > 0) {
    // Most popular categories
    const categoryCount = products.reduce((acc, product) => {
      if (product.category) {
        acc[product.category] = (acc[product.category] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const topCategory = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0]

    if (topCategory) {
      suggestions.push({
        type: 'trending',
        title: `Trending: ${topCategory}`,
        description: `${topCategory} are popular right now`,
        filters: { category: topCategory },
        priority: 4
      })
    }

    // Featured products suggestion
    const featuredCount = products.filter(p => p.featured).length
    if (featuredCount > 0) {
      suggestions.push({
        type: 'ai-recommended',
        title: 'Staff Picks',
        description: `${featuredCount} carefully selected pieces by our style experts`,
        filters: { featured: true },
        priority: 5
      })
    }
  }

  return suggestions.sort((a, b) => a.priority - b.priority)
}

// AI-powered product recommendations based on user behavior
export function getAIRecommendations(
  products: EnhancedProduct[],
  userHistory: any[] = [],
  currentFilters: Record<string, any> = {}
): EnhancedProduct[] {
  // Simple AI logic - can be enhanced with ML models
  let recommendedProducts = [...products]

  // If user has history, recommend similar items
  if (userHistory.length > 0) {
    const viewedCategories = userHistory
      .map(item => item.category)
      .filter(Boolean)
    
    const uniqueCategories = [...new Set(viewedCategories)]
    
    // Prioritize products from viewed categories
    recommendedProducts = recommendedProducts.sort((a, b) => {
      const aInHistory = uniqueCategories.includes(a.category || '')
      const bInHistory = uniqueCategories.includes(b.category || '')
      
      if (aInHistory && !bInHistory) return -1
      if (!aInHistory && bInHistory) return 1
      return 0
    })
  }

  // Boost featured products
  recommendedProducts = recommendedProducts.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  // Apply seasonal boost
  const currentSeason = getCurrentSeason()
  const seasonalColors = SEASONAL_RECOMMENDATIONS[currentSeason].recommendedColors

  recommendedProducts = recommendedProducts.sort((a, b) => {
    const aHasSeasonalColor = seasonalColors.some(color => 
      a.name.toLowerCase().includes(color.toLowerCase()) ||
      a.tags?.some(tag => tag.toLowerCase().includes(color.toLowerCase()))
    )
    const bHasSeasonalColor = seasonalColors.some(color => 
      b.name.toLowerCase().includes(color.toLowerCase()) ||
      b.tags?.some(tag => tag.toLowerCase().includes(color.toLowerCase()))
    )

    if (aHasSeasonalColor && !bHasSeasonalColor) return -1
    if (!aHasSeasonalColor && bHasSeasonalColor) return 1
    return 0
  })

  return recommendedProducts
}

// Smart search suggestions
export function getSmartSearchSuggestions(
  query: string,
  products: EnhancedProduct[]
): string[] {
  if (!query || query.length < 2) return []

  const queryLower = query.toLowerCase()
  const suggestions = new Set<string>()

  // Add category matches
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
  categories.forEach(category => {
    if (category && category.toLowerCase().includes(queryLower)) {
      suggestions.add(category)
    }
  })

  // Add color matches
  const colors = ['Black', 'Navy', 'Gray', 'Blue', 'White', 'Burgundy', 'Brown']
  colors.forEach(color => {
    if (color.toLowerCase().includes(queryLower)) {
      suggestions.add(color)
    }
  })

  // Add product name matches
  products.forEach(product => {
    const words = product.name.toLowerCase().split(' ')
    words.forEach(word => {
      if (word.includes(queryLower) && word.length > 2) {
        suggestions.add(word)
      }
    })
  })

  return Array.from(suggestions).slice(0, 8)
}

// Dynamic price range suggestions based on products
export function getDynamicPriceRanges(products: EnhancedProduct[]): Array<{
  label: string
  min: number
  max: number
}> {
  const prices = products.map(p => p.price / 100).filter(p => p > 0)
  
  if (prices.length === 0) {
    return [
      { label: 'Budget', min: 0, max: 200 },
      { label: 'Mid-range', min: 200, max: 500 },
      { label: 'Premium', min: 500, max: 1000 },
      { label: 'Luxury', min: 1000, max: 5000 }
    ]
  }

  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  
  const range = maxPrice - minPrice
  const step = range / 4

  return [
    { label: 'Budget', min: minPrice, max: minPrice + step },
    { label: 'Value', min: minPrice + step, max: minPrice + (step * 2) },
    { label: 'Premium', min: minPrice + (step * 2), max: minPrice + (step * 3) },
    { label: 'Luxury', min: minPrice + (step * 3), max: maxPrice }
  ]
}