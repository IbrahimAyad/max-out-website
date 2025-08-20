"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UniversalProductCard, UniversalProductGrid } from "@/components/products/UniversalProductCard";
import { knowledgeProductAnalyzer } from "@/lib/ai/knowledge-product-analyzer";
import { Sparkles, TrendingUp, Clock, Sun, Award, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SectionProps {
  title: string;
  subtitle?: string;
  products: any[];
  icon?: React.ReactNode;
  viewAllLink?: string;
  className?: string;
  columns?: number;
}

// Individual section component
function ProductSection({ 
  title, 
  subtitle, 
  products, 
  icon, 
  viewAllLink,
  className = "",
  columns = 4
}: SectionProps) {
  const displayProducts = products.slice(0, columns);

  if (products.length === 0) return null;

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 flex items-center gap-2">
              {icon}
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          {viewAllLink && (
            <Link 
              href={viewAllLink}
              className="flex items-center gap-1 text-sm text-gray-900 hover:text-burgundy transition-colors"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Product Grid */}
        <div className={`
          grid gap-x-3 gap-y-8
          grid-cols-2 
          ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'}
          ${columns === 5 ? 'lg:grid-cols-5' : ''}
        `}>
          {displayProducts.map((product, index) => (
            <UniversalProductCard
              key={product.id || index}
              product={product}
              priority={index < 2}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Hero carousel for featured products
function HeroSection({ products }: { products: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Link href={`/products/${currentProduct.slug || currentProduct.id}`}>
            <div className="relative h-full">
              <img
                src={currentProduct.images?.hero?.url || 
                     currentProduct.images?.primary?.cdn_url || 
                     '/placeholder-product.jpg'}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Product Info */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Atelier Featured
                  </p>
                  <h1 className="text-3xl md:text-5xl font-light mb-3">
                    {currentProduct.name}
                  </h1>
                  <p className="text-lg mb-6 max-w-xl">
                    {currentProduct.description || 'Exclusively curated by Atelier AI'}
                  </p>
                  <button className="bg-white text-black px-8 py-3 hover:bg-gray-100 transition-colors">
                    Shop Now
                  </button>
                </motion.div>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// Main AI-powered homepage sections component
export function AIProductSections() {
  const [sections, setSections] = useState<{
    hero: any[];
    trending: any[];
    newArrivals: any[];
    seasonal: any[];
    premium: any[];
    classics: any[];
  }>({
    hero: [],
    trending: [],
    newArrivals: [],
    seasonal: [],
    premium: [],
    classics: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAndAnalyzeProducts();
  }, []);

  const fetchAndAnalyzeProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch enhanced products from Supabase
      const response = await fetch('/api/products/enhanced?status=active&limit=100');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      const products = data.products || [];

      if (products.length === 0) {
        // Use fallback demo products if no products in database
        setError('No products found in database');
        return;
      }

      // Use Fashion Knowledge Base to analyze and organize products
      const organized = await knowledgeProductAnalyzer.analyzeAndOrganizeProducts(products);
      setSections({
        hero: organized.hero,
        trending: organized.trending,
        newArrivals: organized.newArrivals,
        seasonal: organized.seasonal,
        premium: organized.premium,
        classics: organized.classics
      });

    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">AI is curating your experience...</p>
        </div>
      </div>
    );
  }

  const currentSeason = new Date().getMonth() >= 3 && new Date().getMonth() <= 8 ? 'Summer' : 'Winter';

  return (
    <>
      {/* Hero Section - Featured Products */}
      <HeroSection products={sections.hero} />

      {/* Trending Now - AI Curated */}
      <ProductSection
        title="Trending Now"
        subtitle="AI-curated styles gaining momentum"
        products={sections.trending}
        icon={<TrendingUp className="w-5 h-5 text-burgundy" />}
        viewAllLink="/collections/trending"
        className="bg-white"
      />

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh additions to our collection"
        products={sections.newArrivals}
        icon={<Clock className="w-5 h-5 text-burgundy" />}
        viewAllLink="/collections/new-arrivals"
        className="bg-gray-50"
      />

      {/* Seasonal Collection */}
      <ProductSection
        title={`${currentSeason} Essentials`}
        subtitle={`Perfect for the ${currentSeason.toLowerCase()} season`}
        products={sections.seasonal}
        icon={<Sun className="w-5 h-5 text-burgundy" />}
        viewAllLink={`/collections/${currentSeason.toLowerCase()}`}
        className="bg-white"
      />

      {/* Premium Collection */}
      <ProductSection
        title="Premium Collection"
        subtitle="Luxury pieces for discerning gentlemen"
        products={sections.premium}
        icon={<Award className="w-5 h-5 text-burgundy" />}
        viewAllLink="/collections/premium"
        className="bg-gray-50"
      />

      {/* Timeless Classics */}
      <ProductSection
        title="Timeless Classics"
        subtitle="Essential pieces for every wardrobe"
        products={sections.classics}
        icon={<Star className="w-5 h-5 text-burgundy" />}
        viewAllLink="/collections/classics"
        className="bg-white"
        columns={3}
      />

      {/* AI Insight Banner */}
      <section className="py-12 bg-burgundy text-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-light mb-3">
            Powered by Atelier AI
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Our AI analyzes trends, seasons, and style preferences to curate the perfect collection for you
          </p>
          <Link 
            href="/style-quiz"
            className="inline-block bg-white text-burgundy px-8 py-3 hover:bg-gray-100 transition-colors"
          >
            Take Our Style Quiz
          </Link>
        </div>
      </section>
    </>
  );
}