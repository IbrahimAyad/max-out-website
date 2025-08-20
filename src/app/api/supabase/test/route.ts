import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export async function GET(req: NextRequest) {
  try {
    // Check if environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey,
          urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : null
        }
      }, { status: 500 });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test database connection with a simple count query
    const { count: productCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({
        success: false,
        error: 'Database query failed',
        details: {
          message: countError.message,
          code: countError.code,
          hint: countError.hint
        }
      }, { status: 500 });
    }

    // Test fetching actual data
    const { data: sampleProducts, error: dataError } = await supabase
      .from('products')
      .select('id, title, handle, status')
      .limit(3);

    if (dataError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch sample data',
        details: {
          message: dataError.message,
          code: dataError.code,
          hint: dataError.hint
        }
      }, { status: 500 });
    }

    // Test variants
    const { count: variantCount } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact', head: true });

    // Test images
    const { count: imageCount } = await supabase
      .from('product_images')
      .select('*', { count: 'exact', head: true });

    // Test collections
    const { count: collectionCount } = await supabase
      .from('collections')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      timestamp: new Date().toISOString(),
      data: {
        counts: {
          products: productCount,
          variants: variantCount,
          images: imageCount,
          collections: collectionCount
        },
        sampleProducts: sampleProducts?.map(p => ({
          id: p.id,
          title: p.title,
          status: p.status
        })),
        connection: {
          url: `${supabaseUrl.substring(0, 30)}...`,
          keyLength: supabaseAnonKey.length
        }
      }
    });

  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error occurred',
      details: {
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 });
  }
}