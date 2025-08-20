import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';
import { uploadGeneratedOutfit } from '@/lib/cloudflare/r2-client';
import { uploadToCloudflareImages } from '@/lib/cloudflare/images-client';

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

interface BundleOutfitParams {
  tieColor: string;
  tieStyle: 'bowtie' | 'classic' | 'skinny' | 'slim';
  suitColor: string;
  shirtColor: string;
  occasion: 'wedding' | 'business' | 'prom' | 'casual' | 'formal' | 'cocktail';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
}

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

    const { tieColor, tieStyle, suitColor, shirtColor, occasion, season }: BundleOutfitParams = await request.json();

    // Validate inputs
    if (!tieColor || !tieStyle || !suitColor || !shirtColor || !occasion) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Build detailed prompt for outfit generation
    const styleDescriptions = {
      bowtie: 'elegant pre-tied bow tie',
      classic: 'traditional 3.25 inch wide necktie',
      skinny: 'modern 2.75 inch skinny tie',
      slim: 'contemporary 2.25 inch slim tie'
    };

    const occasionSettings = {
      wedding: 'elegant wedding photography with soft romantic lighting',
      business: 'professional business portrait with clean corporate background',
      formal: 'sophisticated formal event photography with elegant lighting',
      cocktail: 'upscale cocktail party photography with stylish ambiance',
      prom: 'stylish prom photography with modern youthful energy',
      casual: 'relaxed lifestyle photography with natural lighting'
    };

    const seasonModifiers = {
      spring: 'fresh spring setting with blooming flowers in background',
      summer: 'bright summer day with clear blue sky',
      fall: 'autumn setting with warm golden tones',
      winter: 'crisp winter atmosphere with cool tones'
    };

    const seasonSetting = season ? `, ${seasonModifiers[season]}` : '';

    const prompt = `Professional fashion photography of a well-dressed male model wearing:
    - A perfectly fitted ${suitColor} colored suit jacket and matching pants (NOT ${tieColor})
    - Crisp ${shirtColor} dress shirt underneath the suit jacket
    - ${tieColor} colored ${styleDescriptions[tieStyle]} as the neckwear accessory
    IMPORTANT: The suit must be ${suitColor}, the tie/bowtie must be ${tieColor}, the shirt must be ${shirtColor}
    ${occasionSettings[occasion]}${seasonSetting}, studio lighting, full outfit visible, clean white background, high-end fashion catalog style, sharp focus on clothing details, 8K resolution, professional menswear photography`;

    const negativePrompt = "blurry, amateur, bad quality, wrinkled clothes, poor fit, messy, dark shadows, overexposed, text, watermark, logo";

    // Generate image using SDXL

    // Use predictions API which returns URLs properly
    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt,
        negative_prompt: negativePrompt,
        width: 768,
        height: 1024,
        num_outputs: 1,
        num_inference_steps: 30,
        guidance_scale: 7.5,
        refine: "expert_ensemble_refiner",
        refine_steps: 10
      }
    });

    // Wait for the prediction to complete
    let finalPrediction = await replicate.predictions.get(prediction.id);

    while (finalPrediction.status !== 'succeeded' && finalPrediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      finalPrediction = await replicate.predictions.get(prediction.id);

    }

    if (finalPrediction.status === 'failed') {
      throw new Error('Image generation failed: ' + finalPrediction.error);
    }

    // Get the image URL from the output
    const imageUrl = Array.isArray(finalPrediction.output) 
      ? finalPrediction.output[0] 
      : finalPrediction.output;

    // Optionally save to style swipe
    let savedUrl = null;
    if (request.headers.get('x-save-to-style-swipe') === 'true') {
      try {
        // Try Cloudflare Images first (simpler, no need to download)
        const cfImageUrl = await uploadToCloudflareImages(imageUrl, {
          occasion,
          tieColor,
          suitColor,
          shirtColor,
          tieStyle,
          season
        });

        if (cfImageUrl) {
          savedUrl = cfImageUrl;

        } else {
          // Fallback to R2 if CF Images fails
          try {
            const imageResponse = await fetch(imageUrl);
            const imageBuffer = await imageResponse.arrayBuffer();

            savedUrl = await uploadGeneratedOutfit(imageBuffer, {
              occasion,
              tieColor,
              suitColor,
              shirtColor,
              tieStyle,
              season
            });

          } catch (r2Error) {

          }
        }
      } catch (error) {

        // Don't fail the whole request if upload fails
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      r2Url: savedUrl,
      outfit: {
        tieColor,
        tieStyle,
        suitColor,
        shirtColor,
        occasion,
        season
      },
      prompt,
      timestamp: new Date().toISOString()
    });

  } catch (error) {

    return NextResponse.json(
      { 
        error: 'Failed to generate outfit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Test endpoint to check if Replicate is configured
export async function GET() {
  return NextResponse.json({
    configured: !!process.env.REPLICATE_API_TOKEN,
    message: process.env.REPLICATE_API_TOKEN 
      ? 'Replicate is configured and ready' 
      : 'Replicate API token not found. Add REPLICATE_API_TOKEN to .env.local'
  });
}