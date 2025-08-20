'use client';

import { useState } from 'react';
import { PromGroupBuilder } from '@/components/prom/PromGroupBuilder';
import { PageTransition, InteractiveCard, AnimatedCounter } from '@/components/ui/micro-interactions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ArrowLeft,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Sparkles,
  Heart,
  Star,
  Clock,
  Package,
  Zap,
  MessageSquare
} from 'lucide-react';
import { promTrends, promBundles, ageAppropriateGuidelines, promTimeline } from '@/lib/data/knowledgeBank/prom-data';

export default function PromCollectionPage() {
  const [selectedYear] = useState(2025);
  const [showGroupBuilder, setShowGroupBuilder] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  const currentTrend = promTrends[selectedYear];

  const promStats = [
    { label: 'Popular Colors', value: currentTrend.popularColors.length, icon: Sparkles },
    { label: 'Avg Budget', value: `$${currentTrend.budgetRange.average}`, icon: DollarSign },
    { label: 'Group Themes', value: currentTrend.groupCoordination.popularThemes.length, icon: Users },
    { label: 'Days to Plan', value: '90', icon: Calendar }
  ];

  const timelineSteps = Object.entries(promTimeline);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
                Prom Collection {selectedYear}
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Make your prom night unforgettable with our trendy, age-appropriate formal wear. 
                Coordinate with friends and save with group packages!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Prom Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {promStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {typeof stat.value === 'number' ? (
                      <AnimatedCounter value={stat.value} />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </Card>
              );
            })}
          </div>

          {!showGroupBuilder ? (
            <>
              {/* Popular Colors */}
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-serif text-center mb-6 flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  Trending Colors for {selectedYear}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {currentTrend.popularColors.map((color) => (
                    <div key={color} className="text-center">
                      <div 
                        className="w-20 h-20 mx-auto rounded-full shadow-lg mb-2"
                        style={{
                          background: 
                            color === 'Royal Blue' ? '#1e40af' :
                            color === 'Burgundy' ? '#7f1d1d' :
                            color === 'Emerald Green' ? '#047857' :
                            color === 'Navy' ? '#1e293b' :
                            color === 'Sage Green' ? '#84cc16' :
                            color === 'Dusty Blue' ? '#60a5fa' :
                            '#000000'
                        }}
                      />
                      <p className="font-medium text-sm">{color}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Budget-Friendly Bundles */}
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-center mb-6">
                  Budget-Friendly Prom Packages
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {promBundles.slice(0, 3).map((bundle) => (
                    <InteractiveCard
                      key={bundle.name}
                      className={`p-6 cursor-pointer ${
                        selectedBundle === bundle.name ? 'ring-2 ring-purple-500 shadow-lg' : ''
                      }`}
                      onClick={() => setSelectedBundle(bundle.name)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">{bundle.name}</h3>
                        <Badge className="bg-green-600 text-white">
                          Save ${bundle.savings}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {bundle.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                            {item}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-purple-600">${bundle.price}</p>
                          <p className="text-xs text-gray-500 line-through">
                            ${bundle.price + bundle.savings}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.floor(bundle.popularity / 20) 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </InteractiveCard>
                  ))}
                </div>
              </div>

              {/* Group Coordination CTA */}
              <Card className="p-8 mb-8 bg-gradient-to-r from-purple-100 to-pink-100">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h2 className="text-2xl font-serif mb-3">Going with Friends?</h2>
                  <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                    Coordinate your group's look and save up to 30% with our group packages. 
                    Use our color harmony tool to ensure everyone looks great together!
                  </p>
                  <button
                    onClick={() => setShowGroupBuilder(true)}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Build Your Squad's Look
                  </button>
                </div>
              </Card>

              {/* Prom Timeline */}
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-serif text-center mb-6 flex items-center justify-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  Prom Planning Timeline
                </h2>
                <div className="space-y-6">
                  {timelineSteps.map(([timeframe, tasks], index) => (
                    <div key={timeframe} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {timelineSteps.length - index}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold capitalize mb-2">
                          {timeframe.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <ul className="space-y-1">
                          {(tasks as string[]).map((task, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Age-Appropriate Guidelines */}
              <Card className="p-8">
                <h2 className="text-2xl font-serif text-center mb-6">
                  Style Guidelines for Prom
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-green-600" />
                      Recommended Styles
                    </h3>
                    <ul className="space-y-2">
                      {ageAppropriateGuidelines.formalWearBasics.acceptable.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Color Options
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Classic:</p>
                      <div className="flex flex-wrap gap-2">
                        {ageAppropriateGuidelines.colorGuidelines.classic.map((color) => (
                          <Badge key={color} variant="outline" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm font-medium mt-3">Trendy:</p>
                      <div className="flex flex-wrap gap-2">
                        {ageAppropriateGuidelines.colorGuidelines.trendy.map((color) => (
                          <Badge key={color} variant="outline" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      Essential Accessories
                    </h3>
                    <ul className="space-y-2">
                      {ageAppropriateGuidelines.accessoryRules.recommended.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setShowGroupBuilder(false)}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Prom Collection
                </button>
              </div>
              <PromGroupBuilder 
                schoolName="Your School"
                promDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
              />
            </div>
          )}

          {/* Support CTA */}
          <Card className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Need Help Planning?</h4>
                  <p className="text-sm text-gray-600">
                    Our prom specialists are here to help you look your best
                  </p>
                </div>
              </div>
              <Link 
                href="/contact"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Chat with Us
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}