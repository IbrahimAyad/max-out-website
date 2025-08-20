import { NextRequest, NextResponse } from 'next/server'
import { AtelierAICore } from '@/lib/ai/atelier-ai-core'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, productId, measurements } = body

    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      )
    }

    // Get AI instance
    const ai = AtelierAICore.getInstance()

    // Generate size recommendation
    const recommendation = await ai.predictSize(userId || 'guest', productId, measurements)

    return NextResponse.json({
      success: true,
      recommendation
    })
  } catch (error) {
    console.error('Size prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to predict size' },
      { status: 500 }
    )
  }
}

// Get size recommendation history
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const productId = searchParams.get('productId')

  if (!userId) {
    return NextResponse.json(
      { error: 'userId is required' },
      { status: 400 }
    )
  }

  try {
    let query = supabase
      .from('size_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data, error } = await query.limit(10)

    if (error) throw error

    return NextResponse.json({ 
      success: true,
      recommendations: data 
    })
  } catch (error) {
    console.error('Error fetching size recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch size recommendations' },
      { status: 500 }
    )
  }
}