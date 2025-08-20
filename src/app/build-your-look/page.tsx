"use client";

import InteractiveBundleBuilder from "@/components/bundles/InteractiveBundleBuilder";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Sparkles, Users, Clock, Shield } from "lucide-react";

export default function BuildYourLookPage() {
  const handleBundleSelect = (bundle: any, selections: any) => {
    // Handle bundle selection and add to cart
    console.log('Bundle selected:', bundle, selections);
    // In a real app, this would add to cart and redirect to checkout
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/collections" 
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Browse Collections
              </Link>
              <Link 
                href="/size-guide" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Size Guide
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-px h-8 bg-gray-300" />
              <p className="text-sm tracking-[0.3em] uppercase text-gray-600 font-medium">
                Curated Collections
              </p>
              <div className="w-px h-8 bg-gray-300" />
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 mb-6 leading-[0.9]">
              Build Your
              <span className="block font-normal italic text-gray-700">Perfect Look</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light mb-8">
              Discover expertly curated bundles that take the guesswork out of dressing well. 
              Each collection is designed by our stylists for maximum impact and value.
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Expert Styling</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Free Alterations</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Quality Guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </div>
      </section>

      {/* Interactive Bundle Builder */}
      <InteractiveBundleBuilder onBundleSelect={handleBundleSelect} />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Why Choose Bundles?
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Curation",
                description: "Each bundle is carefully curated by our style experts to ensure perfect harmony between all pieces."
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Time Saving",
                description: "Skip the guesswork and get a complete, coordinated look in minutes instead of hours of shopping."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Value Guarantee",
                description: "Save up to $150 compared to buying items separately, plus get free alterations included."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 text-gray-700 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-light mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Our style consultants are here to help you find the perfect bundle for any occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-white text-gray-900 px-8 py-4 font-semibold hover:bg-gray-100 transition-colors rounded-lg">
                  Schedule Consultation
                </button>
              </Link>
              <Link href="/size-guide">
                <button className="border-2 border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-gray-900 transition-all rounded-lg">
                  Size Guide
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}