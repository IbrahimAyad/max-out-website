"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Star, ShoppingCart, Heart, CheckCircle, Phone, MapPin, Clock, Sparkles } from "lucide-react";
import { EnhancedProductCard } from "@/components/products/enhanced/EnhancedProductCard";
import TrendingNowCarousel from "@/components/home/TrendingNowCarousel";
import LuxuryVideoShowcase from "@/components/home/LuxuryVideoShowcase";

interface Product {
  id: number;
  name: string;
  category: string;
  base_price: number;
  image?: string;
  description?: string;
}

interface HomePageClientProps {
  initialProducts?: Product[];
}

export default function HomePageClient({ initialProducts = [] }: HomePageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  useEffect(() => {
    if (initialProducts.length === 0) {
      loadProducts();
    }
  }, [initialProducts.length]);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products/enhanced?status=active&limit=12');
      if (response.ok) {
        const data = await response.json();
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

  const createDemoProducts = (): Product[] => [
    {
      id: 1, 
      name: "Classic Navy Suit", 
      category: "suits", 
      base_price: 599.99,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80",
      description: "Timeless elegance for the modern gentleman"
    },
    {
      id: 2, 
      name: "Black Tuxedo", 
      category: "tuxedos", 
      base_price: 799.99,
      image: "https://images.unsplash.com/photo-1521505772811-d7e4ec1b5c7b?w=500&q=80",
      description: "Perfect for special occasions"
    },
    {
      id: 3, 
      name: "Charcoal Business Suit", 
      category: "suits", 
      base_price: 549.99,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
      description: "Professional excellence"
    },
    {
      id: 4, 
      name: "Wedding Vest Set", 
      category: "accessories", 
      base_price: 199.99,
      image: "https://images.unsplash.com/photo-1621976360623-004223992275?w=500&q=80",
      description: "Complete your wedding look"
    },
    {
      id: 5, 
      name: "Prom Tuxedo", 
      category: "tuxedos", 
      base_price: 699.99,
      image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=80",
      description: "Make your night memorable"
    },
    {
      id: 6, 
      name: "Oxford Dress Shoes", 
      category: "shoes", 
      base_price: 299.99,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
      description: "Handcrafted Italian leather"
    }
  ];

  // Luxury videos for showcase
  const luxuryVideos = [
    {
      id: "video-1",
      title: "Artisan Tailoring Process",
      description: "Witness the precision of our master craftsmen",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80"
    },
    {
      id: "video-2", 
      title: "Premium Fabric Selection",
      description: "From Italian mills to your wardrobe",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80"
    },
    {
      id: "video-3",
      title: "Wedding Collection",
      description: "Perfect moments deserve perfect attire",
      image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=80"
    },
    {
      id: "video-4",
      title: "Business Excellence",
      description: "Command respect in every boardroom",
      image: "https://images.unsplash.com/photo-1521505772811-d7e4ec1b5c7b?w=500&q=80"
    }
  ];

  const featuredProducts = products.slice(0, 6);

  return (
    <>
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Signature Collections
            </h2>
            <div className="w-16 h-px bg-gray-900 mx-auto mb-8" />
            <p className="text-gray-700 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
              Curated selections for every occasion, crafted with uncompromising quality
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Wedding Suits",
                subtitle: "Perfect moments deserve perfection",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85",
                href: "/collections/wedding"
              },
              {
                title: "Business Suits", 
                subtitle: "Professional excellence redefined",
                image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=85",
                href: "/collections/suits"
              },
              {
                title: "Evening Wear",
                subtitle: "Sophistication for special occasions",
                image: "https://images.unsplash.com/photo-1521505772811-d7e4ec1b5c7b?w=800&q=85",
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
                  <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-gray-100 shadow-xl">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl md:text-3xl font-light text-white mb-2 tracking-wide">
                        {collection.title}
                      </h3>
                      <p className="text-white/90 text-sm font-light">
                        {collection.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Video Showcase - Using Images Instead of Videos */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Craftsmanship Stories
            </h2>
            <div className="w-16 h-px bg-gray-900 mx-auto mb-8" />
            <p className="text-gray-700 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
              Behind every piece lies exceptional artistry and decades of experience
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {luxuryVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-[9/16] overflow-hidden bg-gray-100 group cursor-pointer"
              >
                <Image
                  src={video.image}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-sm font-light mb-1">{video.title}</h3>
                  <p className="text-white/80 text-xs">{video.description}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Enhanced Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Featured Pieces
            </h2>
            <div className="w-16 h-px bg-gray-900 mx-auto mb-8" />
            <p className="text-gray-700 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
              Handpicked selections from our master craftsmen, showcasing the finest in contemporary menswear
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-lg mb-4">
                    <Image
                      src={product.image || `https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80`}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-light text-gray-900 tracking-wide">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm font-light">
                      {product.description || `Premium ${product.category}`}
                    </p>
                    <p className="text-2xl font-light text-gray-900">
                      ${product.base_price.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/collections">
              <button className="bg-gray-900 text-white px-12 py-4 text-lg font-light tracking-wide hover:bg-gray-800 transition-colors duration-300 shadow-lg">
                VIEW ALL PRODUCTS
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}