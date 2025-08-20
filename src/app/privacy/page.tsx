'use client'

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Lock, Users, Cookie, Mail, Phone, FileText, HelpCircle } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-300 mb-6">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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

      {/* Privacy Policy Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 mb-8">
              <p className="text-gray-700 mb-8">
                At KCT Menswear, we are committed to protecting your privacy and ensuring the security of your personal 
                information. This Privacy Policy explains our practices regarding the collection, use, and disclosure of your 
                information through our website and services.
              </p>
            </Card>

            {/* Information Collection */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Eye className="h-6 w-6 text-gold" />
                Information Collection
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold">We collect information when you:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Register on our site</li>
                  <li>Place an order</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Respond to a survey</li>
                  <li>Fill out a form</li>
                </ul>
                
                <p className="font-semibold mt-6">Information collected may include:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Mailing address</li>
                  <li>Phone number</li>
                </ul>
                
                <p className="text-sm text-gray-600 mt-4">
                  <strong>Note:</strong> You may visit our site anonymously.
                </p>
              </div>
            </Card>

            {/* Information Usage */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-gold" />
                Information Usage
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold">Your information helps us to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Personalize your experience</li>
                  <li>Improve our website</li>
                  <li>Improve customer service</li>
                  <li>Process transactions</li>
                  <li>Send periodic emails</li>
                </ul>
                
                <p className="mt-6">
                  Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other 
                  company without your consent, other than for the express purpose of delivering purchased products or 
                  services.
                </p>
              </div>
            </Card>

            {/* Information Protection */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Shield className="h-6 w-6 text-gold" />
                Information Protection
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold">We implement various security measures to maintain the safety of your personal information when you:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Place an order</li>
                  <li>Enter, submit, or access your information</li>
                </ul>
                
                <p className="mt-6">
                  After a transaction, your private information (credit cards, social security numbers, financials, etc.) will not be 
                  kept on file for more than 60 days.
                </p>
              </div>
            </Card>

            {/* Policy Updates */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="h-6 w-6 text-gold" />
                Policy Updates
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold">We may update this privacy policy at any time. We will notify you of any changes by:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Posting the new privacy policy on this page</li>
                  <li>Sending an email notification</li>
                  <li>Displaying a prominent notice on our website</li>
                </ul>
              </div>
            </Card>

            {/* COPPA Compliance */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Children's Online Privacy Protection Act Compliance</h2>
              
              <div className="text-gray-700">
                <p>
                  We are in compliance with the requirements of COPPA (Children's Online Privacy Protection Act). We do not 
                  collect any information from anyone under 13 years of age. Our website, products, and services are all 
                  directed to people who are at least 13 years old or older.
                </p>
              </div>
            </Card>

            {/* Your Consent */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Your Consent</h2>
              
              <div className="text-gray-700">
                <p>By using our site, you consent to our privacy policy.</p>
              </div>
            </Card>

            {/* Contact Us */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
              
              <div className="text-gray-700 space-y-4">
                <p>If you have any questions regarding this privacy policy, you may contact us using the information below:</p>
                
                <div className="space-y-2">
                  <p>
                    <strong>Phone:</strong> 
                    <a href="tel:269-342-1234" className="text-blue-600 hover:underline ml-1">(269) 342-1234</a>
                  </p>
                  <p>
                    <strong>Email:</strong> 
                    <a href="mailto:KCTMenswear@gmail.com" className="text-blue-600 hover:underline ml-1">KCTMenswear@gmail.com</a>
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="p-8 mb-8 bg-gray-50">
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => window.location.href = '/terms'}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => window.location.href = '/contact'}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}