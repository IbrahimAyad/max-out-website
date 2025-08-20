import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-10-28.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse request body
    const body = await req.json()
    const { 
      items, 
      customer_email, 
      user_id,
      cart_id,
      success_url,
      cancel_url,
      metadata = {}
    } = body

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: 'No items provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log(`Processing checkout with ${items.length} items`)

    // Process items and create Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    const processedItems: any[] = []
    let isBundle = false
    let bundleInfo = null

    for (const item of items) {
      // Determine if this is a core product (Stripe) or catalog product (Supabase)
      if (item.type === 'stripe' && item.stripe_price_id) {
        // Core product - use existing Stripe price ID
        lineItems.push({
          price: item.stripe_price_id,
          quantity: item.quantity,
        })

        processedItems.push({
          type: 'core',
          stripe_price_id: item.stripe_price_id,
          quantity: item.quantity,
          customization: item.customization || {},
        })

        // Check if it's a bundle
        if (item.stripe_price_id.includes('bundle') || item.stripe_price_id.includes('Bundle')) {
          isBundle = true
          bundleInfo = {
            bundle_type: item.bundle_type || 'custom',
            bundle_name: item.name || 'Bundle',
          }
        }
      } else if (item.type === 'catalog') {
        // Catalog product - create dynamic price
        const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
          currency: 'usd',
          unit_amount: Math.round(item.price * 100), // Convert to cents
          product_data: {
            name: item.name,
            description: item.sku || undefined,
            metadata: {
              variant_id: item.variant_id,
              product_id: item.product_id,
              sku: item.sku || '',
            },
          },
        }

        lineItems.push({
          price_data: priceData,
          quantity: item.quantity,
        })

        processedItems.push({
          type: 'catalog',
          variant_id: item.variant_id,
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          sku: item.sku,
          customization: item.customization || {},
        })
      } else {
        // Fallback for items without explicit type
        // Try to determine based on presence of stripe_price_id
        if (item.stripe_price_id) {
          lineItems.push({
            price: item.stripe_price_id,
            quantity: item.quantity,
          })
        } else {
          // Create dynamic price
          const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
            currency: 'usd',
            unit_amount: Math.round((item.price || 0) * 100),
            product_data: {
              name: item.name || 'Product',
              description: item.sku || undefined,
            },
          }

          lineItems.push({
            price_data: priceData,
            quantity: item.quantity || 1,
          })
        }

        processedItems.push(item)
      }
    }

    // Create session metadata
    const sessionMetadata: { [key: string]: string } = {
      ...metadata,
      cart_id: cart_id || '',
      user_id: user_id || '',
      source: metadata.source || 'website',
      items: JSON.stringify(processedItems), // Store items for webhook processing
      timestamp: new Date().toISOString(),
    }

    // Add bundle info if applicable
    if (isBundle && bundleInfo) {
      sessionMetadata.order_type = 'bundle'
      sessionMetadata.bundle_type = bundleInfo.bundle_type
      sessionMetadata.bundle_name = bundleInfo.bundle_name
    }

    // Create Stripe checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card', 'link'],
      line_items: lineItems,
      mode: 'payment',
      success_url: success_url || `${Deno.env.get('SITE_URL')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${Deno.env.get('SITE_URL')}/cart`,
      customer_email: customer_email || undefined,
      metadata: sessionMetadata,
      
      // Shipping configuration
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate: 'shr_1Rq49FCHc12x7sCzaNB3IohF', // Your existing shipping rate
        },
      ],
      
      // Tax configuration
      automatic_tax: {
        enabled: true,
      },
      
      // Allow promotion codes
      allow_promotion_codes: true,
      
      // Phone number collection
      phone_number_collection: {
        enabled: true,
      },
    }

    // Create the session
    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log(`Checkout session created: ${session.id}`)

    // If user is logged in, save the session to database for tracking
    if (user_id) {
      const { error: sessionError } = await supabase
        .from('checkout_sessions')
        .insert({
          session_id: session.id,
          user_id: user_id,
          cart_id: cart_id,
          status: 'pending',
          metadata: sessionMetadata,
          created_at: new Date().toISOString(),
        })

      if (sessionError) {
        console.error('Error saving checkout session:', sessionError)
        // Don't fail the checkout, just log the error
      }
    }

    // Return the session URL and ID
    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
        success: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Checkout error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}, { port: 8000 })