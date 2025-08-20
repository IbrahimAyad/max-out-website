import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCDNUrls, fixLegacyUrl } from '@/lib/utils/cdn-url-generator';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not configured' }, { status: 500 });
    }
    
    // Fetch both regular and enhanced products
    const [regularResult, enhancedResult] = await Promise.all([
      // Regular products
      supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('visibility', true)
        .limit(5),
      
      // Enhanced products (blazers, etc.)
      supabase
        .from('products_enhanced')
        .select('*')
        .eq('status', 'active')
        .limit(5)
    ]);
    
    const debugInfo = {
      regular_products: {
        count: regularResult.data?.length || 0,
        sample: regularResult.data?.[0] || null,
        fields: regularResult.data?.[0] ? Object.keys(regularResult.data[0]) : [],
        images: regularResult.data?.map(p => ({
          name: p.name,
          primary_image: p.primary_image,
          image_url: p.image_url,
          images: p.images,
          generated: generateCDNUrls(p.name)
        }))
      },
      enhanced_products: {
        count: enhancedResult.data?.length || 0,
        sample: enhancedResult.data?.[0] || null,
        fields: enhancedResult.data?.[0] ? Object.keys(enhancedResult.data[0]) : [],
        images: enhancedResult.data?.map(p => ({
          name: p.name,
          images: p.images,
          generated: generateCDNUrls(p.name)
        }))
      },
      errors: {
        regular: regularResult.error,
        enhanced: enhancedResult.error
      }
    };
    
    return NextResponse.json(debugInfo, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to debug products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}