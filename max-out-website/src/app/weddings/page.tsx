'use client';

import { useState } from 'react';
import { WeddingPortal } from '@/components/wedding/WeddingPortal';
import { WeddingStudio } from '@/components/wedding/WeddingStudio';
import { Wedding, WeddingMember } from '@/lib/types';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, ShoppingBag, Camera, BookOpen, Heart, Star, Crown, Palette, RefreshCw, Gift } from 'lucide-react';

// Mock wedding data
const mockWedding: Wedding = {
  id: 'w-123',
  weddingDate: new Date('2024-08-15'),
  groomId: 'user-1',
  status: 'planning',
  partyMembers: [
    {
      id: 'user-1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'groom',
      measurements: {
        chest: 40,
        waist: 32,
        hips: 38,
        neck: 15.5,
        inseam: 32,
        sleeve: 34,
      },
    },
    {
      id: 'user-2',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'best_man',
      measurements: undefined,
    },
    {
      id: 'user-3',
      name: 'David Lee',
      email: 'david@example.com',
      role: 'groomsman',
      measurements: {
        chest: 42,
        waist: 34,
        hips: 40,
        neck: 16,
        inseam: 30,
        sleeve: 33,
      },
    },
    {
      id: 'user-4',
      name: 'Chris Wilson',
      email: 'chris@example.com',
      role: 'groomsman',
      measurements: undefined,
    },
  ],
};

export default function WeddingsPage() {
  const [wedding, setWedding] = useState<Wedding>(mockWedding);
  const [showWeddingStudio, setShowWeddingStudio] = useState(false);
  const currentUserId = 'user-1'; // Mock current user

  const handleUpdateWedding = (updatedWedding: Wedding) => {
    setWedding(updatedWedding);

  };

  const handleSendMessage = (message: string, recipientId?: string) => {

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Luxury Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-rose-200/50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>

            <div className="flex gap-4">
              <Link 
                href="/weddings/collections" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse Collections
              </Link>
              <Link 
                href="/weddings/coordination" 
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900 hover:bg-gray-900 hover:text-white rounded-lg font-semibold transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                Group Tools
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Content */}
      {showWeddingStudio ? (
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setShowWeddingStudio(false)}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Wedding Portal
              </button>
            </div>
            <WeddingStudio />
          </div>
        </div>
      ) : (
        <>
          {/* Wedding Portal */}
          <WeddingPortal
            wedding={wedding}
            currentUserId={currentUserId}
            onUpdateWedding={handleUpdateWedding}
            onSendMessage={handleSendMessage}
          />

          {/* Luxury Quick Actions */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Heart className="w-6 h-6 text-rose-500" />
                  <h2 className="text-4xl md:text-5xl font-light text-gray-900">Wedding Essentials</h2>
                  <Heart className="w-6 h-6 text-rose-500" />
                </div>
                <div className="w-24 h-px bg-rose-300 mx-auto mb-6" />
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Everything you need to create the perfect wedding day look for your entire party
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
                {[
                  {
                    href: '/weddings/collections',
                    icon: <ShoppingBag className="w-8 h-8" />,
                    title: 'Browse Collections',
                    description: 'Explore curated wedding styles for your party',
                    color: 'from-rose-500 to-pink-600'
                  },
                  {
                    href: '/weddings/coordination',
                    icon: <Users className="w-8 h-8" />,
                    title: 'Coordinate Group',
                    description: 'Manage invitations, sizes, and orders',
                    color: 'from-purple-500 to-indigo-600'
                  },
                  {
                    href: '/weddings/seasonal',
                    icon: <Calendar className="w-8 h-8" />,
                    title: 'Seasonal Collections',
                    description: 'Spring, Summer, Fall wedding styles',
                    color: 'from-green-500 to-emerald-600'
                  },
                  {
                    href: '/weddings/color-matching',
                    icon: <Palette className="w-8 h-8" />,
                    title: 'Color Matching',
                    description: 'Perfect color coordination for your theme',
                    color: 'from-pink-500 to-rose-600'
                  },
                  {
                    href: '/build-your-look',
                    icon: <Crown className="w-8 h-8" />,
                    title: 'Custom Builder',
                    description: 'Create unique suits for your special day',
                    color: 'from-amber-500 to-orange-600'
                  },
                  {
                    onClick: () => setShowWeddingStudio(true),
                    icon: <Camera className="w-8 h-8" />,
                    title: 'Wedding Studio',
                    description: 'AI-powered wedding visualization',
                    color: 'from-teal-500 to-cyan-600'
                  },
                  {
                    href: '/weddings/group-ordering',
                    icon: <Gift className="w-8 h-8" />,
                    title: 'Group Ordering',
                    description: 'Simplified ordering for groomsmen',
                    color: 'from-indigo-500 to-blue-600'
                  }
                ].map((action, index) => {
                  const Component = action.href ? Link : 'button';
                  const props = action.href ? { href: action.href } : { onClick: action.onClick };
                  
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Component 
                        {...props}
                        className="block w-full h-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200"
                      >
                        <div className="text-center">
                          <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 text-white shadow-lg`}>
                            {action.icon}
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-gray-700 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                            {action.description}
                          </p>
                        </div>
                      </Component>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* NEW: Seasonal Wedding Collections */}
          <section className="py-20 bg-gradient-to-br from-rose-50 to-amber-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">Seasonal Collections</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover the perfect look for your wedding season
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    season: 'Spring',
                    description: 'Light fabrics and fresh colors for garden ceremonies',
                    image: 'https://cdn.kctmenswear.com/spring-wedding.jpg',
                    colors: ['#E8F5E8', '#F0F8F0', '#DFF0DF'],
                    href: '/collections/wedding/spring'
                  },
                  {
                    season: 'Summer',
                    description: 'Breathable materials perfect for outdoor celebrations',
                    image: 'https://cdn.kctmenswear.com/summer-wedding.jpg',
                    colors: ['#FFF8DC', '#F5F5DC', '#F0E68C'],
                    href: '/collections/wedding/summer'
                  },
                  {
                    season: 'Fall',
                    description: 'Rich textures and warm tones for autumn romance',
                    image: 'https://cdn.kctmenswear.com/fall-wedding.jpg',
                    colors: ['#8B4513', '#A0522D', '#CD853F'],
                    href: '/collections/wedding/fall'
                  }
                ].map((collection, index) => (
                  <motion.div
                    key={collection.season}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="group"
                  >
                    <Link href={collection.href}>
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                        <div className="aspect-[4/3] bg-gray-100 relative">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                          <div className="absolute bottom-4 left-6 text-white">
                            <h3 className="text-2xl font-serif font-semibold mb-1">{collection.season} Weddings</h3>
                            <div className="flex gap-2">
                              {collection.colors.map((color, i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                            {collection.description}
                          </p>
                          <div className="mt-4 text-rose-600 font-medium group-hover:text-rose-700 transition-colors">
                            Explore Collection →
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}