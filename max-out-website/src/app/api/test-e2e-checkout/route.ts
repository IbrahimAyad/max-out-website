export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function GET(request: NextRequest) {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };
    
    // Test 1: Fetch products from unified API
    const productsResponse = await fetch(`${request.nextUrl.origin}/api/products/unified?limit=5`);
    const productsData = await productsResponse.json();
    
    results.tests.push({
      name: 'Fetch Products',
      success: productsResponse.ok,
      details: {
        productCount: productsData.products?.length || 0,
        hasStripeData: productsData.products?.[0]?.stripePriceId ? true : false,
        firstProduct: productsData.products?.[0] ? {
          name: productsData.products[0].title,
          price: productsData.products[0].price,
          stripePriceId: productsData.products[0].stripePriceId
        } : null
      }
    });
    
    // Test 2: Simulate adding to cart
    const testProduct = productsData.products?.[0];
    if (testProduct) {
      const cartItem = {
        productId: testProduct.id,
        name: testProduct.title,
        price: parseFloat(testProduct.price) * 100, // Convert to cents
        quantity: 1,
        stripePriceId: testProduct.stripePriceId || testProduct.variants?.[0]?.stripe_price_id
      };
      
      results.tests.push({
        name: 'Cart Item Creation',
        success: !!cartItem.stripePriceId,
        details: cartItem
      });
      
      // Test 3: Create Stripe checkout session
      if (cartItem.stripePriceId) {
        try {
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              price: cartItem.stripePriceId,
              quantity: 1
            }],
            mode: 'payment',
            success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.nextUrl.origin}/cart`,
            metadata: {
              test: 'true',
              productId: cartItem.productId,
              productName: cartItem.name
            }
          });
          
          results.tests.push({
            name: 'Stripe Session Creation',
            success: true,
            details: {
              sessionId: session.id,
              url: session.url,
              amount: session.amount_total,
              currency: session.currency
            }
          });
        } catch (stripeError: any) {
          results.tests.push({
            name: 'Stripe Session Creation',
            success: false,
            error: stripeError.message,
            details: {
              type: stripeError.type,
              code: stripeError.code
            }
          });
        }
      }
    }
    
    // Test 4: Check database coverage
    const supabase = await createClient();
    
    const { data: variantStats } = await supabase
      .from('product_variants')
      .select('stripe_price_id, stripe_active')
      .limit(1000);
    
    const total = variantStats?.length || 0;
    const withStripePriceId = variantStats?.filter(v => v.stripe_price_id)?.length || 0;
    const activeStripe = variantStats?.filter(v => v.stripe_active)?.length || 0;
    
    results.tests.push({
      name: 'Database Coverage',
      success: withStripePriceId === total,
      details: {
        totalVariants: total,
        withStripePriceId,
        activeStripe,
        coverage: total > 0 ? `${Math.round((withStripePriceId / total) * 100)}%` : '0%'
      }
    });
    
    // Test 5: Verify Stripe prices exist
    if (testProduct?.stripePriceId) {
      try {
        const price = await stripe.prices.retrieve(testProduct.stripePriceId);
        results.tests.push({
          name: 'Stripe Price Verification',
          success: true,
          details: {
            priceId: price.id,
            amount: price.unit_amount,
            currency: price.currency,
            active: price.active
          }
        });
      } catch (error: any) {
        results.tests.push({
          name: 'Stripe Price Verification',
          success: false,
          error: error.message
        });
      }
    }
    
    // Summary
    const allSuccess = results.tests.every((t: any) => t.success);
    results.summary = {
      allTestsPassed: allSuccess,
      passedCount: results.tests.filter((t: any) => t.success).length,
      totalTests: results.tests.length,
      readyForProduction: allSuccess,
      recommendations: allSuccess ? 
        ['System is ready for checkout flow'] : 
        ['Fix failing tests before going to production', 'Ensure all products have Stripe price IDs']
    };
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('E2E test error:', error);
    return NextResponse.json({
      success: false,
      error: 'E2E test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}