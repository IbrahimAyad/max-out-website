import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // First check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const envCheck = {
      urlFound: !!supabaseUrl,
      keyFound: !!supabaseAnonKey,
      urlValue: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing',
      keyLength: supabaseAnonKey?.length || 0
    };

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        envCheck
      });
    }

    // Create Supabase client directly
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test connection with the most basic query
    try {
      const { error: pingError } = await supabase
        .from('products')
        .select('count')
        .limit(1)
        .maybeSingle();

      if (pingError) {
        return NextResponse.json({
          success: false,
          error: 'Supabase query failed',
          errorDetails: {
            message: pingError.message,
            code: pingError.code,
            details: pingError.details,
            hint: pingError.hint
          },
          envCheck
        });
      }

      // If basic query works, try fetching actual data
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, category, base_price')
        .limit(3);

      if (productsError) {
        return NextResponse.json({
          success: false,
          error: 'Products fetch failed',
          errorDetails: productsError,
          envCheck
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Supabase connection successful',
        productsFound: products?.length || 0,
        products: products || [],
        envCheck
      });

    } catch (queryError) {
      return NextResponse.json({
        success: false,
        error: 'Query execution failed',
        errorDetails: queryError instanceof Error ? queryError.message : String(queryError),
        envCheck
      });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      errorDetails: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined
    });
  }
}