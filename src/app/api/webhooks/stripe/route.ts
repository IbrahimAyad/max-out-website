import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { APIResponse, StripeWebhookPayload } from '@/lib/types/api';

// Disable body parsing, we need the raw body for webhook signature verification
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {

  // Initialize Stripe inside the function to ensure env vars are available
  if (!process.env.STRIPE_SECRET_KEY) {

    const errorResponse: APIResponse = {
      success: false,
      error: 'Webhook configuration error',
      timestamp: new Date().toISOString()
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {

    const errorResponse: APIResponse = {
      success: false,
      error: 'Webhook secret not configured',
      timestamp: new Date().toISOString()
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-10-28.acacia',
  });

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    const errorResponse: APIResponse = {
      success: false,
      error: 'Missing stripe-signature header',
      timestamp: new Date().toISOString()
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {

    const errorResponse: APIResponse = {
      success: false,
      error: 'Invalid signature',
      timestamp: new Date().toISOString()
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        // Parse order details from metadata
        const orderDetails = session.metadata?.order_details 
          ? JSON.parse(session.metadata.order_details) 
          : [];

        // Log the order for now (replace with Supabase save)

        // TODO: Save to Supabase
        // const { error } = await supabase.from('orders').insert({
        //   stripe_session_id: session.id,
        //   stripe_payment_intent: session.payment_intent,
        //   customer_email: session.customer_email,
        //   customer_name: session.customer_details?.name,
        //   customer_phone: session.customer_details?.phone,
        //   shipping_address: session.shipping_details?.address,
        //   items: orderDetails,
        //   subtotal: (session.amount_subtotal || 0) / 100,
        //   tax: (session.total_details?.amount_tax || 0) / 100,
        //   total: (session.amount_total || 0) / 100,
        //   status: 'paid',
        //   created_at: new Date().toISOString(),
        // });

        // TODO: Send confirmation email
        // await sendOrderConfirmation(session, orderDetails);

      } catch (error) {

        // Don't return error to Stripe, log it instead
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;

      // TODO: Update order status in database
      break;
    }

    case 'refund.created': {
      const refund = event.data.object as Stripe.Refund;

      break;
    }

    case 'refund.updated': {
      const refund = event.data.object as Stripe.Refund;

      break;
    }

    case 'charge.updated': {
      const charge = event.data.object as Stripe.Charge;

      if (charge.refunded) {

      }
      break;
    }

    default:

  }

  const response: APIResponse<{ received: boolean }> = {
    success: true,
    data: { received: true },
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(response);
}