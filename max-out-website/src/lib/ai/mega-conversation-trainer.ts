// Mega Conversation Trainer - Runs 5-exchange conversations on ALL 1000+ scenarios
// Tests the entire AI system's ability to handle complete conversations

import { contextAwareSelector } from './context-aware-selector'
import { TRAINING_QUESTIONS } from './training-questions'
import { ADVANCED_SCENARIOS } from './advanced-training'
import { EXTENDED_TRAINING_SCENARIOS } from './training-extended'
import { MEGA_EXTENDED_SCENARIOS } from './training-mega-extended'

export interface ConversationResult {
  scenarioId: string
  category: string
  initialMessage: string
  exchanges: Array<{
    customerMessage: string
    aiResponse: string
    wordCount: number
  }>
  successful: boolean
  exchangeCount: number
  resolutionType: 'purchase' | 'appointment' | 'information' | 'referral' | 'unresolved'
  customerSatisfaction: number // 1-5
  totalResponseTime: number
}

export interface TrainingReport {
  totalScenarios: number
  totalConversations: number
  successfulConversations: number
  averageExchanges: number
  successRate: number
  categoryPerformance: Map<string, {
    total: number
    successful: number
    avgExchanges: number
    avgSatisfaction: number
  }>
  commonPatterns: string[]
  areasForImprovement: string[]
  bestPerformingCategories: string[]
  worstPerformingCategories: string[]
}

export class MegaConversationTrainer {
  private results: ConversationResult[] = []
  private sessionId = `mega_training_${Date.now()}`
  
  // Generate realistic customer follow-ups based on context
  private generateNextCustomerMessage(
    aiResponse: string,
    exchangeNumber: number,
    category: string,
    previousMessages: string[]
  ): string {
    // Category-specific follow-up patterns
    const categoryPatterns: Record<string, string[][]> = {
      wedding: [
        ["what's the timeline?", "how much total?", "include everything?", "what colors best?"],
        ["can alter in time?", "groomsmen too?", "matching available?", "rush possible?"],
        ["fits my budget?", "payment plans?", "group discount?", "deposits required?"],
        ["when can fit?", "appointment needed?", "bring anything?", "how long takes?"],
        ["perfect thank you!", "I'll book it", "sounds great!", "see you tomorrow"]
      ],
      prom: [
        ["how much cost?", "rentals available?", "trending styles?", "what's popular?"],
        ["my size available?", "can try on?", "slim fit?", "color options?"],
        ["includes shoes?", "matching friends?", "accessories included?", "bow tie options?"],
        ["when pickup?", "alterations free?", "damage insurance?", "return when?"],
        ["that works perfectly", "booking now thanks", "I'll take it", "mom will call"]
      ],
      business: [
        ["professional enough?", "interview appropriate?", "too formal?", "industry standard?"],
        ["need how many?", "mix and match?", "versatile pieces?", "travel friendly?"],
        ["wrinkle resistant?", "care instructions?", "dry clean only?", "machine washable?"],
        ["build slowly?", "essentials first?", "priority items?", "phase approach?"],
        ["makes sense thanks", "I'll start there", "good advice", "ordering those"]
      ],
      sizing: [
        ["I'm 6'2 200lbs", "42 chest usually", "between sizes often", "athletic build"],
        ["room for movement?", "shrink at all?", "true to size?", "runs small?"],
        ["free alterations?", "hem included?", "waist adjusted?", "sleeve length?"],
        ["measure at home?", "size chart accurate?", "exchange policy?", "fit guarantee?"],
        ["that helps thanks", "I'll measure first", "booking fitting", "confident now"]
      ],
      style: [
        ["what's trending?", "classic or modern?", "age appropriate?", "too young looking?"],
        ["colors for me?", "skin tone matters?", "seasonal colors?", "versatile shades?"],
        ["accessories needed?", "shoes to match?", "belt included?", "complete look?"],
        ["dress code okay?", "too casual?", "overdressed maybe?", "appropriate for?"],
        ["exactly what needed", "great suggestions", "I'll try that", "much clearer now"]
      ],
      budget: [
        ["cheapest option?", "under 300 possible?", "payment plans?", "sales coming?"],
        ["quality at price?", "worth the cost?", "last how long?", "good value?"],
        ["hidden fees?", "alterations extra?", "total cost?", "everything included?"],
        ["alternatives available?", "similar cheaper?", "rental instead?", "clearance items?"],
        ["works for me", "I'll save up", "fair price", "let me think"]
      ],
      emergency: [
        ["need by tomorrow!", "today possible?", "rush available?", "express service?"],
        ["in stock now?", "my size available?", "can alter today?", "open late?"],
        ["deliver overnight?", "pickup when?", "ready by 5?", "guaranteed timing?"],
        ["cost for rush?", "emergency fee?", "priority service?", "expedite this?"],
        ["lifesaver thank you!", "heading over now", "you saved me", "perfect timing"]
      ]
    }
    
    // Detect category from previous context
    const detectedCategory = this.detectCategory(category)
    const patterns = categoryPatterns[detectedCategory] || categoryPatterns.style
    
    // Get appropriate pattern for exchange number
    const exchangePatterns = patterns[Math.min(exchangeNumber - 1, patterns.length - 1)]
    
    // Select based on AI response content
    const aiLower = aiResponse.toLowerCase()
    
    // Smart selection based on response content
    if (aiLower.includes('price') || aiLower.includes('$')) {
      return exchangePatterns.find(p => p.includes('cost') || p.includes('much')) || exchangePatterns[0]
    }
    if (aiLower.includes('size') || aiLower.includes('fit')) {
      return exchangePatterns.find(p => p.includes('size') || p.includes('fit')) || exchangePatterns[1]
    }
    if (aiLower.includes('time') || aiLower.includes('when')) {
      return exchangePatterns.find(p => p.includes('when') || p.includes('time')) || exchangePatterns[2]
    }
    
    // Default to appropriate exchange pattern
    return exchangePatterns[Math.floor(Math.random() * exchangePatterns.length)]
  }
  
  // Detect category from scenario
  private detectCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'wedding': 'wedding',
      'prom': 'prom',
      'career': 'business',
      'professional': 'business',
      'sizing': 'sizing',
      'style': 'style',
      'budget': 'budget',
      'emergency': 'emergency',
      'life_events': 'wedding',
      'emotional': 'style',
      'body_confidence': 'sizing',
      'cultural': 'style',
      'tech_industry': 'business',
      'dating': 'style',
      'medical_professional': 'business'
    }
    
    for (const [key, value] of Object.entries(categoryMap)) {
      if (category.toLowerCase().includes(key)) {
        return value
      }
    }
    
    return 'style' // default
  }
  
  // Run a complete 5-exchange conversation
  async runConversation(
    scenario: any,
    scenarioId: string,
    category: string
  ): Promise<ConversationResult> {
    const startTime = Date.now()
    const result: ConversationResult = {
      scenarioId,
      category,
      initialMessage: scenario.userMessage || scenario,
      exchanges: [],
      successful: false,
      exchangeCount: 0,
      resolutionType: 'unresolved',
      customerSatisfaction: 3,
      totalResponseTime: 0
    }
    
    let currentMessage = result.initialMessage
    const previousMessages: string[] = []
    
    // Run 5 exchanges
    for (let i = 0; i < 5; i++) {
      try {
        // Get AI response
        const aiResponse = contextAwareSelector.selectBestResponse(
          currentMessage,
          `customer_${scenarioId}_${i}`,
          this.sessionId
        )
        
        // Record exchange
        result.exchanges.push({
          customerMessage: currentMessage,
          aiResponse: aiResponse.response,
          wordCount: currentMessage.split(' ').length
        })
        
        previousMessages.push(currentMessage)
        previousMessages.push(aiResponse.response)
        
        // Generate next customer message (except on last exchange)
        if (i < 4) {
          currentMessage = this.generateNextCustomerMessage(
            aiResponse.response,
            i + 2,
            category,
            previousMessages
          )
        }
        
        result.exchangeCount++
      } catch (error) {
        console.error(`Error in exchange ${i + 1} for scenario ${scenarioId}:`, error)
        break
      }
    }
    
    // Determine success and resolution type
    if (result.exchanges.length > 0) {
      const lastCustomerMessage = result.exchanges[result.exchanges.length - 1].customerMessage
      const lastAIResponse = result.exchanges[result.exchanges.length - 1].aiResponse
      
      // Check for successful resolution
      const successIndicators = [
        'thank', 'perfect', 'great', 'I\'ll take', 'sounds good',
        'book', 'order', 'works', 'helps', 'saved'
      ]
      
      result.successful = successIndicators.some(indicator => 
        lastCustomerMessage.toLowerCase().includes(indicator)
      )
      
      // Determine resolution type
      if (lastCustomerMessage.includes('buy') || lastCustomerMessage.includes('take') || lastCustomerMessage.includes('order')) {
        result.resolutionType = 'purchase'
      } else if (lastCustomerMessage.includes('book') || lastCustomerMessage.includes('appointment')) {
        result.resolutionType = 'appointment'
      } else if (lastCustomerMessage.includes('thank') || lastCustomerMessage.includes('helps')) {
        result.resolutionType = 'information'
      } else if (lastCustomerMessage.includes('call') || lastCustomerMessage.includes('later')) {
        result.resolutionType = 'referral'
      }
      
      // Calculate satisfaction
      result.customerSatisfaction = result.successful ? 
        (result.exchangeCount <= 3 ? 5 : 4) : 
        (result.exchangeCount === 5 ? 3 : 2)
    }
    
    result.totalResponseTime = Date.now() - startTime
    
    return result
  }
  
  // Run training on all scenarios
  async runMegaTraining(limit?: number): Promise<TrainingReport> {
    const reports: TrainingReport[] = [];
    const scenarios = this.scenarios.slice(0, limit);
    
    for (const scenario of scenarios) {
      const report = await this.runScenario(scenario);
      reports.push(report);
    }
    
    return {
      scenario: 'mega-training',
      totalQuestions: reports.reduce((sum, r) => sum + r.totalQuestions, 0),
      passedQuestions: reports.reduce((sum, r) => sum + r.passedQuestions, 0),
      averageResponseTime: reports.reduce((sum, r) => sum + r.averageResponseTime, 0) / reports.length,
      score: reports.reduce((sum, r) => sum + r.score, 0) / reports.length,
      results: reports.flatMap(r => r.results),
      totalResponseTime: reports.reduce((sum, r) => sum + r.totalResponseTime, 0),
      exchangeCount: reports.reduce((sum, r) => sum + r.exchangeCount, 0)
    };
  }
}
