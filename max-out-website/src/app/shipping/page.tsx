'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, Clock, Package, Shield, Star, MapPin, Globe, Store } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Shipping Information</h1>
            <p className="text-xl text-gray-300 mb-6">
              Fast, secure delivery to get your perfect fit when you need it
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="py-16 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shipping Methods</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Standard Shipping */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Standard Shipping</h3>
                  <p className="text-gray-600 mb-3">Delivery in 5-7 business days</p>
                  <p className="text-lg font-semibold text-blue-600">Free on orders over $200</p>
                </div>
              </div>
            </Card>

            {/* Express Shipping */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Express Shipping</h3>
                  <p className="text-gray-600 mb-3">Delivery in 2-3 business days</p>
                  <p className="text-lg font-semibold text-blue-600">$15</p>
                </div>
              </div>
            </Card>

            {/* International Shipping */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">International Shipping</h3>
                  <p className="text-gray-600 mb-3">Delivery in 7-14 business days</p>
                  <p className="text-lg font-semibold text-blue-600">Calculated at checkout</p>
                </div>
              </div>
            </Card>

            {/* Store Pickup */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                  <Store className="h-6 w-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Store Pickup</h3>
                  <p className="text-gray-600 mb-3">Available within 24 hours</p>
                  <p className="text-lg font-semibold text-blue-600">Free</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Shipping Policy Details */}
          <Card className="p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8">Shipping Policy Details</h2>
            
            <div className="space-y-6 text-gray-700">
              <p className="text-lg">
                We strive to process and ship all orders within 1-2 business days. Once your order ships, you'll receive a 
                confirmation email with tracking information.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-bold text-lg mb-3">Processing Time</h4>
                  <ul className="space-y-2 text-sm">
                    <li>In-stock items: 1-2 business days</li>
                    <li>Made-to-order items: 2-3 weeks</li>
                    <li>Custom tailored items: 3-4 weeks</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-3">Delivery Areas</h4>
                  <p className="text-sm">
                    We currently ship to the United States, Canada, and select international destinations. 
                    For international orders, please note that customs duties and taxes may apply.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-3">Order Tracking</h4>
                  <p className="text-sm">
                    Once your order ships, you'll receive a confirmation email with tracking information. 
                    You can also track your order by logging into your account or contacting our customer service team.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Section */}
          <Card className="p-8 text-center bg-gray-50">
            <h2 className="text-3xl font-bold mb-4">Need Help with Shipping?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our team is here to assist you with any questions about shipping options, tracking, or delivery.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-gold hover:bg-gold/90 text-black font-medium px-8 py-3"
                onClick={() => window.location.href = 'mailto:KCTMenswear@gmail.com'}
              >
                <Package className="h-4 w-4 mr-2" />
                Email Us
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-3"
                onClick={() => window.location.href = 'tel:269-532-4852'}
              >
                <Truck className="h-4 w-4 mr-2" />
                Call (269) 532-4852
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}