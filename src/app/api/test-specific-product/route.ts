import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available (not during build)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
}) : null;

export async function GET(request: NextRequest) {
  try {
    // Check if Stripe is available (prevents build errors)
    if (!stripe) {
      return NextResponse.json({
        success: false,
        error: 'Payment processing is not available',
        message: 'Stripe not configured for testing'
      }, { status: 503 });
    }

    const supabase = await createClient();
    
    // Test with the specific products from the guide
    const testProductIds = [
      'a9e4bbba-7128-4f45-9258-9b0d9465123b', // Velvet Blazer - $289.99
      '754192d7-e19e-475b-9b64-0463d31c4cad', // Tuxedo - $315.00
      'a31c629f-c935-4f17-9a05-53812d8af29d', // Vest Set - $65.00
    ];
    
    // Fetch these specific products
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants!inner(
          id,
          stripe_price_id,
          stripe_active,
          price,
          inventory_quantity
        )
      `)
      .in('id', testProductIds);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Test creating checkout sessions for each
    const results = [];
    
    for (const product of products || []) {
      const variant = product.product_variants?.[0];
      
      if (variant?.stripe_price_id) {
        try {
          // Create a test checkout session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              price: variant.stripe_price_id,
              quantity: 1
            }],
            mode: 'payment',
            success_url: `${request.nextUrl.origin}/checkout/success`,
            cancel_url: `${request.nextUrl.origin}/cart`,
            metadata: {
              test: 'true',
              productId: product.id,
              productName: product.name
            }
          });
          
          results.push({
            productId: product.id,
            productName: product.name,
            variantId: variant.id,
            stripePriceId: variant.stripe_price_id,
            price: variant.price / 100,
            checkoutSuccess: true,
            checkoutUrl: session.url,
            sessionId: session.id
          });
        } catch (stripeError: any) {
          results.push({
            productId: product.id,
            productName: product.name,
            variantId: variant.id,
            stripePriceId: variant.stripe_price_id,
            price: variant.price / 100,
            checkoutSuccess: false,
            error: stripeError.message
          });
        }
      } else {
        results.push({
          productId: product.id,
          productName: product.name,
          checkoutSuccess: false,
          error: 'No Stripe price ID found'
        });
      }
    }
    
    // Get overall statistics
    const { count: totalCount } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact', head: true });
    
    const { count: withStripeCount } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact', head: true })
      .not('stripe_price_id', 'is', null)
      .not('stripe_price_id', 'eq', '');
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      testProducts: results,
      statistics: {
        totalVariants: totalCount,
        withStripePriceId: withStripeCount,
        coverage: `${Math.round((withStripeCount! / totalCount!) * 100)}%`
      },
      summary: {
        message: withStripeCount === totalCount 
          ? '✅ ALL products are ready for checkout!' 
          : `⚠️ ${totalCount! - withStripeCount!} products still need Stripe IDs`,
        readyForProduction: withStripeCount === totalCount
      }
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}