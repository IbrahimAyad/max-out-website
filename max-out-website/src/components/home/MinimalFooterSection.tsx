'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function MinimalFooterSection() {
  const trustIndicators = [
    {
      icon: MapPin,
      title: "Detroit Location",
      description: "Serving Metro Detroit for over 15 years"
    },
    {
      icon: Clock,
      title: "Expert Tailoring",
      description: "Professional alterations & custom fitting"
    },
    {
      icon: Phone,
      title: "Personal Service",
      description: "Call (313) 555-0123 for appointments"
    },
    {
      icon: Mail,
      title: "Style Consultation",
      description: "Free styling advice with every purchase"
    }
  ];

  return (
    <section className="py-32 bg-black text-white">
      <div className="container-main">
        {/* Trust Indicators Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20"
        >
          {trustIndicators.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 flex justify-center">
                  <Icon className="w-8 h-8 text-burgundy group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-serif text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-800 mb-20" />

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <h3 className="font-serif text-2xl font-bold mb-4">KCT Menswear</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Elevating men's style in Detroit through exceptional craftsmanship and personalized service.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>123 Main Street</p>
              <p>Detroit, MI 48201</p>
              <p>(313) 555-0123</p>
            </div>
          </motion.div>

          {/* Collections */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-serif text-lg font-medium mb-4">Collections</h4>
            <nav className="space-y-2">
              {[
                { name: 'Business Suits', href: '/collections/business' },
                { name: 'Wedding Attire', href: '/collections/wedding' },
                { name: 'Black Tie', href: '/collections/formal' },
                { name: 'Casual Wear', href: '/collections/casual' }
              ].map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-serif text-lg font-medium mb-4">Services</h4>
            <nav className="space-y-2">
              {[
                { name: 'Custom Tailoring', href: '/services/tailoring' },
                { name: 'Atelier AI Styling', href: '/atelier-ai' },
                { name: 'Wedding Planning', href: '/wedding' },
                { name: 'Corporate Accounts', href: '/corporate' }
              ].map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-serif text-lg font-medium mb-4">Support</h4>
            <nav className="space-y-2">
              {[
                { name: 'Size Guide', href: '/size-guide' },
                { name: 'Care Instructions', href: '/care' },
                { name: 'Returns & Exchanges', href: '/returns' },
                { name: 'Contact Us', href: '/contact' }
              ].map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 text-sm text-gray-500"
        >
          <p>&copy; 2024 KCT Menswear. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}