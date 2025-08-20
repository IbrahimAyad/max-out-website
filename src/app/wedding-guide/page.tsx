'use client';

import { useState } from 'react';
import { VenueOutfitMatcher } from '@/components/wedding/VenueOutfitMatcher';
import { SeasonalWeddingGuide } from '@/components/wedding/SeasonalWeddingGuide';
import { WeddingPartyCoordinator } from '@/components/wedding/WeddingPartyCoordinator';
import { WeddingStyleSwiper } from '@/components/wedding/WeddingStyleSwiper';
import { PageTransition, InteractiveCard } from '@/components/ui/micro-interactions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
  Camera,
  BookOpen,
  Zap,
  Sparkles as SparklesIcon
} from 'lucide-react';

export default function WeddingStyleGuidePage() {
  const [activeSection, setActiveSection] = useState<'venue' | 'seasonal' | 'coordinator' | 'swiper' | null>(null);

  const sections = [
    {
      id: 'venue',
      title: 'Venue-Specific Styling',
      description: 'Get outfit recommendations based on your wedding venue',
      icon: MapPin,
      gradient: 'from-blue-500 to-purple-500',
      stats: '98% venue match accuracy'
    },
    {
      id: 'seasonal',
      title: 'Seasonal Champions',
      description: 'Discover the most popular combinations by season',
      icon: Calendar,
      gradient: 'from-green-500 to-blue-500',
      stats: '10,000+ weddings analyzed'
    },
    {
      id: 'coordinator',
      title: 'Wedding Party Tools',
      description: 'Coordinate your entire wedding party effortlessly',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
      stats: 'Save 30% with group orders'
    },
    {
      id: 'swiper',
      title: 'Style Discovery',
      description: 'Swipe through wedding looks to find your perfect style',
      icon: SparklesIcon,
      gradient: 'from-pink-500 to-orange-500',
      stats: 'AI-powered recommendations'
    }
  ];

  const weddingStats = [
    { label: 'Weddings Analyzed', value: '10,000+', icon: Heart },
    { label: 'Venue Types', value: '8', icon: MapPin },
    { label: 'Color Combinations', value: '156', icon: Sparkles },
    { label: 'Success Rate', value: '96%', icon: Award }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Wedding Style Guide
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your complete guide to wedding attire based on 10,000+ wedding analysis. 
                Find the perfect combination for your venue, season, and wedding party.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Wedding Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {weddingStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-gold" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </Card>
              );
            })}
          </div>

          {/* Section Selector */}
          {!activeSection && (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <InteractiveCard
                      key={section.id}
                      className="p-6 cursor-pointer group"
                      onClick={() => setActiveSection(section.id as any)}
                    >
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${section.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
                      <p className="text-gray-600 mb-3">{section.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {section.stats}
                      </Badge>
                    </InteractiveCard>
                  );
                })}
              </div>

              {/* Quick Links */}
              <Card className="p-8 mb-8 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-2xl font-serif text-center mb-6">Popular Resources</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link href="/weddings/studio" className="group">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <Camera className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Wedding Studio</h4>
                        <p className="text-sm text-gray-600">AI-powered wedding visualization</p>
                      </div>
                      <Zap className="w-5 h-5 text-gold ml-auto" />
                    </div>
                  </Link>

                  <Link href="/weddings" className="group">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                        <Users className="w-6 h-6 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Wedding Portal</h4>
                        <p className="text-sm text-gray-600">Manage your wedding party</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </Card>

              {/* Trending Insights */}
              <Card className="p-8">
                <h2 className="text-2xl font-serif text-center mb-6 flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  2025 Wedding Trends
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl mb-2">🌿</div>
                    <h4 className="font-semibold mb-1">Sage Green</h4>
                    <p className="text-sm text-gray-600">+156% growth</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl mb-2">🌊</div>
                    <h4 className="font-semibold mb-1">Ocean Blues</h4>
                    <p className="text-sm text-gray-600">Beach weddings up 40%</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl mb-2">💎</div>
                    <h4 className="font-semibold mb-1">Velvet Textures</h4>
                    <p className="text-sm text-gray-600">Winter luxury trend</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl mb-2">🌱</div>
                    <h4 className="font-semibold mb-1">Sustainable</h4>
                    <p className="text-sm text-gray-600">88% prefer eco-friendly</p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Active Section Content */}
          {activeSection && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setActiveSection(null)}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Guide
                </button>
              </div>

              {activeSection === 'venue' && <VenueOutfitMatcher />}
              {activeSection === 'seasonal' && <SeasonalWeddingGuide />}
              {activeSection === 'coordinator' && <WeddingPartyCoordinator />}
              {activeSection === 'swiper' && <WeddingStyleSwiper />}
            </div>
          )}

          {/* Knowledge Bank Citation */}
          <Card className="mt-8 p-6 bg-gray-50">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Data-Driven Recommendations</h4>
                <p className="text-sm text-gray-600">
                  All recommendations are based on comprehensive analysis of 10,000+ weddings, 
                  seasonal trends, and venue-specific requirements. Our knowledge bank is continuously 
                  updated with the latest wedding fashion insights.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}