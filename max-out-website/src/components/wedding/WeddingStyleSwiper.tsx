'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SatisfyingButton } from '@/components/ui/micro-interactions';
import { 
  Heart, 
  X as XIcon, 
  Sparkles, 
  TrendingUp,
  RefreshCw,
  ChevronRight,
  Loader2,
  Camera,
  Info
} from 'lucide-react';

interface WeddingOutfit {
  id: string;
  suit: string;
  shirt: string;
  tie: string;
  venue: string;
  season: string;
  formality: string;
  imageUrl?: string;
  style: 'classic' | 'modern' | 'trendy' | 'bold';
  colorFamily: 'neutral' | 'warm' | 'cool' | 'jewel';
}

// 12 Diverse wedding outfit combinations for maximum style coverage
const weddingOutfits: WeddingOutfit[] = [
  {
    id: '1',
    suit: 'Navy Blue',
    shirt: 'White',
    tie: 'Burgundy',
    venue: 'Church',
    season: 'Fall',
    formality: 'Formal',
    style: 'classic',
    colorFamily: 'neutral'
  },
  {
    id: '2',
    suit: 'Light Grey',
    shirt: 'Light Blue',
    tie: 'Blush Pink',
    venue: 'Garden',
    season: 'Spring',
    formality: 'Semi-Formal',
    style: 'modern',
    colorFamily: 'cool'
  },
  {
    id: '3',
    suit: 'Sage Green',
    shirt: 'White',
    tie: 'Rust Orange',
    venue: 'Outdoor',
    season: 'Summer',
    formality: 'Casual',
    style: 'trendy',
    colorFamily: 'warm'
  },
  {
    id: '4',
    suit: 'Burgundy',
    shirt: 'White',
    tie: 'Gold',
    venue: 'Vineyard',
    season: 'Fall',
    formality: 'Formal',
    style: 'bold',
    colorFamily: 'jewel'
  },
  {
    id: '5',
    suit: 'Charcoal',
    shirt: 'White',
    tie: 'Silver',
    venue: 'Ballroom',
    season: 'Winter',
    formality: 'Black Tie',
    style: 'classic',
    colorFamily: 'neutral'
  },
  {
    id: '6',
    suit: 'Tan',
    shirt: 'White',
    tie: 'Navy',
    venue: 'Beach',
    season: 'Summer',
    formality: 'Casual',
    style: 'classic',
    colorFamily: 'warm'
  },
  {
    id: '7',
    suit: 'Emerald Green',
    shirt: 'White',
    tie: 'Black Bow',
    venue: 'Evening',
    season: 'Winter',
    formality: 'Formal',
    style: 'bold',
    colorFamily: 'jewel'
  },
  {
    id: '8',
    suit: 'Powder Blue',
    shirt: 'White',
    tie: 'Coral',
    venue: 'Garden',
    season: 'Spring',
    formality: 'Semi-Formal',
    style: 'modern',
    colorFamily: 'cool'
  },
  {
    id: '9',
    suit: 'Black',
    shirt: 'White',
    tie: 'Black Bow',
    venue: 'Ballroom',
    season: 'Any',
    formality: 'Black Tie',
    style: 'classic',
    colorFamily: 'neutral'
  },
  {
    id: '10',
    suit: 'Olive Green',
    shirt: 'Cream',
    tie: 'Mustard',
    venue: 'Barn',
    season: 'Fall',
    formality: 'Casual',
    style: 'trendy',
    colorFamily: 'warm'
  },
  {
    id: '11',
    suit: 'Royal Blue',
    shirt: 'White',
    tie: 'Pink',
    venue: 'Modern',
    season: 'Spring',
    formality: 'Semi-Formal',
    style: 'modern',
    colorFamily: 'cool'
  },
  {
    id: '12',
    suit: 'Brown Tweed',
    shirt: 'Ivory',
    tie: 'Forest Green',
    venue: 'Rustic',
    season: 'Fall',
    formality: 'Semi-Formal',
    style: 'trendy',
    colorFamily: 'warm'
  }
];

interface SwipeData {
  outfitId: string;
  liked: boolean;
  style: string;
  colorFamily: string;
  formality: string;
}

export function WeddingStyleSwiper() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState<SwipeData[]>([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(true);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);

  // Generate images on mount
  useEffect(() => {
    generateAllImages();
  }, []);

  const generateAllImages = async () => {
    setIsGeneratingImages(true);
    const images: Record<string, string> = {};

    // Generate images in batches to avoid overwhelming the API
    for (let i = 0; i < weddingOutfits.length; i += 3) {
      const batch = weddingOutfits.slice(i, i + 3);

      await Promise.all(
        batch.map(async (outfit) => {
          try {
            const response = await fetch('/api/wedding-studio/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                venue: outfit.venue.toLowerCase(),
                suitColor: outfit.suit.toLowerCase().replace(/\s+/g, '_'),
                partySize: 5,
                timeOfDay: outfit.season === 'Winter' ? 'evening' : 'afternoon',
                season: outfit.season.toLowerCase(),
                accessories: []
              }),
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.images?.[0]) {
                images[outfit.id] = data.images[0];
              }
            }
          } catch (error) {

          }
        })
      );
    }

    // Fallback to placeholder images if generation fails
    weddingOutfits.forEach((outfit) => {
      if (!images[outfit.id]) {
        images[outfit.id] = `/api/placeholder/800/1000?text=${encodeURIComponent(
          `${outfit.suit} Suit\n${outfit.shirt} Shirt\n${outfit.tie} Tie`
        )}`;
      }
    });

    setGeneratedImages(images);
    setIsGeneratingImages(false);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= weddingOutfits.length) return;

    const currentOutfit = weddingOutfits[currentIndex];
    const swipeData: SwipeData = {
      outfitId: currentOutfit.id,
      liked: direction === 'right',
      style: currentOutfit.style,
      colorFamily: currentOutfit.colorFamily,
      formality: currentOutfit.formality
    };

    setSwipes([...swipes, swipeData]);
    setCurrentIndex(currentIndex + 1);

    // Check if we've reached 6 RIGHT swipes
    const allSwipes = [...swipes, swipeData];
    const rightSwipes = allSwipes.filter(s => s.liked).length;

    if (rightSwipes >= 6 || currentIndex + 1 >= weddingOutfits.length) {
      analyzePreferences(allSwipes);
    }
  };

  const analyzePreferences = (allSwipes: SwipeData[]) => {
    const likedSwipes = allSwipes.filter(s => s.liked);
    const dislikedSwipes = allSwipes.filter(s => !s.liked);

    // Analyze LIKED preferences
    const likedStyleCount = likedSwipes.reduce((acc, swipe) => {
      acc[swipe.style] = (acc[swipe.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const likedColorCount = likedSwipes.reduce((acc, swipe) => {
      acc[swipe.colorFamily] = (acc[swipe.colorFamily] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const likedFormalityCount = likedSwipes.reduce((acc, swipe) => {
      acc[swipe.formality] = (acc[swipe.formality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Analyze DISLIKED preferences (what to avoid)
    const dislikedStyleCount = dislikedSwipes.reduce((acc, swipe) => {
      acc[swipe.style] = (acc[swipe.style] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dislikedColorCount = dislikedSwipes.reduce((acc, swipe) => {
      acc[swipe.colorFamily] = (acc[swipe.colorFamily] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dislikedFormalityCount = dislikedSwipes.reduce((acc, swipe) => {
      acc[swipe.formality] = (acc[swipe.formality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get venue and season preferences from liked/disliked outfits
    const likedVenues = likedSwipes.map(s => weddingOutfits.find(o => o.id === s.outfitId)?.venue).filter(Boolean);
    const dislikedVenues = dislikedSwipes.map(s => weddingOutfits.find(o => o.id === s.outfitId)?.venue).filter(Boolean);
    const likedSeasons = likedSwipes.map(s => weddingOutfits.find(o => o.id === s.outfitId)?.season).filter(Boolean);
    const dislikedSeasons = dislikedSwipes.map(s => weddingOutfits.find(o => o.id === s.outfitId)?.season).filter(Boolean);

    // Calculate confidence scores (higher liked count = higher confidence)
    const getTotalLikes = (obj: Record<string, number>) => Object.values(obj).reduce((a, b) => a + b, 0);
    const getTotalDislikes = (obj: Record<string, number>) => Object.values(obj).reduce((a, b) => a + b, 0);

    // Store comprehensive preferences for suit builder
    const preferences = {
      // Positive preferences (what they like)
      preferredStyle: Object.entries(likedStyleCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'classic',
      preferredColors: Object.entries(likedColorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral',
      preferredFormality: Object.entries(likedFormalityCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Semi-Formal',

      // Negative preferences (what to avoid)
      avoidedStyles: Object.entries(dislikedStyleCount).sort((a, b) => b[1] - a[1]).map(([style, count]) => ({ style, count })),
      avoidedColors: Object.entries(dislikedColorCount).sort((a, b) => b[1] - a[1]).map(([color, count]) => ({ color, count })),
      avoidedFormality: Object.entries(dislikedFormalityCount).sort((a, b) => b[1] - a[1]).map(([formality, count]) => ({ formality, count })),

      // Venue and season insights
      preferredVenues: [...new Set(likedVenues)],
      avoidedVenues: [...new Set(dislikedVenues)],
      preferredSeasons: [...new Set(likedSeasons)],
      avoidedSeasons: [...new Set(dislikedSeasons)],

      // Confidence metrics
      styleConfidence: getTotalLikes(likedStyleCount) / Math.max(1, getTotalLikes(likedStyleCount) + getTotalDislikes(dislikedStyleCount)),
      colorConfidence: getTotalLikes(likedColorCount) / Math.max(1, getTotalLikes(likedColorCount) + getTotalDislikes(dislikedColorCount)),
      formalityConfidence: getTotalLikes(likedFormalityCount) / Math.max(1, getTotalLikes(likedFormalityCount) + getTotalDislikes(dislikedFormalityCount)),

      // Original data for analysis
      likedOutfits: likedSwipes.map(s => weddingOutfits.find(o => o.id === s.outfitId)).filter(Boolean),
      dislikedOutfits: dislikedSwipes.map(s => weddingOutfits.find(o => o.id === s.outfitId)).filter(Boolean),
      totalSwipes: allSwipes.length,
      likeRatio: likedSwipes.length / allSwipes.length
    };

    localStorage.setItem('weddingStylePreferences', JSON.stringify(preferences));
    setShowResults(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const voteThreshold = 100;
    const velocity = info.velocity.x;

    if (Math.abs(info.offset.x) > threshold) {
      setExitX(info.offset.x > 0 ? 200 : -200);
      setExitY(info.offset.y);

      if (info.offset.x > voteThreshold || velocity > 500) {
        handleSwipe('right');
      } else if (info.offset.x < -voteThreshold || velocity < -500) {
        handleSwipe('left');
      }
    }
  };

  const resetSwiper = () => {
    setCurrentIndex(0);
    setSwipes([]);
    setShowResults(false);
  };

  const goToSuitBuilder = () => {
    router.push('/builder?preset=wedding-swiper');
  };

  if (isGeneratingImages) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-gold mx-auto" />
          <h3 className="text-xl font-semibold">Generating Wedding Looks...</h3>
          <p className="text-gray-600">Creating personalized outfit visualizations</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const preferences = JSON.parse(localStorage.getItem('weddingStylePreferences') || '{}');
    const likedCount = swipes.filter(s => s.liked).length;

    return (
      <Card className="max-w-4xl mx-auto p-8">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-gold" />
          </div>

          <h2 className="text-3xl font-serif">Your Wedding Style Profile</h2>

          {/* Preferences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            {/* What You Love */}
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                What You Love
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Style:</span>
                  <span className="font-semibold capitalize text-green-700">{preferences.preferredStyle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Colors:</span>
                  <span className="font-semibold capitalize text-green-700">{preferences.preferredColors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Formality:</span>
                  <span className="font-semibold text-green-700">{preferences.preferredFormality}</span>
                </div>
                {preferences.preferredVenues?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Venues:</span>
                    <span className="font-semibold text-green-700">{preferences.preferredVenues.slice(0, 2).join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* What You Avoid */}
            <div className="p-6 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                <XIcon className="w-5 h-5" />
                What You Avoid
              </h3>
              <div className="space-y-3">
                {preferences.avoidedStyles?.[0] && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Style:</span>
                    <span className="font-semibold capitalize text-red-700">{preferences.avoidedStyles[0].style}</span>
                  </div>
                )}
                {preferences.avoidedColors?.[0] && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Colors:</span>
                    <span className="font-semibold capitalize text-red-700">{preferences.avoidedColors[0].color}</span>
                  </div>
                )}
                {preferences.avoidedFormality?.[0] && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Formality:</span>
                    <span className="font-semibold text-red-700">{preferences.avoidedFormality[0].formality}</span>
                  </div>
                )}
                {!preferences.avoidedStyles?.[0] && !preferences.avoidedColors?.[0] && !preferences.avoidedFormality?.[0] && (
                  <p className="text-sm text-gray-500 italic">Great taste! You didn't reject any major categories.</p>
                )}
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Preference Confidence</h4>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(preferences.styleConfidence * 100)}%</div>
                <div className="text-xs text-blue-600">Style</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(preferences.colorConfidence * 100)}%</div>
                <div className="text-xs text-blue-600">Color</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(preferences.formalityConfidence * 100)}%</div>
                <div className="text-xs text-blue-600">Formality</div>
              </div>
            </div>
          </div>

          <p className="text-gray-600">
            You liked {likedCount} styles after reviewing {swipes.length} options ({Math.round(preferences.likeRatio * 100)}% approval rate). 
            We've analyzed both your likes and dislikes to create your perfect wedding look!
          </p>

          <div className="flex gap-4 justify-center">
            <SatisfyingButton onClick={resetSwiper} variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </SatisfyingButton>
            <SatisfyingButton onClick={goToSuitBuilder} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              Build My Perfect Suit
              <ChevronRight className="w-4 h-4 ml-2" />
            </SatisfyingButton>
          </div>

          {/* Insight Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left max-w-2xl mx-auto">
            <h4 className="font-semibold mb-2 text-center">💡 Your Style Insights</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your suit will emphasize <strong>{preferences.preferredStyle}</strong> styling with <strong>{preferences.preferredColors}</strong> tones</li>
              <li>• We'll avoid elements similar to styles you rejected</li>
              <li>• Formality level optimized for <strong>{preferences.preferredFormality}</strong> occasions</li>
              {preferences.avoidedStyles?.[0] && (
                <li>• We noticed you're not a fan of <strong>{preferences.avoidedStyles[0].style}</strong> styles - we'll steer clear!</li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    );
  }

  if (currentIndex >= weddingOutfits.length) {
    return (
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <h3 className="text-2xl font-serif mb-4">All Done!</h3>
        <p className="text-gray-600 mb-6">You've viewed all wedding styles.</p>
        <SatisfyingButton onClick={resetSwiper}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Start Over
        </SatisfyingButton>
      </Card>
    );
  }

  const currentOutfit = weddingOutfits[currentIndex];
  const remainingCards = weddingOutfits.length - currentIndex;
  const rightSwipeCount = swipes.filter(s => s.liked).length;

  return (
    <div className="relative max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 font-medium">
            Card {currentIndex + 1} of {weddingOutfits.length}
          </span>
          <span className="text-sm font-medium">
            {rightSwipeCount < 6 ? (
              <span className="text-green-600">
                {rightSwipeCount}/6 likes • {Math.max(0, 6 - rightSwipeCount)} more needed
              </span>
            ) : (
              <span className="text-green-600 font-bold">✓ Ready to build!</span>
            )}
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(rightSwipeCount / 6) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="absolute top-0 left-0 w-full flex justify-between px-1">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 h-3 ${i < rightSwipeCount ? 'bg-green-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative h-[600px] mb-6 touch-none select-none">
        <AnimatePresence mode="wait">
          {/* Show next 2 cards underneath for depth */}
          {currentIndex + 2 < weddingOutfits.length && (
            <Card className="absolute inset-0 transform scale-90 opacity-30">
              <img
                src={generatedImages[weddingOutfits[currentIndex + 2].id]}
                alt="Next outfit"
                className="w-full h-full object-cover rounded-lg"
              />
            </Card>
          )}
          {currentIndex + 1 < weddingOutfits.length && (
            <Card className="absolute inset-0 transform scale-95 opacity-50">
              <img
                src={generatedImages[weddingOutfits[currentIndex + 1].id]}
                alt="Next outfit"
                className="w-full h-full object-cover rounded-lg"
              />
            </Card>
          )}

          {/* Current Card */}
          <motion.div
            key={currentOutfit.id}
            className="absolute inset-0"
            drag="x"
            dragConstraints={{ left: -200, right: 200 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            onDrag={(_, info) => {
              setExitX(info.offset.x);
              setExitY(info.offset.y);
            }}
            whileDrag={{ 
              scale: 1.05,
              rotate: exitX / 10,
            }}
            animate={{ 
              x: 0, 
              y: 0,
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            exit={{ 
              x: exitX > 0 ? 300 : -300,
              y: exitY,
              opacity: 0,
              rotate: exitX / 10,
              transition: { duration: 0.3, ease: 'easeOut' }
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            <Card className="h-full cursor-grab active:cursor-grabbing overflow-hidden shadow-2xl">
              <motion.div 
                className="relative h-full"
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={generatedImages[currentOutfit.id]}
                  alt={`${currentOutfit.suit} wedding outfit`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay with outfit details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">
                        {currentOutfit.suit} Suit
                      </h3>
                      <div className="flex gap-2 mb-3">
                        <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                          {currentOutfit.venue}
                        </Badge>
                        <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                          {currentOutfit.season}
                        </Badge>
                        <Badge className="bg-white/20 backdrop-blur text-white border-white/30">
                          {currentOutfit.formality}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white rounded-full" />
                      <span>{currentOutfit.shirt} Shirt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gold rounded-full" />
                      <span>{currentOutfit.tie} Tie</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic swipe indicators */}
                <motion.div 
                  className="absolute top-8 left-8 px-6 py-3 bg-red-500 text-white font-bold rounded-xl rotate-[-20deg] shadow-lg select-none pointer-events-none"
                  style={{ fontSize: '1.5rem' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: exitX < -50 ? 1 : 0,
                    scale: exitX < -50 ? 1 : 0.5
                  }}
                  transition={{ duration: 0.1 }}
                >
                  NOPE
                </motion.div>
                <motion.div 
                  className="absolute top-8 right-8 px-6 py-3 bg-green-500 text-white font-bold rounded-xl rotate-[20deg] shadow-lg select-none pointer-events-none"
                  style={{ fontSize: '1.5rem' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: exitX > 50 ? 1 : 0,
                    scale: exitX > 50 ? 1 : 0.5
                  }}
                  transition={{ duration: 0.1 }}
                >
                  LIKE
                </motion.div>
              </motion.div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-8">
        <motion.button
          onClick={() => handleSwipe('left')}
          className="w-20 h-20 bg-white border-4 border-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95"
          whileTap={{ scale: 0.9 }}
        >
          <XIcon className="w-10 h-10 text-red-500" />
        </motion.button>

        <motion.button
          onClick={() => handleSwipe('right')}
          className="w-20 h-20 bg-white border-4 border-green-500 hover:bg-green-50 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95"
          whileTap={{ scale: 0.9 }}
        >
          <Heart className="w-10 h-10 text-green-500 fill-current" />
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
          <Info className="w-4 h-4" />
          Swipe right or tap ❤️ to like, left or ✕ to pass
        </p>
        <p className="text-xs text-gray-500">
          Pro tip: Drag the card to see the like/nope indicators!
        </p>
      </div>
    </div>
  );
}