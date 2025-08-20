import { NextResponse } from 'next/server';
import { stripeProducts } from '@/lib/services/stripeProductService';

export async function GET() {
  try {
    // For now, return the static product data
    // In production, you would fetch from Stripe API here

    return NextResponse.json({ 
      products: stripeProducts,
      message: 'Static product data. Implement Stripe API integration for dynamic data.'
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
}