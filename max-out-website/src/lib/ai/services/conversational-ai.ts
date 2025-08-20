import { createClient } from '@supabase/supabase-js'
import { getConversationalResponse, STYLE_DISCOVERY_QUESTIONS } from '@/lib/ai/knowledge-base'
import { getShortResponse, formatChatResponse } from '../chat-responses'
import { conversationEngine } from '../conversation-engine'
import type { 
  ConversationContext, 
  AIResponse, 
  Intent,
  IntentType,
  Action,
  ProductSuggestion,
  ExtractedEntity,
  Message
} from '../types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ConversationState {
  stage: 'greeting' | 'discovery' | 'consideration' | 'decision' | 'checkout'
  mood: 'positive' | 'neutral' | 'frustrated'
  topicHistory: string[]
  productContext: string[]
}

export class ConversationalAI {
  private openaiApiKey: string
  private conversationStates: Map<string, ConversationState> = new Map()

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || ''
  }

  async processMessage(message: string, context: ConversationContext): Promise<AIResponse> {
    try {
      // Get conversation state
      const state = this.getConversationState(context.sessionId)
      
      // Use the advanced conversation engine
      const engineResponse = await conversationEngine.processMessage(
        message,
        context.sessionId,
        {
          stage: state.stage,
          mood: state.mood,
          history: state.topicHistory,
          preferences: context.extractedPreferences,
          userId: context.userId
        }
      )
      
      // Get agent info for personality
      const agentInfo = conversationEngine.getAgentInfo(engineResponse.agent)
      
      // Build AI response with agent personality
      const aiResponse: AIResponse = {
        message: engineResponse.response,
        intent: this.determineIntent(message),
        confidence: engineResponse.confidence,
        suggestedActions: engineResponse.quickReplies.map(reply => ({
          type: 'quick-reply',
          label: reply,
          data: { reply }
        })),
        productRecommendations: [],
        metadata: {
          agent: agentInfo,
          shouldHandoff: engineResponse.shouldHandoff
        }
      }
      
      // Update conversation state
      this.updateConversationStateFromEngine(context.sessionId, engineResponse)
      
      // If high confidence response, return immediately
      if (engineResponse.confidence > 0.7) {
        return aiResponse
      }
      
      // Extract intent and entities from the message
      const intent = await this.extractIntent(message, context, state)
      
      // Update context with extracted information
      const updatedContext = this.updateContext(context, intent)
      
      // Generate appropriate response based on intent
      const response = await this.generateResponse(message, intent, updatedContext, state)
      
      // Get product recommendations if relevant
      const productRecommendations = await this.getProductRecommendations(intent, updatedContext)
      
      // Generate suggested actions
      const suggestedActions = this.generateActions(intent, state, productRecommendations.length > 0)
      
      // Update conversation state
      this.updateConversationState(context.sessionId, intent, response)
      
      return {
        ...response,
        suggestedActions,
        productRecommendations
      }
    } catch (error) {
      console.error('Conversational AI error:', error)
      return this.getFallbackResponse()
    }
  }

  private getConversationState(sessionId: string): ConversationState {
    if (!this.conversationStates.has(sessionId)) {
      this.conversationStates.set(sessionId, {
        stage: 'greeting',
        mood: 'neutral',
        topicHistory: [],
        productContext: []
      })
    }
    return this.conversationStates.get(sessionId)!
  }

  private async extractIntent(
    message: string, 
    context: ConversationContext,
    state: ConversationState
  ): Promise<Intent> {
    const prompt = `
    You are analyzing a customer message in a luxury menswear store chat.
    
    Customer message: "${message}"
    
    Conversation history (last 3 messages):
    ${context.conversationHistory.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}
    
    Current conversation stage: ${state.stage}
    Topics discussed: ${state.topicHistory.join(', ')}
    
    Extract the customer's intent and key entities. Respond in JSON format:
    {
      "intent_type": "product-search|size-help|style-advice|occasion-help|order-status|general-question|checkout-help|comparison|budget-constraint",
      "confidence": 0.0-1.0,
      "entities": [
        {
          "type": "category|color|occasion|size|budget|brand|style",
          "value": "extracted value",
          "confidence": 0.0-1.0
        }
      ],
      "context": {
        "urgency": "immediate|planning|browsing",
        "sentiment": "positive|neutral|frustrated"
      }
    }
    `

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: 'You are an AI assistant that extracts intent from customer messages.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      })

      if (!response.ok) throw new Error('OpenAI API error')

      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)

      return {
        type: result.intent_type as IntentType,
        confidence: result.confidence,
        entities: result.entities,
        context: {
          previousIntent: context.currentIntent?.type,
          conversationStage: state.stage,
          mood: result.context.sentiment || state.mood
        }
      }
    } catch (error) {
      console.error('Intent extraction error:', error)
      return {
        type: 'general-question',
        confidence: 0.5,
        entities: [],
        context: {
          conversationStage: state.stage,
          mood: state.mood
        }
      }
    }
  }

  private updateContext(context: ConversationContext, intent: Intent): ConversationContext {
    const updatedPreferences = { ...context.extractedPreferences }

    // Update preferences based on entities
    intent.entities.forEach(entity => {
      switch (entity.type) {
        case 'occasion':
          updatedPreferences.occasion = entity.value as any
          break
        case 'budget':
          const budgetValue = parseInt(entity.value)
          if (!isNaN(budgetValue)) {
            updatedPreferences.budget = {
              min: budgetValue * 0.7,
              max: budgetValue * 1.3,
              preferred: budgetValue
            }
          }
          break
        case 'color':
          if (!updatedPreferences.colors) updatedPreferences.colors = []
          updatedPreferences.colors.push(entity.value)
          break
        case 'style':
          updatedPreferences.style = entity.value as any
          break
      }
    })

    return {
      ...context,
      currentIntent: intent,
      extractedPreferences: updatedPreferences
    }
  }

  private async generateResponse(
    message: string,
    intent: Intent,
    context: ConversationContext,
    state: ConversationState
  ): Promise<Partial<AIResponse>> {
    const systemPrompt = `
    You are Atelier AI, a sophisticated personal shopping assistant for KCT Menswear, a luxury men's formal wear store.
    
    Your personality:
    - Professional yet friendly
    - Knowledgeable about men's fashion
    - Helpful without being pushy
    - Concise but informative
    
    Current context:
    - Customer intent: ${intent.type}
    - Conversation stage: ${state.stage}
    - Customer mood: ${intent.context.mood}
    - Extracted preferences: ${JSON.stringify(context.extractedPreferences)}
    `

    const userPrompt = `
    Customer message: "${message}"
    Intent: ${intent.type}
    Entities: ${JSON.stringify(intent.entities)}
    
    Generate an appropriate response that:
    1. Addresses their ${intent.type} intent
    2. Is appropriate for the ${state.stage} stage
    3. Maintains a ${intent.context.mood === 'frustrated' ? 'empathetic and helpful' : 'professional and engaging'} tone
    4. Guides them towards finding the perfect outfit
    5. Is concise (2-3 sentences max)
    `

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            ...context.conversationHistory.slice(-5).map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content
            })),
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      })

      if (!response.ok) throw new Error('OpenAI API error')

      const data = await response.json()
      const aiMessage = data.choices[0].message.content

      return {
        message: aiMessage,
        intent: intent.type,
        confidence: intent.confidence
      }
    } catch (error) {
      console.error('Response generation error:', error)
      return this.getIntentBasedFallback(intent.type)
    }
  }

  private async getProductRecommendations(
    intent: Intent,
    context: ConversationContext
  ): Promise<ProductSuggestion[]> {
    // Only get recommendations for relevant intents
    if (!['product-search', 'style-advice', 'occasion-help', 'comparison'].includes(intent.type)) {
      return []
    }

    try {
      // Build search query based on entities
      let query = supabase.from('products').select('*').eq('in_stock', true)

      // Apply filters based on entities
      intent.entities.forEach(entity => {
        switch (entity.type) {
          case 'category':
            query = query.ilike('category', `%${entity.value}%`)
            break
          case 'color':
            query = query.contains('tags', [entity.value])
            break
          case 'occasion':
            query = query.contains('tags', [entity.value])
            break
        }
      })

      const { data: products } = await query.limit(3)

      if (!products || products.length === 0) return []

      return products.map(product => ({
        productId: product.id,
        reason: this.generateProductReason(product, intent, context),
        relevanceScore: 0.8,
        highlight: this.getProductHighlight(product, intent)
      }))
    } catch (error) {
      console.error('Product recommendation error:', error)
      return []
    }
  }

  private generateProductReason(product: any, intent: Intent, context: ConversationContext): string {
    const reasons = [
      `Perfect for ${context.extractedPreferences.occasion || 'your needs'}`,
      `Matches your style preferences`,
      `Popular choice for similar occasions`,
      `Great value within your budget`,
      `Highly rated by other customers`
    ]
    
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  private getProductHighlight(product: any, intent: Intent): string {
    if (intent.entities.find(e => e.type === 'color')) {
      return `Available in ${product.color || 'your preferred color'}`
    }
    if (intent.entities.find(e => e.type === 'occasion')) {
      return `Ideal for ${intent.entities.find(e => e.type === 'occasion')?.value}`
    }
    return `${product.category} - ${product.brand || 'Premium quality'}`
  }

  private generateActions(
    intent: Intent, 
    state: ConversationState,
    hasProducts: boolean
  ): Action[] {
    const actions: Action[] = []

    switch (intent.type) {
      case 'product-search':
        if (hasProducts) {
          actions.push({
            type: 'navigate',
            label: 'View All Results',
            data: { url: '/products', filters: intent.entities }
          })
        }
        actions.push({
          type: 'filter',
          label: 'Refine Search',
          data: { showFilters: true }
        })
        break

      case 'size-help':
        actions.push({
          type: 'size-guide',
          label: 'Open Size Guide',
          data: { productId: context.activeProducts[0] }
        })
        break

      case 'occasion-help':
        actions.push({
          type: 'navigate',
          label: 'Browse Occasion Outfits',
          data: { url: '/occasions' }
        })
        break

      case 'checkout-help':
        if (context.shoppingCart.length > 0) {
          actions.push({
            type: 'navigate',
            label: 'Go to Checkout',
            data: { url: '/checkout' }
          })
        }
        break
    }

    // Always add contact support for frustrated customers
    if (state.mood === 'frustrated') {
      actions.push({
        type: 'contact-support',
        label: 'Speak to a Stylist',
        data: { priority: 'high' }
      })
    }

    return actions
  }

  private updateConversationState(
    sessionId: string,
    intent: Intent,
    response: Partial<AIResponse>
  ): void {
    const state = this.conversationStates.get(sessionId)!
    
    // Update stage based on intent
    if (['product-search', 'style-advice', 'occasion-help'].includes(intent.type)) {
      state.stage = 'discovery'
    } else if (['comparison', 'size-help'].includes(intent.type)) {
      state.stage = 'consideration'
    } else if (intent.type === 'checkout-help') {
      state.stage = 'checkout'
    }

    // Update mood
    state.mood = intent.context.mood as any

    // Add to topic history
    if (!state.topicHistory.includes(intent.type)) {
      state.topicHistory.push(intent.type)
    }

    this.conversationStates.set(sessionId, state)
  }

  private determineIntent(message: string): string {
    const lower = message.toLowerCase()
    if (lower.includes('wedding') || lower.includes('married')) return 'wedding-planning'
    if (lower.includes('size') || lower.includes('fit')) return 'sizing-help'
    if (lower.includes('color') || lower.includes('match')) return 'style-advice'
    if (lower.includes('price') || lower.includes('cost')) return 'pricing-inquiry'
    if (lower.includes('suit') || lower.includes('blazer')) return 'product-search'
    return 'general-question'
  }

  private updateConversationStateFromEngine(
    sessionId: string,
    engineResponse: any
  ): void {
    const state = this.getConversationState(sessionId)
    
    // Update based on agent type
    if (engineResponse.agent === 'James') {
      state.stage = 'discovery'
      state.topicHistory.push('wedding')
    } else if (engineResponse.agent === 'David') {
      state.stage = 'consideration'
      state.topicHistory.push('sizing')
    }
    
    // Update mood based on confidence
    if (engineResponse.confidence > 0.8) {
      state.mood = 'positive'
    }
    
    this.conversationStates.set(sessionId, state)
  }

  private updateConversationStateFromShortResponse(
    sessionId: string,
    message: string,
    response: any
  ): void {
    const state = this.getConversationState(sessionId)
    
    // Update stage based on response intent
    if (response.intent) {
      if (['wedding', 'product', 'styling'].includes(response.intent)) {
        state.stage = 'discovery'
      } else if (['sizing', 'comparison'].includes(response.intent)) {
        state.stage = 'consideration'
      }
    }
    
    // Track topic
    if (response.intent && !state.topicHistory.includes(response.intent)) {
      state.topicHistory.push(response.intent)
    }
    
    this.conversationStates.set(sessionId, state)
  }

  private updateConversationStateFromPattern(
    sessionId: string, 
    message: string, 
    conversationalResponse: any
  ): void {
    const state = this.getConversationState(sessionId)
    
    // Update stage to discovery since we're learning about style
    state.stage = 'discovery'
    state.mood = 'positive'
    
    // Add topic to history
    const topic = this.extractTopicFromMessage(message)
    if (topic && !state.topicHistory.includes(topic)) {
      state.topicHistory.push(topic)
    }
    
    this.conversationStates.set(sessionId, state)
  }
  
  private extractTopicFromMessage(message: string): string {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('suit')) return 'suits'
    if (lowerMessage.includes('wedding')) return 'wedding'
    if (lowerMessage.includes('business')) return 'business'
    if (lowerMessage.includes('color')) return 'colors'
    if (lowerMessage.includes('fit')) return 'fit'
    if (lowerMessage.includes('size')) return 'sizing'
    if (lowerMessage.includes('price')) return 'pricing'
    if (lowerMessage.includes('accessory') || lowerMessage.includes('tie') || lowerMessage.includes('pocket square')) return 'accessories'
    
    return 'general'
  }

  private getFallbackResponse(): AIResponse {
    return {
      message: "Let me help you with that. What are you looking for?",
      intent: 'general-question',
      confidence: 0.3,
      suggestedActions: [
        {
          type: 'quick-reply',
          label: 'Find a suit',
          data: { reply: 'I need a suit' }
        },
        {
          type: 'quick-reply',
          label: 'Style advice',
          data: { reply: 'I need style advice' }
        },
        {
          type: 'quick-reply',
          label: 'Sizing help',
          data: { reply: 'Help with sizing' }
        },
        {
          type: 'quick-reply',
          label: 'Browse all',
          data: { reply: 'Show me everything' }
        }
      ],
      productRecommendations: []
    }
  }

  private getIntentBasedFallback(intent: IntentType): Partial<AIResponse> {
    const fallbacks: Record<IntentType, string> = {
      'product-search': "I'd be happy to help you find what you're looking for. Could you tell me more about the occasion or style you have in mind?",
      'size-help': "I can help you find the perfect fit. Would you like to use our AI size predictor or view our size guide?",
      'style-advice': "I'd love to help you put together the perfect outfit. What's the occasion you're dressing for?",
      'occasion-help': "Let me help you find the ideal outfit for your event. Could you share more details about the occasion?",
      'order-status': "For order inquiries, please check your order confirmation email or contact our customer service team.",
      'general-question': "I'm here to help! Feel free to ask about our products, sizing, or styling advice.",
      'checkout-help': "I can assist with your purchase. Are you having trouble with the checkout process?",
      'comparison': "I'd be happy to help you compare options. Which items are you considering?",
      'budget-constraint': "Let me help you find great options within your budget. What's your price range?"
    }

    return {
      message: fallbacks[intent],
      intent,
      confidence: 0.7
    }
  }
}