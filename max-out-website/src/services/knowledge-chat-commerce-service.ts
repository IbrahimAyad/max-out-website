import { knowledgeChatService } from './knowledge-chat-service'
import { atelierCommerceService } from './atelier-commerce-service'
import { UnifiedProduct } from '@/types/unified-shop'

interface EnhancedChatMessage {
  message: string
  suggestions?: string[]
  products?: Array<{
    product: UnifiedProduct
    reason: string
    matchScore: number
  }>
  actions?: Array<{
    type: 'view' | 'add_to_cart' | 'buy_now' | 'size_guide'
    label: string
    productId?: string
  }>
  layerLevel?: 1 | 2 | 3
  intent?: string
  shouldSpeak?: boolean
  voicePersona?: 'professional' | 'enthusiastic' | 'empathetic'
}

export class KnowledgeChatCommerceService {
  async processEnhancedMessage(
    message: string, 
    imageFile?: File, 
    context?: any
  ): Promise<EnhancedChatMessage> {
    const lowerMessage = message.toLowerCase()
    
    // Check if this is a commerce-related query
    if (this.isCommerceQuery(lowerMessage)) {
      // Get commerce response with real products
      const commerceResponse = await atelierCommerceService.processCommerceQuery(message)
      
      // Enhance with knowledge base insights
      const knowledgeResponse = await knowledgeChatService.processMessage(message, imageFile, context)
      
      // Merge responses for comprehensive answer
      return this.mergeResponses(commerceResponse, knowledgeResponse)
    }
    
    // For non-commerce queries, use existing knowledge service
    const knowledgeResponse = await knowledgeChatService.processMessage(message, imageFile, context)
    
    // Check if we should add product suggestions anyway
    if (this.shouldSuggestProducts(lowerMessage)) {
      const products = await this.getRelevantProducts(lowerMessage)
      return {
        ...knowledgeResponse,
        products: products.slice(0, 3).map(product => ({
          product,
          reason: "Based on your style interests",
          matchScore: 0.75
        })),
        actions: this.generateProductActions()
      }
    }
    
    return knowledgeResponse
  }

  private isCommerceQuery(message: string): boolean {
    const commerceKeywords = [
      'show', 'find', 'buy', 'purchase', 'order', 'price', 'cost',
      'blazer', 'suit', 'shirt', 'tie', 'pants', 'jacket', 'vest',
      'collection', 'products', 'available', 'stock', 'shop'
    ]
    
    return commerceKeywords.some(keyword => message.includes(keyword))
  }

  private shouldSuggestProducts(message: string): boolean {
    const suggestionTriggers = [
      'style', 'outfit', 'wear', 'match', 'occasion',
      'wedding', 'business', 'formal', 'casual', 'event'
    ]
    
    return suggestionTriggers.some(trigger => message.includes(trigger))
  }

  private async getRelevantProducts(query: string): Promise<UnifiedProduct[]> {
    try {
      const response = await fetch(`/api/products/unified?search=${encodeURIComponent(query)}&limit=6`)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      return data.products || []
    } catch (error) {
      console.error('Failed to fetch relevant products:', error)
      return []
    }
  }

  private mergeResponses(
    commerceResponse: any, 
    knowledgeResponse: any
  ): EnhancedChatMessage {
    // Combine the conversational knowledge with product recommendations
    const enhancedMessage = `${knowledgeResponse.message} ${
      commerceResponse.products?.length > 0 
        ? `I've found ${commerceResponse.products.length} perfect options for you.`
        : ''
    }`
    
    return {
      message: enhancedMessage,
      suggestions: [
        ...(knowledgeResponse.suggestions || []),
        ...(commerceResponse.suggestions || [])
      ].slice(0, 4),
      products: commerceResponse.products,
      actions: commerceResponse.actions || this.generateProductActions(),
      layerLevel: Math.max(
        knowledgeResponse.layerLevel || 1,
        commerceResponse.layerLevel || 1
      ),
      intent: commerceResponse.intent || 'general',
      shouldSpeak: knowledgeResponse.shouldSpeak,
      voicePersona: knowledgeResponse.voicePersona
    }
  }

  private generateProductActions() {
    return [
      { type: 'view' as const, label: 'View Details' },
      { type: 'add_to_cart' as const, label: 'Add to Cart' },
      { type: 'buy_now' as const, label: 'Buy Now' }
    ]
  }

  // Commerce-specific handlers
  async handleAddToCart(productId: string, quantity: number = 1, size?: string): Promise<boolean> {
    return await atelierCommerceService.addToCartFromChat(productId, quantity, size)
  }

  async handleCheckout(productIds: string[]): Promise<string | null> {
    return await atelierCommerceService.initiateCheckout(productIds)
  }

  // Pre-defined shopping scenarios
  async getShoppingScenarios() {
    return {
      wedding: {
        message: "Planning your wedding? Let me show you our premium wedding collection.",
        products: await this.getRelevantProducts("wedding suit tuxedo"),
        suggestions: [
          "Classic black tuxedo",
          "Navy wedding suit",
          "Groomsmen packages",
          "Accessories bundle"
        ]
      },
      business: {
        message: "Building your professional wardrobe? Here are our top business essentials.",
        products: await this.getRelevantProducts("business suit professional"),
        suggestions: [
          "Navy power suit",
          "Charcoal essentials",
          "Complete outfit",
          "Executive collection"
        ]
      },
      casual: {
        message: "Looking for smart casual options? These pieces offer versatility and style.",
        products: await this.getRelevantProducts("blazer casual smart"),
        suggestions: [
          "Weekend blazers",
          "Smart casual sets",
          "Seasonal favorites",
          "Mix and match"
        ]
      }
    }
  }
}

// Singleton instance
export const knowledgeChatCommerceService = new KnowledgeChatCommerceService()