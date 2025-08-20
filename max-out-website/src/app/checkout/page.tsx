"use client";

import { useState } from "react";
import { useCart } from "@/lib/hooks/useCart";
import { useProductStore } from "@/lib/store/productStore";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, Star, Lock, Clock, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from 'framer-motion';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CheckoutPage() {
  const { items, cartSummary } = useCart();
  const { products } = useProductStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const cartItemsWithProducts = items.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          customerEmail: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { sessionId, url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback to client-side redirect
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {

            alert('Unable to redirect to checkout. Please try again.');
          }
        }
      }
    } catch (error) {

      alert('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const shipping = cartSummary.totalPrice >= 50000 ? 0 : 1500;
  const total = cartSummary.totalPrice + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-charcoal/5">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gold/10 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/cart" className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Cart
            </Link>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-green-600">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">256-bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-medium">PCI Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 text-gold mb-4">
            <div className="h-px w-16 bg-gold"></div>
            <span className="text-sm font-medium tracking-[0.2em] uppercase">Secure Checkout</span>
            <div className="h-px w-16 bg-gold"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-charcoal">
            Complete Your <span className="italic font-serif">Order</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
            You're just moments away from receiving your premium menswear
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-12">
                <div className="flex items-center space-x-8">
                  {[
                    { number: 1, title: "Contact", completed: !!formData.email },
                    { number: 2, title: "Shipping", completed: !!formData.address },
                    { number: 3, title: "Payment", completed: false }
                  ].map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                        step.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-charcoal text-white'
                      }`}>
                        {step.completed ? <CheckCircle className="w-5 h-5" /> : step.number}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">{step.title}</span>
                      {index < 2 && <div className="w-16 h-px bg-gray-300 ml-4" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <h2 className="text-2xl font-light text-charcoal">Contact Information</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-charcoal transition-all duration-200 bg-white shadow-sm text-lg"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-charcoal transition-all duration-200 bg-white shadow-sm text-lg"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-charcoal transition-all duration-200 bg-white shadow-sm text-lg"
                          placeholder="Smith"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Shipping Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <h2 className="text-2xl font-light text-charcoal">Shipping Address</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Street Address</label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-charcoal transition-all duration-200 bg-white shadow-sm text-lg"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">City</label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-charcoal transition-all duration-200 bg-white shadow-sm text-lg"
                          placeholder="Detroit"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">State</label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-charcoal transition-all duration-200 bg-white shadow-sm text-lg"
                          placeholder="MI"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          required
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-charcoal transition-all duration-200 bg-white shadow-sm text-lg"
                          placeholder="48201"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-charcoal focus:border-charcoal transition-all duration-200 bg-white shadow-sm text-lg"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <h2 className="text-2xl font-light text-charcoal">Payment Method</h2>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-sm p-8 text-center border border-green-200">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-green-800 mb-3">
                      Secure Payment by Stripe
                    </h3>
                    <p className="text-green-700 mb-6">
                      Your payment information is encrypted and secure with industry-leading protection
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-green-600">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>PCI Compliant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        <span>Trusted Worldwide</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </form>
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 border-0 shadow-xl sticky top-32 bg-gradient-to-br from-white to-gray-50 rounded-sm">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-6 w-6 text-charcoal" />
                  </div>
                  <h2 className="text-2xl font-light text-charcoal mb-2">Order Summary</h2>
                  <p className="text-sm text-gray-600">Final review before payment</p>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-8 max-h-80 overflow-y-auto">
                  {cartItemsWithProducts.map((item) => {
                    if (!item.product) return null;

                    return (
                      <div key={`${item.productId}-${item.size}`} className="flex gap-4 p-4 bg-white rounded-sm border border-gray-100 hover:border-gold/30 transition-colors shadow-sm">
                        <div className="relative w-16 h-20 bg-gray-100 rounded-sm overflow-hidden shadow-sm">
                          {item.product.images[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-charcoal text-sm">{item.product.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Size {item.size} • Qty {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-charcoal mt-2">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 border-t border-gold/20 pt-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(cartSummary.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Shipping
                    </span>
                    <span className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}>
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <div className="text-xs text-green-600 text-right flex items-center justify-end gap-1">
                      <Gift className="h-3 w-3" />
                      You saved {formatPrice(1500)}!
                    </div>
                  )}
                  <div className="flex justify-between text-2xl font-medium border-t border-gold/20 pt-4">
                    <span className="text-charcoal">Total</span>
                    <span className="text-charcoal">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full mt-8 py-4 bg-gradient-to-r from-charcoal to-charcoal/90 hover:from-charcoal/90 hover:to-charcoal text-white text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border-0 rounded-sm"
                  onClick={handleSubmit}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Complete Order - {formatPrice(total)}
                    </div>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="mt-6 p-4 bg-gray-50 rounded-sm">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Shield className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">Secure</span>
                    </div>
                    <div>
                      <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">Fast</span>
                    </div>
                    <div>
                      <Star className="h-5 w-5 text-gold mx-auto mb-1" />
                      <span className="text-xs text-gray-600">Premium</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}