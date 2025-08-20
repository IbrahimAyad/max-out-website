'use client'

import { Card } from "@/components/ui/card";
import { FileText, Shield, CreditCard, Package, AlertCircle, Scale, Mail, Phone } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-300 mb-6">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-600 mb-8">Last Updated: March 1, 2024</p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <Card className="p-8 mb-8">
              <p className="text-gray-700">
                Welcome to KCT Menswear. These Terms of Service ("Terms") govern your use of our website, 
                stores, and services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
            </Card>

            {/* Acceptance of Terms */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-gold" />
                Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms and 
                  provision of this agreement. If you do not agree to abide by the above, please do not use 
                  this service.
                </p>
                <p>
                  This website is for use by individuals who are at least 18 years old, or the age of majority 
                  in their jurisdiction of residence.
                </p>
              </div>
            </Card>

            {/* Use of Website */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-gold" />
                Use of Website
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold">You may use our website for lawful purposes only. You agree not to use the website:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation</li>
                  <li>To impersonate or attempt to impersonate KCT Menswear, a KCT Menswear employee, another user, or any other person or entity</li>
                  <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website</li>
                </ul>
              </div>
            </Card>

            {/* Products and Pricing */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-gold" />
                Products and Pricing
              </h2>
              <div className="space-y-4 text-gray-700">
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>All prices are listed in US Dollars (USD)</li>
                  <li>Prices are subject to change without notice</li>
                  <li>We reserve the right to modify or discontinue any product without notice</li>
                  <li>We reserve the right to limit the quantities of any products or services that we offer</li>
                  <li>We do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free</li>
                  <li>In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price</li>
                </ul>
              </div>
            </Card>

            {/* Order Acceptance */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Package className="h-6 w-6 text-gold" />
                Order Acceptance and Cancellation
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Your receipt of an electronic or other form of order confirmation does not signify our 
                  acceptance of your order, nor does it constitute confirmation of our offer to sell.
                </p>
                <p>
                  We reserve the right at any time after receipt of your order to accept or decline your 
                  order for any reason or to supply less than the quantity you ordered of any item.
                </p>
                <p className="font-semibold">We may cancel an order for reasons including but not limited to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Product or service unavailability</li>
                  <li>Errors in product or pricing information</li>
                  <li>Errors in your order</li>
                  <li>Problems with payment processing</li>
                  <li>Suspected fraudulent activity</li>
                </ul>
              </div>
            </Card>

            {/* Shipping and Delivery */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Shipping and Delivery</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Shipping and delivery times are estimates only and are not guaranteed. We are not responsible 
                  for delays due to customs, weather, or other circumstances beyond our control.
                </p>
                <p>
                  Risk of loss and title for items purchased pass to you upon delivery to the carrier. 
                  You are responsible for filing any claims with carriers for damaged or lost shipments.
                </p>
              </div>
            </Card>

            {/* Returns and Refunds */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Returns and Refunds</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our return and refund policy is detailed on our <a href="/returns" className="text-gold hover:underline">Returns & Exchanges page</a>.
                </p>
                <p className="font-semibold">Key points:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Items must be returned within 10 days for refunds, 30 days for exchanges</li>
                  <li>Items must be unused and in original condition with tags</li>
                  <li>Altered or customized items cannot be returned</li>
                  <li>Restocking fees may apply for certain returns</li>
                </ul>
              </div>
            </Card>

            {/* Intellectual Property */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Scale className="h-6 w-6 text-gold" />
                Intellectual Property
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  All content on this website, including but not limited to text, graphics, logos, images, 
                  audio clips, digital downloads, and data compilations, is the property of KCT Menswear or 
                  its content suppliers and is protected by United States and international copyright laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, 
                  publicly perform, republish, download, store, or transmit any of the material on our website 
                  without the prior written consent of KCT Menswear.
                </p>
              </div>
            </Card>

            {/* Limitation of Liability */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-gold" />
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  IN NO EVENT SHALL KCT MENSWEAR, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY 
                  THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR 
                  PUNITIVE DAMAGES, INCLUDING LOST PROFIT DAMAGES ARISING FROM YOUR USE OF THE WEBSITE OR 
                  SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p>
                  NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY 
                  CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED 
                  TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY 
                  CAUSE OF ACTION ARISING.
                </p>
              </div>
            </Card>

            {/* Indemnification */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Indemnification</h2>
              <div className="text-gray-700">
                <p>
                  You agree to defend, indemnify, and hold harmless KCT Menswear and its subsidiaries, agents, 
                  licensors, managers, and other affiliated companies, and their employees, contractors, agents, 
                  officers and directors, from and against any and all claims, damages, obligations, losses, 
                  liabilities, costs or debt, and expenses (including but not limited to attorney's fees) 
                  arising from your use of and access to the website or services.
                </p>
              </div>
            </Card>

            {/* Governing Law */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Governing Law</h2>
              <div className="text-gray-700">
                <p>
                  These Terms shall be governed and construed in accordance with the laws of the State of 
                  Michigan, United States, without regard to its conflict of law provisions. Our failure to 
                  enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>
            </Card>

            {/* Changes to Terms */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Changes to Terms</h2>
              <div className="text-gray-700">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will provide at least 30 days notice prior to any new terms 
                  taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="text-gray-700 space-y-4">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                
                <div className="space-y-2">
                  <p>
                    <strong>KCT Menswear</strong><br />
                    213 S Kalamazoo Mall<br />
                    Kalamazoo, MI 49007
                  </p>
                  <p>
                    <strong>Phone:</strong> 
                    <a href="tel:269-532-4852" className="text-gold hover:underline ml-1">(269) 532-4852</a>
                  </p>
                  <p>
                    <strong>Email:</strong> 
                    <a href="mailto:KCTMenswear@gmail.com" className="text-gold hover:underline ml-1">KCTMenswear@gmail.com</a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Agreement */}
            <Card className="p-8 bg-gray-50">
              <p className="text-center text-gray-700 font-medium">
                By using our website and services, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms of Service.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}