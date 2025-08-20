'use client';

import { useState, useEffect } from 'react';
import { LiveShoppingEvent } from '@/components/live/LiveShoppingEvent';
import { VideoHeatmap, useVideoAnalytics } from '@/components/analytics/VideoHeatmap';
import type { StockLevel } from '@/lib/types';
import { 
  SatisfyingButton, 
  InteractiveCard, 
  SuccessCelebration,
  FloatingActionButton,
  PageTransition,
  AnimatedStarRating
} from '@/components/ui/micro-interactions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  Eye, 
  Heart, 
  Share2,
  Play,
  Sparkles,
  Gift
} from 'lucide-react';
import { Product } from '@/lib/types';

// Mock live events data
const liveEvents = [
  {
    id: 'wedding-spring-2024',
    title: 'Spring Wedding Collection Reveal',
    host: {
      name: 'Marcus Thompson',
      avatar: '/api/placeholder/150/150',
      title: 'Senior Style Consultant'
    },
    status: 'live' as const,
    startTime: new Date(),
    viewers: 1247,
    streamUrl: '/api/placeholder/video.mp4',
    featuredProducts: [
      {
        id: 'spring-suit-1',
        sku: 'SPR-001',
        name: 'Light Blue Spring Suit',
        price: 79900,
        images: ['/api/placeholder/400/500'],
        category: 'suits' as const,
        stock: { '40R': 10 } as StockLevel,
        variants: []
      },
      {
        id: 'spring-tie-1',
        sku: 'SPR-002',
        name: 'Floral Silk Tie',
        price: 5900,
        images: ['/api/placeholder/400/500'],
        category: 'accessories' as const,
        stock: { 'OS': 25 } as StockLevel,
        variants: []
      }
    ],
    specialOffers: [
      {
        id: 'offer-1',
        product: {
          id: 'spring-suit-1',
          sku: 'SPR-001',
          name: 'Light Blue Spring Suit',
          price: 79900,
          images: ['/api/placeholder/400/500'],
          category: 'suits' as const,
          stock: { '40R': 10 } as StockLevel,
          variants: []
        },
        originalPrice: 79900,
        livePrice: 59900,
        timeLeft: 450,
        claimed: 23,
        limit: 50
      }
    ]
  },
  {
    id: 'prom-night-special',
    title: 'Prom Night Special - Last Minute Deals',
    host: {
      name: 'Sarah Williams',
      avatar: '/api/placeholder/150/150',
      title: 'Prom Specialist'
    },
    status: 'upcoming' as const,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    viewers: 892,
    streamUrl: '/api/placeholder/video.mp4',
    featuredProducts: [],
    specialOffers: []
  },
  {
    id: 'black-tie-masterclass',
    title: 'Black Tie Etiquette & Style Masterclass',
    host: {
      name: 'James Rodriguez',
      avatar: '/api/placeholder/150/150',
      title: 'Master Tailor'
    },
    status: 'upcoming' as const,
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    viewers: 2156,
    streamUrl: '/api/placeholder/video.mp4',
    featuredProducts: [],
    specialOffers: []
  }
];

export default function LiveShoppingPage() {
  const [selectedEvent, setSelectedEvent] = useState(liveEvents[0]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [eventRating, setEventRating] = useState(0);

  const { analytics, updateAnalytics } = useVideoAnalytics(selectedEvent.id);

  // Mock analytics data
  useEffect(() => {
    updateAnalytics({
      totalViews: 15420,
      averageWatchTime: 180,
      completionRate: 67,
      clickThroughRate: 12.4,
      heatmapData: [],
      hotspotPerformance: [
        { hotspotId: 'suit-1', clicks: 45, conversions: 8, timestamp: 120 },
        { hotspotId: 'tie-1', clicks: 32, conversions: 12, timestamp: 180 },
        { hotspotId: 'shoes-1', clicks: 28, conversions: 6, timestamp: 240 }
      ],
      timelineEngagement: Array.from({ length: 20 }, (_, i) => ({
        time: i * 15,
        engagement: Math.random() * 40 + 40,
        dropoffRate: Math.random() * 20 + 5
      }))
    });
  }, [selectedEvent.id]);

  const handleProductClick = (product: Product) => {

    // Add product click analytics
    updateAnalytics({
      heatmapData: [
        ...analytics.heatmapData,
        {
          x: Math.random() * 100,
          y: Math.random() * 100,
          intensity: 1,
          timestamp: Date.now(),
          userId: 'current-user',
          action: 'click'
        }
      ]
    });
  };

  const handlePurchase = (productId: string, price: number) => {

    setShowCelebration(true);

    // Track conversion
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 animate-pulse';
      case 'upcoming': return 'bg-yellow-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimeUntilEvent = (startTime: Date) => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();

    if (diff <= 0) return 'Live Now';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Live Shopping Events
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join our style experts for exclusive deals, styling tips, and real-time fashion advice
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Live Event Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <InteractiveCard className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-3">
                <Eye className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedEvent.viewers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Live Viewers</div>
            </InteractiveCard>

            <InteractiveCard className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.clickThroughRate}%
              </div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </InteractiveCard>

            <InteractiveCard className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedEvent.specialOffers.length}
              </div>
              <div className="text-sm text-gray-600">Live Offers</div>
            </InteractiveCard>

            <InteractiveCard className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(analytics.averageWatchTime / 60)}m
              </div>
              <div className="text-sm text-gray-600">Avg Watch Time</div>
            </InteractiveCard>
          </div>

          {/* Event Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif mb-6">Available Events</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {liveEvents.map((event) => (
                <InteractiveCard
                  key={event.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedEvent.id === event.id ? 'ring-2 ring-purple-500 shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={event.host.avatar}
                      alt={event.host.name}
                      className="w-12 h-12 rounded-full border-2 border-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs ${getEventStatusColor(event.status)} text-white`}>
                          {event.status.toUpperCase()}
                        </Badge>
                        {event.status === 'upcoming' && (
                          <span className="text-sm text-gray-500">
                            in {formatTimeUntilEvent(event.startTime)}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.host.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {event.viewers.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {event.startTime.toLocaleDateString()}
                    </div>
                  </div>

                  {event.status === 'live' && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <SatisfyingButton
                        className="w-full mt-4"
                        onClick={() => {
                          setSelectedEvent(event);
                        }}
                      >
                      <Play className="w-4 h-4 mr-2" />
                      Join Live Event
                    </SatisfyingButton>
                    </div>
                  )}
                </InteractiveCard>
              ))}
            </div>
          </div>

          {/* Main Live Shopping Event */}
          {selectedEvent.status === 'live' ? (
            <div className="relative mb-8">
              <LiveShoppingEvent
                event={selectedEvent}
                onProductClick={handleProductClick}
                onPurchase={handlePurchase}
              />

              {/* Video Analytics Overlay */}
              <VideoHeatmap
                videoElement={null}
                analytics={analytics}
                isRecording={true}
                onAnalyticsUpdate={updateAnalytics}
              />
            </div>
          ) : (
            <Card className="p-8 text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-serif mb-4">Event Starting Soon</h3>
              <p className="text-gray-600 mb-6">
                {selectedEvent.title} will begin in {formatTimeUntilEvent(selectedEvent.startTime)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SatisfyingButton>
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Reminder
                </SatisfyingButton>
                <SatisfyingButton variant="secondary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </SatisfyingButton>
              </div>
            </Card>
          )}

          {/* Event Rating */}
          <Card className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Rate This Event</h3>
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-gray-600">How was your experience?</span>
              <AnimatedStarRating
                rating={eventRating}
                onRatingChange={setEventRating}
                size="lg"
              />
            </div>
            {eventRating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Thank you for your feedback!
              </p>
            )}
          </Card>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          icon={Sparkles}
          label="Join Next Event"
          onClick={() => {
            const nextEvent = liveEvents.find(e => e.status === 'upcoming');
            if (nextEvent) setSelectedEvent(nextEvent);
          }}
        />

        {/* Success Celebration */}
        <SuccessCelebration trigger={showCelebration} />
      </div>
    </PageTransition>
  );
}