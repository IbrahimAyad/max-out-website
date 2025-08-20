import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterWelcome } from '@/lib/sendgrid';

// Simple in-memory store for demo. In production, use a database
const subscribedEmails = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if already subscribed (in production, check database)
    if (subscribedEmails.has(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 409 }
      );
    }

    // Add to subscribers (in production, save to database)
    subscribedEmails.add(email.toLowerCase());

    // Send welcome email
    try {
      await sendNewsletterWelcome(email);
    } catch (emailError) {

      // Don't fail the subscription if email fails
    }

    // In production, you would also:
    // 1. Save to your database
    // 2. Add to your email marketing platform (Mailchimp, Klaviyo, etc.)
    // 3. Set up proper unsubscribe handling

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed to newsletter!',
        email: email 
      },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint to check subscription status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  const isSubscribed = subscribedEmails.has(email.toLowerCase());

  return NextResponse.json({
    email,
    subscribed: isSubscribed
  });
}