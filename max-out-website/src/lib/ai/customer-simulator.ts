// Customer Simulator - Acts as customer with realistic short questions
// Always responds within 10 words, simulating real customer behavior

import { contextAwareSelector } from './context-aware-selector'

export interface CustomerPersona {
  id: string
  name: string
  mood: 'happy' | 'stressed' | 'confused' | 'frustrated' | 'excited' | 'neutral'
  budget: 'budget' | 'mid' | 'luxury'
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  style: 'conservative' | 'modern' | 'trendy' | 'casual'
  scenario: string
}

export interface ConversationExchange {
  customerMessage: string
  aiResponse: string
  wordCount: number
  exchangeNumber: number
}

export interface ConversationThread {
  persona: CustomerPersona
  initialQuestion: string
  exchanges: ConversationExchange[]
  totalExchanges: number
  successful: boolean
}

export class CustomerSimulator {
  private currentPersona: CustomerPersona | null = null
  private conversationHistory: string[] = []
  
  // Customer personas with different characteristics
  private personas: CustomerPersona[] = [
    {
      id: 'rushed_groom',
      name: 'Mike',
      mood: 'stressed',
      budget: 'mid',
      urgency: 'emergency',
      style: 'modern',
      scenario: 'wedding'
    },
    {
      id: 'confused_dad',
      name: 'Robert',
      mood: 'confused',
      budget: 'budget',
      urgency: 'medium',
      style: 'conservative',
      scenario: 'prom'
    },
    {
      id: 'tech_worker',
      name: 'Alex',
      mood: 'neutral',
      budget: 'luxury',
      urgency: 'low',
      style: 'casual',
      scenario: 'work'
    },
    {
      id: 'first_date',
      name: 'James',
      mood: 'excited',
      budget: 'mid',
      urgency: 'high',
      style: 'modern',
      scenario: 'dating'
    },
    {
      id: 'lost_shopper',
      name: 'David',
      mood: 'frustrated',
      budget: 'budget',
      urgency: 'low',
      style: 'casual',
      scenario: 'general'
    }
  ]
  
  // Generate customer follow-up questions based on AI response
  generateCustomerFollowUp(aiResponse: string, exchangeNumber: number): string {
    const followUpTemplates = {
      1: [ // First follow-up
        "how much does that cost?",
        "what colors do you have?",
        "how long for alterations?",
        "do you have my size?",
        "can I see pictures?",
        "is that in stock?",
        "what about shoes?",
        "any deals right now?"
      ],
      2: [ // Second follow-up
        "too expensive, anything cheaper?",
        "what matches with navy?",
        "need it by Friday possible?",
        "I'm 42 chest 32 waist",
        "like the second one better",
        "yes need the full outfit",
        "black or brown shoes?",
        "bundle discount available?"
      ],
      3: [ // Third follow-up
        "what's your cheapest option?",
        "burgundy tie work with that?",
        "can you rush it?",
        "will that fit me?",
        "how do I order?",
        "include shirt and tie?",
        "prefer brown, have those?",
        "how much with everything?"
      ],
      4: [ // Fourth follow-up
        "ok I'll take it",
        "perfect, that works",
        "still not sure honestly",
        "maybe too formal?",
        "need to think about it",
        "can I return if not?",
        "when can I pickup?",
        "do you take amex?"
      ],
      5: [ // Final exchange
        "thank you so much!",
        "great, see you tomorrow",
        "I'll come back later",
        "let me ask my wife",
        "sounds good to me",
        "appreciate your help today",
        "ok booking appointment now",
        "perfect, ordering online then"
      ]
    }
    
    // Get appropriate follow-up based on exchange number
    const templates = followUpTemplates[exchangeNumber as keyof typeof followUpTemplates] || followUpTemplates[1]
    
    // Pick based on response content
    const lower = aiResponse.toLowerCase()
    
    if (lower.includes('price') || lower.includes('$') || lower.includes('cost')) {
      return templates[0] // Price-related follow-up
    } else if (lower.includes('color') || lower.includes('navy') || lower.includes('grey')) {
      return templates[1] // Color-related follow-up
    } else if (lower.includes('time') || lower.includes('day') || lower.includes('week')) {
      return templates[2] // Timeline-related follow-up
    } else if (lower.includes('size') || lower.includes('fit')) {
      return templates[3] // Size-related follow-up
    } else {
      // Random selection from appropriate templates
      return templates[Math.floor(Math.random() * templates.length)]
    }
  }
  
  // Simulate a complete conversation thread
  async simulateConversation(initialQuestion: string, personaId?: string): Promise<ConversationThread> {
    // Select or create persona
    this.currentPersona = personaId 
      ? this.personas.find(p => p.id === personaId) || this.personas[0]
      : this.personas[Math.floor(Math.random() * this.personas.length)]
    
    const thread: ConversationThread = {
      persona: this.currentPersona,
      initialQuestion,
      exchanges: [],
      totalExchanges: 0,
      successful: false
    }
    
    let currentQuestion = initialQuestion
    
    // Have 5 exchanges
    for (let i = 0; i < 5; i++) {
      // Get AI response
      const aiResponse = contextAwareSelector.selectBestResponse(
        currentQuestion,
        `customer_${this.currentPersona.id}`,
        `session_${Date.now()}`
      )
      
      // Create exchange record
      const exchange: ConversationExchange = {
        customerMessage: currentQuestion,
        aiResponse: aiResponse.response,
        wordCount: currentQuestion.split(' ').length,
        exchangeNumber: i + 1
      }
      
      thread.exchanges.push(exchange)
      thread.totalExchanges++
      
      // Generate next customer response (except on last exchange)
      if (i < 4) {
        currentQuestion = this.generateCustomerFollowUp(aiResponse.response, i + 1)
      }
    }
    
    // Determine if conversation was successful
    const lastExchange = thread.exchanges[thread.exchanges.length - 1]
    thread.successful = 
      lastExchange.customerMessage.includes('thank') ||
      lastExchange.customerMessage.includes('great') ||
      lastExchange.customerMessage.includes('perfect') ||
      lastExchange.customerMessage.includes('I\'ll take') ||
      lastExchange.customerMessage.includes('sounds good')
    
    return thread
  }
  
  // Run multiple conversation simulations
  async runSimulations(count: number = 5): Promise<ConversationThread[]> {
    const initialQuestions = [
      "need a suit for wedding",
      "son needs prom tux help",
      "what colors work with pale skin?",
      "interview tomorrow need help urgent",
      "never worn suit before confused"
    ]
    
    const threads: ConversationThread[] = []
    
    for (let i = 0; i < count; i++) {
      const question = initialQuestions[i % initialQuestions.length]
      const personaId = this.personas[i % this.personas.length].id
      const thread = await this.simulateConversation(question, personaId)
      threads.push(thread)
    }
    
    return threads
  }
}

// Export singleton instance
export const customerSimulator = new CustomerSimulator()

// Function to display conversation thread
export function displayConversation(thread: ConversationThread): string {
  let output = `\n${'='.repeat(60)}\n`
  output += `CUSTOMER: ${thread.persona.name} (${thread.persona.mood}, ${thread.persona.urgency} urgency)\n`
  output += `SCENARIO: ${thread.persona.scenario}\n`
  output += `${'='.repeat(60)}\n\n`
  
  thread.exchanges.forEach((exchange, index) => {
    output += `[Exchange ${index + 1}]\n`
    output += `👤 Customer: "${exchange.customerMessage}" (${exchange.wordCount} words)\n`
    output += `🤖 AI: "${exchange.aiResponse}"\n\n`
  })
  
  output += `${'='.repeat(60)}\n`
  output += `Result: ${thread.successful ? '✅ SUCCESSFUL' : '⚠️ NEEDS FOLLOW-UP'}\n`
  output += `Total Exchanges: ${thread.totalExchanges}\n`
  
  return output
}