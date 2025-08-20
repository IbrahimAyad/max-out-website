import { UnifiedProduct } from '@/types/unified-shop'
import { atelierAIService } from './atelier-ai-service'

interface ProductRecommendation {
  product: UnifiedProduct
  reason: string
  matchScore: number
}

interface CommerceResponse {
  message: string
  products?: ProductRecommendation[]
  suggestions?: string[]
  actions?: CommerceAction[]
  layerLevel?: 1 | 2 | 3
  intent?: 'browse' | 'search' | 'purchase' | 'question'
}

interface CommerceAction {
  type: 'view' | 'add_to_cart' | 'buy_now' | 'size_guide'
  label: string
  productId?: string
  data?: any
}

export class AtelierCommerceService {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }

  async processCommerceQuery(message: string): Promise<CommerceResponse> {
    const lowerMessage = message.toLowerCase()
    const intent = this.detectIntent(lowerMessage)
    
    // Search for products based on query
    const products = await this.searchProducts(lowerMessage)
    
    switch (intent) {
      case 'search':
        return this.handleProductSearch(lowerMessage, products)
      case 'purchase':
        return this.handlePurchaseIntent(lowerMessage, products)
      case 'browse':
        return this.handleBrowsingIntent(lowerMessage, products)
      default:
        return this.handleGeneralQuestion(lowerMessage, products)
    }
  }

  private detectIntent(message: string): CommerceResponse['intent'] {
    if (message.includes('buy') || message.includes('purchase') || message.includes('order')) {
      return 'purchase'
    }
    if (message.includes('show') || message.includes('find') || message.includes('looking for')) {
      return 'search'
    }
    if (message.includes('browse') || message.includes('collection') || message.includes('what do you have')) {
      return 'browse'
    }
    return 'question'
  }

  private async searchProducts(query: string): Promise<UnifiedProduct[]> {
    try {
      // Extract search terms
      const searchTerms = this.extractSearchTerms(query)
      
      // Fetch from unified API
      const response = await fetch(`${this.apiUrl}/api/products/unified?search=${searchTerms}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      return data.products || []
    } catch (error) {
      console.error('Product search error:', error)
      return []
    }
  }

  private extractSearchTerms(query: string): string {
    // Extract key terms for product search
    const colorPatterns = /\b(navy|black|grey|gray|charcoal|burgundy|red|blue|brown|tan|beige|white|green|purple)\b/gi
    const typePatterns = /\b(suit|blazer|jacket|shirt|tie|vest|pants|trousers|shoes|accessories)\b/gi
    const stylePatterns = /\b(formal|casual|business|wedding|prom|slim|classic|modern|luxury|premium)\b/gi
    
    const colors = query.match(colorPatterns) || []
    const types = query.match(typePatterns) || []
    const styles = query.match(stylePatterns) || []
    
    return [...colors, ...types, ...styles].join(' ').trim() || 'blazer'
  }

  private async handleProductSearch(
    query: string, 
    products: UnifiedProduct[]
  ): Promise<CommerceResponse> {
    if (products.length === 0) {
      return {
        message: "I couldn't find exact matches for your search, but let me show you some similar options from our premium collection.",
        suggestions: [
          "Browse all blazers",
          "View suits collection",
          "Show me navy options",
          "What's trending"
        ],
        layerLevel: 1
      }
    }

    // Score and rank products
    const recommendations = products.slice(0, 5).map(product => ({
      product,
      reason: this.generateRecommendationReason(product, query),
      matchScore: this.calculateMatchScore(product, query)
    }))

    return {
      message: `I found ${products.length} perfect matches for you. Here are my top recommendations based on your style preferences:`,
      products: recommendations,
      actions: [
        { type: 'view', label: 'View Details' },
        { type: 'add_to_cart', label: 'Add to Cart' },
        { type: 'buy_now', label: 'Buy Now' }
      ],
      suggestions: [
        "Show me more options",
        "Filter by price",
        "Different colors",
        "Check sizing"
      ],
      layerLevel: 2,
      intent: 'search'
    }
  }

  private async handlePurchaseIntent(
    query: string,
    products: UnifiedProduct[]
  ): Promise<CommerceResponse> {
    if (products.length === 0) {
      return {
        message: "I'd love to help you make a purchase! Could you tell me more about what you're looking for? I can help you find the perfect piece.",
        suggestions: [
          "Navy blazer for business",
          "Wedding suit options",
          "Casual Friday outfit",
          "Complete formal look"
        ],
        layerLevel: 1,
        intent: 'purchase'
      }
    }

    const topProduct = products[0]
    const recommendations = [{
      product: topProduct,
      reason: "Based on your request, this is our most popular choice with excellent reviews",
      matchScore: 0.95
    }]

    return {
      message: `Excellent choice! This ${topProduct.name} is one of our bestsellers. It's crafted with premium materials and offers exceptional value. Would you like to proceed with the purchase?`,
      products: recommendations,
      actions: [
        { type: 'buy_now', label: 'Buy Now - Fast Checkout', productId: topProduct.id },
        { type: 'add_to_cart', label: 'Add to Cart', productId: topProduct.id },
        { type: 'size_guide', label: 'Check Size Guide' }
      ],
      suggestions: [
        "Tell me more about this product",
        "Show similar options",
        "What about accessories?",
        "Check return policy"
      ],
      layerLevel: 3,
      intent: 'purchase'
    }
  }

  private async handleBrowsingIntent(
    query: string,
    products: UnifiedProduct[]
  ): Promise<CommerceResponse> {
    // Get a variety of products for browsing
    const categories = this.categorizeProducts(products)
    
    return {
      message: "Let me show you our curated collection. I've selected pieces that embody the Sterling Crown philosophy - where luxury meets accessibility:",
      products: products.slice(0, 6).map(product => ({
        product,
        reason: this.generateBrowsingReason(product),
        matchScore: Math.random() * 0.3 + 0.7 // 0.7-1.0 range
      })),
      actions: [
        { type: 'view', label: 'Quick View' },
        { type: 'add_to_cart', label: 'Add to Cart' }
      ],
      suggestions: [
        "Filter by occasion",
        "Sort by price",
        "New arrivals",
        "Best sellers"
      ],
      layerLevel: 1,
      intent: 'browse'
    }
  }

  private handleGeneralQuestion(
    query: string,
    products: UnifiedProduct[]
  ): Promise<CommerceResponse> {
    // Handle sizing questions
    if (query.includes('size') || query.includes('fit')) {
      return Promise.resolve({
        message: "I can help you find your perfect fit! Our AI-powered sizing system has 98% accuracy. Would you like me to guide you through our size finder, or would you prefer to see our size chart?",
        suggestions: [
          "Start size finder",
          "View size chart",
          "Compare brand sizing",
          "Alteration services"
        ],
        layerLevel: 1,
        intent: 'question'
      })
    }

    // Handle style advice
    if (query.includes('style') || query.includes('match') || query.includes('wear')) {
      return Promise.resolve({
        message: "I'd be delighted to help with styling advice! Based on current trends and classic menswear principles, I can create the perfect look for any occasion. What event are you dressing for?",
        suggestions: [
          "Business meeting",
          "Wedding guest",
          "Date night",
          "Casual Friday"
        ],
        layerLevel: 1,
        intent: 'question'
      })
    }

    // Default response with product suggestions
    return Promise.resolve({
      message: "I'm here to help you discover your perfect style. Whether you're looking for a complete outfit or a specific piece, I can guide you to the best options in our collection.",
      products: products.slice(0, 3).map(product => ({
        product,
        reason: "Trending this season",
        matchScore: 0.8
      })),
      suggestions: [
        "Show me suits",
        "Browse blazers",
        "Formal wear",
        "Casual collection"
      ],
      layerLevel: 1,
      intent: 'question'
    })
  }

  private generateRecommendationReason(product: UnifiedProduct, query: string): string {
    const reasons = [
      `Perfect match for "${query}" with premium ${product.category} construction`,
      `Highly rated ${product.name} - a customer favorite`,
      `Versatile piece that works for multiple occasions`,
      `Exceptional value with luxury materials`,
      `Trending style that aligns with your preferences`
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  private generateBrowsingReason(product: UnifiedProduct): string {
    const reasons = [
      "Bestseller with 5-star reviews",
      "New arrival - exclusive design",
      "Limited edition piece",
      "Staff pick - exceptional quality",
      "Trending this season"
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  private calculateMatchScore(product: UnifiedProduct, query: string): number {
    let score = 0.5 // Base score
    const lowerQuery = query.toLowerCase()
    const lowerName = product.name.toLowerCase()
    const lowerCategory = product.category?.toLowerCase() || ''
    
    // Exact name match
    if (lowerName.includes(lowerQuery)) score += 0.3
    
    // Category match
    if (lowerCategory && lowerQuery.includes(lowerCategory)) score += 0.2
    
    // Color match
    const colors = ['navy', 'black', 'grey', 'burgundy', 'blue', 'brown']
    colors.forEach(color => {
      if (lowerQuery.includes(color) && lowerName.includes(color)) {
        score += 0.2
      }
    })
    
    // Price consideration (if mentioned)
    if (lowerQuery.includes('affordable') || lowerQuery.includes('budget')) {
      if (product.price < 300) score += 0.1
    }
    if (lowerQuery.includes('premium') || lowerQuery.includes('luxury')) {
      if (product.price > 500) score += 0.1
    }
    
    return Math.min(score, 1.0)
  }

  private categorizeProducts(products: UnifiedProduct[]): Record<string, UnifiedProduct[]> {
    const categories: Record<string, UnifiedProduct[]> = {}
    
    products.forEach(product => {
      const category = product.category || 'other'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(product)
    })
    
    return categories
  }

  // Cart and Checkout Integration
  async addToCartFromChat(productId: string, quantity: number = 1, size?: string): Promise<boolean> {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, size })
      })
      return response.ok
    } catch (error) {
      console.error('Add to cart error:', error)
      return false
    }
  }

  async initiateCheckout(productIds: string[]): Promise<string | null> {
    try {
      const response = await fetch('/api/checkout/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productIds,
          source: 'atelier-ai-chat'
        })
      })
      
      if (response.ok) {
        const { url } = await response.json()
        return url
      }
      return null
    } catch (error) {
      console.error('Checkout initiation error:', error)
      return null
    }
  }
}

// Singleton instance
export const atelierCommerceService = new AtelierCommerceService()