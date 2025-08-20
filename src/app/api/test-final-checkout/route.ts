import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Test 1: Get a product with valid Stripe price ID
    const { data: productWithStripe, error: productError } = await supabase
      .from('product_variants')
      .select(`
        *,
        products!inner (
          id,
          name,
          description,
          product_type,
          base_price
        )
      `)
      .eq('stripe_active', true)
      .not('stripe_price_id', 'is', null)
      .limit(1)
      .single();
    
    if (productError || !productWithStripe) {
      return NextResponse.json({
        success: false,
        error: 'No products with Stripe integration found',
        details: productError
      });
    }
    
    // Test 2: Simulate cart checkout data structure
    const checkoutData = {
      items: [{
        productId: productWithStripe.product_id,
        variantId: productWithStripe.id,
        name: productWithStripe.products.name,
        quantity: 1,
        price: productWithStripe.price,
        stripePriceId: productWithStripe.stripe_price_id
      }],
      customerEmail: 'test@example.com',
      successUrl: `${request.nextUrl.origin}/checkout/success`,
      cancelUrl: `${request.nextUrl.origin}/cart`
    };
    
    // Test 3: Validate Stripe line items format
    const lineItems = checkoutData.items.map(item => ({
      price: item.stripePriceId,
      quantity: item.quantity
    }));
    
    const allHaveStripePriceId = lineItems.every(item => item.price);
    
    // Test 4: Check overall statistics (FIXED: Get actual count, not limited data)
    const { count: totalCount } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact', head: true });
    
    const { count: withStripeCount } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact', head: true })
      .not('stripe_price_id', 'is', null)
      .not('stripe_price_id', 'eq', '');
    
    const { count: activeCount } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact', head: true })
      .eq('stripe_active', true);
    
    const totalVariants = totalCount || 0;
    const withStripeId = withStripeCount || 0;
    const activeStripe = activeCount || 0;
    
    // Test 5: Sample 10 products to check their readiness
    const { data: sampleProducts } = await supabase
      .from('product_variants')
      .select(`
        id,
        stripe_price_id,
        stripe_active,
        price,
        products (
          name,
          product_type
        )
      `)
      .limit(10);
    
    const sampleReadiness = sampleProducts?.map(p => ({
      name: p.products?.name,
      type: p.products?.product_type,
      hasStripePriceId: !!p.stripe_price_id,
      isActive: p.stripe_active,
      ready: !!(p.stripe_price_id && p.stripe_active && p.price > 0)
    }));
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      testProduct: {
        name: productWithStripe.products.name,
        variantId: productWithStripe.id,
        stripePriceId: productWithStripe.stripe_price_id,
        price: productWithStripe.price / 100 // Convert to dollars
      },
      checkoutReadiness: {
        canCheckout: allHaveStripePriceId,
        lineItems,
        checkoutData
      },
      databaseStatistics: {
        totalVariants,
        withStripePriceId: withStripeId,
        activeStripe,
        coveragePercentage: Math.round((withStripeId / totalVariants) * 100),
        readyForCheckout: activeStripe
      },
      sampleProducts: {
        total: sampleReadiness?.length || 0,
        ready: sampleReadiness?.filter(p => p.ready)?.length || 0,
        details: sampleReadiness
      },
      recommendations: {
        isReady: withStripeId === totalVariants,
        message: withStripeId === totalVariants 
          ? '✅ All products have Stripe price IDs and are ready for checkout!'
          : `⚠️ ${totalVariants - withStripeId} products still need Stripe price IDs`,
        nextSteps: withStripeId === totalVariants 
          ? ['System is ready for production checkout']
          : ['Complete Stripe price ID mapping for remaining products', 'Verify all price IDs exist in Stripe']
      }
    });
    
  } catch (error) {
    console.error('Final checkout test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}