import { loadStripe, Stripe, StripeElements } from "@stripe/stripe-js";
import { PaymentIntentRequest, PaymentIntentResponse } from "@/lib/types";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export async function createPaymentIntent(
  amount: number, 
  metadata?: Record<string, any>
): Promise<string> {
  try {
    const response = await fetch("/api/checkout/payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {

    throw error;
  }
}

export async function confirmPayment(
  clientSecret: string, 
  elements: StripeElements
): Promise<void> {
  const stripe = await getStripe();
  if (!stripe) throw new Error("Stripe not initialized");

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/checkout/confirmation`,
    },
  });

  if (error) {
    throw error;
  }
}