import { NextRequest, NextResponse } from 'next/server'
import { AtelierAICore } from '@/lib/ai/atelier-ai-core'
import { RecommendationContext } from '@/lib/ai/types'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { context, userId }: { context: RecommendationContext; userId?: string } = body

    // Validate required fields
    if (!context.occasion || !context.budget) {
      return NextResponse.json(
        { error: 'Missing required fields: occasion and budget are required' },
        { status: 400 }
      )
    }

    // Get user profile if userId provided
    let userProfile = null
    if (userId) {
      const { data: profile } = await supabase
        .from('user_style_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (profile) {
        userProfile = {
          id: userId,
          styleProfile: profile.style_personality,
          measurements: profile.body_measurements,
          preferences: {
            ...profile.fit_preferences,
            ...profile.color_preferences,
            budget: profile.budget_ranges
          },
          purchaseHistory: [],
          savedOutfits: []
        }
      }
    }

    // Get AI instance
    const ai = AtelierAICore.getInstance()

    // Generate recommendations
    const recommendations = await ai.generateOutfitRecommendations(context, userProfile)

    // Store recommendations for analytics
    if (userId) {
      await supabase.from('ai_recommendations').insert({
        user_id: userId,
        recommendation_type: 'outfit',
        input_data: context,
        recommendations: recommendations,
        conversion_tracked: false
      })
    }

    return NextResponse.json({
      success: true,
      recommendations,
      context: {
        occasion: context.occasion,
        season: context.season,
        budget: context.budget
      }
    })
  } catch (error) {
    console.error('Outfit recommendation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate outfit recommendations' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Get saved recommendations for a user
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    )
  }

  try {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('recommendation_type', 'outfit')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error

    return NextResponse.json({ recommendations: data })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}