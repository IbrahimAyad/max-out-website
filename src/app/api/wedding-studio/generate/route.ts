import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate - safely handle missing token
let replicate: Replicate | null = null;
try {
  if (process.env.REPLICATE_API_TOKEN) {
    replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }
} catch (error) {

}

interface WeddingVisualizationParams {
  venue: string;
  suitColor: string;
  partySize: number;
  timeOfDay: string;
  season: string;
  accessories?: string[];
}

// Enhanced prompt templates for different scenarios
const promptTemplates = {
  venue: {
    beach: "seaside beach wedding with ocean waves and sandy shores in the background",
    church: "traditional church cathedral with stained glass windows and elegant architecture",
    garden: "lush botanical garden with blooming flowers and natural greenery",
    barn: "rustic barn venue with wooden beams and countryside charm",
    ballroom: "luxury ballroom with crystal chandeliers and elegant decorations",
    vineyard: "scenic vineyard estate with rolling hills and grapevines"
  },
  timeOfDay: {
    morning: "soft morning light with gentle golden hour glow",
    afternoon: "bright natural daylight with clear visibility",
    sunset: "romantic golden hour with warm orange and pink sunset colors",
    evening: "dramatic evening lighting with ambient venue illumination"
  },
  season: {
    spring: "fresh spring atmosphere with blooming flowers and new green foliage",
    summer: "vibrant summer setting with lush greenery and bright blue skies",
    fall: "autumn ambiance with colorful fall leaves and warm earth tones",
    winter: "elegant winter scene with subtle frost and crisp clear air"
  }
};

// Color mapping for suits
const suitColorDescriptions = {
  navy: "deep navy blue",
  charcoal: "sophisticated charcoal grey",
  black: "classic formal black",
  tan: "light tan beige",
  burgundy: "rich burgundy wine",
  forest: "deep forest green"
};

export async function POST(request: NextRequest) {
  try {
    // Check if Replicate is configured
    if (!replicate) {
      return NextResponse.json(
        { 
          error: 'Image generation not configured',
          message: 'REPLICATE_API_TOKEN not found in environment variables'
        },
        { status: 503 }
      );
    }

    const { venue, suitColor, partySize, timeOfDay, season, accessories = [] }: WeddingVisualizationParams = await request.json();

    // Validate inputs
    if (!venue || !suitColor || !partySize || !timeOfDay || !season) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Build enhanced prompt
    const suitDescription = suitColorDescriptions[suitColor as keyof typeof suitColorDescriptions] || suitColor;
    const venueDescription = promptTemplates.venue[venue as keyof typeof promptTemplates.venue] || venue;
    const lightingDescription = promptTemplates.timeOfDay[timeOfDay as keyof typeof promptTemplates.timeOfDay] || timeOfDay;
    const seasonDescription = promptTemplates.season[season as keyof typeof promptTemplates.season] || season;

    const accessoriesText = accessories.length > 0 ? `with ${accessories.join(', ')} accessories` : '';

    const prompt = `Professional luxury wedding photography featuring ${partySize} handsome groomsmen wearing impeccably tailored ${suitDescription} suits ${accessoriesText} at a ${seasonDescription} ${venueDescription} during ${lightingDescription}, shot with high-end camera equipment, perfect composition, sharp focus, elegant poses, joyful expressions, premium wedding photography style, detailed fabric textures, cinematic lighting, 8K resolution, masterpiece quality`;

    const negativePrompt = "blurry, amateur photography, bad quality, distorted faces, poor lighting, casual clothing, wrinkled suits, bad composition, low resolution, watermark, text, cartoonish, unrealistic proportions, bad anatomy, crowd, too many people, dark shadows, overexposed, underexposed";

    // Call Replicate API
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt,
          negative_prompt: negativePrompt,
          width: 1024,
          height: 768,
          num_outputs: 4,
          num_inference_steps: 50,
          guidance_scale: 7.5,
          scheduler: "K_EULER"
        }
      }
    );

    // Process output URLs
    const imageUrls = Array.isArray(output) ? output : [output];

    // Log for analytics

    return NextResponse.json({
      success: true,
      images: imageUrls,
      params: {
        venue,
        suitColor,
        partySize,
        timeOfDay,
        season,
        accessories
      },
      prompt,
      timestamp: new Date().toISOString()
    });

  } catch (error) {

    return NextResponse.json(
      { 
        error: 'Failed to generate wedding visualization',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving generation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // In a real implementation, you'd fetch from database
    // For now, return empty array
    return NextResponse.json({
      success: true,
      history: [],
      message: 'Generation history retrieved successfully'
    });

  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch generation history' },
      { status: 500 }
    );
  }
}