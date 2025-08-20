import { NextRequest, NextResponse } from 'next/server'
import { AtelierAICore } from '@/lib/ai/atelier-ai-core'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Please upload an image under 10MB.' },
        { status: 400 }
      )
    }

    // Get AI instance
    const ai = AtelierAICore.getInstance()

    // Analyze the image
    const analysis = await ai.analyzeStyle(imageFile)

    // Find similar products
    const styleMatch = await ai.findSimilarProducts(analysis)

    return NextResponse.json({
      success: true,
      analysis,
      matches: styleMatch
    })
  } catch (error) {
    console.error('Style analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze style. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve previous analyses
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const analysisId = searchParams.get('id')
  const userId = searchParams.get('userId')

  if (!analysisId && !userId) {
    return NextResponse.json(
      { error: 'Either analysisId or userId is required' },
      { status: 400 }
    )
  }

  try {
    // In production, fetch from database
    // For now, return mock data
    return NextResponse.json({
      analyses: []
    })
  } catch (error) {
    console.error('Error fetching analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch style analyses' },
      { status: 500 }
    )
  }
}