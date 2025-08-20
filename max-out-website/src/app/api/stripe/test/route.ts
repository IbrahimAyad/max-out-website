import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  try {
    const hasKey = !!process.env.STRIPE_SECRET_KEY;
    const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 7);
    
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        status: 'error',
        message: 'Stripe secret key not configured',
        hasKey: false
      });
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    });
    
    // Try to list products to verify connection
    const products = await stripe.products.list({ limit: 1 });
    
    return NextResponse.json({
      status: 'success',
      message: 'Stripe configuration is working',
      hasKey,
      keyPrefix,
      productsFound: products.data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Stripe test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}