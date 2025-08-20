'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Package, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  Mail,
  Phone,
  MessageCircle,
  Headphones,
  Truck,
  RotateCcw,
  AlertTriangle,
  MapPin
} from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Returns & Exchanges</h1>
            <p className="text-xl text-gray-300 mb-6">
              With over 40 years of amazing customer service, we're committed to ensuring your complete satisfaction.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Features */}
      <section className="py-16 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-white p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Money-Back Guarantee</h3>
              <p className="text-sm text-gray-600">Return eligible items for a full refund within 10 days of delivery</p>
            </Card>

            <Card className="bg-white p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Sizing Help</h3>
              <p className="text-sm text-gray-600">Contact us before or after ordering for sizing assistance</p>
            </Card>

            <Card className="bg-white p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Contact us anytime for return assistance</p>
            </Card>

            <Card className="bg-white p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Process</h3>
              <p className="text-sm text-gray-600">Simple email-based return initiation</p>
            </Card>
          </div>

          {/* Return Policy Details */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Return Policy</h2>
            
            {/* Eligibility Requirements */}
            <Card className="p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6">Eligibility Requirements</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>Items must be unused and in the same condition as received</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>Original packaging and tags must be included</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>No deodorant stains, sweat stains, make-up stains, or animal hair</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>No cologne, body odor, or smoke smell</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                  <span>Item must be resellable as new</span>
                </div>
              </div>
            </Card>

            {/* Return & Exchange Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="text-xl font-bold mb-4 text-blue-900">Refund Timeline</h4>
                <p className="text-blue-800">Items being returned for a refund must be returned within 10 days of delivery. Items cannot have been worn!</p>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <h4 className="text-xl font-bold mb-4 text-green-900">Exchange Timeline</h4>
                <p className="text-green-800">Items being returned for an exchange must be returned within 30 days of delivery.</p>
              </Card>
            </div>

            {/* Important Note */}
            <Card className="p-6 bg-amber-50 border-amber-200 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Important Note</h4>
                  <p className="text-amber-800">Items returned used, not in the same condition, or without original packaging may be subject to a 50% restocking fee or rejected.</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Product Guidelines */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Product Guidelines</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Shirts */}
              <Card className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-gold" />
                  Shirts
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Must be returned in original packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Repackaged items accepted without fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Balled-up returns may incur restocking fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Missing packaging/tags: 50% restocking fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>No packaging: Return rejected</span>
                  </li>
                </ul>
              </Card>

              {/* Shoes */}
              <Card className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-gold" />
                  Shoes
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Must be in original condition and packaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>No signs of wear or use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>No walking creases or dirt on soles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Damaged box: 50% restocking fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>May be rejected if improperly packaged</span>
                  </li>
                </ul>
              </Card>

              {/* Tuxedos/Suits */}
              <Card className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-gold" />
                  Tuxedos/Suits
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>All tags must be intact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>No alterations or tailoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Must include hanger and garment bag</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Missing packaging: 50% restocking fee</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Altered items cannot be returned</span>
                  </li>
                </ul>
              </Card>

              {/* Boys Tuxedos/Suits */}
              <Card className="p-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-gold" />
                  Boys Tuxedos/Suits
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>All items must be returned together</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Original packaging required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Tags must be attached</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Incomplete sets cannot be returned</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gold">•</span>
                    <span>Must be in original condition</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Return Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Return Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-gold" />
                </div>
                <h4 className="font-bold text-lg mb-2">Contact Us</h4>
                <p className="text-sm text-gray-600">Email KCTMenswear@gmail.com with subject "Return/Exchange - Order Number"</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gold" />
                </div>
                <h4 className="font-bold text-lg mb-2">Wait for Response</h4>
                <p className="text-sm text-gray-600">Our team will review your request and provide return instructions</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-gold" />
                </div>
                <h4 className="font-bold text-lg mb-2">Ship Items Back</h4>
                <p className="text-sm text-gray-600">Return to our Kalamazoo store location (not to manufacturers)</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-gold" />
                </div>
                <h4 className="font-bold text-lg mb-2">Inspection & Refund</h4>
                <p className="text-sm text-gray-600">Items inspected within one day and refund processed after approval</p>
              </Card>
            </div>
          </div>

          {/* Return Address */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Return Address</h2>
            <p className="text-center text-gray-600 mb-8">Please return all items to our Kalamazoo location:</p>
            
            <Card className="p-8 max-w-md mx-auto text-center mb-8">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-gold" />
              </div>
              <div className="space-y-2">
                <p className="font-bold text-lg">KCT Menswear</p>
                <p className="text-gray-700">213 S Kalamazoo Mall</p>
                <p className="text-gray-700">Kalamazoo, MI 49007</p>
              </div>
            </Card>

            <Card className="p-6 bg-amber-50 border-amber-200 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Important:</h4>
                  <p className="text-amber-800">DO NOT return any items to manufacturers, even if shipped directly from them. All returns must be sent to KCT Menswear.</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Need Help Section */}
          <Card className="p-8 text-center bg-gray-50">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Our team is here to assist you with any questions about returns or exchanges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-gold hover:bg-gold/90 text-black font-medium px-8 py-3"
                onClick={() => window.location.href = 'mailto:KCTMenswear@gmail.com'}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Us
              </Button>
              <Button 
                variant="outline"
                className="px-8 py-3"
                onClick={() => window.location.href = 'tel:269-352-2015'}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call (269) 352-2015
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}