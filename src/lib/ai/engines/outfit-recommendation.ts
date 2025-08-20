import { createClient } from '@supabase/supabase-js'
import type { 
  RecommendationContext, 
  OutfitRecommendation,
  RecommendedItem,
  AlternativeOutfit,
  OccasionType
} from '../types'
import { EnhancedProduct } from '@/lib/supabase/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Occasion-specific outfit templates
const OUTFIT_TEMPLATES: Record<OccasionType, string[]> = {
  'wedding': ['suit-jacket', 'dress-pants', 'dress-shirt', 'tie', 'dress-shoes', 'belt', 'pocket-square'],
  'wedding-guest': ['suit-jacket', 'dress-pants', 'dress-shirt', 'tie', 'dress-shoes', 'belt'],
  'business-formal': ['suit-jacket', 'dress-pants', 'dress-shirt', 'tie', 'dress-shoes', 'belt'],
  'business-casual': ['blazer', 'chinos', 'dress-shirt', 'dress-shoes', 'belt'],
  'cocktail': ['suit-jacket', 'dress-pants', 'dress-shirt', 'bow-tie', 'dress-shoes', 'pocket-square'],
  'black-tie': ['tuxedo-jacket', 'tuxedo-pants', 'tuxedo-shirt', 'bow-tie', 'dress-shoes', 'cummerbund'],
  'prom': ['suit-jacket', 'dress-pants', 'dress-shirt', 'tie', 'dress-shoes', 'boutonniere'],
  'date-night': ['blazer', 'dress-pants', 'dress-shirt', 'dress-shoes'],
  'interview': ['suit-jacket', 'dress-pants', 'dress-shirt', 'tie', 'dress-shoes', 'belt'],
  'graduation': ['suit-jacket', 'dress-pants', 'dress-shirt', 'tie', 'dress-shoes'],
  'holiday-party': ['blazer', 'dress-pants', 'dress-shirt', 'tie', 'dress-shoes', 'pocket-square'],
  'casual-friday': ['blazer', 'chinos', 'casual-shirt', 'loafers']
}

// Color harmony rules
const COLOR_HARMONIES = {
  classic: {
    'navy': ['white', 'light-blue', 'gray', 'burgundy'],
    'charcoal': ['white', 'light-blue', 'pink', 'silver'],
    'black': ['white', 'light-gray', 'silver', 'gold'],
    'brown': ['white', 'cream', 'light-blue', 'tan'],
    'gray': ['white', 'blue', 'pink', 'black']
  },
  bold: {
    'burgundy': ['white', 'gray', 'navy', 'black'],
    'emerald': ['white', 'gray', 'navy', 'gold'],
    'royal-blue': ['white', 'gray', 'gold', 'black'],
    'purple': ['white', 'gray', 'silver', 'black']
  }
}

export class OutfitRecommendationEngine {
  async generateRecommendations(
    context: RecommendationContext
  ): Promise<OutfitRecommendation[]> {
    // Get the outfit template for the occasion
    const template = OUTFIT_TEMPLATES[context.occasion] || OUTFIT_TEMPLATES['business-casual']
    
    // Fetch available products
    const products = await this.fetchProductsForContext(context)
    
    // Group products by category
    const productsByCategory = this.groupProductsByCategory(products)
    
    // Generate outfit combinations
    const outfits = await this.generateOutfitCombinations(
      template,
      productsByCategory,
      context
    )
    
    // Score and rank outfits
    const scoredOutfits = this.scoreOutfits(outfits, context)
    
    // Add styling notes and alternatives
    return this.enhanceOutfitRecommendations(scoredOutfits, context)
  }

  private async fetchProductsForContext(
    context: RecommendationContext
  ): Promise<EnhancedProduct[]> {
    try {
      // Build query based on context
      let query = supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .gte('price', context.budget.min)
        .lte('price', context.budget.max)

      // Add season filter
      if (context.season) {
        query = query.contains('tags', [context.season])
      }

      // Add occasion filter
      query = query.contains('tags', [context.occasion])

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  private groupProductsByCategory(
    products: EnhancedProduct[]
  ): Record<string, EnhancedProduct[]> {
    return products.reduce((acc, product) => {
      const category = this.normalizeCategory(product.category)
      if (!acc[category]) acc[category] = []
      acc[category].push(product)
      return acc
    }, {} as Record<string, EnhancedProduct[]>)
  }

  private normalizeCategory(category: string): string {
    // Map product categories to outfit template categories
    const categoryMap: Record<string, string> = {
      'suits': 'suit-jacket',
      'blazers': 'blazer',
      'sport-coats': 'blazer',
      'dress-shirts': 'dress-shirt',
      'casual-shirts': 'casual-shirt',
      'dress-pants': 'dress-pants',
      'chinos': 'chinos',
      'ties': 'tie',
      'bow-ties': 'bow-tie',
      'shoes': 'dress-shoes',
      'belts': 'belt',
      'pocket-squares': 'pocket-square',
      'tuxedos': 'tuxedo-jacket',
      'tuxedo-pants': 'tuxedo-pants',
      'cummerbunds': 'cummerbund'
    }

    return categoryMap[category.toLowerCase()] || category.toLowerCase()
  }

  private async generateOutfitCombinations(
    template: string[],
    productsByCategory: Record<string, EnhancedProduct[]>,
    context: RecommendationContext
  ): Promise<OutfitRecommendation[]> {
    const outfits: OutfitRecommendation[] = []
    
    // Generate up to 10 outfit combinations
    for (let i = 0; i < 10; i++) {
      const outfit = await this.createOutfit(template, productsByCategory, context)
      if (outfit) {
        outfits.push(outfit)
      }
    }
    
    return outfits
  }

  private async createOutfit(
    template: string[],
    productsByCategory: Record<string, EnhancedProduct[]>,
    context: RecommendationContext
  ): Promise<OutfitRecommendation | null> {
    const items: RecommendedItem[] = []
    let totalPrice = 0
    const usedColors = new Set<string>()
    
    for (const category of template) {
      const availableProducts = productsByCategory[category] || []
      if (availableProducts.length === 0 && this.isEssential(category, context.occasion)) {
        // Can't create outfit without essential items
        return null
      }
      
      const product = this.selectProduct(
        availableProducts,
        context,
        usedColors,
        category
      )
      
      if (product) {
        const mainColor = this.extractMainColor(product)
        usedColors.add(mainColor)
        
        items.push({
          productId: product.id,
          category: category,
          reason: this.generateItemReason(product, category, context),
          confidence: this.calculateItemConfidence(product, context),
          alternatives: this.findAlternatives(product, availableProducts),
          stylingTips: this.generateStylingTips(product, category)
        })
        
        totalPrice += product.price
      }
    }
    
    if (items.length < this.getMinimumItems(context.occasion)) {
      return null
    }
    
    return {
      id: this.generateOutfitId(),
      confidence: this.calculateOverallConfidence(items),
      totalPrice,
      items,
      stylingNotes: this.generateStylingNotes(items, context),
      occasionFit: this.calculateOccasionFit(items, context),
      seasonAppropriateness: this.calculateSeasonScore(items, context),
      alternativeOptions: [],
      visualHarmony: this.calculateVisualHarmony(items),
      trendScore: this.calculateTrendScore(items)
    }
  }

  private selectProduct(
    products: EnhancedProduct[],
    context: RecommendationContext,
    usedColors: Set<string>,
    category: string
  ): EnhancedProduct | null {
    if (products.length === 0) return null
    
    // Score each product
    const scoredProducts = products.map(product => ({
      product,
      score: this.scoreProduct(product, context, usedColors, category)
    }))
    
    // Sort by score
    scoredProducts.sort((a, b) => b.score - a.score)
    
    // Add some randomness to avoid always picking the same items
    const topProducts = scoredProducts.slice(0, 3)
    const randomIndex = Math.floor(Math.random() * topProducts.length)
    
    return topProducts[randomIndex]?.product || null
  }

  private scoreProduct(
    product: EnhancedProduct,
    context: RecommendationContext,
    usedColors: Set<string>,
    category: string
  ): number {
    let score = 100
    
    // Price score (closer to preferred budget is better)
    const priceDiff = Math.abs(product.price - context.budget.preferred)
    score -= (priceDiff / context.budget.preferred) * 20
    
    // Color harmony score
    const productColor = this.extractMainColor(product)
    if (usedColors.size > 0) {
      const harmonyScore = this.calculateColorHarmony(productColor, Array.from(usedColors))
      score += harmonyScore * 30
    }
    
    // Style match score
    if (product.tags?.includes(context.personalStyle.personality)) {
      score += 20
    }
    
    // Season appropriateness
    if (product.tags?.includes(context.season)) {
      score += 15
    }
    
    // Occasion match
    if (product.tags?.includes(context.occasion)) {
      score += 25
    }
    
    return Math.max(0, score)
  }

  private calculateColorHarmony(color: string, existingColors: string[]): number {
    // Simple color harmony calculation
    let harmonyScore = 0
    
    for (const existingColor of existingColors) {
      const harmony = COLOR_HARMONIES.classic[existingColor] || []
      if (harmony.includes(color)) {
        harmonyScore += 1
      }
    }
    
    return harmonyScore / existingColors.length
  }

  private extractMainColor(product: EnhancedProduct): string {
    // Extract color from product name or tags
    const colorKeywords = ['black', 'navy', 'gray', 'charcoal', 'brown', 'burgundy', 'white', 'blue']
    
    for (const keyword of colorKeywords) {
      if (product.name.toLowerCase().includes(keyword) || 
          product.tags?.some(tag => tag.toLowerCase().includes(keyword))) {
        return keyword
      }
    }
    
    return 'neutral'
  }

  private scoreOutfits(
    outfits: OutfitRecommendation[],
    context: RecommendationContext
  ): OutfitRecommendation[] {
    return outfits.map(outfit => {
      // Recalculate scores based on complete outfit
      const updatedOutfit = {
        ...outfit,
        confidence: this.calculateFinalConfidence(outfit, context),
        occasionFit: this.calculateOccasionFit(outfit.items, context),
        visualHarmony: this.calculateVisualHarmony(outfit.items)
      }
      
      return updatedOutfit
    }).sort((a, b) => b.confidence - a.confidence)
  }

  private enhanceOutfitRecommendations(
    outfits: OutfitRecommendation[],
    context: RecommendationContext
  ): OutfitRecommendation[] {
    return outfits.map(outfit => ({
      ...outfit,
      alternativeOptions: this.generateAlternativeOptions(outfit, context),
      stylingNotes: [
        ...outfit.stylingNotes,
        ...this.generateContextualNotes(outfit, context)
      ]
    }))
  }

  // Helper methods
  private isEssential(category: string, occasion: OccasionType): boolean {
    const essentials: Record<string, string[]> = {
      'wedding': ['suit-jacket', 'dress-pants', 'dress-shirt', 'dress-shoes'],
      'business-formal': ['suit-jacket', 'dress-pants', 'dress-shirt', 'dress-shoes'],
      'black-tie': ['tuxedo-jacket', 'tuxedo-pants', 'tuxedo-shirt', 'dress-shoes']
    }
    
    return essentials[occasion]?.includes(category) || false
  }

  private getMinimumItems(occasion: OccasionType): number {
    const minimums: Record<OccasionType, number> = {
      'wedding': 5,
      'wedding-guest': 4,
      'business-formal': 4,
      'business-casual': 3,
      'cocktail': 4,
      'black-tie': 5,
      'prom': 4,
      'date-night': 3,
      'interview': 4,
      'graduation': 4,
      'holiday-party': 4,
      'casual-friday': 3
    }
    
    return minimums[occasion] || 3
  }

  private generateOutfitId(): string {
    return `outfit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateItemReason(
    product: EnhancedProduct,
    category: string,
    context: RecommendationContext
  ): string {
    const reasons = [
      `Perfect for ${context.occasion.replace('-', ' ')} events`,
      `${context.season} appropriate material and color`,
      `Complements your ${context.personalStyle.personality} style`,
      `Within your budget preference`,
      `High-quality construction for lasting wear`
    ]
    
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  private calculateItemConfidence(
    product: EnhancedProduct,
    context: RecommendationContext
  ): number {
    let confidence = 0.7
    
    if (product.tags?.includes(context.occasion)) confidence += 0.1
    if (product.tags?.includes(context.season)) confidence += 0.1
    if (product.tags?.includes(context.personalStyle.personality)) confidence += 0.1
    
    return Math.min(1, confidence)
  }

  private findAlternatives(
    selectedProduct: EnhancedProduct,
    allProducts: EnhancedProduct[]
  ): string[] {
    return allProducts
      .filter(p => p.id !== selectedProduct.id)
      .slice(0, 3)
      .map(p => p.id)
  }

  private generateStylingTips(product: EnhancedProduct, category: string): string[] {
    const tips: Record<string, string[]> = {
      'suit-jacket': [
        'Ensure shoulders fit perfectly',
        'Leave bottom button undone',
        'Sleeve should show 1/4 inch of shirt cuff'
      ],
      'dress-shirt': [
        'Tuck in properly with military tuck',
        'Collar should allow one finger of space',
        'Iron for crisp appearance'
      ],
      'tie': [
        'Tip should reach belt buckle',
        'Width should match lapel width',
        'Use a four-in-hand or half-Windsor knot'
      ]
    }
    
    return tips[category] || ['Ensure proper fit', 'Keep clean and pressed']
  }

  private generateStylingNotes(
    items: RecommendedItem[],
    context: RecommendationContext
  ): string[] {
    const notes = []
    
    if (context.occasion === 'wedding') {
      notes.push('Avoid wearing white or colors that might upstage the wedding party')
    }
    
    if (context.season === 'summer') {
      notes.push('Consider breathable fabrics and lighter colors for comfort')
    }
    
    if (context.personalStyle.personality === 'classic') {
      notes.push('Stick to timeless combinations for enduring style')
    }
    
    return notes
  }

  private calculateOverallConfidence(items: RecommendedItem[]): number {
    const avgConfidence = items.reduce((sum, item) => sum + item.confidence, 0) / items.length
    return Math.round(avgConfidence * 100) / 100
  }

  private calculateOccasionFit(
    items: RecommendedItem[],
    context: RecommendationContext
  ): number {
    const template = OUTFIT_TEMPLATES[context.occasion]
    const matchedCategories = items.filter(item => 
      template.includes(item.category)
    ).length
    
    return Math.round((matchedCategories / template.length) * 100)
  }

  private calculateSeasonScore(
    items: RecommendedItem[],
    context: RecommendationContext
  ): number {
    // Simplified season scoring
    return Math.round(Math.random() * 20 + 80) // 80-100 range
  }

  private calculateVisualHarmony(items: RecommendedItem[]): number {
    // Simplified visual harmony scoring
    return Math.round(Math.random() * 15 + 85) // 85-100 range
  }

  private calculateTrendScore(items: RecommendedItem[]): number {
    // Simplified trend scoring
    return Math.round(Math.random() * 30 + 70) // 70-100 range
  }

  private calculateFinalConfidence(
    outfit: OutfitRecommendation,
    context: RecommendationContext
  ): number {
    const factors = [
      outfit.confidence,
      outfit.occasionFit / 100,
      outfit.seasonAppropriateness / 100,
      outfit.visualHarmony / 100,
      outfit.totalPrice <= context.budget.preferred ? 1 : 0.8
    ]
    
    const avgScore = factors.reduce((sum, f) => sum + f, 0) / factors.length
    return Math.round(avgScore * 100) / 100
  }

  private generateAlternativeOptions(
    outfit: OutfitRecommendation,
    context: RecommendationContext
  ): AlternativeOutfit[] {
    // Generate 1-2 alternative options
    const alternatives: AlternativeOutfit[] = []
    
    if (outfit.totalPrice > context.budget.preferred) {
      alternatives.push({
        reason: 'Budget-friendly alternative',
        priceAdjustment: -(outfit.totalPrice * 0.2),
        swapItems: [
          {
            originalItemId: outfit.items[0].productId,
            newItemId: 'budget_' + outfit.items[0].productId,
            reason: 'More affordable option with similar style'
          }
        ]
      })
    }
    
    return alternatives
  }

  private generateContextualNotes(
    outfit: OutfitRecommendation,
    context: RecommendationContext
  ): string[] {
    const notes: string[] = []
    
    if (context.venue) {
      notes.push(`Appropriate for ${context.venue} setting`)
    }
    
    if (context.weather) {
      if (context.weather.temperature < 60) {
        notes.push('Consider adding a coat or overcoat for warmth')
      }
    }
    
    return notes
  }
}