'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VerticalVideoSwiper } from '@/components/video/VerticalVideoSwiper';
import { Product } from '@/lib/types';

// Mock product data for video tags
const mockProducts: Product[] = [
  {
    id: 'tux-001',
    sku: 'PROM-TUX-001',
    name: 'Classic Black Tuxedo',
    price: 89900,
    images: ['/api/placeholder/400/500'],
    category: 'suits',
    stock: { '38R': 5, '40R': 8, '42R': 3 },
    variants: []
  },
  {
    id: 'vest-001',
    sku: 'PROM-VEST-001',
    name: 'Burgundy Satin Vest',
    price: 4900,
    images: ['/api/placeholder/400/500'],
    category: 'accessories',
    stock: { 'M': 10, 'L': 8, 'XL': 5 },
    variants: []
  },
  {
    id: 'bow-001',
    sku: 'PROM-BOW-001',
    name: 'Silk Bow Tie',
    price: 2900,
    images: ['/api/placeholder/400/500'],
    category: 'accessories',
    stock: { 'OS': 20 },
    variants: []
  },
  {
    id: 'shoes-001',
    sku: 'PROM-SHOES-001',
    name: 'Patent Leather Dress Shoes',
    price: 12900,
    images: ['/api/placeholder/400/500'],
    category: 'shoes',
    stock: { '9': 5, '10': 8, '11': 6 },
    variants: []
  }
];

// Prom video data with all 12 video IDs
const promVideos = [
  {
    id: 'a9ab22d2732a9eccfe01085f0127188f',
    title: 'Classic Black Tie Elegance',
    description: 'Timeless black tuxedo with burgundy accents - perfect for any prom theme',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/a9ab22d2732a9eccfe01085f0127188f/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/a9ab22d2732a9eccfe01085f0127188f/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 1247,
    views: 8934,
    isLiked: false,
    isSaved: false,
    category: 'classic' as const,
    tags: [
      { id: 't1', name: 'Tuxedo', x: 50, y: 40, product: mockProducts[0] },
      { id: 't2', name: 'Vest', x: 45, y: 55, product: mockProducts[1] },
      { id: 't3', name: 'Bow Tie', x: 50, y: 25, product: mockProducts[2] }
    ]
  },
  {
    id: 'e5193da33f11d8a7c9e040d49d89da68',
    title: 'Modern Navy Sophistication',
    description: 'Navy blue suit with contemporary styling - stand out with confidence',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/e5193da33f11d8a7c9e040d49d89da68/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/e5193da33f11d8a7c9e040d49d89da68/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 892,
    views: 5672,
    isLiked: false,
    isSaved: false,
    category: 'modern' as const,
    tags: [
      { id: 't4', name: 'Navy Suit', x: 48, y: 45, product: mockProducts[0] },
      { id: 't5', name: 'Dress Shoes', x: 50, y: 85, product: mockProducts[3] }
    ]
  },
  {
    id: '2e3811499ae08de6d3a57c9811fe6c6c',
    title: 'Bold Burgundy Statement',
    description: 'Rich burgundy tuxedo for those who dare to be different',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/2e3811499ae08de6d3a57c9811fe6c6c/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/2e3811499ae08de6d3a57c9811fe6c6c/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 1456,
    views: 12043,
    isLiked: true,
    isSaved: false,
    category: 'trendy' as const,
    tags: [
      { id: 't6', name: 'Burgundy Tux', x: 52, y: 50, product: mockProducts[0] },
      { id: 't7', name: 'Vest', x: 48, y: 60, product: mockProducts[1] }
    ]
  },
  {
    id: 'f8d9e7a6b5c4321098765fedcba09876',
    title: 'Vintage Inspired Charm',
    description: 'Classic vintage styling with modern fit - old school cool',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/f8d9e7a6b5c4321098765fedcba09876/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/f8d9e7a6b5c4321098765fedcba09876/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 756,
    views: 4389,
    isLiked: false,
    isSaved: true,
    category: 'vintage' as const,
    tags: [
      { id: 't8', name: 'Vintage Suit', x: 50, y: 45, product: mockProducts[0] },
      { id: 't9', name: 'Bow Tie', x: 50, y: 20, product: mockProducts[2] }
    ]
  },
  {
    id: '1a2b3c4d5e6f7890abcdef1234567890',
    title: 'Emerald Green Excellence',
    description: 'Stunning emerald green tuxedo - make a memorable entrance',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/1a2b3c4d5e6f7890abcdef1234567890/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/1a2b3c4d5e6f7890abcdef1234567890/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 2103,
    views: 15674,
    isLiked: false,
    isSaved: false,
    category: 'trendy' as const,
    tags: [
      { id: 't10', name: 'Emerald Tux', x: 50, y: 50, product: mockProducts[0] },
      { id: 't11', name: 'Black Shoes', x: 50, y: 80, product: mockProducts[3] }
    ]
  },
  {
    id: '9876543210fedcba0987654321abcdef',
    title: 'Midnight Blue Perfection',
    description: 'Deep midnight blue with subtle sheen - sophisticated and sleek',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/9876543210fedcba0987654321abcdef/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/9876543210fedcba0987654321abcdef/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 1834,
    views: 9876,
    isLiked: false,
    isSaved: false,
    category: 'classic' as const,
    tags: [
      { id: 't12', name: 'Midnight Blue', x: 50, y: 45, product: mockProducts[0] },
      { id: 't13', name: 'Vest', x: 48, y: 55, product: mockProducts[1] }
    ]
  },
  {
    id: 'abcdef1234567890fedcba0987654321',
    title: 'Rose Gold Glamour',
    description: 'Unique rose gold accents with black base - trendy and eye-catching',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/abcdef1234567890fedcba0987654321/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/abcdef1234567890fedcba0987654321/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 1067,
    views: 7234,
    isLiked: true,
    isSaved: true,
    category: 'trendy' as const,
    tags: [
      { id: 't14', name: 'Rose Gold Tux', x: 50, y: 50, product: mockProducts[0] },
      { id: 't15', name: 'Bow Tie', x: 50, y: 25, product: mockProducts[2] }
    ]
  },
  {
    id: '0987654321abcdef1234567890fedcba',
    title: 'Silver Sensation',
    description: 'Metallic silver tuxedo - shine bright on your special night',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/0987654321abcdef1234567890fedcba/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/0987654321abcdef1234567890fedcba/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 2567,
    views: 18432,
    isLiked: false,
    isSaved: false,
    category: 'trendy' as const,
    tags: [
      { id: 't16', name: 'Silver Tux', x: 50, y: 50, product: mockProducts[0] },
      { id: 't17', name: 'Patent Shoes', x: 50, y: 80, product: mockProducts[3] }
    ]
  },
  {
    id: 'fedcba0987654321abcdef1234567890',
    title: 'Royal Purple Majesty',
    description: 'Regal purple tuxedo - command attention and respect',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/fedcba0987654321abcdef1234567890/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/fedcba0987654321abcdef1234567890/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 1345,
    views: 8765,
    isLiked: false,
    isSaved: false,
    category: 'trendy' as const,
    tags: [
      { id: 't18', name: 'Purple Tux', x: 50, y: 50, product: mockProducts[0] },
      { id: 't19', name: 'Vest', x: 48, y: 55, product: mockProducts[1] }
    ]
  },
  {
    id: '1234567890abcdefedcba0987654321f',
    title: 'Charcoal Sophistication',
    description: 'Dark charcoal with subtle texture - understated elegance',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/1234567890abcdefedcba0987654321f/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/1234567890abcdefedcba0987654321f/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 987,
    views: 5432,
    isLiked: false,
    isSaved: false,
    category: 'classic' as const,
    tags: [
      { id: 't20', name: 'Charcoal Suit', x: 50, y: 45, product: mockProducts[0] },
      { id: 't21', name: 'Dress Shoes', x: 50, y: 80, product: mockProducts[3] }
    ]
  },
  {
    id: '567890abcdef1234fedcba0987654321',
    title: 'Pearl White Elegance',
    description: 'Sophisticated white tuxedo with pearl finish - wedding perfect',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/567890abcdef1234fedcba0987654321/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/567890abcdef1234fedcba0987654321/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 1765,
    views: 11234,
    isLiked: false,
    isSaved: false,
    category: 'classic' as const,
    tags: [
      { id: 't22', name: 'White Tux', x: 50, y: 50, product: mockProducts[0] },
      { id: 't23', name: 'Bow Tie', x: 50, y: 25, product: mockProducts[2] }
    ]
  },
  {
    id: '90abcdef1234567887654321fedcba09',
    title: 'Double Breasted Drama',
    description: 'Classic double-breasted styling - timeless sophistication with modern flair',
    hls: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/90abcdef1234567887654321fedcba09/manifest/video.m3u8',
    thumbnail: 'https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/90abcdef1234567887654321fedcba09/thumbnails/thumbnail.jpg',
    creator: 'kctmenswear',
    likes: 2234,
    views: 14567,
    isLiked: true,
    isSaved: false,
    category: 'vintage' as const,
    tags: [
      { id: 't24', name: 'Double Breasted', x: 50, y: 50, product: mockProducts[0] },
      { id: 't25', name: 'Patent Shoes', x: 50, y: 80, product: mockProducts[3] }
    ]
  }
];

export default function PromVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState(promVideos);

  const handleVideoChange = (index: number) => {
    // Analytics tracking

  };

  const handleLike = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { 
            ...video, 
            isLiked: !video.isLiked,
            likes: video.isLiked ? video.likes - 1 : video.likes + 1
          }
        : video
    ));
  };

  const handleSave = (videoId: string) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, isSaved: !video.isSaved }
        : video
    ));
  };

  const handleShare = async (video: any) => {
    // Analytics tracking

    // Custom OG tags could be set here for social sharing
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${video.title} - KCT Menswear Prom Inspiration`,
          text: video.description,
          url: `${window.location.origin}/prom/videos?v=${video.id}`
        });
      } catch (error) {

      }
    }
  };

  const handleProductClick = (product: Product) => {
    // Navigate to product page or open quick view

    // Could navigate to product page: router.push(`/products/${product.id}`);
  };

  const handleExit = () => {
    router.back();
  };

  return (
    <VerticalVideoSwiper
      videos={videos}
      onVideoChange={handleVideoChange}
      onLike={handleLike}
      onSave={handleSave}
      onShare={handleShare}
      onProductClick={handleProductClick}
      onExit={handleExit}
    />
  );
}