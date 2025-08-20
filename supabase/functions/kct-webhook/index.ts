import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

// Make sure CORS headers are set for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Helper function to generate SKU
function generateSKU(item: any): string {
  const parts = ['KCT']
  
  // Add category
  if (item.category) {
    parts.push(item.category.toUpperCase())
  }
  
  // Add color
  if (item.color) {
    parts.push(item.color.replace(/\s+/g, '').toUpperCase())
  }
  
  // Add type/style/fit
  if (item.metadata?.type) {
    parts.push(item.metadata.type.replace(/\s+/g, '').toUpperCase())
  } else if (item.metadata?.style) {
    parts.push(item.metadata.style.toUpperCase())
  } else if (item.metadata?.fit) {
    parts.push(item.metadata.fit.toUpperCase())
  }
  
  // Add size
  if (item.size) {
    parts.push(item.size.toUpperCase())
  }
  
  return parts.join('-')
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

    // Get the Stripe signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      console.error('Missing stripe-signature header')
      return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-10-28.acacia',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

    // Get the raw body for signature verification
    const body = await req.text()
    
    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('Webhook received:', event.type)

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Processing checkout session:', session.id)

        // Create or update customer
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .upsert({
            email: session.customer_email || session.customer_details?.email,
            stripe_customer_id: session.customer as string,
            name: session.customer_details?.name,
            phone: session.customer_details?.phone,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'email',
          })
          .select()
          .single()

        if (customerError) {
          console.error('Error creating customer:', customerError)
          throw customerError
        }

        // Generate order number
        const orderNumber = `KCT-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`

        // Parse metadata to get bundle info and items
        const metadata = session.metadata || {}
        const bundleInfo = metadata.order_type === 'bundle' ? {
          is_bundle: true,
          bundle_type: metadata.bundle_type,
          bundle_name: metadata.bundle_name || metadata.bundle_type,
          bundle_discount: parseFloat(metadata.bundle_discount || '0'),
        } : null

        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            customer_id: customer.id,
            customer_email: session.customer_email || session.customer_details?.email,
            customer_name: session.customer_details?.name,
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            amount_total: (session.amount_total || 0) / 100, // Convert from cents
            amount_subtotal: (session.amount_subtotal || 0) / 100,
            discount: bundleInfo ? bundleInfo.bundle_discount : 0,
            tax: 0, // Tax calculation would go here
            shipping: 0, // Shipping calculation would go here
            currency: session.currency?.toUpperCase() || 'USD',
            status: 'pending',
            shipping_address: session.shipping_details?.address || session.customer_details?.address,
            billing_address: session.customer_details?.address,
            metadata: {
              source: 'website',
              stripe_metadata: metadata,
            },
            bundle_info: bundleInfo,
          })
          .select()
          .single()

        if (orderError) {
          console.error('Error creating order:', orderError)
          throw orderError
        }

        // Parse and create order items
        if (metadata.items) {
          try {
            const items = JSON.parse(metadata.items)
            
            for (const item of items) {
              const orderItem = {
                order_id: order.id,
                type: item.category || 'product',
                product_id: item.id,
                stripe_product_id: item.stripeProductId,
                stripe_price_id: item.stripePriceId,
                product_name: item.name,
                product_image: item.image,
                sku: generateSKU(item),
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity,
                attributes: {
                  color: item.color,
                  size: item.size,
                  style: item.metadata?.style,
                  fit: item.metadata?.fit,
                  type: item.metadata?.type,
                },
                bundle_contents: item.bundleItems || null,
              }

              const { error: itemError } = await supabase
                .from('order_items')
                .insert(orderItem)

              if (itemError) {
                console.error('Error creating order item:', itemError)
              }
            }
          } catch (parseError) {
            console.error('Error parsing items metadata:', parseError)
          }
        }

        // Trigger order confirmation email
        try {
          const emailResponse = await fetch(`${Deno.env.get('SITE_URL')}/api/email/order-confirmation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-webhook-secret': Deno.env.get('INTERNAL_WEBHOOK_SECRET') || '',
            },
            body: JSON.stringify({ orderId: order.id }),
          })

          if (!emailResponse.ok) {
            console.error('Failed to trigger order confirmation email')
          }
        } catch (emailError) {
          console.error('Error sending order confirmation:', emailError)
        }

        console.log('Order created:', order.order_number)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)

        // Update order status
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating order:', updateError)
          throw updateError
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment failed:', paymentIntent.id)

        // Update order status
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating order:', updateError)
          throw updateError
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Webhook processing failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}, { port: 8000 })