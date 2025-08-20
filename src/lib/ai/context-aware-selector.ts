// Context-Aware Response Selection System
// Intelligently selects the best response based on context, user history, and learned patterns

import type { ResponseContext, ContextualResponse } from './response-variations'
import { RESPONSE_VARIATIONS_SET_1, RESPONSE_VARIATIONS_SET_2 } from './response-variations'
import { EXTENDED_RESPONSE_VARIATIONS } from './response-variations-extended'
import { abTestingEngine } from './ab-testing'
import { metricsCollector } from './metrics-collector'

export interface UserProfile {
  userId: string
  previousInteractions: number
  preferredTone: 'professional' | 'friendly' | 'casual' | 'expert'
  commonIntents: string[]
  avgSessionLength: number
  conversionHistory: boolean[]
  lastInteraction: Date
  demographics?: {
    ageRange?: string
    location?: string
    preferences?: string[]
  }
}

export interface ConversationState {
  sessionId: string
  startTime: Date
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  currentIntent: string
  emotionalTrend: 'improving' | 'stable' | 'declining'
  engagementLevel: 'high' | 'medium' | 'low'
  context: ResponseContext
}

export class ContextAwareResponseSelector {
  private userProfiles = new Map<string, UserProfile>()
  private conversationStates = new Map<string, ConversationState>()
  private responseCache = new Map<string, ContextualResponse[]>()
  private learningData = new Map<string, {
    context: ResponseContext
    response: string
    effectiveness: number
  }[]>()
  
  // Main selection method
  selectBestResponse(
    message: string,
    userId?: string,
    sessionId?: string
  ): ContextualResponse {
    // Get or create conversation state
    const conversationState = this.getOrCreateConversationState(sessionId || `session_${Date.now()}`)
    
    // Get or create user profile
    const userProfile = userId ? this.getOrCreateUserProfile(userId) : null
    
    // Analyze current context
    const context = this.analyzeContext(message, conversationState, userProfile)
    
    // Find matching scenarios
    const matchingScenarios = this.findMatchingScenarios(message)
    
    if (matchingScenarios.length === 0) {
      // Generate new response if no match
      return this.generateFallbackResponse(message, context)
    }
    
    // Score all available responses
    const scoredResponses = this.scoreResponses(matchingScenarios, context, userProfile)
    
    // Select best response
    const bestResponse = this.selectTopResponse(scoredResponses, context)
    
    // Track selection for learning
    this.trackSelection(message, bestResponse, context, userId, sessionId)
    
    // Update conversation state
    this.updateConversationState(conversationState, message, bestResponse.response)
    
    return bestResponse
  }
  
  // Analyze current context from multiple signals
  private analyzeContext(
    message: string,
    conversationState: ConversationState,
    userProfile: UserProfile | null
  ): ResponseContext {
    const now = new Date()
    const hour = now.getHours()
    
    // Determine time of day
    let timeOfDay: ResponseContext['timeOfDay']
    if (hour < 12) timeOfDay = 'morning'
    else if (hour < 17) timeOfDay = 'afternoon'
    else if (hour < 21) timeOfDay = 'evening'
    else timeOfDay = 'night'
    
    // Determine conversation stage
    let conversationStage: ResponseContext['conversationStage']
    const messageCount = conversationState.messages.length
    if (messageCount <= 2) conversationStage = 'greeting'
    else if (messageCount <= 6) conversationStage = 'discovery'
    else if (messageCount <= 10) conversationStage = 'recommendation'
    else conversationStage = 'closing'
    
    // Analyze user mood
    const userMood = this.analyzeUserMood(message, conversationState)
    
    // Determine urgency
    const urgencyLevel = this.analyzeUrgency(message)
    
    // Get channel type (default to chat for now)
    const channelType = 'chat' as ResponseContext['channelType']
    
    // Calculate previous interactions
    const previousInteractions = userProfile?.previousInteractions || 
      conversationState.messages.filter(m => m.role === 'user').length
    
    return {
      timeOfDay,
      conversationStage,
      userMood,
      previousInteractions,
      urgencyLevel,
      channelType
    }
  }
  
  // Analyze user mood from message and conversation history
  private analyzeUserMood(
    message: string,
    conversationState: ConversationState
  ): ResponseContext['userMood'] {
    const lowerMessage = message.toLowerCase()
    
    // Check for explicit mood indicators
    const moodIndicators = {
      happy: ['excited', 'great', 'awesome', 'perfect', 'love', 'amazing', 'wonderful'],
      stressed: ['stressed', 'worried', 'anxious', 'nervous', 'panic', 'afraid'],
      confused: ['confused', 'don\'t understand', 'help', 'lost', 'not sure', 'don\'t know'],
      frustrated: ['frustrated', 'annoyed', 'angry', 'mad', 'terrible', 'awful', 'hate'],
      excited: ['excited', 'can\'t wait', 'thrilled', 'pumped', 'stoked', 'psyched'],
      neutral: []
    }
    
    for (const [mood, indicators] of Object.entries(moodIndicators)) {
      if (indicators.some(indicator => lowerMessage.includes(indicator))) {
        return mood as ResponseContext['userMood']
      }
    }
    
    // Check emotional trend in conversation
    if (conversationState.emotionalTrend === 'declining') {
      return 'frustrated'
    } else if (conversationState.emotionalTrend === 'improving') {
      return 'happy'
    }
    
    return 'neutral'
  }
  
  // Analyze urgency level from message content
  private analyzeUrgency(message: string): ResponseContext['urgencyLevel'] {
    const lowerMessage = message.toLowerCase()
    
    const emergencyWords = ['emergency', 'urgent', 'asap', 'immediately', 'now', 'today', 'tonight']
    const highUrgencyWords = ['tomorrow', 'this week', 'soon', 'quickly', 'fast', 'rush']
    const mediumUrgencyWords = ['next week', 'coming up', 'planning', 'need']
    
    if (emergencyWords.some(word => lowerMessage.includes(word))) {
      return 'emergency'
    } else if (highUrgencyWords.some(word => lowerMessage.includes(word))) {
      return 'high'
    } else if (mediumUrgencyWords.some(word => lowerMessage.includes(word))) {
      return 'medium'
    }
    
    return 'low'
  }
  
  // Find scenarios that match the user's message
  private findMatchingScenarios(message: string): ContextualResponse[] {
    const allVariations = [
      ...RESPONSE_VARIATIONS_SET_1,
      ...RESPONSE_VARIATIONS_SET_2,
      ...EXTENDED_RESPONSE_VARIATIONS
    ]
    
    const lowerMessage = message.toLowerCase()
    const matchingResponses: ContextualResponse[] = []
    
    // Find exact or close matches
    allVariations.forEach(variation => {
      const similarity = this.calculateSimilarity(lowerMessage, variation.originalMessage.toLowerCase())
      if (similarity > 0.6) {
        matchingResponses.push(...variation.variations)
      }
    })
    
    // If no good matches, find by intent
    if (matchingResponses.length === 0) {
      const intent = this.extractIntent(message)
      allVariations.forEach(variation => {
        if (variation.scenarioId.includes(intent)) {
          matchingResponses.push(...variation.variations)
        }
      })
    }
    
    return matchingResponses
  }
  
  // Calculate similarity between two messages
  private calculateSimilarity(message1: string, message2: string): number {
    const words1 = message1.split(' ')
    const words2 = message2.split(' ')
    
    const commonWords = words1.filter(word => words2.includes(word))
    const similarity = commonWords.length / Math.max(words1.length, words2.length)
    
    return similarity
  }
  
  // Extract intent from message
  private extractIntent(message: string): string {
    const lowerMessage = message.toLowerCase()
    
    const intents = {
      wedding: ['wedding', 'married', 'groom', 'ceremony', 'vows'],
      prom: ['prom', 'dance', 'formal', 'school'],
      business: ['work', 'office', 'meeting', 'interview', 'corporate'],
      sizing: ['size', 'fit', 'measure', 'too big', 'too small'],
      style: ['color', 'style', 'look', 'match', 'coordinate'],
      emergency: ['emergency', 'urgent', 'asap', 'tomorrow', 'tonight'],
      budget: ['cheap', 'affordable', 'budget', 'expensive', 'cost', 'price']
    }
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent
      }
    }
    
    return 'general'
  }
  
  // Score responses based on context match and historical performance
  private scoreResponses(
    responses: ContextualResponse[],
    currentContext: ResponseContext,
    userProfile: UserProfile | null
  ): Array<{ response: ContextualResponse, score: number }> {
    return responses.map(response => {
      let score = 0
      
      // Context matching score (40%)
      if (response.context.timeOfDay === currentContext.timeOfDay) score += 10
      if (response.context.conversationStage === currentContext.conversationStage) score += 10
      if (response.context.userMood === currentContext.userMood) score += 10
      if (response.context.urgencyLevel === currentContext.urgencyLevel) score += 10
      
      // User preference score (30%)
      if (userProfile) {
        if (response.tone === userProfile.preferredTone) score += 20
        if (Math.abs(response.context.previousInteractions - currentContext.previousInteractions) < 3) score += 10
      }
      
      // Historical performance score (30%)
      const historicalScore = this.getHistoricalPerformance(response.response)
      score += historicalScore * 30
      
      return { response, score }
    })
  }
  
  // Get historical performance of a response
  private getHistoricalPerformance(response: string): number {
    // Check if we have learning data for similar responses
    const similarResponses = Array.from(this.learningData.values())
      .flat()
      .filter(data => this.calculateSimilarity(data.response, response) > 0.8)
    
    if (similarResponses.length === 0) return 0.5 // Default middle score
    
    const avgEffectiveness = similarResponses.reduce((sum, data) => sum + data.effectiveness, 0) / similarResponses.length
    return avgEffectiveness
  }
  
  // Select the top response with some randomization for variety
  private selectTopResponse(
    scoredResponses: Array<{ response: ContextualResponse, score: number }>,
    context: ResponseContext
  ): ContextualResponse {
    // Sort by score
    scoredResponses.sort((a, b) => b.score - a.score)
    
    // Add some randomization to avoid always picking the same response
    // Use weighted random selection from top 3
    const topResponses = scoredResponses.slice(0, 3)
    
    if (topResponses.length === 0) {
      return this.generateFallbackResponse('', context)
    }
    
    // Weighted random selection
    const totalScore = topResponses.reduce((sum, r) => sum + r.score, 0)
    let random = Math.random() * totalScore
    
    for (const scored of topResponses) {
      random -= scored.score
      if (random <= 0) {
        return scored.response
      }
    }
    
    return topResponses[0].response
  }
  
  // Generate fallback response when no scenarios match
  private generateFallbackResponse(message: string, context: ResponseContext): ContextualResponse {
    const intent = this.extractIntent(message)
    
    const fallbackResponses = {
      wedding: "I'd love to help with your wedding attire. Tell me more about your vision.",
      prom: "Prom is special! Let's find you something amazing.",
      business: "Professional wardrobe is my specialty. What's your industry?",
      sizing: "Let's get your measurements right. Do you have a tape measure?",
      style: "Style is personal. What look are you going for?",
      emergency: "I understand the urgency. Let me help you immediately.",
      budget: "We have options for every budget. What's your range?",
      general: "How can I help you look your best today?"
    }
    
    return {
      context,
      response: fallbackResponses[intent as keyof typeof fallbackResponses] || fallbackResponses.general,
      tone: context.urgencyLevel === 'emergency' ? 'urgent' : 'friendly',
      followUp: "What specifically are you looking for?"
    }
  }
  
  // Track selection for learning
  private trackSelection(
    message: string,
    response: ContextualResponse,
    context: ResponseContext,
    userId?: string,
    sessionId?: string
  ) {
    // Track in metrics collector
    metricsCollector.trackConversation({
      sessionId: sessionId || `session_${Date.now()}`,
      userId,
      agent: 'ContextAware',
      intent: this.extractIntent(message),
      message,
      response: response.response,
      responseTime: 0.5,
      confidence: 0.85,
      emotion: context.userMood,
      urgency: context.urgencyLevel,
      quickRepliesUsed: false,
      followUpEngaged: false,
      handoffRequested: false,
      resolved: false
    })
    
    // Track for A/B testing if applicable
    const testId = `context_${this.extractIntent(message)}`
    abTestingEngine.recordConversion(testId, response.response, 4, 500)
  }
  
  // Update conversation state
  private updateConversationState(
    state: ConversationState,
    userMessage: string,
    assistantResponse: string
  ) {
    state.messages.push(
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      },
      {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      }
    )
    
    // Update engagement level based on message frequency
    const messageFrequency = state.messages.length / 
      ((new Date().getTime() - state.startTime.getTime()) / 60000) // messages per minute
    
    if (messageFrequency > 2) state.engagementLevel = 'high'
    else if (messageFrequency > 0.5) state.engagementLevel = 'medium'
    else state.engagementLevel = 'low'
    
    // Update emotional trend
    const recentMoods = state.messages
      .slice(-6)
      .map(m => this.analyzeUserMood(m.content, state))
    
    const positiveCount = recentMoods.filter(m => m === 'happy' || m === 'excited').length
    const negativeCount = recentMoods.filter(m => m === 'frustrated' || m === 'stressed').length
    
    if (positiveCount > negativeCount) state.emotionalTrend = 'improving'
    else if (negativeCount > positiveCount) state.emotionalTrend = 'declining'
    else state.emotionalTrend = 'stable'
  }
  
  // Get or create user profile
  private getOrCreateUserProfile(userId: string): UserProfile {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        userId,
        previousInteractions: 0,
        preferredTone: 'friendly',
        commonIntents: [],
        avgSessionLength: 0,
        conversionHistory: [],
        lastInteraction: new Date()
      })
    }
    
    const profile = this.userProfiles.get(userId)!
    profile.previousInteractions++
    profile.lastInteraction = new Date()
    
    return profile
  }
  
  // Get or create conversation state
  private getOrCreateConversationState(sessionId: string): ConversationState {
    if (!this.conversationStates.has(sessionId)) {
      this.conversationStates.set(sessionId, {
        sessionId,
        startTime: new Date(),
        messages: [],
        currentIntent: 'general',
        emotionalTrend: 'stable',
        engagementLevel: 'medium',
        context: {
          timeOfDay: 'morning',
          conversationStage: 'greeting',
          userMood: 'neutral',
          previousInteractions: 0,
          urgencyLevel: 'low',
          channelType: 'chat'
        }
      })
    }
    
    return this.conversationStates.get(sessionId)!
  }
  
  // Learn from feedback
  learnFromFeedback(
    sessionId: string,
    responseId: string,
    satisfaction: number,
    converted: boolean
  ) {
    const state = this.conversationStates.get(sessionId)
    if (!state) return
    
    // Find the response in the conversation
    const responseMessage = state.messages.find(m => 
      m.role === 'assistant' && m.content.includes(responseId)
    )
    
    if (!responseMessage) return
    
    // Store learning data
    const key = `${state.currentIntent}_${state.context.userMood}`
    if (!this.learningData.has(key)) {
      this.learningData.set(key, [])
    }
    
    this.learningData.get(key)!.push({
      context: state.context,
      response: responseMessage.content,
      effectiveness: satisfaction / 5
    })
    
    // Update user profile if available
    const userId = state.messages[0]?.content // Simplified user ID extraction
    if (userId && this.userProfiles.has(userId)) {
      const profile = this.userProfiles.get(userId)!
      profile.conversionHistory.push(converted)
      
      // Update preferred tone based on satisfaction
      if (satisfaction >= 4) {
        // Track which tones get high satisfaction
        // This would be more sophisticated in production
      }
    }
  }
  
  // Get response statistics
  getStatistics() {
    const totalUsers = this.userProfiles.size
    const totalSessions = this.conversationStates.size
    const totalLearningData = Array.from(this.learningData.values()).flat().length
    
    const avgSatisfaction = Array.from(this.learningData.values())
      .flat()
      .reduce((sum, data) => sum + data.effectiveness, 0) / totalLearningData || 0
    
    const moodDistribution = new Map<string, number>()
    this.conversationStates.forEach(state => {
      const mood = state.context.userMood
      moodDistribution.set(mood, (moodDistribution.get(mood) || 0) + 1)
    })
    
    return {
      totalUsers,
      totalSessions,
      totalLearningData,
      avgSatisfaction,
      moodDistribution: Array.from(moodDistribution.entries()),
      avgSessionLength: Array.from(this.conversationStates.values())
        .reduce((sum, state) => sum + state.messages.length, 0) / totalSessions || 0
    }
  }
}

// Singleton instance
export const contextAwareSelector = new ContextAwareResponseSelector()

// Helper function for easy access
export function selectContextualResponse(
  message: string,
  userId?: string,
  sessionId?: string
): ContextualResponse {
  return contextAwareSelector.selectBestResponse(message, userId, sessionId)
}

// Export statistics function
export function getResponseStatistics() {
  return contextAwareSelector.getStatistics()
}