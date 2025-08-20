"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  X,
  Sparkles,
  MessageSquare,
  Maximize2,
  Minimize2,
  Camera,
  Upload,
  Heart,
  Star,
  TrendingUp,
  Palette,
  Shirt
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { AIResponse, Action, ProductSuggestion } from '@/lib/ai/types'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  intent?: string
  productRecommendations?: any[]
  suggestedActions?: Action[]
  recommendationType?: string
  visualSearchResults?: any[]
  imageUrl?: string
}

interface EnhancedChatAssistantProps {
  sessionId?: string
  userId?: string
  initialMessage?: string
  className?: string
  onProductClick?: (productId: string) => void
}

export function EnhancedChatAssistant({ 
  sessionId = `session_${Date.now()}`,
  userId,
  initialMessage,
  className,
  onProductClick
}: EnhancedChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showVisualSearch, setShowVisualSearch] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send initial message if provided
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: initialMessage || "Hello! I'm your enhanced AI shopping assistant. I can help you find products through smart recommendations, visual search, and personalized styling advice. How can I help you today?",
        timestamp: new Date()
      }])
    }
  }, [initialMessage, messages.length])

  // Track user interaction
  const trackInteraction = async (interactionType: string, data: any = {}) => {
    try {
      await supabase.functions.invoke('analytics-tracking', {
        body: {
          interactionType,
          sessionId,
          userId: user?.id,
          interactionData: data,
          pageUrl: window.location.href
        }
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageContent = input
    setInput('')
    setIsLoading(true)

    try {
      // Track chat interaction
      await trackInteraction('chat_interaction', {
        message: messageContent,
        intent: 'text_query'
      })

          // Enhanced AI processing with advanced recommendation engine
      const response = await processAdvancedMessage(messageContent)
      
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        intent: response.intent,
        productRecommendations: response.productRecommendations,
        suggestedActions: response.suggestedActions,
        recommendationType: response.recommendationType,
        advancedFeatures: response.advancedFeatures,
        behavioralInsights: response.behavioralInsights
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request. Please try again in a moment.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  // Advanced message processing with enhanced AI capabilities
  const processAdvancedMessage = async (message: string) => {
    const intent = analyzeAdvancedUserIntent(message)
    let response = {
      message: '',
      intent: intent.type,
      productRecommendations: [],
      suggestedActions: [],
      recommendationType: '',
      advancedFeatures: true,
      behavioralInsights: {}
    }

    try {
      switch (intent.type) {
        case 'advanced_recommendation_request':
          response = await getAdvancedRecommendations(intent, message)
          break
        case 'complete_outfit_builder':
          response = await getCompleteOutfitBuilder(intent, message)
          break
        case 'behavioral_based':
          response = await getBehavioralRecommendations(intent, message)
          break
        case 'smart_upselling':
          response = await getSmartUpselling(intent, message)
          break
        case 'occasion_intelligent':
          response = await getOccasionIntelligent(intent, message)
          break
        case 'trending_inquiry':
          response = await getAdvancedTrendingRecommendations(intent, message)
          break
        case 'color_coordination':
          response = await getAdvancedColorCoordination(intent, message)
          break
        case 'style_consultation':
          response = await getAdvancedStyleConsultation(intent, message)
          break
        default:
          response = await getAdvancedGeneralResponse(message)
      }
    } catch (error) {
      console.error('Advanced processing error:', error)
      response.message = "I'm here to provide you with intelligent recommendations using our advanced AI. What can I help you find today?"
    }

    return response
  }

  // Advanced user intent analysis with enhanced capabilities
  const analyzeAdvancedUserIntent = (message: string) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('complete outfit') || lowerMessage.includes('full look') || lowerMessage.includes('everything I need')) {
      return { type: 'complete_outfit_builder', occasion: extractOccasion(lowerMessage), entities: extractEntities(lowerMessage) }
    }
    if (lowerMessage.includes('customers also') || lowerMessage.includes('others bought') || lowerMessage.includes('similar taste')) {
      return { type: 'behavioral_based', entities: extractEntities(lowerMessage) }
    }
    if (lowerMessage.includes('add to') || lowerMessage.includes('goes with') || lowerMessage.includes('pair with')) {
      return { type: 'smart_upselling', entities: extractEntities(lowerMessage) }
    }
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return { type: 'advanced_recommendation_request', entities: extractAdvancedEntities(lowerMessage) }
    }
    if (lowerMessage.includes('wedding') || lowerMessage.includes('prom') || lowerMessage.includes('business') || lowerMessage.includes('interview')) {
      return { type: 'occasion_intelligent', occasion: extractOccasion(lowerMessage), formality: extractFormalityLevel(lowerMessage) }
    }
    if (lowerMessage.includes('style') || lowerMessage.includes('personality') || lowerMessage.includes('look like')) {
      return { type: 'style_consultation', preferences: extractStylePreferences(lowerMessage) }
    }
    if (lowerMessage.includes('trending') || lowerMessage.includes('popular') || lowerMessage.includes('latest') || lowerMessage.includes('hot')) {
      return { type: 'trending_inquiry', timeframe: extractTimeframe(lowerMessage) }
    }
    if (lowerMessage.includes('color') || lowerMessage.includes('match') || lowerMessage.includes('coordinate') || lowerMessage.includes('harmony')) {
      return { type: 'color_coordination', colors: extractColors(lowerMessage), harmony: true }
    }
    
    return { type: 'general', advanced: true }
  }

  // Advanced recommendations with enhanced AI engine
  const getAdvancedRecommendations = async (intent: any, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-recommendation-engine', {
        body: {
          type: 'advanced_complementary',
          context: {
            userMessage: message,
            intent: intent.type,
            entities: intent.entities,
            advanced: true
          },
          sessionId,
          userId: user?.id,
          limit: 8
        }
      })

      if (error) throw error

      return {
        message: "I've curated exceptional recommendations using advanced AI analysis. These pieces are intelligently matched to your style and preferences.",
        intent: intent.type,
        productRecommendations: data.data.recommendations,
        recommendationType: 'advanced_ai_curated',
        advancedFeatures: true,
        behavioralInsights: data.data.insights || {},
        suggestedActions: [
          { type: 'visual-search', label: 'Visual Search', data: { action: 'visual-search' } },
          { type: 'complete-outfit', label: 'Build Complete Outfit', data: { action: 'complete-outfit' } },
          { type: 'behavioral-based', label: 'More Like This', data: { action: 'behavioral' } }
        ]
      }
    } catch (error) {
      console.error('Advanced recommendations error:', error)
      return getAdvancedFallbackResponse('advanced recommendations')
    }
  }

  // Complete outfit builder
  const getCompleteOutfitBuilder = async (intent: any, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-recommendation-engine', {
        body: {
          type: 'complete_outfit_builder',
          context: {
            occasion: intent.occasion,
            userMessage: message,
            buildComplete: true
          },
          sessionId,
          userId: user?.id,
          limit: 6
        }
      })

      if (error) throw error

      return {
        message: `Perfect! I've assembled a complete ${intent.occasion || 'professional'} outfit that coordinates beautifully. Each piece complements the others for a polished, sophisticated look.`,
        intent: intent.type,
        productRecommendations: data.data.recommendations,
        recommendationType: 'complete_outfit',
        advancedFeatures: true,
        suggestedActions: [
          { type: 'add-all-to-cart', label: 'Add Complete Outfit', data: { action: 'add-outfit' } },
          { type: 'customize-outfit', label: 'Customize Colors', data: { action: 'customize' } },
          { type: 'alternative-outfit', label: 'See Alternative', data: { action: 'alternative' } }
        ]
      }
    } catch (error) {
      return getAdvancedFallbackResponse('complete outfit')
    }
  }

  // Behavioral-based recommendations
  const getBehavioralRecommendations = async (intent: any, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-recommendation-engine', {
        body: {
          type: 'behavioral_analytics',
          context: {
            userMessage: message,
            behaviorAnalysis: true
          },
          sessionId,
          userId: user?.id,
          limit: 8
        }
      })

      if (error) throw error

      return {
        message: "Based on your browsing history and customers with similar style preferences, I've found items that perfectly match your taste. These are highly recommended by others with similar style profiles.",
        intent: intent.type,
        productRecommendations: data.data.recommendations,
        recommendationType: 'behavioral_analytics',
        advancedFeatures: true,
        behavioralInsights: data.data.behavioralInsights || {},
        suggestedActions: [
          { type: 'refine-preferences', label: 'Refine Style Profile', data: { action: 'refine' } },
          { type: 'similar-customers', label: 'More from Similar Customers', data: { action: 'similar' } }
        ]
      }
    } catch (error) {
      return getAdvancedFallbackResponse('behavioral recommendations')
    }
  }

  // Smart upselling recommendations
  const getSmartUpselling = async (intent: any, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-recommendation-engine', {
        body: {
          type: 'smart_cross_category',
          context: {
            userMessage: message,
            upselling: true,
            entities: intent.entities
          },
          sessionId,
          userId: user?.id,
          limit: 6
        }
      })

      if (error) throw error

      return {
        message: "Here are some perfect additions that will enhance your look. These complementary pieces are chosen based on successful combinations from other customers.",
        intent: intent.type,
        productRecommendations: data.data.recommendations,
        recommendationType: 'smart_upselling',
        advancedFeatures: true,
        suggestedActions: [
          { type: 'add-to-current', label: 'Add to Current Selection', data: { action: 'add-current' } },
          { type: 'bundle-discount', label: 'View Bundle Pricing', data: { action: 'bundle' } }
        ]
      }
    } catch (error) {
      return getAdvancedFallbackResponse('smart recommendations')
    }
  }

  // Occasion-intelligent recommendations
  const getOccasionIntelligent = async (intent: any, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('advanced-recommendation-engine', {
        body: {
          type: 'occasion_intelligent',
          context: {
            occasion: intent.occasion,
            formality: intent.formality,
            season: getCurrentSeason(),
            intelligent: true
          },
          sessionId,
          userId: user?.id,
          limit: 8
        }
      })

      if (error) throw error

      return {
        message: `Excellent choice! For ${intent.occasion}, I've selected pieces that match the perfect formality level and current style trends. These will ensure you look appropriately dressed and confident.`,
        intent: intent.type,
        productRecommendations: data.data.recommendations,
        recommendationType: 'occasion_intelligent',
        advancedFeatures: true,
        suggestedActions: [
          { type: 'occasion-guide', label: `${intent.occasion} Style Guide`, data: { occasion: intent.occasion } },
          { type: 'seasonal-tips', label: 'Seasonal Styling Tips', data: { season: getCurrentSeason() } }
        ]
      }
    } catch (error) {
      return getAdvancedFallbackResponse(`${intent.occasion} recommendations`)
    }
  }

  // Get occasion-based recommendations
  const getOccasionRecommendations = async (intent: any, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-recommendations', {
        body: {
          type: 'occasion_based',
          context: {
            occasion: intent.occasion,
            season: getCurrentSeason(),
            formalityLevel: getFormalityLevel(intent.occasion)
          },
          sessionId,
          userId: user?.id,
          limit: 6
        }
      })

      if (error) throw error

      return {
        message: `Perfect! I've selected exceptional pieces for ${intent.occasion}. These recommendations follow current style trends while maintaining timeless elegance.`,
        intent: intent.type,
        productRecommendations: data.data.recommendations,
        recommendationType: 'occasion_based',
        suggestedActions: [
          { type: 'outfit-builder', label: 'Build Complete Outfit', data: { occasion: intent.occasion } },
          { type: 'style-guide', label: 'View Style Guide', data: { occasion: intent.occasion } }
        ]
      }
    } catch (error) {
      return getOccasionFallback(intent.occasion)
    }
  }

  // Get trending recommendations
  const getTrendingRecommendations = async (intent: any, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-recommendations', {
        body: {
          type: 'trending',
          context: {
            timeframe: 'weekly',
            categories: ['suits', 'dress-shirts', 'ties']
          },
          sessionId,
          userId: user?.id,
          limit: 8
        }
      })

      if (error) throw error

      return {
        message: "Here are this week's most popular items! These pieces are trending among our style-conscious customers and represent the latest in menswear fashion.",
        intent: intent.type,
        productRecommendations: data.data.recommendations,
        recommendationType: 'trending',
        suggestedActions: [
          { type: 'trend-report', label: 'Full Trend Report', data: { timeframe: 'weekly' } },
          { type: 'newsletter', label: 'Get Style Updates', data: { subscribe: true } }
        ]
      }
    } catch (error) {
      return {
        message: "Based on current fashion trends, I recommend exploring our featured collections that showcase the latest in contemporary menswear.",
        intent: intent.type,
        productRecommendations: [],
        recommendationType: 'trending_fallback',
        suggestedActions: []
      }
    }
  }

  // Enhanced visual search with advanced AI analysis
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    
    try {
      // Convert file to base64
      const base64 = await fileToBase64(file)
      
      // Track advanced visual search interaction
      await trackInteraction('advanced_visual_search', {
        imageSize: file.size,
        imageType: file.type,
        advancedFeatures: true
      })

      const { data, error } = await supabase.functions.invoke('advanced-visual-ai-search', {
        body: {
          imageData: base64,
          searchType: 'advanced_similarity',
          sessionId,
          userId: user?.id,
          similarityThreshold: 0.70,
          limit: 12,
          advancedFeatures: true
        }
      })

      if (error) throw error

      const analysisDetails = data.data.imageAnalysis
      const enhancedResults = data.data.searchResults
      
      let analysisMessage = `I analyzed your image and found ${enhancedResults.length} exceptional matches.`
      
      // Add advanced analysis insights
      if (analysisDetails.style_classification) {
        analysisMessage += ` I detected ${analysisDetails.style_classification.primary || 'formal'} style with ${analysisDetails.style_classification.personality || 'classic'} personality.`
      }
      
      if (analysisDetails.color_analysis?.dominant_colors?.length) {
        analysisMessage += ` The color palette features ${analysisDetails.color_analysis.dominant_colors.join(', ')} with ${analysisDetails.color_analysis.harmony_type || 'complementary'} harmony.`
      }
      
      if (analysisDetails.occasion_formality) {
        analysisMessage += ` Perfect for ${analysisDetails.occasion_formality.occasions?.join(' and ') || 'business'} occasions.`
      }

      const aiMessage: ChatMessage = {
        id: `visual_${Date.now()}`,
        role: 'assistant',
        content: analysisMessage,
        timestamp: new Date(),
        intent: 'advanced_visual_search',
        visualSearchResults: enhancedResults,
        imageUrl: data.data.imageUrl,
        advancedAnalysis: analysisDetails,
        processingTime: data.data.processingTime
      }
      
      setMessages(prev => [...prev, aiMessage])
      
    } catch (error) {
      console.error('Advanced visual search error:', error)
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "I had trouble with the advanced image analysis. Please try uploading a clear, well-lit photo of the clothing item you're looking for.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Advanced entity extraction
  const extractAdvancedEntities = (message: string) => {
    const entities: any = {
      colors: [],
      categories: [],
      styles: [],
      occasions: [],
      brands: [],
      priceRange: null,
      season: null
    }
    
    // Extract colors with advanced recognition
    const colors = [
      'navy', 'black', 'white', 'gray', 'grey', 'brown', 'burgundy', 
      'sage', 'hunter', 'forest', 'emerald', 'royal', 'powder', 'light', 
      'dark', 'charcoal', 'tan', 'beige', 'cream', 'ivory'
    ]
    entities.colors = colors.filter(color => message.includes(color))
    
    // Extract categories
    const categories = [
      'suit', 'suits', 'tuxedo', 'tuxedos', 'blazer', 'blazers',
      'shirt', 'shirts', 'tie', 'ties', 'bow-tie', 'shoes', 'accessories'
    ]
    entities.categories = categories.filter(category => message.includes(category))
    
    // Extract style keywords
    const styles = [
      'classic', 'modern', 'contemporary', 'vintage', 'trendy', 'bold',
      'elegant', 'sophisticated', 'casual', 'formal', 'slim', 'tailored'
    ]
    entities.styles = styles.filter(style => message.includes(style))
    
    // Extract occasions
    const occasions = [
      'wedding', 'prom', 'business', 'interview', 'cocktail', 'gala',
      'formal', 'casual', 'work', 'date', 'party'
    ]
    entities.occasions = occasions.filter(occasion => message.includes(occasion))
    
    return entities
  }

  const extractStylePreferences = (message: string) => {
    const preferences: any = {
      personality: null,
      fit: null,
      colors: [],
      formality: null
    }
    
    if (message.includes('classic') || message.includes('traditional')) preferences.personality = 'classic'
    if (message.includes('modern') || message.includes('contemporary')) preferences.personality = 'modern'
    if (message.includes('bold') || message.includes('statement')) preferences.personality = 'bold'
    
    if (message.includes('slim') || message.includes('fitted')) preferences.fit = 'slim'
    if (message.includes('regular') || message.includes('standard')) preferences.fit = 'regular'
    if (message.includes('relaxed') || message.includes('loose')) preferences.fit = 'relaxed'
    
    return preferences
  }

  const extractFormalityLevel = (message: string) => {
    if (message.includes('black-tie') || message.includes('white-tie')) return 10
    if (message.includes('formal') || message.includes('gala')) return 9
    if (message.includes('wedding') || message.includes('prom')) return 8
    if (message.includes('business') || message.includes('professional')) return 7
    if (message.includes('smart casual') || message.includes('cocktail')) return 5
    if (message.includes('casual') || message.includes('everyday')) return 3
    return 6 // Default business level
  }

  const extractTimeframe = (message: string) => {
    if (message.includes('now') || message.includes('today')) return 'current'
    if (message.includes('week') || message.includes('weekly')) return 'weekly'
    if (message.includes('month') || message.includes('monthly')) return 'monthly'
    if (message.includes('season') || message.includes('seasonal')) return 'seasonal'
    return 'current'
  }

  const getAdvancedFallbackResponse = (type: string) => {
    return {
      message: `I'm currently optimizing our ${type} system. Let me help you explore our curated collections that showcase the latest in menswear excellence.`,
      intent: 'advanced_fallback',
      productRecommendations: [],
      recommendationType: 'fallback',
      advancedFeatures: true,
      suggestedActions: [
        { type: 'browse-collections', label: 'Browse Collections', data: { action: 'collections' } },
        { type: 'style-quiz', label: 'Take Style Quiz', data: { action: 'quiz' } },
        { type: 'chat-help', label: 'Chat Help', data: { action: 'help' } }
      ]
    }
  }

  const getAdvancedTrendingRecommendations = async (intent: any, message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-recommendations', {
        body: {
          type: 'trending',
          context: {
            timeframe: intent.timeframe || 'current',
            advanced: true,
            categories: ['suits', 'dress-shirts', 'ties']
          },
          sessionId,
          userId: user?.id,
          limit: 10
        }
      })

      if (error) throw error

      return {
        message: "Here are the hottest trends right now! These pieces are flying off our shelves and represent the absolute latest in menswear fashion. Our AI has identified these as must-have items based on current demand and style evolution.",
        intent: intent.type,
        productRecommendations: data.data.recommendations,
        recommendationType: 'advanced_trending',
        advancedFeatures: true,
        suggestedActions: [
          { type: 'trend-report', label: 'Full Trend Report', data: { timeframe: intent.timeframe } },
          { type: 'trend-alerts', label: 'Get Trend Alerts', data: { subscribe: true } }
        ]
      }
    } catch (error) {
      return getAdvancedFallbackResponse('trending insights')
    }
  }

  const getAdvancedColorCoordination = async (intent: any, message: string) => {
    return {
      message: "Color harmony is essential for a polished look! Our AI can analyze color relationships and suggest perfect combinations. Would you like me to help you coordinate colors for a specific piece or build a complete color palette?",
      intent: intent.type,
      productRecommendations: [],
      recommendationType: 'advanced_color_coordination',
      advancedFeatures: true,
      suggestedActions: [
        { type: 'color-analyzer', label: 'Color Analysis Tool', data: { action: 'color-tool' } },
        { type: 'color-guide', label: 'Color Harmony Guide', data: { colors: intent.colors } },
        { type: 'seasonal-colors', label: 'Seasonal Color Guide', data: { season: getCurrentSeason() } }
      ]
    }
  }

  const getAdvancedStyleConsultation = async (intent: any, message: string) => {
    return {
      message: "I'd love to help you discover your signature style! Our advanced AI can analyze your preferences, lifestyle, and body type to create a personalized style profile. This will help me make incredibly accurate recommendations tailored just for you.",
      intent: intent.type,
      productRecommendations: [],
      recommendationType: 'advanced_style_consultation',
      advancedFeatures: true,
      suggestedActions: [
        { type: 'style-assessment', label: 'Complete Style Assessment', data: { action: 'assessment' } },
        { type: 'body-type-guide', label: 'Body Type Style Guide', data: { action: 'body-guide' } },
        { type: 'lifestyle-quiz', label: 'Lifestyle & Occasion Quiz', data: { action: 'lifestyle' } }
      ]
    }
  }

  // Keep original extractEntities for backward compatibility
  const extractEntities = (message: string) => {
    const entities: any = {}
    
    // Extract colors
    const colors = ['navy', 'black', 'white', 'gray', 'brown', 'burgundy']
    entities.colors = colors.filter(color => message.includes(color))
    
    // Extract categories
    const categories = ['suit', 'shirt', 'tie', 'shoes', 'blazer']
    entities.categories = categories.filter(category => message.includes(category))
    
    return entities
  }

  const extractOccasion = (message: string) => {
    if (message.includes('wedding')) return 'wedding'
    if (message.includes('prom')) return 'prom'
    if (message.includes('business')) return 'business'
    if (message.includes('interview')) return 'interview'
    if (message.includes('formal')) return 'formal'
    if (message.includes('cocktail')) return 'cocktail'
    if (message.includes('gala')) return 'gala'
    return 'general'
  }

  const extractColors = (message: string) => {
    const colors = ['navy', 'black', 'white', 'gray', 'brown', 'burgundy', 'blue', 'sage', 'hunter']
    return colors.filter(color => message.includes(color))
  }

  const getAdvancedGeneralResponse = async (message: string) => {
    return {
      message: "I'm your advanced AI styling assistant, equipped with the latest in fashion intelligence and behavioral analytics. I can help you with complete outfit building, smart product recommendations based on customer insights, visual search from photos, and personalized styling advice. What would you like to explore?",
      intent: 'general_advanced',
      productRecommendations: [],
      recommendationType: 'general_advanced',
      advancedFeatures: true,
      suggestedActions: [
        { type: 'complete-outfit', label: 'Build Complete Outfit', data: { action: 'complete-outfit' } },
        { type: 'visual-search', label: 'Visual Search', data: { action: 'visual-search' } },
        { type: 'behavioral-recommendations', label: 'Personalized Picks', data: { action: 'behavioral' } },
        { type: 'trending-now', label: 'What\'s Trending', data: { action: 'trending' } },
        { type: 'style-consultation', label: 'Style Consultation', data: { action: 'consultation' } }
      ]
    }
  }

  const extractOccasion = (message: string) => {
    if (message.includes('wedding')) return 'wedding'
    if (message.includes('prom')) return 'prom'
    if (message.includes('business')) return 'business'
    if (message.includes('interview')) return 'interview'
    if (message.includes('formal')) return 'formal'
    return 'general'
  }

  const extractColors = (message: string) => {
    const colors = ['navy', 'black', 'white', 'gray', 'brown', 'burgundy', 'blue']
    return colors.filter(color => message.includes(color))
  }

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1
    if (month >= 3 && month <= 5) return 'spring'
    if (month >= 6 && month <= 8) return 'summer'
    if (month >= 9 && month <= 11) return 'fall'
    return 'winter'
  }

  const getFormalityLevel = (occasion: string) => {
    const levels = {
      'wedding': 9,
      'prom': 9,
      'business': 7,
      'interview': 8,
      'formal': 8,
      'casual': 3
    }
    return levels[occasion as keyof typeof levels] || 6
  }

  const getOccasionFallback = (occasion: string) => {
    return {
      message: `For ${occasion}, I recommend starting with our curated collections that offer sophisticated options perfect for the occasion.`,
      intent: 'occasion_based',
      productRecommendations: [],
      recommendationType: 'occasion_fallback',
      suggestedActions: [
        { type: 'navigate', label: 'Browse Collections', data: { url: '/collections' } }
      ]
    }
  }

  const getGeneralResponse = async (message: string) => {
    return {
      message: "I'm here to help you find the perfect menswear. You can ask me about specific occasions, style recommendations, trending items, or even upload an image for visual search. What would you like to explore?",
      intent: 'general',
      productRecommendations: [],
      recommendationType: 'general',
      suggestedActions: [
        { type: 'quick-action', label: 'Show Trending Items', data: { action: 'trending' } },
        { type: 'quick-action', label: 'Wedding Collection', data: { action: 'wedding' } },
        { type: 'quick-action', label: 'Business Attire', data: { action: 'business' } },
        { type: 'quick-action', label: 'Visual Search', data: { action: 'visual-search' } }
      ]
    }
  }

  const getStyleConsultation = async (intent: any, message: string) => {
    return {
      message: "I'd love to help you discover your personal style! Based on your preferences, I can recommend pieces that reflect your personality and lifestyle. Tell me about the occasions you dress for most often.",
      intent: intent.type,
      productRecommendations: [],
      recommendationType: 'style_consultation',
      suggestedActions: [
        { type: 'style-quiz', label: 'Take Style Quiz', data: { quiz: 'personality' } },
        { type: 'consultation', label: 'Personal Consultation', data: { type: 'style' } }
      ]
    }
  }

  const getColorCoordination = async (intent: any, message: string) => {
    return {
      message: "Color coordination is key to a polished look! I can help you create harmonious combinations that enhance your style. What colors are you working with?",
      intent: intent.type,
      productRecommendations: [],
      recommendationType: 'color_coordination',
      suggestedActions: [
        { type: 'color-guide', label: 'Color Matching Guide', data: { colors: intent.colors } },
        { type: 'palette', label: 'Build Color Palette', data: { action: 'palette' } }
      ]
    }
  }

  const handleAction = (action: Action) => {
    switch (action.type) {
      case 'navigate':
        window.location.href = action.data.url
        break
      case 'quick-action':
        handleQuickAction(action.data.action)
        break
      case 'style-quiz':
        window.location.href = '/style-quiz'
        break
      default:
        console.log('Action:', action)
    }
  }

  const handleQuickAction = async (actionType: string) => {
    setIsLoading(true)
    try {
      let message = ''
      switch (actionType) {
        case 'trending':
          message = 'Show me trending items'
          break
        case 'wedding':
          message = 'I need wedding attire'
          break
        case 'business':
          message = 'I need business professional attire'
          break
        case 'visual-search':
          fileInputRef.current?.click()
          setIsLoading(false)
          return
      }
      
      const response = await processEnhancedMessage(message)
      const aiMessage: ChatMessage = {
        id: `quick_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        intent: response.intent,
        productRecommendations: response.productRecommendations,
        recommendationType: response.recommendationType
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Quick action error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 'welcome_new',
      role: 'assistant',
      content: "Chat cleared! I'm ready to help you find amazing menswear. What can I assist you with today?",
      timestamp: new Date()
    }])
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50",
      isExpanded ? "w-96 h-[600px]" : "w-96 h-[500px]",
      className
    )}>
      <Card className="h-full flex flex-col shadow-2xl">
        {/* Enhanced Header */}
        <div className="p-4 border-b bg-gradient-to-r from-burgundy to-burgundy-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-8 w-8" />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold">Enhanced AI Stylist</h3>
                <p className="text-xs text-white/80">Visual Search • Smart Recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="text-white hover:bg-white/20"
                title="Visual Search"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:bg-white/20"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearChat}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessageComponent
                key={message.id}
                message={message}
                onProductClick={onProductClick}
                onActionClick={handleAction}
              />
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="h-8 w-8 rounded-full bg-burgundy/10 flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-burgundy animate-spin" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-600">Analyzing your request...</p>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask for recommendations, upload an image, or describe what you need..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-burgundy text-sm"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-burgundy hover:bg-burgundy-700 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-1 mt-2">
            <button
              onClick={() => handleQuickAction('trending')}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            >
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Trending
            </button>
            <button
              onClick={() => handleQuickAction('wedding')}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            >
              <Heart className="h-3 w-3 inline mr-1" />
              Wedding
            </button>
            <button
              onClick={() => handleQuickAction('business')}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            >
              <Shirt className="h-3 w-3 inline mr-1" />
              Business
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
            >
              <Camera className="h-3 w-3 inline mr-1" />
              Visual Search
            </button>
          </div>
        </div>
      </Card>
      
      {/* Hidden file input for visual search */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  )
}

// Enhanced chat message component
interface ChatMessageComponentProps {
  message: ChatMessage
  onProductClick?: (productId: string) => void
  onActionClick: (action: Action) => void
}

function ChatMessageComponent({ message, onProductClick, onActionClick }: ChatMessageComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex gap-3",
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.role === 'assistant' && (
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-burgundy/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-burgundy" />
          </div>
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] space-y-3",
        message.role === 'user' ? 'items-end' : 'items-start'
      )}>
        {/* Message content */}
        <div className={cn(
          "rounded-lg px-4 py-2",
          message.role === 'user' 
            ? 'bg-burgundy text-white' 
            : 'bg-gray-100 text-gray-800'
        )}>
          <p className="text-sm">{message.content}</p>
        </div>

        {/* Intent Badge */}
        {message.intent && message.role === 'assistant' && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              {message.intent.replace('_', ' ')}
            </Badge>
            {message.recommendationType && (
              <Badge variant="outline" className="text-xs">
                {message.recommendationType}
              </Badge>
            )}
          </div>
        )}

        {/* Enhanced Product Recommendations */}
        {message.productRecommendations && message.productRecommendations.length > 0 && (
          <div className="space-y-2 mt-3 w-full">
            <div className="text-xs text-gray-500 font-medium">
              {message.productRecommendations.length} Recommendations
            </div>
            <div className="grid grid-cols-2 gap-2">
              {message.productRecommendations.slice(0, 4).map((rec, idx) => (
                <Card 
                  key={idx}
                  className="p-2 cursor-pointer hover:shadow-md transition-shadow border"
                  onClick={() => onProductClick?.(rec.product.id)}
                >
                  <div className="space-y-2">
                    {rec.product.images?.main && (
                      <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={rec.product.images.main}
                          alt={rec.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h5 className="font-medium text-xs line-clamp-2">{rec.product.name}</h5>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs font-semibold text-burgundy">
                          ${rec.product.base_price}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500">
                            {(rec.score * 5).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{rec.reason}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {message.productRecommendations.length > 4 && (
              <button className="text-xs text-burgundy hover:underline">
                View all {message.productRecommendations.length} recommendations →
              </button>
            )}
          </div>
        )}

        {/* Visual Search Results */}
        {message.visualSearchResults && message.visualSearchResults.length > 0 && (
          <div className="space-y-2 mt-3 w-full">
            <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
              <Camera className="h-3 w-3" />
              Visual Search Results ({message.visualSearchResults.length})
            </div>
            {message.imageUrl && (
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                <Image
                  src={message.imageUrl}
                  alt="Search image"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {message.visualSearchResults.slice(0, 4).map((result, idx) => (
                <Card 
                  key={idx}
                  className="p-2 cursor-pointer hover:shadow-md transition-shadow border"
                  onClick={() => onProductClick?.(result.product.id)}
                >
                  <div className="space-y-2">
                    {result.product.images?.main && (
                      <div className="aspect-square bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={result.product.images.main}
                          alt={result.product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h5 className="font-medium text-xs line-clamp-2">{result.product.name}</h5>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs font-semibold text-burgundy">
                          ${result.product.base_price}
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="text-xs bg-green-100 text-green-800 px-1 rounded">
                            {Math.round(result.similarity_score * 100)}%
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {result.match_reasons?.[0] || 'Similar style'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.suggestedActions.map((action, idx) => (
              <Button
                key={idx}
                size="sm"
                variant="outline"
                onClick={() => onActionClick(action)}
                className="text-xs h-7"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {message.role === 'user' && (
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      )}
    </motion.div>
  )
}