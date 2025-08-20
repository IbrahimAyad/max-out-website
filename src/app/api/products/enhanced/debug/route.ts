// Debug endpoint to diagnose enhanced products API issues
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      vercel: process.env.VERCEL ? 'true' : 'false',
      vercelEnv: process.env.VERCEL_ENV || 'not-set'
    },
    supabase: {
      urlConfigured: false,
      anonKeyConfigured: false,
      clientCreated: false,
      connectionTest: null,
      rlsCheck: null,
      productCount: null
    },
    errors: []
  };

  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    diagnostics.supabase.urlConfigured = !!supabaseUrl;
    diagnostics.supabase.anonKeyConfigured = !!supabaseAnonKey;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      diagnostics.errors.push({
        type: 'CONFIG_ERROR',
        message: 'Missing Supabase environment variables',
        missing: [
          !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
          !supabaseAnonKey && 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
        ].filter(Boolean)
      });
      
      return NextResponse.json(diagnostics, { status: 503 });
    }

    // Create Supabase client
    const supabase = await createClient();
    
    if (!supabase) {
      diagnostics.errors.push({
        type: 'CLIENT_ERROR',
        message: 'Failed to create Supabase client'
      });
      return NextResponse.json(diagnostics, { status: 503 });
    }
    
    diagnostics.supabase.clientCreated = true;

    // Test basic connection with a simple query
    try {
      const { data: testData, error: testError } = await supabase
        .from('products_enhanced')
        .select('id')
        .limit(1);
      
      if (testError) {
        diagnostics.supabase.connectionTest = 'failed';
        diagnostics.errors.push({
          type: 'CONNECTION_ERROR',
          message: testError.message,
          code: testError.code,
          details: testError.details,
          hint: testError.hint
        });
        
        // Check for RLS errors specifically
        if (testError.message?.includes('permission denied')) {
          diagnostics.supabase.rlsCheck = 'failed';
          diagnostics.errors.push({
            type: 'RLS_ERROR',
            message: 'Row Level Security is blocking access',
            solution: 'Run the RLS fix script in Supabase SQL Editor'
          });
        }
      } else {
        diagnostics.supabase.connectionTest = 'success';
        diagnostics.supabase.rlsCheck = 'passed';
      }
    } catch (connError: any) {
      diagnostics.supabase.connectionTest = 'error';
      diagnostics.errors.push({
        type: 'QUERY_ERROR',
        message: connError.message || 'Unknown connection error'
      });
    }

    // Count products
    try {
      const { count, error: countError } = await supabase
        .from('products_enhanced')
        .select('*', { count: 'exact', head: true });
      
      if (!countError) {
        diagnostics.supabase.productCount = count;
      } else {
        diagnostics.errors.push({
          type: 'COUNT_ERROR',
          message: countError.message
        });
      }
    } catch (countErr: any) {
      diagnostics.errors.push({
        type: 'COUNT_ERROR',
        message: countErr.message || 'Failed to count products'
      });
    }

    // Try to fetch actual products
    try {
      const { data: products, error: fetchError } = await supabase
        .from('products_enhanced')
        .select('id, name, slug, status, base_price')
        .limit(3);
      
      if (!fetchError && products) {
        diagnostics.sampleProducts = products;
      } else if (fetchError) {
        diagnostics.errors.push({
          type: 'FETCH_ERROR',
          message: fetchError.message,
          code: fetchError.code
        });
      }
    } catch (fetchErr: any) {
      diagnostics.errors.push({
        type: 'FETCH_ERROR',
        message: fetchErr.message || 'Failed to fetch products'
      });
    }

    // Return diagnostic results
    const statusCode = diagnostics.errors.length > 0 ? 500 : 200;
    return NextResponse.json(diagnostics, { status: statusCode });

  } catch (error: any) {
    diagnostics.errors.push({
      type: 'UNEXPECTED_ERROR',
      message: error.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    
    return NextResponse.json(diagnostics, { status: 500 });
  }
}