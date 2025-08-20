// Short, conversational AI responses for KCT Atelier Assistant
// Optimized for quick, helpful responses like in the chat interface

import { TRAINING_QUESTIONS, findBestMatch } from './training-questions'
import type { ConversationalPattern } from './knowledge-base'

interface QuickResponse {
  message: string
  followUp?: string
  quickReplies?: string[]
  intent?: string
}

// Quick responses for common inputs
const QUICK_RESPONSES: Record<string, QuickResponse> = {
  // Greetings
  'hello': {
    message: "Hey! Looking for something specific today?",
    quickReplies: ["Wedding suit", "Business attire", "Just browsing", "Need help with sizing"]
  },
  'hi': {
    message: "Welcome! What brings you here?",
    quickReplies: ["Special event", "Update wardrobe", "Gift shopping", "Style advice"]
  },
  
  // Wedding specific
  'getting married': {
    message: "Congratulations! October weddings are beautiful.",
    followUp: "What's your venue like?",
    quickReplies: ["Vineyard", "Beach", "Garden", "Indoor ballroom"],
    intent: 'wedding-groom'
  },
  'october wedding': {
    message: "Perfect timing! Fall colors are stunning.",
    followUp: "Are you the groom or a guest?",
    quickReplies: ["I'm the groom", "Wedding guest", "Groomsman", "Father of bride/groom"],
    intent: 'wedding-october'
  },
  
  // Color questions
  'what colors': {
    message: "Depends on the occasion and season.",
    followUp: "What's the event?",
    quickReplies: ["Wedding", "Business", "Date night", "Formal event"],
    intent: 'color-advice'
  },
  'burnt orange': {
    message: "Bold choice! Burnt orange is trending for fall.",
    followUp: "For ties or pocket squares?",
    quickReplies: ["Ties", "Pocket squares", "Both", "Show me options"],
    intent: 'color-specific'
  },
  
  // General assistance
  'general question': {
    message: "Sure thing! What would you like to know?",
    quickReplies: ["Sizing help", "Style advice", "Product info", "Pricing"],
    intent: 'general'
  }
}

// Function to generate short, contextual responses
export function getShortResponse(message: string, context?: any): QuickResponse {
  const lowerMessage = message.toLowerCase().trim()
  
  // Check for exact quick responses first
  for (const [key, response] of Object.entries(QUICK_RESPONSES)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }
  
  // Check training questions for matches
  const matchedPattern = findBestMatch(message, TRAINING_QUESTIONS)
  
  if (matchedPattern) {
    // Convert pattern to short response
    return {
      message: matchedPattern.response,
      followUp: matchedPattern.followUpQuestion,
      quickReplies: Object.keys(matchedPattern.contextualResponses).map(key => {
        // Convert context keys to user-friendly labels
        switch(key) {
          case 'wedding': return 'Wedding'
          case 'business': return 'Business'
          case 'formal': return 'Formal event'
          case 'casual': return 'Casual'
          case 'budget': return 'Budget friendly'
          case 'investment': return 'Investment piece'
          case 'luxury': return 'Luxury'
          case 'athletic': return 'Athletic build'
          case 'comfort': return 'Comfort fit'
          case 'modern': return 'Modern style'
          case 'groom': return "I'm the groom"
          case 'guest': return "Wedding guest"
          case 'summer': return 'Summer event'
          case 'yes': return 'Yes'
          case 'no': return 'No'
          case 'unsure': return "Not sure"
          default: return key.charAt(0).toUpperCase() + key.slice(1)
        }
      }).slice(0, 4), // Limit to 4 quick replies
      intent: extractIntent(matchedPattern)
    }
  }
  
  // Context-aware fallbacks based on conversation stage
  if (context?.stage === 'greeting') {
    return {
      message: "How can I help you today?",
      quickReplies: ["Find a suit", "Style advice", "Sizing help", "Browse collections"],
      intent: 'greeting'
    }
  }
  
  if (context?.stage === 'discovery') {
    return {
      message: "Tell me more about what you're looking for.",
      quickReplies: ["Formal wear", "Business attire", "Casual style", "Special occasion"],
      intent: 'discovery'
    }
  }
  
  // Default fallback
  return {
    message: "I can help with that. What specifically would you like to know?",
    quickReplies: ["Show me suits", "Sizing guide", "Style tips", "Contact stylist"],
    intent: 'fallback'
  }
}

// Extract intent from pattern for analytics
function extractIntent(pattern: ConversationalPattern): string {
  const keywords = pattern.keywords[0]
  if (keywords.includes('wedding')) return 'wedding'
  if (keywords.includes('size') || keywords.includes('fit')) return 'sizing'
  if (keywords.includes('color') || keywords.includes('style')) return 'styling'
  if (keywords.includes('price') || keywords.includes('cost')) return 'pricing'
  if (keywords.includes('suit') || keywords.includes('blazer')) return 'product'
  return 'general'
}

// Format response for chat interface
export function formatChatResponse(response: QuickResponse): {
  message: string
  suggestedActions: any[]
} {
  let message = response.message
  
  // Add follow-up question if exists
  if (response.followUp) {
    message += ` ${response.followUp}`
  }
  
  // Convert quick replies to suggested actions
  const suggestedActions = response.quickReplies?.map(reply => ({
    type: 'quick-reply',
    label: reply,
    data: { reply }
  })) || []
  
  return {
    message,
    suggestedActions
  }
}

// Smart response selection based on user history
export function getPersonalizedResponse(
  message: string,
  userHistory?: string[],
  preferences?: any
): QuickResponse {
  // Get base response
  let response = getShortResponse(message)
  
  // Personalize based on history
  if (userHistory && userHistory.length > 0) {
    const lastTopic = userHistory[userHistory.length - 1]
    
    // Adjust follow-up based on previous conversation
    if (lastTopic.includes('wedding') && message.includes('color')) {
      response.message = "For your wedding? " + response.message
    }
    
    if (lastTopic.includes('size') && message.includes('suit')) {
      response.followUp = "Same size as we discussed?"
    }
  }
  
  // Personalize based on preferences
  if (preferences?.style === 'modern' && response.quickReplies) {
    // Adjust quick replies for modern preference
    response.quickReplies = response.quickReplies.map(reply => 
      reply === 'Classic' ? 'Modern fit' : reply
    )
  }
  
  return response
}