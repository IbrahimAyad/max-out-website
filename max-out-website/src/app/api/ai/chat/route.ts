import { NextRequest, NextResponse } from 'next/server'
import { ConversationalAI } from '@/lib/ai/services/conversational-ai'
import { createClient } from '@supabase/supabase-js'
import type { ConversationContext, Message } from '@/lib/ai/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userId, context } = await request.json()

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and session ID are required' },
        { status: 400 }
      )
    }

    // Initialize AI service
    const conversationalAI = new ConversationalAI()

    // Get conversation history from database or session
    const { data: history } = await supabase
      .from('chat_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(20)

    // Build conversation context
    const conversationHistory: Message[] = history?.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.created_at)
    })) || []

    // Get user's shopping cart if available
    const { data: cartItems } = userId ? await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', userId) : { data: [] }

    const shoppingCart = cartItems?.map(item => item.product_id) || []

    // Get user preferences if available
    const { data: userProfile } = userId ? await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('user_id', userId)
      .single() : { data: null }

    const conversationContext: ConversationContext = {
      sessionId,
      userId,
      conversationHistory,
      currentIntent: context?.currentIntent,
      extractedPreferences: context?.extractedPreferences || userProfile?.preferences || {},
      shoppingCart,
      activeProducts: context?.activeProducts || [],
      lastInteraction: conversationHistory[conversationHistory.length - 1]?.timestamp || new Date()
    }

    // Process message with AI
    const response = await conversationalAI.processMessage(message, conversationContext)

    // Store user message in history
    await supabase.from('chat_history').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'user',
      content: message,
      intent: response.intent,
      confidence: response.confidence
    })

    // Store AI response in history
    await supabase.from('chat_history').insert({
      session_id: sessionId,
      user_id: userId,
      role: 'assistant',
      content: response.message,
      intent: response.intent,
      product_recommendations: response.productRecommendations?.map(p => p.productId)
    })

    // If we have product recommendations, fetch full product details
    let enrichedRecommendations = []
    if (response.productRecommendations && response.productRecommendations.length > 0) {
      const productIds = response.productRecommendations.map(p => p.productId)
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)

      enrichedRecommendations = response.productRecommendations.map(rec => {
        const product = products?.find(p => p.id === rec.productId)
        return {
          ...rec,
          product: product || null
        }
      })
    }

    // Track analytics
    await supabase.from('ai_interactions').insert({
      user_id: userId,
      session_id: sessionId,
      interaction_type: 'chat',
      intent: response.intent,
      confidence: response.confidence,
      resulted_in_recommendation: enrichedRecommendations.length > 0
    })

    return NextResponse.json({
      success: true,
      response: {
        ...response,
        productRecommendations: enrichedRecommendations
      }
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

// Get conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const { data: history, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({
      success: true,
      history: history || []
    })
  } catch (error) {
    console.error('Get chat history error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversation history' },
      { status: 500 }
    )
  }
}