"use client";

import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ShoppingBag, Sparkles, Camera } from "lucide-react";
import Link from "next/link";
import { VIDEO_IDS } from "@/lib/utils/constants";
import { StyleSwiperPreview } from "@/components/style/StyleSwiperPreview";
import { VisualSearch } from "@/components/search/VisualSearch";
import { TrendingBundles } from "@/components/home/TrendingBundles";
import { NewArrivals } from "@/components/home/NewArrivals";
import { BuildYourLookShowcase } from "@/components/home/BuildYourLookShowcase";
import TrendingEnsembles from "@/components/home/TrendingEnsembles";
import StyleSwipeHero from "@/components/home/StyleSwipeHero";
import { useState, useEffect } from "react";
import { trackPromoView, trackViewItemList } from "@/lib/analytics/google-analytics";
import { useScrollTracking } from "@/hooks/useScrollTracking";

export default function Home() {
  const [showVisualSearch, setShowVisualSearch] = useState(false);

  // Use scroll tracking
  useScrollTracking();

  // Track homepage promotions
  useEffect(() => {
    // Track hero banner view
    trackPromoView('Homepage Hero - Elevate Your Style', 'hero_banner_2024');

    // You can add more promo tracking here as needed
  }, []);

  return (
    <>
      {/* Hero Section with Static Image Background */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative">
            <img 
              src="/KCT-Home-Banner-Update.jpg"
              alt="KCT Menswear Premium Collection"
              className="w-full h-full object-cover object-[25%_center] md:object-center scale-105 transition-transform duration-700 hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-5xl mx-auto">
            <div className="space-y-2 mb-8 animate-fade-up">
              <div className="h-px w-24 bg-gold mx-auto"></div>
              <p className="text-gold text-sm tracking-[0.3em] uppercase">Excellence in Every Stitch</p>
              <div className="h-px w-24 bg-gold mx-auto"></div>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-6 animate-fade-up tracking-tight leading-[0.9]" style={{ animationDelay: '0.2s' }}>
              Elevate Your
              <span className="block text-gold">Style</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 font-light animate-fade-up max-w-3xl mx-auto leading-relaxed text-gray-100" style={{ animationDelay: '0.4s' }}>
              Premium men&apos;s formal wear crafted with uncompromising attention to detail
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <Link href="/products">
                <Button size="lg" className="group bg-burgundy hover:bg-burgundy-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-sm text-white border-white/50 hover:bg-white hover:text-black px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Book Appointment
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-white/50"></div>
          </div>
        </div>
      </section>

      {/* Build Your Look Showcase - NEW SECTION */}
      <BuildYourLookShowcase />

      {/* Atelier AI - Trending Now Section */}
      <TrendingEnsembles />

      {/* Feature Cards */}
      <section className="py-24 bg-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Tailored to Perfection</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive services designed to elevate your wardrobe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/atelier-ai" className="group">
              <div className="relative bg-white border border-gray-200 p-10 h-full transition-all duration-300 hover:border-burgundy hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-burgundy transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <Sparkles className="h-14 w-14 text-burgundy mb-6 transform group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-2xl font-serif mb-4 group-hover:text-burgundy transition-colors">Atelier AI</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Experience AI-powered outfit recommendations, size predictions, and personalized styling advice
                </p>
                <span className="inline-flex items-center text-black font-semibold group-hover:text-burgundy transition-colors">
                  Explore AI Features 
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </Link>

            <Link href="/occasions" className="group">
              <div className="relative bg-white border border-gray-200 p-10 h-full transition-all duration-300 hover:border-gold hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <ShoppingBag className="h-14 w-14 text-gold mb-6 transform group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-2xl font-serif mb-4 group-hover:text-gold transition-colors">Occasion Bundles</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pre-styled outfits for weddings, interviews, and special events with exclusive bundle pricing
                </p>
                <span className="inline-flex items-center text-black font-semibold group-hover:text-gold transition-colors">
                  Browse Bundles
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </Link>

            <Link href="/wedding" className="group">
              <div className="relative bg-white border border-gray-200 p-10 h-full transition-all duration-300 hover:border-gold hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <Calendar className="h-14 w-14 text-gold mb-6 transform group-hover:rotate-12 transition-transform duration-300" />
                <h3 className="text-2xl font-serif mb-4 group-hover:text-gold transition-colors">Wedding Hub</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Complete wedding party management with coordinated styles and exclusive group discounts
                </p>
                <span className="inline-flex items-center text-black font-semibold group-hover:text-gold transition-colors">
                  Plan Your Wedding
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Style Swiper Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container-main relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-gold mb-4">
              <div className="h-px w-12 bg-gold"></div>
              <span className="text-sm font-semibold tracking-widest uppercase">Personalized Experience</span>
              <div className="h-px w-12 bg-gold"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif mb-6">
              Discover Your 
              <span className="text-gold"> Signature Style</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our intelligent style finder learns your preferences to curate a wardrobe that reflects your unique personality
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <StyleSwiperPreview />
          </div>
        </div>
      </section>

      {/* Style Swipe Hero Section - Interactive Style Finder */}
      <StyleSwipeHero />

      {/* New Arrivals Section */}
      <NewArrivals />
      
      {/* Trending Bundles Section */}
      <TrendingBundles />

      {/* Wedding & Prom Features */}
      <section className="py-20 bg-white">
        <div className="container-main">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-6">
              Special Occasions Deserve
              <span className="text-gold block">Special Service</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From wedding parties to prom nights, we provide comprehensive solutions for your most important moments
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Wedding Feature Card */}
            <div className="group relative overflow-hidden rounded-lg shadow-xl">
              <div className="aspect-[3/4] relative">
                <img 
                  src="https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/aa23aaf9-ea00-430e-4436-15b8ad71db00/public" 
                  alt="KCT Menswear Wedding Suits Collection"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-serif mb-4">Wedding Hub</h3>
                  <p className="text-lg mb-6 text-gray-200">
                    Complete wedding party management with group coordination tools, 
                    themed collections, and exclusive discounts
                  </p>
                  <Link href="/weddings">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                      Explore Wedding Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Prom Feature Card */}
            <div className="group relative overflow-hidden rounded-lg shadow-xl">
              <div className="aspect-[3/4] relative">
                <img 
                  src="https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/e5f26504-4bf5-434a-e115-fab5edaa0b00/public" 
                  alt="KCT Menswear Prom Blazers Collection"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-serif mb-4">Prom Central</h3>
                  <p className="text-lg mb-6 text-gray-200">
                    School-specific collections, group discounts, style guides, 
                    and everything you need for an unforgettable prom night
                  </p>
                  <Link href="/prom">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                      Shop Prom Packages
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build Your Suit CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        </div>

        <div className="container-main relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-gold mb-6">
              <div className="h-px w-12 bg-gold"></div>
              <span className="text-sm font-semibold tracking-widest uppercase">3D Customization</span>
              <div className="h-px w-12 bg-gold"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
              Design Your Dream Suit
              <span className="text-gold block mt-2">In Real-Time 3D</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Use our revolutionary 3D suit builder to customize every detail. 
              Choose fabrics, adjust fit, select styling options, and see your creation come to life instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/builder">
                <Button size="lg" className="bg-burgundy hover:bg-burgundy-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-burgundy/20 transition-all duration-300 transform hover:scale-105">
                  Start Building
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-black px-10 py-6 text-lg backdrop-blur-sm transition-all duration-300">
                View Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-main text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              Experience the Art of
              <span className="block text-gold mt-2">Expert Tailoring</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Every garment is meticulously crafted to your exact measurements, ensuring a perfect fit that complements your physique
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-burgundy hover:bg-burgundy-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-burgundy/20 transition-all duration-300 transform hover:scale-105">
                Book Your Consultation
              </Button>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-black px-10 py-6 text-lg backdrop-blur-sm transition-all duration-300">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Search Modal */}
      {showVisualSearch && (
        <VisualSearch
          onResults={(results) => {

            setShowVisualSearch(false);
          }}
          onClose={() => setShowVisualSearch(false)}
        />
      )}
    </>
  );
}