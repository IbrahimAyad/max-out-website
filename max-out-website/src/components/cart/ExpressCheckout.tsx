'use client';

import { useEffect, useState } from 'react';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';

interface ExpressCheckoutProps {
  amount: number;
  onSuccess: () => void;
}

export function ExpressCheckout({ amount, onSuccess }: ExpressCheckoutProps) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);

  useEffect(() => {
    if (!stripe || amount <= 0) return;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'KCT Menswear',
        amount: amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestShipping: true,
      shippingOptions: [
        {
          id: 'standard',
          label: 'Standard Shipping',
          detail: '2-5 business days',
          amount: amount >= 50000 ? 0 : 1500,
        },
        {
          id: 'express',
          label: 'Express Shipping',
          detail: '1-2 business days',
          amount: 2500,
        },
      ],
    });

    // Check if Apple Pay / Google Pay is available
    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr);
        setCanMakePayment(true);
      }
    });

    // Handle payment
    pr.on('paymentmethod', async (event) => {
      // In production, you would create payment intent on backend
      // For now, we'll just trigger the regular checkout
      event.complete('success');
      onSuccess();
    });

    pr.on('shippingaddresschange', async (event) => {
      // Update shipping based on address
      event.updateWith({ status: 'success' });
    });

    pr.on('shippingoptionchange', async (event) => {
      // Update total based on shipping option
      const shippingAmount = event.shippingOption.amount;
      event.updateWith({
        status: 'success',
        total: {
          label: 'KCT Menswear',
          amount: amount + shippingAmount,
        },
      });
    });
  }, [stripe, amount, onSuccess]);

  if (!canMakePayment || !paymentRequest) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Express checkout</span>
        </div>
      </div>
      <div className="mt-4">
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      </div>
    </div>
  );
}