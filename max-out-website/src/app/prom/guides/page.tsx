'use client';

import { useState } from 'react';
import { PromGuides } from '@/components/prom/PromGuides';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock video guides
const mockGuides = [
  {
    id: 'g1',
    title: 'How to Choose the Perfect Prom Tuxedo',
    description: 'Everything you need to know about selecting a tuxedo that fits your style and body type',
    duration: '8:45',
    thumbnail: '/api/placeholder/600/400',
    videoId: 'mock-video-1',
    category: 'styling' as const,
    views: 125000,
    likes: 4800,
    chapters: [
      { title: 'Introduction', timestamp: 0 },
      { title: 'Understanding Tuxedo Styles', timestamp: 45 },
      { title: 'Choosing the Right Fit', timestamp: 180 },
      { title: 'Color Coordination', timestamp: 320 },
      { title: 'Final Tips', timestamp: 480 },
    ],
  },
  {
    id: 'g2',
    title: 'Perfect Fit: Measurement Guide',
    description: 'Learn how to take accurate measurements for the best fitting formal wear',
    duration: '6:30',
    thumbnail: '/api/placeholder/600/400',
    videoId: 'mock-video-2',
    category: 'fitting' as const,
    views: 89000,
    likes: 3200,
    chapters: [
      { title: 'Tools You\'ll Need', timestamp: 0 },
      { title: 'Chest Measurement', timestamp: 60 },
      { title: 'Waist & Hip Measurement', timestamp: 150 },
      { title: 'Inseam & Sleeve Length', timestamp: 240 },
      { title: 'Common Mistakes', timestamp: 330 },
    ],
  },
  {
    id: 'g3',
    title: 'Prom Etiquette 101',
    description: 'Essential manners and behavior tips for prom night',
    duration: '5:15',
    thumbnail: '/api/placeholder/600/400',
    videoId: 'mock-video-3',
    category: 'etiquette' as const,
    views: 67000,
    likes: 2100,
    chapters: [
      { title: 'Arrival & Photos', timestamp: 0 },
      { title: 'Dinner Etiquette', timestamp: 90 },
      { title: 'Dancing Do\'s and Don\'ts', timestamp: 180 },
      { title: 'After-Prom Tips', timestamp: 270 },
    ],
  },
  {
    id: 'g4',
    title: '2024 Prom Trends: What\'s Hot',
    description: 'Discover the latest trends in prom fashion for this year',
    duration: '7:00',
    thumbnail: '/api/placeholder/600/400',
    videoId: 'mock-video-4',
    category: 'trends' as const,
    views: 156000,
    likes: 5600,
    chapters: [
      { title: 'Color Trends', timestamp: 0 },
      { title: 'Pattern Play', timestamp: 120 },
      { title: 'Accessory Trends', timestamp: 240 },
      { title: 'Shoe Styles', timestamp: 360 },
    ],
  },
  {
    id: 'g5',
    title: 'Accessorizing Your Prom Look',
    description: 'Complete your outfit with the perfect accessories',
    duration: '5:45',
    thumbnail: '/api/placeholder/600/400',
    videoId: 'mock-video-5',
    category: 'styling' as const,
    views: 98000,
    likes: 3400,
    chapters: [
      { title: 'Bow Ties vs Neckties', timestamp: 0 },
      { title: 'Pocket Squares', timestamp: 90 },
      { title: 'Cufflinks & Studs', timestamp: 180 },
      { title: 'Belts & Suspenders', timestamp: 270 },
    ],
  },
  {
    id: 'g6',
    title: 'Group Coordination Tips',
    description: 'How to coordinate looks with your prom group',
    duration: '4:30',
    thumbnail: '/api/placeholder/600/400',
    videoId: 'mock-video-6',
    category: 'styling' as const,
    views: 72000,
    likes: 2800,
    chapters: [
      { title: 'Color Coordination', timestamp: 0 },
      { title: 'Style Variations', timestamp: 90 },
      { title: 'Group Photos', timestamp: 180 },
      { title: 'Budget Tips', timestamp: 240 },
    ],
  },
];

export default function PromGuidesPage() {
  const handleGuideView = (guide: any) => {

  };

  const handleGuideShare = (guide: any) => {

  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/prom" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              Back to Prom Central
            </Link>
          </div>
        </div>
      </div>

      {/* Prom Guides */}
      <PromGuides
        guides={mockGuides}
        onGuideView={handleGuideView}
        onGuideShare={handleGuideShare}
      />
    </div>
  );
}