'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, Mail, Calendar, ArrowRight, Star, Gift } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Get session ID from URL on client side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('session_id');
      setSessionId(id);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Simulate order details - in real app, fetch from API
      setTimeout(() => {
        setOrderDetails({
          id: 'ORDER-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          total: '$459.00',
          items: [
            { name: 'Premium Navy Suit', size: '40R', quantity: 1, price: '$299.00' },
            { name: 'Italian Silk Tie', size: 'OS', quantity: 2, price: '$80.00' }
          ],
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          email: 'customer@example.com'
        });
        setLoading(false);
      }, 1000);
    }
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-charcoal/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-charcoal/20 border-t-charcoal rounded-full animate-spin mx-auto mb-6" />
          <p className="text-xl text-gray-600 font-light">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-charcoal/5">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-charcoal">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          
          {orderDetails && (
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-sm text-gray-500">Order Number:</span>
              <span className="font-medium text-charcoal">{orderDetails.id}</span>
            </div>
          )}
        </motion.div>

        {/* Order Details */}
        {orderDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {/* Order Summary */}
            <Card className="p-8">
              <h2 className="text-2xl font-light mb-6 text-charcoal">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">Size: {item.size} • Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">{item.price}</div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-medium">
                  <span>Total</span>
                  <span>{orderDetails.total}</span>
                </div>
              </div>
            </Card>

            {/* Delivery Info */}
            <Card className="p-8">
              <h2 className="text-2xl font-light mb-6 text-charcoal">Delivery Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Free Standard Delivery</div>
                    <div className="text-sm text-gray-500">
                      Estimated delivery: {orderDetails.estimatedDelivery.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Order Confirmation</div>
                    <div className="text-sm text-gray-500">
                      Sent to {orderDetails.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Tracking Updates</div>
                    <div className="text-sm text-gray-500">
                      You'll receive tracking information soon
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-6"
        >
          <h2 className="text-2xl font-light mb-8 text-charcoal">What's Next?</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-medium mb-2">Order Confirmation</h3>
              <p className="text-sm text-gray-600">
                Check your email for order details and tracking information.
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">
                We'll prepare your items with care and attention to detail.
              </p>
            </Card>
            
            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium mb-2">Premium Delivery</h3>
              <p className="text-sm text-gray-600">
                Your order will arrive in premium packaging within 5-7 business days.
              </p>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button 
                size="lg" 
                className="bg-charcoal hover:bg-charcoal/90 text-white px-8 py-3"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/account">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white px-8 py-3"
              >
                View Account
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
