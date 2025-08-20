import { createClient } from '@supabase/supabase-js'
import { fashionClipService } from '@/lib/services/fashionClipService'
import type { 
  StyleAnalysis, 
  DetectedItem, 
  ColorAnalysis, 
  StyleMatch,
  CompleteOutfit,
  BudgetTier
} from '../types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export class StyleAnalysisService {
  private openaiApiKey: string

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
  }

  async analyzeImage(imageFile: File): Promise<StyleAnalysis> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile)
      
      // Analyze with Fashion CLIP first for fashion-specific insights
      const fashionClipAnalysis = await fashionClipService.analyzeImage(imageFile)
      
      // Analyze with OpenAI Vision for detailed understanding
      const analysis = await this.analyzeWithOpenAI(base64Image)
      
      // Merge Fashion CLIP results with OpenAI analysis
      const mergedAnalysis = this.mergeFashionClipWithOpenAI(fashionClipAnalysis, analysis)
      
      // Extract color palette
      const colorPalette = await this.extractColorPalette(base64Image)
      
      // Store analysis result
      const analysisId = await this.storeAnalysis({
        ...mergedAnalysis,
        colorPalette,
        fashionClipData: fashionClipAnalysis
      })
      
      return {
        imageId: analysisId,
        ...mergedAnalysis,
        colorPalette
      }
    } catch (error) {
      console.error('Style analysis error:', error)
      throw new Error('Failed to analyze style')
    }
  }

  async findSimilarProducts(analysis: StyleAnalysis): Promise<StyleMatch> {
    try {
      const matchingProducts = await this.searchProductsByStyle(analysis)
      const completeLook = await this.buildCompleteLook(analysis, matchingProducts)
      const budgetOptions = this.generateBudgetTiers(completeLook)
      
      return {
        similarityScore: this.calculateOverallSimilarity(matchingProducts),
        matchingProducts,
        completeLook,
        styleNotes: this.generateStyleNotes(analysis),
        budgetOptions
      }
    } catch (error) {
      console.error('Product matching error:', error)
      throw new Error('Failed to find similar products')
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  private async analyzeWithOpenAI(base64Image: string): Promise<Partial<StyleAnalysis>> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: `You are a fashion expert analyzing menswear outfits. Analyze the image and provide detailed information about:
              1. Detected clothing items (type, color, pattern, fit)
              2. Overall style category (classic, modern, casual, formal, etc.)
              3. Occasion appropriateness
              4. Formality level (1-10)
              5. Season appropriateness
              
              Respond in JSON format with the following structure:
              {
                "detectedItems": [
                  {
                    "category": "suit-jacket",
                    "color": "navy",
                    "pattern": "solid",
                    "fitStyle": "slim",
                    "confidence": 0.95
                  }
                ],
                "styleCategory": "business-formal",
                "occasionType": "business-formal",
                "formalityLevel": 8,
                "seasonAppropriateness": {
                  "spring": 0.8,
                  "summer": 0.6,
                  "fall": 0.9,
                  "winter": 0.9
                },
                "overallAesthetic": "Modern professional with classic elements"
              }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this menswear outfit and provide detailed style information.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error('OpenAI API request failed')
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content
    
    try {
      const analysis = JSON.parse(analysisText)
      return {
        detectedItems: analysis.detectedItems.map((item: any) => ({
          ...item,
          boundingBox: { x: 0, y: 0, width: 100, height: 100 } // Placeholder
        })),
        styleCategory: analysis.styleCategory,
        occasionType: analysis.occasionType,
        formalityLevel: analysis.formalityLevel,
        seasonAppropriateness: analysis.seasonAppropriateness,
        overallAesthetic: analysis.overallAesthetic
      }
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error)
      // Return default analysis
      return {
        detectedItems: [],
        styleCategory: 'casual',
        occasionType: 'casual-friday',
        formalityLevel: 5,
        seasonAppropriateness: { spring: 0.5, summer: 0.5, fall: 0.5, winter: 0.5 },
        overallAesthetic: 'Unable to analyze style'
      }
    }
  }

  private async extractColorPalette(base64Image: string): Promise<ColorAnalysis> {
    // For now, use a simplified color extraction
    // In production, you'd use a proper color extraction library or API
    return {
      dominantColors: [
        { hex: '#1a365d', name: 'Navy Blue', percentage: 40 },
        { hex: '#ffffff', name: 'White', percentage: 30 },
        { hex: '#8b4513', name: 'Brown', percentage: 20 },
        { hex: '#000000', name: 'Black', percentage: 10 }
      ],
      colorHarmony: 'complementary',
      seasonalAlignment: ['fall', 'winter']
    }
  }

  private mergeFashionClipWithOpenAI(
    fashionClipData: any, 
    openAIAnalysis: Partial<StyleAnalysis>
  ): Partial<StyleAnalysis> {
    // If Fashion CLIP found similar items, enhance the analysis
    if (fashionClipData?.similar_items) {
      // Fashion CLIP provides better fashion-specific categorization
      if (fashionClipData.classification) {
        openAIAnalysis.styleCategory = fashionClipData.classification
      }
      
      // Enhance confidence with Fashion CLIP's fashion expertise
      if (fashionClipData.confidence && openAIAnalysis.detectedItems) {
        openAIAnalysis.detectedItems = openAIAnalysis.detectedItems.map(item => ({
          ...item,
          confidence: (item.confidence + fashionClipData.confidence) / 2
        }))
      }
    }
    
    return openAIAnalysis
  }

  private async searchProductsByStyle(analysis: StyleAnalysis): Promise<any[]> {
    const matchingProducts = []
    
    // If we have Fashion CLIP embeddings, use them for similarity search
    const fashionClipData = (analysis as any).fashionClipData
    if (fashionClipData?.embeddings) {
      // Search using Fashion CLIP embeddings for better fashion similarity
      const { data: similarProducts } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .limit(20)
      
      // In production, you'd use vector similarity search here
      // For now, we'll use the similar_items from Fashion CLIP
      if (fashionClipData.similar_items && similarProducts) {
        const clipMatches = similarProducts.filter(product => 
          fashionClipData.similar_items.includes(product.id) ||
          fashionClipData.similar_items.some((item: string) => 
            product.name?.toLowerCase().includes(item.toLowerCase())
          )
        )
        
        matchingProducts.push(...clipMatches.map(product => ({
          productId: product.id,
          similarityScore: 0.9, // High score for Fashion CLIP matches
          matchedAttributes: ['fashion-clip-match', 'style', 'aesthetic'],
          category: product.category,
          price: product.price
        })))
      }
    }
    
    // Also search for each detected item
    for (const item of analysis.detectedItems) {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .ilike('category', `%${item.category}%`)
        .ilike('tags', `%${item.color}%`)
        .limit(5)
      
      if (products) {
        matchingProducts.push(...products.map(product => ({
          productId: product.id,
          similarityScore: this.calculateItemSimilarity(item, product),
          matchedAttributes: this.getMatchedAttributes(item, product),
          category: item.category,
          price: product.price
        })))
      }
    }
    
    // Remove duplicates and sort by similarity score
    const uniqueProducts = Array.from(
      new Map(matchingProducts.map(item => [item.productId, item])).values()
    )
    
    return uniqueProducts.sort((a, b) => b.similarityScore - a.similarityScore)
  }

  private calculateItemSimilarity(detectedItem: DetectedItem, product: any): number {
    let score = 0
    
    // Category match
    if (product.category?.toLowerCase().includes(detectedItem.category)) {
      score += 0.4
    }
    
    // Color match
    if (product.name?.toLowerCase().includes(detectedItem.color) || 
        product.tags?.some((tag: string) => tag.toLowerCase().includes(detectedItem.color))) {
      score += 0.3
    }
    
    // Pattern match
    if (detectedItem.pattern && 
        (product.name?.toLowerCase().includes(detectedItem.pattern) ||
         product.tags?.some((tag: string) => tag.toLowerCase().includes(detectedItem.pattern)))) {
      score += 0.2
    }
    
    // Fit style match
    if (detectedItem.fitStyle && 
        (product.name?.toLowerCase().includes(detectedItem.fitStyle) ||
         product.tags?.some((tag: string) => tag.toLowerCase().includes(detectedItem.fitStyle)))) {
      score += 0.1
    }
    
    return Math.min(score, 1)
  }

  private getMatchedAttributes(item: DetectedItem, product: any): string[] {
    const matched = []
    
    if (product.category?.toLowerCase().includes(item.category)) {
      matched.push('category')
    }
    if (product.name?.toLowerCase().includes(item.color) || 
        product.tags?.some((tag: string) => tag.toLowerCase().includes(item.color))) {
      matched.push('color')
    }
    if (item.pattern && 
        (product.name?.toLowerCase().includes(item.pattern) ||
         product.tags?.some((tag: string) => tag.toLowerCase().includes(item.pattern)))) {
      matched.push('pattern')
    }
    if (item.fitStyle && 
        (product.name?.toLowerCase().includes(item.fitStyle) ||
         product.tags?.some((tag: string) => tag.toLowerCase().includes(item.fitStyle)))) {
      matched.push('fit')
    }
    
    return matched
  }

  private async buildCompleteLook(
    analysis: StyleAnalysis, 
    matchingProducts: any[]
  ): Promise<CompleteOutfit> {
    const essentialCategories = this.getEssentialCategories(analysis.occasionType)
    const includedCategories = new Set(analysis.detectedItems.map(item => item.category))
    const missingCategories = essentialCategories.filter(cat => !includedCategories.has(cat))
    
    // Group products by category
    const productsByCategory = matchingProducts.reduce((acc, product) => {
      const category = product.category
      if (!acc[category]) acc[category] = []
      acc[category].push(product)
      return acc
    }, {} as Record<string, any[]>)
    
    // Build outfit items
    const items = []
    let totalPrice = 0
    
    // Add detected items
    for (const category of includedCategories) {
      const categoryProducts = productsByCategory[category] || []
      if (categoryProducts.length > 0) {
        const bestMatch = categoryProducts[0]
        items.push({
          productId: bestMatch.productId,
          category: category,
          essential: essentialCategories.includes(category),
          alternatives: categoryProducts.slice(1, 4).map((p: any) => p.productId)
        })
        totalPrice += bestMatch.price
      }
    }
    
    // Add suggestions for missing pieces
    const missingPieces = []
    for (const category of missingCategories) {
      const { data: suggestions } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .ilike('category', `%${category}%`)
        .limit(3)
      
      if (suggestions && suggestions.length > 0) {
        items.push({
          productId: suggestions[0].id,
          category: category,
          essential: true,
          alternatives: suggestions.slice(1).map((p: any) => p.id)
        })
        totalPrice += suggestions[0].price
      } else {
        missingPieces.push(category)
      }
    }
    
    return {
      items,
      totalPrice,
      missingPieces,
      alternativeOptions: this.generateAlternatives(items)
    }
  }

  private getEssentialCategories(occasionType: string): string[] {
    const essentials: Record<string, string[]> = {
      'business-formal': ['suit-jacket', 'dress-pants', 'dress-shirt', 'tie', 'dress-shoes'],
      'business-casual': ['blazer', 'chinos', 'dress-shirt', 'dress-shoes'],
      'cocktail': ['suit-jacket', 'dress-pants', 'dress-shirt', 'dress-shoes'],
      'casual': ['shirt', 'pants', 'shoes'],
      'wedding': ['suit-jacket', 'dress-pants', 'dress-shirt', 'tie', 'dress-shoes'],
      'black-tie': ['tuxedo-jacket', 'tuxedo-pants', 'tuxedo-shirt', 'bow-tie', 'dress-shoes']
    }
    
    return essentials[occasionType] || essentials['casual']
  }

  private generateAlternatives(items: any[]): any[] {
    // Generate 1-2 alternative options
    return items.slice(0, 2).map(item => ({
      productId: item.alternatives[0],
      reason: 'Similar style at different price point',
      priceDifference: Math.random() * 50 - 25 // Random for now
    }))
  }

  private generateBudgetTiers(outfit: CompleteOutfit): BudgetTier[] {
    const basePrice = outfit.totalPrice
    
    return [
      {
        tier: 'economy',
        totalPrice: basePrice * 0.7,
        items: outfit.items.map(item => item.alternatives[0] || item.productId)
      },
      {
        tier: 'standard',
        totalPrice: basePrice,
        items: outfit.items.map(item => item.productId)
      },
      {
        tier: 'premium',
        totalPrice: basePrice * 1.5,
        items: outfit.items.map(item => item.productId) // Would select premium versions
      }
    ]
  }

  private calculateOverallSimilarity(products: any[]): number {
    if (products.length === 0) return 0
    const avgScore = products.reduce((sum, p) => sum + p.similarityScore, 0) / products.length
    return Math.round(avgScore * 100) / 100
  }

  private generateStyleNotes(analysis: StyleAnalysis): string[] {
    const notes = []
    
    if (analysis.formalityLevel >= 8) {
      notes.push('This is a formal look perfect for business meetings or special events')
    } else if (analysis.formalityLevel >= 5) {
      notes.push('Smart casual style suitable for office or dinner occasions')
    } else {
      notes.push('Relaxed style great for weekend or casual outings')
    }
    
    if (analysis.colorPalette.colorHarmony === 'monochromatic') {
      notes.push('Monochromatic color scheme creates a sophisticated, cohesive look')
    } else if (analysis.colorPalette.colorHarmony === 'complementary') {
      notes.push('Complementary colors add visual interest and balance')
    }
    
    const dominantColor = analysis.colorPalette.dominantColors[0]
    if (dominantColor) {
      notes.push(`${dominantColor.name} as the dominant color anchors the outfit`)
    }
    
    return notes
  }

  private async storeAnalysis(analysis: any): Promise<string> {
    // Generate unique ID
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // In production, store in database
    // For now, return the ID
    return analysisId
  }
}