import { NextResponse } from 'next/server';
import { r2Client, listImagesFromR2 } from '@/lib/cloudflare/r2-client';

export async function GET() {
  try {
    // Check if R2 is configured
    if (!r2Client) {
      return NextResponse.json({
        success: false,
        error: 'R2 credentials not configured',
        details: {
          hasAccessKey: !!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
          hasSecretKey: !!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
          publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
        }
      }, { status: 500 });
    }

    // Try to list images to test the connection
    const images = await listImagesFromR2('style-swiper/', 5);
    
    return NextResponse.json({
      success: true,
      message: 'R2 connection successful!',
      bucketName: 'style-swipe',
      publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
      imageCount: images.length,
      sampleImages: images,
    });
  } catch (error: any) {
    console.error('R2 test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to connect to R2',
      details: error.toString(),
    }, { status: 500 });
  }
}