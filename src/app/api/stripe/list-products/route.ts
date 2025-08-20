import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    });

    // List all products with their prices
    const products = await stripe.products.list({
      limit: 100,
      expand: ['data.default_price']
    });

    // Get all prices for these products
    const prices = await stripe.prices.list({
      limit: 100,
      expand: ['data.product']
    });

    // Format the response
    const formattedProducts = products.data.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      active: product.active,
      metadata: product.metadata,
      prices: prices.data
        .filter(price => price.product === product.id)
        .map(price => ({
          id: price.id,
          nickname: price.nickname,
          unit_amount: price.unit_amount,
          currency: price.currency,
          type: price.type,
          active: price.active
        }))
    }));

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      totalProducts: products.data.length,
      totalPrices: prices.data.length
    });
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to list products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}