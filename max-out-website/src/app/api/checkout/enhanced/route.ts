// Temporary checkout for enhanced products using price_data
// This allows immediate sales while Stripe tier products are being set up

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Price tier definitions (will become Stripe products later)
const PRICE_TIERS = {
  'TIER_1': { min: 5000, max: 7499, name: 'Value' },
  'TIER_2': { min: 7500, max: 9999, name: 'Value Plus' },
  'TIER_3': { min: 10000, max: 12499, name: 'Standard' },
  'TIER_4': { min: 12500, max: 14999, name: 'Standard Plus' },
  'TIER_5': { min: 15000, max: 19999, name: 'Professional' },
  'TIER_6': { min: 20000, max: 24999, name: 'Professional Plus' },
  'TIER_7': { min: 25000, max: 29999, name: 'Premium' },
  'TIER_8': { min: 30000, max: 39999, name: 'Premium Plus' },
  'TIER_9': { min: 40000, max: 49999, name: 'Executive' },
  'TIER_10': { min: 50000, max: 59999, name: 'Executive Plus' },
  'TIER_11': { min: 60000, max: 74999, name: 'Luxury' },
  'TIER_12': { min: 75000, max: 99999, name: 'Luxury Plus' },
  'TIER_13': { min: 100000, max: 124999, name: 'Elite' },
  'TIER_14': { min: 125000, max: 149999, name: 'Elite Plus' },
  'TIER_15': { min: 150000, max: 199999, name: 'Prestige' },
  'TIER_16': { min: 200000, max: 249999, name: 'Prestige Plus' },
  'TIER_17': { min: 250000, max: 299999, name: 'Signature' },
  'TIER_18': { min: 300000, max: 399999, name: 'Signature Plus' },
  'TIER_19': { min: 400000, max: 499999, name: 'Couture' },
  'TIER_20': { min: 500000, max: Infinity, name: 'Haute Couture' }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1, size, successUrl, cancelUrl } = body;


    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch the enhanced product
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    const { data: product, error } = await supabase
      .from('products_enhanced')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Database error fetching product:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    if (!product) {
      console.error('Product not found with ID:', productId);
      return NextResponse.json(
        { error: `Product not found with ID: ${productId}` },
        { status: 404 }
      );
    }

    // Get the primary image URL
    const imageUrl = product.images?.hero?.url || 
                    product.images?.primary?.url || 
                    'https://cdn.kctmenswear.com/placeholder.jpg';

    // Get tier information
    const tierInfo = PRICE_TIERS[product.price_tier as keyof typeof PRICE_TIERS] || 
                    { name: 'Standard' };

    // Create Stripe checkout session with dynamic pricing
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description || `Premium ${product.category} from KCT Menswear`,
              images: [imageUrl],
              metadata: {
                product_id: product.id,
                sku: product.sku,
                handle: product.handle,
                price_tier: product.price_tier,
                tier_name: tierInfo.name,
                category: product.category,
                subcategory: product.subcategory || '',
                size: size || 'Not specified',
                season: product.season || '',
                collection: product.collection || ''
              }
            },
            unit_amount: product.base_price, // Price in cents
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/products/${product.slug}`,
      metadata: {
        product_id: product.id,
        product_name: product.name,
        product_sku: product.sku,
        price_tier: product.price_tier,
        size: size || 'Not specified',
        source: 'enhanced_products',
        temporary_checkout: 'true' // Flag to identify these are using price_data
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      phone_number_collection: {
        enabled: true,
      },
      // Add customer email collection
      customer_email: body.customerEmail || undefined,
      // Enable automatic tax calculation
      automatic_tax: {
        enabled: true,
      },
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    // Return the checkout session URL
    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
      product: {
        name: product.name,
        price: product.base_price / 100, // Convert to dollars for display
        tier: product.price_tier,
        image: imageUrl
      }
    });

  } catch (error) {
    console.error('Checkout error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// GET endpoint to check product availability before checkout
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    const { data: product, error } = await supabase
      .from('products_enhanced')
      .select('id, name, base_price, price_tier, status, inventory')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is active and in stock
    const isAvailable = product.status === 'active';
    const stock = product.inventory?.available_stock || 0;

    return NextResponse.json({
      available: isAvailable,
      inStock: stock > 0,
      product: {
        id: product.id,
        name: product.name,
        price: product.base_price / 100,
        tier: product.price_tier,
        stock: stock
      }
    });

  } catch (error) {
    console.error('Product check error:', error);
    return NextResponse.json(
      { error: 'Failed to check product availability' },
      { status: 500 }
    );
  }
}