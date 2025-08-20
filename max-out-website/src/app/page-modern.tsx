"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ModernHero } from "@/components/home/ModernHero";
import { BuildYourLookModern } from "@/components/home/BuildYourLookModern";
import { EditorialCollections } from "@/components/home/EditorialCollections";
import { ModernProductShowcase } from "@/components/home/ModernProductShowcase";
import { MinimalFooterSection } from "@/components/home/MinimalFooterSection";

// Premium outfit combinations for Build Your Look
const outfitCombinations = [
  {
    id: "executive",
    name: "Executive Power",
    suit: {
      id: "navy-suit",
      name: "Navy Tailored Suit",
      price: 189,
      image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg"
    },
    shirt: {
      id: "white-shirt",
      name: "Crisp White Shirt",
      price: 49,
      image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/white/white-shirt-1.jpg"
    },
    tie: {
      id: "burgundy-tie",
      name: "Burgundy Silk Tie",
      price: 29,
      image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/burgundy/burgundy-tie-1.jpg"
    },
    totalPrice: 267,
    bundlePrice: 229,
    savings: 38,
    description: "Commanding presence for the modern executive"
  },
  {
    id: "wedding",
    name: "Wedding Classic",
    suit: {
      id: "charcoal-suit",
      name: "Charcoal Three-Piece",
      price: 229,
      image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/charcoal/charcoal-main-1.jpg"
    },
    shirt: {
      id: "light-blue-shirt",
      name: "Light Blue Shirt",
      price: 55,
      image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/blue/light-blue-shirt-1.jpg"
    },
    tie: {
      id: "silver-tie",
      name: "Silver Tie",
      price: 35,
      image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/silver/silver-tie-1.jpg"
    },
    totalPrice: 319,
    bundlePrice: 279,
    savings: 40,
    description: "Timeless elegance for your special day"
  },
  {
    id: "black-tie",
    name: "Black Tie Elite",
    suit: {
      id: "black-tuxedo",
      name: "Black Tuxedo",
      price: 279,
      image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/black-tux-main-1.jpg"
    },
    shirt: {
      id: "formal-white",
      name: "Formal White Shirt",
      price: 65,
      image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/white/wing-collar-1.jpg"
    },
    tie: {
      id: "black-bowtie",
      name: "Black Bow Tie",
      price: 25,
      image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/ties/black/black-bowtie-1.jpg"
    },
    totalPrice: 369,
    bundlePrice: 329,
    savings: 40,
    description: "Sophisticated luxury for formal events"
  }
];

// Collections data for editorial grid
const editorialCollections = [
  {
    id: "business",
    name: "Business Collection",
    subtitle: "Power Dressing",
    image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/lifestyle/business-meeting.jpg",
    href: "/collections/business",
    size: "large" as const
  },
  {
    id: "wedding",
    name: "Wedding",
    subtitle: "Timeless Romance",
    image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/lifestyle/wedding-party.jpg",
    href: "/collections/wedding",
    size: "medium" as const
  },
  {
    id: "formal",
    name: "Black Tie",
    subtitle: "Evening Elegance",
    image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/lifestyle/black-tie-event.jpg",
    href: "/collections/formal",
    size: "medium" as const
  },
  {
    id: "casual",
    name: "Smart Casual",
    subtitle: "Modern Comfort",
    image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/lifestyle/casual-style.jpg",
    href: "/collections/casual",
    size: "small" as const
  },
  {
    id: "prom",
    name: "Prom Night",
    subtitle: "Stand Out Style",
    image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/lifestyle/prom-celebration.jpg",
    href: "/collections/prom",
    size: "large" as const
  }
];

// Featured products for showcase
const featuredProducts = [
  {
    id: 1,
    name: "Navy Tailored Suit",
    price: 189,
    originalPrice: 229,
    image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg",
    href: "/products/navy-tailored-suit"
  },
  {
    id: 2,
    name: "Charcoal Three-Piece",
    price: 229,
    originalPrice: 279,
    image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/charcoal/charcoal-main-1.jpg",
    href: "/products/charcoal-three-piece"
  },
  {
    id: 3,
    name: "Black Evening Tuxedo",
    price: 279,
    originalPrice: 329,
    image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/black-tux-main-1.jpg",
    href: "/products/black-evening-tuxedo"
  },
  {
    id: 4,
    name: "Light Grey Suit",
    price: 199,
    originalPrice: 249,
    image: "https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/grey/light-grey-main-1.jpg",
    href: "/products/light-grey-suit"
  }
];

export default function ModernHomePage() {
  const [showAIGreeting, setShowAIGreeting] = useState(false);

  // Show Atelier AI greeting after a short delay (preserved from original)
  useEffect(() => {
    const hasSeenGreeting = sessionStorage.getItem('atelier-ai-greeted');
    if (!hasSeenGreeting) {
      const timer = setTimeout(() => {
        setShowAIGreeting(true);
        sessionStorage.setItem('atelier-ai-greeted', 'true');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
          setShowAIGreeting(false);
        }, 4000);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Editorial Hero Section */}
      <ModernHero />

      {/* Build Your Look Interactive Section */}
      <section className="py-32 bg-white">
        <BuildYourLookModern outfits={outfitCombinations} />
      </section>

      {/* Editorial Collections Grid */}
      <section className="py-32 bg-gray-50">
        <EditorialCollections collections={editorialCollections} />
      </section>

      {/* Product Showcase */}
      <section className="py-32 bg-white">
        <ModernProductShowcase products={featuredProducts} />
      </section>

      {/* Minimal Footer Section */}
      <MinimalFooterSection />

      {/* Atelier AI Greeting Notification (Preserved) */}
      <AnimatePresence>
        {showAIGreeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className="bg-gradient-to-r from-burgundy to-burgundy-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Atelier AI Header */}
              <div className="bg-black/20 px-4 py-2 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white/90 tracking-wide">ATELIER AI</span>
                  <button
                    onClick={() => setShowAIGreeting(false)}
                    className="ml-auto hover:opacity-80 transition-opacity"
                    aria-label="Dismiss"
                  >
                    <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="px-5 py-4">
                <p className="text-white font-medium text-sm leading-relaxed">
                  Welcome to KCT. I'm here to help you discover your perfect style. 
                  <span className="block mt-2 text-white/90">Let's elevate your wardrobe together ✨</span>
                </p>
              </div>
              
              {/* Progress bar */}
              <motion.div
                className="h-0.5 bg-white/30"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}