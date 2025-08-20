import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Disable body parsing, we need the raw body for signature verification
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {

  let body: string;
  let event: Stripe.Event;

  try {
    // Get raw body as string for signature verification
    body = await req.text();

  } catch (error) {

    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const sig = req.headers.get('stripe-signature');

  if (!sig) {

    return NextResponse.json(
      { error: 'No stripe-signature header' },
      { status: 400 }
    );
  }

  // Check environment variables
  if (!process.env.STRIPE_WEBHOOK_SECRET) {

    return NextResponse.json(
      { error: 'Webhook endpoint not configured on server' },
      { status: 500 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {

    return NextResponse.json(
      { error: 'Stripe not configured on server' },
      { status: 500 }
    );
  }

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-10-28.acacia',
  });

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err: any) {

    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extract order details from metadata
        const orderDetails = session.metadata?.order_details ? 
          JSON.parse(session.metadata.order_details) : null;

        if (orderDetails) {

        }

        if (session.shipping_details) {

        }

        // TODO: Save order to your database
        // TODO: Send confirmation email
        // TODO: Update inventory

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

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;

        break;
      }

      case 'customer.created': {
        const customer = event.data.object as Stripe.Customer;

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;

        // TODO: Update order status in database
        // TODO: Send refund notification email
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

    // Return success response
    return NextResponse.json(
      { received: true, eventId: event.id },
      { status: 200 }
    );
  } catch (error) {

    // Still return 200 to acknowledge receipt
    return NextResponse.json(
      { received: true, error: 'Processing error but acknowledged' },
      { status: 200 }
    );
  }
}