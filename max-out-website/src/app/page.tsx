"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Star, ShoppingCart, Heart, CheckCircle, Phone, MapPin, Clock, Sparkles } from "lucide-react";
import { EnhancedProductCard } from "@/components/products/enhanced/EnhancedProductCard";
import TrendingNowCarousel from "@/components/home/TrendingNowCarousel";
import LuxuryVideoShowcase from "@/components/home/LuxuryVideoShowcase";

// Working video solution using iframe embeds instead of HLS
const FeaturedVideo = ({ videoId, title, className = "" }: { videoId: string; title: string; className?: string }) => {
  return (
    <div className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer ${className}`}>
      <iframe
        src={`https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/${videoId}/iframe`}
        className="w-full h-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        title={title}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
    </div>
  );
};

// Simple HTML5 video for hero with direct MP4 fallback
const HeroVideo = ({ className = "" }: { className?: string }) => {
  const [videoError, setVideoError] = useState(false);
  
  if (videoError) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80"
          alt="KCT Menswear Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={() => setVideoError(true)}
      >
        <source 
          src={`https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/a9ab22d2732a9eccfe01085f0127188f/downloads/default.mp4`}
          type="video/mp4"
        />
        {/* Fallback image if video fails */}
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
};


export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products/enhanced?status=active&limit=12');
      if (response.ok) {
        const data = await response.json();
        // If no real products, create some demo products
        const loadedProducts = data.products?.length ? data.products : createDemoProducts();
        setProducts(loadedProducts);
      } else {
        setProducts(createDemoProducts());
      }
    } catch (error) {
      setProducts(createDemoProducts());
    } finally {
      setLoading(false);
    }
  };

  // Create demo products if API fails
  const createDemoProducts = () => [
    { id: 1, name: "Classic Navy Suit", category: "suits", base_price: 599.99 },
    { id: 2, name: "Black Tuxedo", category: "tuxedos", base_price: 799.99 },
    { id: 3, name: "Charcoal Business Suit", category: "suits", base_price: 549.99 },
    { id: 4, name: "Wedding Vest Set", category: "accessories", base_price: 199.99 },
    { id: 5, name: "Prom Tuxedo", category: "tuxedos", base_price: 699.99 },
    { id: 6, name: "Oxford Dress Shoes", category: "shoes", base_price: 299.99 }
  ];

  // 12 TikTok videos for luxury showcase
  const luxuryVideos = [
    {
      id: "e5193da33f11d8a7c9e040d49d89da68",
      title: "Artisan Tailoring Process",
      description: "Witness the precision of our master craftsmen"
    },
    {
      id: "2e3811499ae08de6d3a57c9811fe6c6c", 
      title: "Premium Fabric Selection",
      description: "From Italian mills to your wardrobe"
    },
    {
      id: "0e292b2b0a7d9e5b9a0ced80590d4898",
      title: "Wedding Collection",
      description: "Perfect moments deserve perfect attire"
    },
    {
      id: "89027eb56b4470a759bb0bd6e83ebac4",
      title: "Business Excellence",
      description: "Command respect in every boardroom"
    },
    {
      id: "a9ab22d2732a9eccfe01085f0127188f",
      title: "Seasonal Collections", 
      description: "Contemporary elegance for every season"
    },
    {
      id: "e5193da33f11d8a7c9e040d49d89da68", // Repeat for demo
      title: "Formal Accessories",
      description: "Details that define distinction"
    },
    {
      id: "2e3811499ae08de6d3a57c9811fe6c6c", // Repeat for demo
      title: "Evening Wear",
      description: "Sophistication for special occasions"
    },
    {
      id: "0e292b2b0a7d9e5b9a0ced80590d4898", // Repeat for demo
      title: "Heritage Craftsmanship",
      description: "40 years of Detroit excellence"
    },
    {
      id: "89027eb56b4470a759bb0bd6e83ebac4", // Repeat for demo
      title: "Modern Classics",
      description: "Timeless style, contemporary fit"
    },
    {
      id: "a9ab22d2732a9eccfe01085f0127188f", // Repeat for demo
      title: "Personal Styling",
      description: "Your style, expertly curated"
    },
    {
      id: "e5193da33f11d8a7c9e040d49d89da68", // Repeat for demo
      title: "Quality Materials",
      description: "Premium fabrics, exceptional comfort"
    },
    {
      id: "2e3811499ae08de6d3a57c9811fe6c6c", // Repeat for demo
      title: "Complete Collections",
      description: "From suit to shoes, perfectly coordinated"
    }
  ];

  const featuredProducts = products.slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      {/* Luxury Hero Section - Hugo Boss Inspired */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
        <HeroVideo className="absolute inset-0 w-full h-full opacity-80" />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-16 h-px bg-white mx-auto mb-6" />
            <p className="text-white/90 text-sm tracking-[0.2em] uppercase font-light">
              Detroit's Premier Menswear
            </p>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-extralight text-white mb-8 leading-none tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            EXCEPTIONAL
            <span className="block font-light opacity-90">MENSWEAR</span>
          </motion.h1>

          <motion.p
            className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Discover precision-crafted suits and accessories for the modern gentleman.
            Four decades of excellence in Detroit.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/collections">
              <button className="bg-white text-gray-900 px-12 py-4 font-light tracking-wide hover:bg-gray-50 transition-all duration-300 flex items-center justify-center group">
                EXPLORE COLLECTION
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/services">
              <button className="border border-white text-white px-12 py-4 font-light tracking-wide hover:bg-white hover:text-gray-900 transition-all duration-300">
                BOOK CONSULTATION
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            className="w-px h-12 bg-white/50"
            initial={{ height: 0 }}
            animate={{ height: 48 }}
            transition={{ duration: 1, delay: 1.5 }}
          />
        </div>
      </section>

      {/* Hugo Boss Inspired Trending Carousel */}
      <TrendingNowCarousel 
        products={products} 
        title="Trending Now"
        subtitle="Discover what's capturing attention"
      />

      {/* Luxury Collections Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Signature Collections
            </h2>
            <div className="w-12 h-px bg-gray-300 mx-auto mb-6" />
            <p className="text-gray-600 text-base md:text-lg font-light max-w-md mx-auto">
              Curated selections for every occasion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Wedding Suits",
                subtitle: "Perfect moments deserve perfection",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
                href: "/collections/wedding"
              },
              {
                title: "Business Suits", 
                subtitle: "Professional excellence redefined",
                image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
                href: "/collections/suits"
              },
              {
                title: "Evening Wear",
                subtitle: "Sophistication for special occasions",
                image: "https://images.unsplash.com/photo-1562094644-c37de8614025?w=800&q=80",
                href: "/collections/prom"
              }
            ].map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <Link href={collection.href}>
                  <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-light text-gray-900 tracking-wide">
                      {collection.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-light">
                      {collection.subtitle}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Video Showcase - 12 TikTok Videos */}
      <LuxuryVideoShowcase 
        videos={luxuryVideos}
        title="Craftsmanship Stories"
        subtitle="Behind every piece lies exceptional artistry"
      />

      {/* Featured Products - Minimal Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Featured Pieces
            </h2>
            <div className="w-12 h-px bg-gray-300 mx-auto mb-6" />
            <p className="text-gray-600 text-base md:text-lg font-light max-w-md mx-auto">
              Handpicked selections from our master craftsmen
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EnhancedProductCard product={product} showQuickActions={true} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/collections">
              <button className="bg-gray-900 text-white px-12 py-4 font-light tracking-wide hover:bg-gray-800 transition-colors duration-300">
                VIEW ALL PRODUCTS
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Services - Clean Minimal */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Premium Services
            </h2>
            <div className="w-12 h-px bg-gray-300 mx-auto mb-6" />
            <p className="text-gray-600 text-base md:text-lg font-light max-w-md mx-auto">
              Excellence in every detail
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-gray-900" />,
                title: "Expert Tailoring",
                description: "Precision fittings by master craftsmen with decades of experience"
              },
              {
                icon: <Clock className="w-6 h-6 text-gray-900" />,
                title: "Quick Turnaround", 
                description: "Same-day alterations available for most items and urgent needs"
              },
              {
                icon: <Heart className="w-6 h-6 text-gray-900" />,
                title: "Style Consultation",
                description: "Personal styling sessions to discover your perfect aesthetic"
              },
              {
                icon: <MapPin className="w-6 h-6 text-gray-900" />,
                title: "Multiple Locations",
                description: "Convenient locations across Detroit and surrounding areas"
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {service.icon}
                  </div>
                </div>
                <h3 className="text-lg font-light text-gray-900 tracking-wide">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/services">
              <button className="bg-gray-900 text-white px-12 py-4 font-light tracking-wide hover:bg-gray-800 transition-colors duration-300">
                DISCOVER OUR SERVICES
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA - Luxury Minimal */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-tight">
              Ready to Experience Excellence?
            </h3>
            <p className="text-white/80 mb-12 text-lg font-light max-w-2xl mx-auto">
              Schedule a personal consultation or visit our showroom to discover 
              the KCT Menswear difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
                <button className="bg-white text-gray-900 px-12 py-4 font-light tracking-wide hover:bg-gray-100 transition-colors duration-300">
                  SCHEDULE APPOINTMENT
                </button>
              </Link>
              <a href="tel:313-525-2424">
                <button className="border border-white text-white px-12 py-4 font-light tracking-wide hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center">
                  <Phone className="mr-3 h-4 w-4" />
                  (313) 525-2424
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}