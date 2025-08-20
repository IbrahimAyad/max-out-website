/**
 * API Route: MiniMax Checkout
 * Handles checkout processing through MiniMax admin backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { processCheckout } from '@/lib/minimax/checkout';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.items || !body.customer || !body.shipping) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process checkout through MiniMax
    const result = await processCheckout(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { 
        error: 'Checkout failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}