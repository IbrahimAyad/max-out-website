import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

// Initialize Stripe only if the secret key is available (not during build)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
}) : null;

interface CartItem {
  id: string;
  name: string;
  price: number; // Price in cents
  quantity: number;
  image?: string;
  selectedSize?: string;
  stripePriceId?: string; // Legacy products have this
  enhanced?: boolean; // Flag for enhanced products
  category?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is available (prevents build errors)
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not available' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { items, customerEmail, successUrl, cancelUrl } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Separate legacy and enhanced products
    const legacyItems = items.filter((item: CartItem) => !item.enhanced && item.stripePriceId);
    const enhancedItems = items.filter((item: CartItem) => item.enhanced || !item.stripePriceId);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Process legacy items (have Stripe price IDs)
    for (const item of legacyItems) {
      lineItems.push({
        price: item.stripePriceId!,
        quantity: item.quantity,
      });
    }

    // Process enhanced items (use price_data)
    if (enhancedItems.length > 0) {
      const supabase = await createClient();
      
      for (const item of enhancedItems) {
        // Extract the actual ID from enhanced_[id] format
        const productId = item.id.startsWith('enhanced_') 
          ? item.id.replace('enhanced_', '')
          : item.id;

        // Fetch enhanced product details if needed
        let productData = null;
        if (item.enhanced) {
          const { data: product } = await supabase
            .from('products_enhanced')
            .select('*')
            .eq('id', productId)
            .single();
          
          productData = product;
        }

        // Use fetched data or fallback to item data
        const productName = productData?.name || item.name;
        const productImage = productData?.images?.primary?.url || 
                           productData?.images?.hero?.url || 
                           item.image || 
                           'https://cdn.kctmenswear.com/placeholder.jpg';
        const productPrice = productData?.base_price || item.price;

        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: item.selectedSize ? `Size: ${item.selectedSize}` : undefined,
              images: [productImage],
              metadata: {
                product_id: productId,
                size: item.selectedSize || 'N/A',
                category: item.category || 'general',
                enhanced: 'true'
              }
            },
            unit_amount: productPrice, // Price in cents
          },
          quantity: item.quantity,
        });
      }
    }

    // Calculate totals for metadata
    const subtotal = items.reduce((sum: number, item: CartItem) => 
      sum + (item.price * item.quantity), 0
    );

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/cart`,
      customer_email: customerEmail || undefined,
      metadata: {
        order_type: 'unified',
        legacy_items: legacyItems.length.toString(),
        enhanced_items: enhancedItems.length.toString(),
        total_items: items.length.toString(),
        subtotal: (subtotal / 100).toFixed(2),
        timestamp: new Date().toISOString(),
        // Store simplified item data
        items_summary: JSON.stringify(items.map((item: CartItem) => ({
          id: item.id,
          name: item.name.substring(0, 30),
          qty: item.quantity,
          size: item.selectedSize || 'N/A',
          type: item.enhanced ? 'enhanced' : 'legacy'
        }))).substring(0, 450) // Keep under 500 char limit
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'usd',
            },
            display_name: 'Express shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 2,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
      allow_promotion_codes: true,
      // Enable saved payment methods for returning customers
      payment_intent_data: {
        setup_future_usage: 'off_session',
      },
      // Custom fields for additional info
      custom_fields: [
        {
          key: 'gift_message',
          label: {
            type: 'custom',
            custom: 'Gift Message (Optional)',
          },
          type: 'text',
          optional: true,
        },
      ],
      // Billing address collection for better fraud prevention
      billing_address_collection: 'required',
    });


    // Return the checkout session URL
    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      summary: {
        totalItems: items.length,
        subtotal: subtotal / 100,
        legacyProducts: legacyItems.length,
        enhancedProducts: enhancedItems.length
      }
    });

  } catch (error) {
    console.error('Unified checkout error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}

// Express checkout endpoint for single products
export async function PUT(request: NextRequest) {
  try {
    // Check if Stripe is available (prevents build errors)
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not available' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { productId, quantity = 1, size, enhanced = false } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;
    let productName = 'Product';
    let productImage = 'https://cdn.kctmenswear.com/placeholder.jpg';

    if (enhanced) {
      // Fetch enhanced product for express checkout
      const supabase = await createClient();
      const actualId = productId.replace('enhanced_', '');
      
      const { data: product, error } = await supabase
        .from('products_enhanced')
        .select('*')
        .eq('id', actualId)
        .single();

      if (error || !product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      productName = product.name;
      productImage = product.images?.primary?.url || product.images?.hero?.url || productImage;

      lineItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: `Express checkout${size ? ` - Size: ${size}` : ''}`,
            images: [productImage],
            metadata: {
              product_id: actualId,
              size: size || 'N/A',
              express_checkout: 'true',
              enhanced: 'true'
            }
          },
          unit_amount: product.base_price,
        },
        quantity: quantity,
      };
    } else {
      // For legacy products, we need the Stripe price ID
      // This would come from your product data
      return NextResponse.json(
        { error: 'Legacy express checkout requires Stripe price ID' },
        { status: 400 }
      );
    }

    // Create express checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'link'],
      line_items: [lineItem],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&express=true`,
      cancel_url: `${request.nextUrl.origin}/products/${productId}`,
      metadata: {
        order_type: 'express',
        product_id: productId,
        product_name: productName,
        size: size || 'N/A',
        quantity: quantity.toString(),
        enhanced: enhanced.toString()
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
      billing_address_collection: 'required',
    });


    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      express: true
    });

  } catch (error) {
    console.error('Express checkout error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Payment error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create express checkout. Please try again.' },
      { status: 500 }
    );
  }
}