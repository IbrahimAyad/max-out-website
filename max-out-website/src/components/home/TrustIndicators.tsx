'use client';

import { motion } from 'framer-motion';
import { Truck, Shield, Star, Phone, Bot, Sparkles } from 'lucide-react';

const trustItems = [
  {
    icon: Star,
    title: '4.9/5 Rating',
    description: '2,847 Reviews',
    color: 'text-yellow-500'
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Orders $150+',
    color: 'text-blue-600'
  },
  {
    icon: Shield,
    title: '30-Day Returns',
    description: 'Easy & Free',
    color: 'text-green-600'
  },
  {
    icon: Phone,
    title: 'Expert Styling',
    description: '313-525-2424',
    color: 'text-purple-600'
  },
  {
    icon: Bot,
    title: 'AI Size Bot',
    description: 'Perfect Fit Guaranteed',
    color: 'text-orange-600'
  },
  {
    icon: Sparkles,
    title: 'Atelier AI',
    description: 'Style Assistant',
    color: 'text-burgundy-600'
  }
];

export default function TrustIndicators() {
  return (
    <section className="py-8 bg-gradient-to-b from-white to-gray-50 border-y">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}