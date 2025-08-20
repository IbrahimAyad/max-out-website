import { NextRequest, NextResponse } from 'next/server';
import { fetchProductsWithImages, getStripePriceId } from '@/lib/shared/supabase-products';

/**
 * Test API endpoint to verify the complete checkout flow
 * Tests: Supabase products → Cart items → Stripe checkout
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '5');


    // 1. Fetch products from Supabase
    const result = await fetchProductsWithImages({ limit, status: 'active' });
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch products');
    }

    const products = result.data;

    // 2. Test cart item creation and Stripe price ID resolution
    const testCartItems = [];
    const issues = [];

    for (const product of products) {

      // Test different sizes for suits
      const testSizes = product.category?.toLowerCase().includes('suit') 
        ? ['40R', '42R'] 
        : ['M', 'L'];

      for (const size of testSizes) {
        const stripePriceId = getStripePriceId(product, size);
        
        const cartItem = {
          productId: product.id,
          name: product.name,
          price: product.base_price,
          quantity: 1,
          size,
          image: product.images?.[0]?.url || null,
          category: product.category,
          stripePriceId,
          stripeProductId: product.metadata?.stripe_product_id,
          metadata: product.metadata,
        };

        testCartItems.push(cartItem);

        // Check for issues
        if (!stripePriceId) {
          issues.push({
            type: 'missing_stripe_price_id',
            product: product.name,
            productId: product.id,
            size,
            category: product.category,
            suggestion: product.category?.toLowerCase().includes('suit') 
              ? 'Run the Stripe setup script or add stripe_price_id to metadata'
              : 'Create Stripe products for this category first'
          });
        }

      }
    }

    // 3. Test checkout session creation (simulation)
    const checkoutReadyItems = testCartItems.filter(item => item.stripePriceId);
    const checkoutFailItems = testCartItems.filter(item => !item.stripePriceId);

    // 4. Generate comprehensive report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_products_tested: products.length,
        total_cart_items_generated: testCartItems.length,
        checkout_ready_items: checkoutReadyItems.length,
        items_with_issues: checkoutFailItems.length,
        checkout_success_rate: `${Math.round((checkoutReadyItems.length / testCartItems.length) * 100)}%`
      },
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        has_stripe_integration: !!getStripePriceId(p),
        stripe_price_id: getStripePriceId(p),
        variants_count: p.variants?.length || 0,
        images_count: p.images?.length || 0,
      })),
      checkout_ready_items: checkoutReadyItems.slice(0, 10), // Limit for readability
      issues,
      recommendations: [
        issues.length > 0 ? "Run the Stripe setup script: `npm run setup-stripe-integration`" : null,
        checkoutFailItems.length > 0 ? "Create Stripe products for non-suit categories" : null,
        "Test the complete flow by adding items to cart and proceeding to checkout",
        "Verify webhook handling for successful payments"
      ].filter(Boolean),
      next_steps: {
        if_all_green: "✅ Checkout flow is ready! Test with real cart operations.",
        if_issues_found: "❌ Fix the issues above before enabling checkout for affected products.",
        test_real_checkout: "Add a product to cart and test the complete flow at /checkout"
      }
    };

    return NextResponse.json(report);

  } catch (error) {
    console.error('❌ Checkout flow test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Checkout flow test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Check Supabase connection and credentials',
        'Verify products table exists and has data',
        'Run the database migration if needed',
        'Check server logs for detailed error information'
      ]
    }, { status: 500 });
  }
}