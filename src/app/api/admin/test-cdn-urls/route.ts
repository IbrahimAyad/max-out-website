export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { generateCDNUrls, validateCDNUrl, getBestImageUrl } from '@/lib/utils/cdn-url-generator';

export async function POST(request: NextRequest) {
  try {
    const { productName, testUrl } = await request.json();
    
    if (!productName) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    
    // Generate CDN URLs
    const generated = generateCDNUrls(productName);
    
    // Validate generated URLs
    const modelValid = await validateCDNUrl(generated.model);
    const productValid = generated.product ? await validateCDNUrl(generated.product) : false;
    
    // Get best available URL
    const bestUrl = await getBestImageUrl(productName, testUrl);
    
    return NextResponse.json({
      productName,
      generated,
      validation: {
        modelValid,
        productValid
      },
      bestUrl,
      testUrl: testUrl || null
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to test CDN URLs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productName = searchParams.get('product');
  
  if (!productName) {
    return NextResponse.json({ 
      message: 'CDN URL Test Endpoint',
      usage: 'POST with { productName: "Product Name", testUrl?: "optional-url" }',
      example: {
        productName: 'Hunter Green Vest',
        testUrl: 'https://old-domain.com/image.jpg'
      }
    });
  }
  
  // Quick test for GET requests
  const generated = generateCDNUrls(productName);
  
  return NextResponse.json({
    productName,
    generated,
    note: 'Use POST for full validation'
  });
}