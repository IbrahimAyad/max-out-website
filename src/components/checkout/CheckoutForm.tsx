"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { getStripe, createPaymentIntent } from "@/lib/api/stripeClient";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { adminClient } from "@/lib/api/adminClient";

interface CheckoutFormProps {
  amount: number;
  onComplete: (orderId: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

function CheckoutFormInner({ amount, onComplete, isProcessing, setIsProcessing }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { customer } = useAuth();
  const { items, clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(customer?.email || "");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create order first
      const orderData = {
        customerId: customer?.id,
        email,
        items,
        shippingInfo,
        total: amount,
      };

      const order = await adminClient.createOrder(orderData);

      // Confirm payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation?orderId=${order.id}`,
          receipt_email: email,
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else {
        clearCart();
        onComplete(order.id);
      }
    } catch (err) {
      setError("Failed to process order");

    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Checkout form">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        <label htmlFor="email" className="sr-only">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          aria-required="true"
          aria-label="Email address"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="sr-only">First name</label>
            <input
              id="firstName"
              type="text"
              value={shippingInfo.firstName}
              onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
              placeholder="First Name"
              aria-label="First name"
              aria-required="true"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="sr-only">Last name</label>
            <input
              id="lastName"
              type="text"
              value={shippingInfo.lastName}
              onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
              placeholder="Last Name"
              aria-label="Last name"
              aria-required="true"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
            />
          </div>
        </div>
        <input
          type="text"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
          placeholder="Address"
          required
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            value={shippingInfo.city}
            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
            placeholder="City"
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={shippingInfo.state}
              onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
              placeholder="State"
              required
              maxLength={2}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
            />
            <input
              type="text"
              value={shippingInfo.zipCode}
              onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
              placeholder="ZIP"
              required
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
            />
          </div>
        </div>
        <input
          type="tel"
          value={shippingInfo.phone}
          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
          placeholder="Phone Number"
          required
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Payment</h2>
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-3 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}

export function CheckoutForm(props: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    createPaymentIntent(props.amount).then(setClientSecret);
  }, [props.amount]);

  if (!clientSecret) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />;
  }

  return (
    <Elements stripe={getStripe()} options={{ clientSecret }}>
      <CheckoutFormInner {...props} />
    </Elements>
  );
}