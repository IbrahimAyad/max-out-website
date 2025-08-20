export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Test 1: First, fetch a variant directly to see what columns exist
    const { data: testVariant, error: variantError } = await supabase
      .from('product_variants')
      .select('*')
      .eq('stripe_active', true)
      .limit(1)
      .single();
    
    if (variantError) {
      // If variants fail, try products table
      const { data: productOnly } = await supabase
        .from('products')
        .select('*')
        .limit(1)
        .single();
        
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch test variant',
        details: variantError,
        productTableSample: productOnly
      });
    }
    
    // Now fetch the product with its variants using discovered schema
    const { data: testProduct, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        product_variants!inner (*)
      `)
      .eq('product_variants.stripe_active', true)
      .limit(1)
      .single();
    
    if (productError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch test product',
        details: productError
      });
    }
    
    if (!testProduct) {
      return NextResponse.json({
        success: false,
        error: 'No products found in database'
      });
    }
    
    // Test 2: Check if product has stripe_price_id
    const hasStripePriceId = testProduct.product_variants?.some(
      (v: any) => v.stripe_price_id && v.stripe_active
    );
    
    // Test 3: Simulate cart item creation
    const firstVariant = testProduct?.product_variants?.[0] || testVariant;
    const cartItem = {
      productId: testProduct?.id || firstVariant?.product_id,
      variantId: firstVariant?.id,
      name: testProduct?.name || 'Test Product',
      sku: testProduct?.sku || firstVariant?.id,
      quantity: 1,
      price: firstVariant?.price || testProduct?.base_price || 0,
      stripePriceId: firstVariant?.stripe_price_id,
      stripeActive: firstVariant?.stripe_active
    };
    
    // Test 4: Check Stripe checkout readiness
    const isCheckoutReady = !!(
      cartItem.stripePriceId && 
      cartItem.stripeActive && 
      cartItem.price > 0
    );
    
    // Test 5: Fetch multiple products to check coverage
    const { data: allProducts, error: allError } = await supabase
      .from('product_variants')
      .select('stripe_price_id, stripe_active')
      .limit(100);
    
    const stats = {
      total: allProducts?.length || 0,
      withStripePriceId: allProducts?.filter((p: any) => p.stripe_price_id)?.length || 0,
      activeStripe: allProducts?.filter((p: any) => p.stripe_active)?.length || 0
    };
    
    // Test 6: Simulate checkout session data
    const checkoutLineItem = cartItem.stripePriceId ? {
      price: cartItem.stripePriceId,
      quantity: cartItem.quantity
    } : null;
    
    return NextResponse.json({
      success: true,
      tests: {
        productFetch: {
          success: !!testProduct,
          productName: testProduct.name,
          variantCount: testProduct.product_variants?.length || 0
        },
        stripeIntegration: {
          hasStripePriceId,
          firstVariantPriceId: firstVariant?.stripe_price_id || 'MISSING',
          isActive: firstVariant?.stripe_active || false
        },
        cartSimulation: {
          cartItem,
          isCheckoutReady
        },
        checkoutReadiness: {
          canCreateSession: !!checkoutLineItem,
          lineItem: checkoutLineItem
        },
        coverage: {
          ...stats,
          percentage: stats.total > 0 
            ? Math.round((stats.withStripePriceId / stats.total) * 100) 
            : 0
        }
      },
      recommendations: {
        ready: isCheckoutReady,
        issues: [
          !hasStripePriceId && 'Product variants missing stripe_price_id',
          !firstVariant?.stripe_active && 'Stripe integration not active',
          !checkoutLineItem && 'Cannot create Stripe checkout session'
        ].filter(Boolean)
      }
    });
    
  } catch (error) {
    console.error('Test checkout integration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}