// Advanced Conversation Engine with Multi-Agent System
// This engine orchestrates specialized agents for optimal responses

import { AI_TRAINING_SYSTEM, ADVANCED_SCENARIOS, RESPONSE_RULES } from './advanced-training'
import { getShortResponse } from './chat-responses'

// Specialized agents with unique personalities and expertise
export class ConversationAgent {
  constructor(
    public name: string,
    public expertise: string[],
    public personality: {
      tone: 'professional' | 'friendly' | 'casual' | 'expert'
      enthusiasm: 'high' | 'medium' | 'low'
      formality: 'formal' | 'semi-formal' | 'casual'
    },
    public responseStyle: {
      maxWords: number
      useEmoji: boolean
      useSlang: boolean
      useQuestions: boolean
    }
  ) {}

  canHandle(message: string, context?: any): number {
    // Score from 0-1 on how well this agent can handle the message
    const lowerMessage = message.toLowerCase()
    let score = 0
    
    // Check expertise match
    for (const skill of this.expertise) {
      if (lowerMessage.includes(skill)) {
        score += 0.3
      }
    }
    
    // Check context match
    if (context?.mood === 'nervous' && this.personality.tone === 'friendly') {
      score += 0.2
    }
    if (context?.urgency === 'immediate' && this.personality.enthusiasm === 'high') {
      score += 0.2
    }
    
    return Math.min(score, 1)
  }

  generateResponse(message: string, context?: any): string {
    // Find matching scenario
    const scenario = ADVANCED_SCENARIOS.find(s => 
      message.toLowerCase().includes(s.userMessage.toLowerCase().substring(0, 10))
    )
    
    if (!scenario) {
      return this.getDefaultResponse()
    }
    
    // Apply personality to response
    let response = scenario.agentResponses.primary
    
    // Adjust based on personality
    if (this.personality.tone === 'casual' && scenario.agentResponses.alternatives.length > 1) {
      response = scenario.agentResponses.alternatives[1] // Usually more casual
    }
    
    // Add emoji if appropriate
    if (this.responseStyle.useEmoji && this.personality.enthusiasm === 'high') {
      response = this.addEmoji(response)
    }
    
    // Shorten if needed
    if (response.split(' ').length > this.responseStyle.maxWords) {
      response = this.shortenResponse(response)
    }
    
    return response
  }

  private getDefaultResponse(): string {
    const defaults = {
      professional: "I can help with that. What specific information do you need?",
      friendly: "Let me help you out! What are you looking for?",
      casual: "Sure thing! What's up?",
      expert: "I'll provide expert guidance. Please elaborate."
    }
    return defaults[this.personality.tone]
  }

  private addEmoji(response: string): string {
    const emojiMap: { [key: string]: string } = {
      'congrats': '🎉',
      'perfect': '✨',
      'great': '👍',
      'love': '❤️',
      'wedding': '💒',
      'suit': '🤵',
      'help': '💪'
    }
    
    for (const [word, emoji] of Object.entries(emojiMap)) {
      if (response.toLowerCase().includes(word)) {
        return response + ' ' + emoji
      }
    }
    return response
  }

  private shortenResponse(response: string): string {
    const words = response.split(' ')
    if (words.length <= this.responseStyle.maxWords) return response
    
    // Keep first sentence if it's short enough
    const firstSentence = response.split('.')[0]
    if (firstSentence.split(' ').length <= this.responseStyle.maxWords) {
      return firstSentence + '.'
    }
    
    // Otherwise truncate
    return words.slice(0, this.responseStyle.maxWords).join(' ') + '...'
  }
}

// Define specialized agents
export const AGENTS = {
  styleExpert: new ConversationAgent(
    'Marcus',
    ['style', 'color', 'fashion', 'trend', 'outfit', 'match', 'coordinate'],
    { tone: 'expert', enthusiasm: 'medium', formality: 'semi-formal' },
    { maxWords: 20, useEmoji: false, useSlang: false, useQuestions: true }
  ),
  
  weddingSpecialist: new ConversationAgent(
    'James',
    ['wedding', 'groom', 'groomsmen', 'ceremony', 'reception', 'formal'],
    { tone: 'friendly', enthusiasm: 'high', formality: 'semi-formal' },
    { maxWords: 25, useEmoji: true, useSlang: false, useQuestions: true }
  ),
  
  fitConsultant: new ConversationAgent(
    'David',
    ['size', 'fit', 'measurement', 'alteration', 'tailor', 'length', 'sleeve'],
    { tone: 'professional', enthusiasm: 'medium', formality: 'formal' },
    { maxWords: 20, useEmoji: false, useSlang: false, useQuestions: false }
  ),
  
  budgetAdvisor: new ConversationAgent(
    'Mike',
    ['price', 'cost', 'budget', 'cheap', 'affordable', 'value', 'sale'],
    { tone: 'casual', enthusiasm: 'medium', formality: 'casual' },
    { maxWords: 15, useEmoji: false, useSlang: true, useQuestions: true }
  ),
  
  casualHelper: new ConversationAgent(
    'Alex',
    ['casual', 'browse', 'looking', 'help', 'general', 'question'],
    { tone: 'friendly', enthusiasm: 'high', formality: 'casual' },
    { maxWords: 15, useEmoji: true, useSlang: true, useQuestions: true }
  )
}

// Main conversation engine
export class ConversationEngine {
  private conversationHistory: Map<string, any[]> = new Map()
  private activeAgent: ConversationAgent | null = null
  
  async processMessage(
    message: string,
    sessionId: string,
    context?: any
  ): Promise<{
    response: string
    agent: string
    confidence: number
    quickReplies: string[]
    shouldHandoff: boolean
  }> {
    // Get conversation history
    const history = this.conversationHistory.get(sessionId) || []
    
    // Detect emotion and urgency
    const emotion = this.detectEmotion(message)
    const urgency = this.detectUrgency(message)
    
    // Enhanced context
    const enhancedContext = {
      ...context,
      emotion,
      urgency,
      historyLength: history.length,
      previousAgent: this.activeAgent?.name
    }
    
    // Select best agent
    const agent = this.selectBestAgent(message, enhancedContext)
    
    // Generate response
    const response = agent.generateResponse(message, enhancedContext)
    
    // Get quick replies
    const quickReplies = this.generateQuickReplies(message, response, agent)
    
    // Determine if handoff needed
    const shouldHandoff = this.shouldHandoffToHuman(emotion, urgency, history.length)
    
    // Update history
    history.push({ message, response, agent: agent.name, timestamp: Date.now() })
    this.conversationHistory.set(sessionId, history)
    
    // Set active agent
    this.activeAgent = agent
    
    return {
      response,
      agent: agent.name,
      confidence: agent.canHandle(message, enhancedContext),
      quickReplies,
      shouldHandoff
    }
  }
  
  private selectBestAgent(message: string, context: any): ConversationAgent {
    let bestAgent = AGENTS.casualHelper
    let bestScore = 0
    
    for (const agent of Object.values(AGENTS)) {
      const score = agent.canHandle(message, context)
      if (score > bestScore) {
        bestScore = score
        bestAgent = agent
      }
    }
    
    // If confidence is low, use casual helper
    if (bestScore < 0.3) {
      return AGENTS.casualHelper
    }
    
    return bestAgent
  }
  
  private detectEmotion(message: string): string {
    const lower = message.toLowerCase()
    
    if (RESPONSE_RULES.emotionIndicators.stressed.some(word => lower.includes(word))) {
      return 'stressed'
    }
    if (RESPONSE_RULES.emotionIndicators.happy.some(word => lower.includes(word))) {
      return 'happy'
    }
    if (RESPONSE_RULES.emotionIndicators.confused.some(word => lower.includes(word))) {
      return 'confused'
    }
    if (RESPONSE_RULES.emotionIndicators.frustrated.some(word => lower.includes(word))) {
      return 'frustrated'
    }
    
    return 'neutral'
  }
  
  private detectUrgency(message: string): string {
    const lower = message.toLowerCase()
    
    if (lower.includes('tomorrow') || lower.includes('today') || lower.includes('asap')) {
      return 'immediate'
    }
    if (lower.includes('next week') || lower.includes('planning') || lower.includes('upcoming')) {
      return 'planning'
    }
    
    return 'exploring'
  }
  
  private generateQuickReplies(message: string, response: string, agent: ConversationAgent): string[] {
    // Find matching scenario for follow-up paths
    const scenario = ADVANCED_SCENARIOS.find(s => 
      message.toLowerCase().includes(s.userMessage.toLowerCase().substring(0, 10))
    )
    
    if (scenario && scenario.followUpPaths) {
      return Object.keys(scenario.followUpPaths).slice(0, 4)
    }
    
    // Default quick replies based on agent
    const agentDefaults: { [key: string]: string[] } = {
      'Marcus': ['Show me options', 'What colors?', 'Style advice', 'Different style'],
      'James': ['Wedding timeline', 'Groomsmen too?', 'Color options', 'Budget?'],
      'David': ['Size guide', 'Measure myself', 'Alterations cost', 'When ready?'],
      'Mike': ['Payment plans?', 'Any sales?', 'Bundle deals', 'Compare options'],
      'Alex': ['Browse suits', 'Just looking', 'Need help', 'Special occasion']
    }
    
    return agentDefaults[agent.name] || ['Yes', 'No', 'Tell me more', 'Other options']
  }
  
  private shouldHandoffToHuman(emotion: string, urgency: string, historyLength: number): boolean {
    // Handoff if frustrated and talked for a while
    if (emotion === 'frustrated' && historyLength > 5) return true
    
    // Handoff if stressed and immediate need
    if (emotion === 'stressed' && urgency === 'immediate') return true
    
    // Handoff if conversation is too long without progress
    if (historyLength > 10) return true
    
    return false
  }
  
  // Get agent info for UI display
  getAgentInfo(agentName: string): {
    name: string
    avatar: string
    title: string
    specialty: string
  } {
    const agentInfo: { [key: string]: any } = {
      'Marcus': {
        name: 'Marcus',
        avatar: '👔',
        title: 'Style Expert',
        specialty: 'Color coordination & trending styles'
      },
      'James': {
        name: 'James',
        avatar: '🤵',
        title: 'Wedding Specialist',
        specialty: 'Formal events & ceremonies'
      },
      'David': {
        name: 'David',
        avatar: '📏',
        title: 'Fit Consultant',
        specialty: 'Sizing & alterations'
      },
      'Mike': {
        name: 'Mike',
        avatar: '💰',
        title: 'Value Advisor',
        specialty: 'Budget-friendly options'
      },
      'Alex': {
        name: 'Alex',
        avatar: '👋',
        title: 'Personal Shopper',
        specialty: 'General assistance'
      }
    }
    
    return agentInfo[agentName] || agentInfo['Alex']
  }
}

// Singleton instance
export const conversationEngine = new ConversationEngine()

// Quick test function
export function testConversation() {
  const engine = new ConversationEngine()
  
  const testMessages = [
    "getting married in October",
    "my son is getting married and I don't know what fathers wear",
    "I'm really short will your suits fit?",
    "lost weight and nothing fits anymore",
    "girlfriend wearing red dress what should I wear"
  ]
  
  // Test each message
  testMessages.forEach(async (message, index) => {
    const sessionId = `test_session_${index}`
    try {
      const response = await engine.processMessage(message, sessionId)
      // Test output removed for production
    } catch (error) {
      console.error(`Test ${index + 1} failed:`, error)
    }
  })
}
