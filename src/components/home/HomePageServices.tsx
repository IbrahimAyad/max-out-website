"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Sparkles, Clock, Heart, MapPin } from "lucide-react";

export default function HomePageServices() {
  return (
    <>
      {/* Premium Services - Enhanced Design */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-tight">
              Premium Services
            </h2>
            <div className="w-16 h-px bg-white mx-auto mb-8" />
            <p className="text-white/80 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
              Excellence in every detail, personalized for your distinguished taste
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-white" />,
                title: "Expert Tailoring",
                description: "Precision fittings by master craftsmen with decades of experience in bespoke menswear"
              },
              {
                icon: <Clock className="w-8 h-8 text-white" />,
                title: "Quick Turnaround", 
                description: "Same-day alterations available for most items and urgent needs, without compromising quality"
              },
              {
                icon: <Heart className="w-8 h-8 text-white" />,
                title: "Style Consultation",
                description: "Personal styling sessions to discover your perfect aesthetic with our expert consultants"
              },
              {
                icon: <MapPin className="w-8 h-8 text-white" />,
                title: "Multiple Locations",
                description: "Convenient locations across Detroit and surrounding areas for your shopping comfort"
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-6 group"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-light text-white tracking-wide">
                  {service.title}
                </h3>
                <p className="text-white/70 text-sm font-light leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/services">
              <button className="bg-white text-gray-900 px-12 py-5 text-lg font-light tracking-wide hover:bg-gray-100 transition-colors duration-300 shadow-xl">
                DISCOVER OUR SERVICES
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA - Enhanced Luxury Design */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8 tracking-tight">
              Ready to Experience
              <span className="block">Excellence?</span>
            </h3>
            <div className="w-16 h-px bg-gray-900 mx-auto mb-8" />
            <p className="text-gray-700 mb-12 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Schedule a personal consultation or visit our showroom to discover 
              the KCT Menswear difference. Your perfect suit awaits.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
                <button className="bg-gray-900 text-white px-12 py-5 text-lg font-light tracking-wide hover:bg-gray-800 transition-colors duration-300 shadow-xl">
                  SCHEDULE APPOINTMENT
                </button>
              </Link>
              <a href="tel:313-525-2424">
                <button className="border-2 border-gray-900 text-gray-900 px-12 py-5 text-lg font-light tracking-wide hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center">
                  <Phone className="mr-3 h-5 w-5" />
                  (313) 525-2424
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}