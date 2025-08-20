'use client';

import { useState, useEffect, Suspense } from 'react';
import { SuitBuilder3D } from '@/components/builder/SuitBuilder3D';
import { SuitConfiguration } from '@/components/builder/SuitBuilder3D';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [savedConfigs, setSavedConfigs] = useState<SuitConfiguration[]>([]);
  const [initialConfig, setInitialConfig] = useState<Partial<SuitConfiguration> | undefined>();

  useEffect(() => {
    const preset = searchParams.get('preset');

    if (preset === 'wedding-swiper') {
      const preferencesStr = localStorage.getItem('weddingStylePreferences');
      if (preferencesStr) {
        const preferences = JSON.parse(preferencesStr);

        // Map preferences to suit configuration with avoidance logic
        const config: Partial<SuitConfiguration> = {
          fabric: {
            type: getPreferredFabricType(preferences),
            color: mapColorPreferenceToHex(preferences.preferredColors, preferences.avoidedColors),
            pattern: getPreferredPattern(preferences),
          },
          jacket: {
            style: getPreferredJacketStyle(preferences),
            lapel: getPreferredLapel(preferences),
            buttons: preferences.preferredFormality === 'Black Tie' ? 1 : 2,
            vents: preferences.preferredStyle === 'classic' && !isStyleAvoided(preferences, 'classic') ? 'center' : 'side',
            lining: '#8b0000',
          },
          trouser: {
            fit: getPreferredTrouserFit(preferences),
            pleats: preferences.preferredStyle === 'classic' && !isStyleAvoided(preferences, 'classic') ? 'single' : 'flat',
            cuffs: preferences.preferredFormality === 'Formal' || preferences.preferredFormality === 'Black Tie',
            rise: preferences.preferredStyle === 'classic' ? 'high' : 'medium',
          },
        };

        setInitialConfig(config);
      }
    }
  }, [searchParams]);

  const mapColorPreferenceToHex = (colorFamily: string, avoidedColors?: Array<{color: string, count: number}>): string => {
    // Check if primary preference is strongly avoided
    const isStronglyAvoided = avoidedColors?.some(avoided => avoided.color === colorFamily && avoided.count >= 2);

    if (isStronglyAvoided) {
      // Fall back to a safe neutral if their preference is contradicted by strong dislikes
      return '#1a1a1a'; // Charcoal as safe fallback
    }

    switch (colorFamily) {
      case 'neutral':
        return '#1a1a1a'; // Charcoal
      case 'cool':
        return '#1e3a8a'; // Navy Blue
      case 'warm':
        return '#713f12'; // Brown
      case 'jewel':
        return '#7f1d1d'; // Burgundy
      default:
        return '#1a1a1a';
    }
  };

  const isStyleAvoided = (preferences: any, style: string): boolean => {
    return preferences.avoidedStyles?.some((avoided: any) => avoided.style === style && avoided.count >= 2) || false;
  };

  const getPreferredFabricType = (preferences: any): 'wool' | 'cotton' | 'linen' | 'cashmere' => {
    // Base on formality and season preferences
    if (preferences.preferredFormality === 'Black Tie') return 'wool';
    if (preferences.preferredSeasons?.includes('Summer')) return 'linen';
    if (preferences.preferredFormality === 'Casual') return 'cotton';
    return 'wool'; // Safe default
  };

  const getPreferredPattern = (preferences: any): 'solid' | 'pinstripe' | 'plaid' | 'herringbone' => {
    // Avoid patterns if user consistently rejected patterned looks
    const stronglyPrefersClassic = preferences.preferredStyle === 'classic' && preferences.styleConfidence > 0.7;
    const avoidsBold = isStyleAvoided(preferences, 'bold');

    if (stronglyPrefersClassic || avoidsBold) return 'solid';
    if (preferences.preferredStyle === 'trendy') return 'herringbone';
    if (preferences.preferredStyle === 'modern') return 'pinstripe';
    return 'solid';
  };

  const getPreferredJacketStyle = (preferences: any): 'single-breasted' | 'double-breasted' => {
    if (preferences.preferredFormality === 'Black Tie' && !isStyleAvoided(preferences, 'bold')) {
      return 'double-breasted';
    }
    return 'single-breasted'; // Safe default, works for most
  };

  const getPreferredLapel = (preferences: any): 'notch' | 'peak' | 'shawl' => {
    if (preferences.preferredFormality === 'Black Tie') return 'peak';
    if (preferences.preferredStyle === 'modern' && !isStyleAvoided(preferences, 'modern')) return 'peak';
    return 'notch'; // Classic safe choice
  };

  const getPreferredTrouserFit = (preferences: any): 'slim' | 'classic' | 'relaxed' => {
    const avoidsSlim = preferences.avoidedStyles?.some((style: any) => 
      (style.style === 'modern' || style.style === 'trendy') && style.count >= 2
    );

    if (avoidsSlim) return 'classic';
    if (preferences.preferredStyle === 'modern' || preferences.preferredStyle === 'trendy') return 'slim';
    return 'classic';
  };

  const handleSave = (config: SuitConfiguration) => {

    setSavedConfigs([...savedConfigs, config]);
    // In a real app, this would save to a database
  };

  const handleAddToCart = (config: SuitConfiguration) => {

    // In a real app, this would add the custom suit to the cart
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            {savedConfigs.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Save className="h-4 w-4" />
                {savedConfigs.length} saved design{savedConfigs.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wedding Swiper Message */}
      {searchParams.get('preset') === 'wedding-swiper' && initialConfig && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-purple-800 mb-2">
                <span className="text-2xl">✨</span>
                <h3 className="text-lg font-semibold">
                  Suit Customized Based on Your Swipe Preferences!
                </h3>
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-sm text-purple-700">
                We've analyzed what you liked AND what you avoided to create your perfect starting point.
                Feel free to customize further!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3D Suit Builder */}
      <SuitBuilder3D
        onSave={handleSave}
        onAddToCart={handleAddToCart}
        initialConfig={initialConfig}
      />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-center mb-12">Why Custom?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✂️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect Fit</h3>
              <p className="text-gray-600">
                Tailored precisely to your measurements for unmatched comfort and style
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unlimited Options</h3>
              <p className="text-gray-600">
                Choose from countless fabric, color, and style combinations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Delivery</h3>
              <p className="text-gray-600">
                Your custom suit delivered in just 2-3 weeks
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BuilderContent />
    </Suspense>
  );
}