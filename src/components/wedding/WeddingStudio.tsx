'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Camera, 
  Download, 
  Heart, 
  Share2, 
  Wand2, 
  Users, 
  MapPin,
  Clock,
  Palette,
  ChevronDown,
  Star,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SatisfyingButton, InteractiveCard } from '@/components/ui/micro-interactions';

interface WeddingVisualizationParams {
  venue: string;
  suitColor: string;
  partySize: number;
  timeOfDay: string;
  season: string;
  accessories: string[];
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  params: WeddingVisualizationParams;
  timestamp: Date;
  liked: boolean;
  saved: boolean;
}

const venueOptions = [
  { id: 'beach', name: 'Beach Wedding', icon: '🏖️', description: 'Ocean views and sandy shores' },
  { id: 'church', name: 'Traditional Church', icon: '⛪', description: 'Classic cathedral setting' },
  { id: 'garden', name: 'Garden Party', icon: '🌸', description: 'Outdoor botanical beauty' },
  { id: 'barn', name: 'Rustic Barn', icon: '🏚️', description: 'Country charm and warmth' },
  { id: 'ballroom', name: 'Elegant Ballroom', icon: '💎', description: 'Luxury and sophistication' },
  { id: 'vineyard', name: 'Vineyard Estate', icon: '🍇', description: 'Wine country romance' }
];

const suitColorOptions = [
  { id: 'navy', name: 'Navy Blue', color: '#1e3a8a', description: 'Timeless and versatile' },
  { id: 'charcoal', name: 'Charcoal Grey', color: '#374151', description: 'Modern sophistication' },
  { id: 'black', name: 'Classic Black', color: '#000000', description: 'Formal elegance' },
  { id: 'tan', name: 'Light Tan', color: '#d2b48c', description: 'Casual sophistication' },
  { id: 'burgundy', name: 'Deep Burgundy', color: '#7c2d12', description: 'Bold and distinctive' },
  { id: 'forest', name: 'Forest Green', color: '#14532d', description: 'Natural and rich' }
];

const timeOfDayOptions = [
  { id: 'morning', name: 'Morning Ceremony', icon: '🌅', description: 'Soft golden light' },
  { id: 'afternoon', name: 'Afternoon Reception', icon: '☀️', description: 'Bright natural light' },
  { id: 'sunset', name: 'Golden Hour', icon: '🌇', description: 'Romantic warm tones' },
  { id: 'evening', name: 'Evening Celebration', icon: '🌙', description: 'Dramatic ambiance' }
];

const seasonOptions = [
  { id: 'spring', name: 'Spring', icon: '🌸', colors: 'Fresh greens and pastels' },
  { id: 'summer', name: 'Summer', icon: '☀️', colors: 'Bright blues and whites' },
  { id: 'fall', name: 'Autumn', icon: '🍂', colors: 'Warm oranges and golds' },
  { id: 'winter', name: 'Winter', icon: '❄️', colors: 'Cool whites and silvers' }
];

const presetCombinations = [
  {
    name: 'Classic Elegance',
    venue: 'ballroom',
    suitColor: 'black',
    partySize: 5,
    timeOfDay: 'evening',
    season: 'winter',
    description: 'Timeless black tuxedos in an elegant ballroom'
  },
  {
    name: 'Rustic Romance',
    venue: 'barn',
    suitColor: 'tan',
    partySize: 4,
    timeOfDay: 'sunset',
    season: 'fall',
    description: 'Warm tan suits in a charming rustic barn'
  },
  {
    name: 'Beach Bliss',
    venue: 'beach',
    suitColor: 'navy',
    partySize: 6,
    timeOfDay: 'afternoon',
    season: 'summer',
    description: 'Navy suits with ocean views'
  },
  {
    name: 'Garden Party',
    venue: 'garden',
    suitColor: 'charcoal',
    partySize: 5,
    timeOfDay: 'morning',
    season: 'spring',
    description: 'Sophisticated grey suits in botanical setting'
  }
];

export function WeddingStudio() {
  const [currentStep, setCurrentStep] = useState(0);
  const [params, setParams] = useState<WeddingVisualizationParams>({
    venue: 'ballroom',
    suitColor: 'navy',
    partySize: 5,
    timeOfDay: 'afternoon',
    season: 'spring',
    accessories: []
  });
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [savedBoards, setSavedBoards] = useState<GeneratedImage[]>([]);

  const steps = [
    { title: 'Choose Venue', icon: MapPin },
    { title: 'Select Suit Color', icon: Palette },
    { title: 'Party Size & Time', icon: Users },
    { title: 'Generate & Save', icon: Sparkles }
  ];

  const generateWeddingVisualization = async (customParams?: WeddingVisualizationParams) => {
    setIsGenerating(true);
    const useParams = customParams || params;

    try {
      // Call the API endpoint
      const response = await fetch('/api/wedding-studio/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(useParams),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const newImages: GeneratedImage[] = data.images.map((url: string, index: number) => ({
          id: `${Date.now()}-${index}`,
          url,
          prompt: data.prompt,
          params: useParams,
          timestamp: new Date(),
          liked: false,
          saved: false
        }));

        setGeneratedImages(prev => [...prev, ...newImages]);

        // Track analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'wedding_visualization_generated', {
            venue: useParams.venue,
            suit_color: useParams.suitColor,
            party_size: useParams.partySize,
            time_of_day: useParams.timeOfDay,
            season: useParams.season
          });
        }
      } else {
        throw new Error(data.error || 'Failed to generate images');
      }
    } catch (error) {

      // Fallback to mock images for demo purposes
      const mockImages = [
        '/api/placeholder/1024/768?text=Wedding+Visualization+1',
        '/api/placeholder/1024/768?text=Wedding+Visualization+2',
        '/api/placeholder/1024/768?text=Wedding+Visualization+3',
        '/api/placeholder/1024/768?text=Wedding+Visualization+4'
      ];

      const newImages: GeneratedImage[] = mockImages.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        prompt: `${useParams.partySize} groomsmen in ${useParams.suitColor} suits at ${useParams.venue}`,
        params: useParams,
        timestamp: new Date(),
        liked: false,
        saved: false
      }));

      setGeneratedImages(prev => [...prev, ...newImages]);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyPreset = (preset: typeof presetCombinations[0]) => {
    setParams({
      venue: preset.venue,
      suitColor: preset.suitColor,
      partySize: preset.partySize,
      timeOfDay: preset.timeOfDay,
      season: preset.season,
      accessories: []
    });
    setSelectedPreset(preset.name);
    generateWeddingVisualization({
      venue: preset.venue,
      suitColor: preset.suitColor,
      partySize: preset.partySize,
      timeOfDay: preset.timeOfDay,
      season: preset.season,
      accessories: []
    });
  };

  const toggleImageLike = (imageId: string) => {
    setGeneratedImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, liked: !img.liked } : img
    ));
  };

  const saveToBoard = (image: GeneratedImage) => {
    if (!image.saved) {
      setSavedBoards(prev => [...prev, { ...image, saved: true }]);
      setGeneratedImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, saved: true } : img
      ));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-center mb-6">Choose Your Wedding Venue</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venueOptions.map((venue) => (
                <InteractiveCard
                  key={venue.id}
                  className={`p-6 cursor-pointer transition-all ${
                    params.venue === venue.id ? 'ring-2 ring-gold shadow-lg' : ''
                  }`}
                  onClick={() => setParams(prev => ({ ...prev, venue: venue.id }))}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{venue.icon}</div>
                    <h4 className="font-semibold mb-2">{venue.name}</h4>
                    <p className="text-sm text-gray-600">{venue.description}</p>
                  </div>
                </InteractiveCard>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif text-center mb-6">Select Your Suit Color</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suitColorOptions.map((color) => (
                <InteractiveCard
                  key={color.id}
                  className={`p-6 cursor-pointer transition-all ${
                    params.suitColor === color.id ? 'ring-2 ring-gold shadow-lg' : ''
                  }`}
                  onClick={() => setParams(prev => ({ ...prev, suitColor: color.id }))}
                >
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-white shadow-lg"
                      style={{ backgroundColor: color.color }}
                    />
                    <h4 className="font-semibold mb-2">{color.name}</h4>
                    <p className="text-sm text-gray-600">{color.description}</p>
                  </div>
                </InteractiveCard>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-serif text-center mb-6">Party Size & Timing</h3>

              {/* Party Size */}
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-4">Wedding Party Size</label>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setParams(prev => ({ ...prev, partySize: Math.max(3, prev.partySize - 1) }))}
                    disabled={params.partySize <= 3}
                  >
                    -
                  </Button>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold">{params.partySize}</div>
                    <div className="text-sm text-gray-600">groomsmen</div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setParams(prev => ({ ...prev, partySize: Math.min(8, prev.partySize + 1) }))}
                    disabled={params.partySize >= 8}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Time of Day */}
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-4">Time of Day</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {timeOfDayOptions.map((time) => (
                    <InteractiveCard
                      key={time.id}
                      className={`p-4 cursor-pointer transition-all ${
                        params.timeOfDay === time.id ? 'ring-2 ring-gold shadow-lg' : ''
                      }`}
                      onClick={() => setParams(prev => ({ ...prev, timeOfDay: time.id }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{time.icon}</div>
                        <div>
                          <h4 className="font-semibold">{time.name}</h4>
                          <p className="text-sm text-gray-600">{time.description}</p>
                        </div>
                      </div>
                    </InteractiveCard>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div>
                <label className="block text-lg font-semibold mb-4">Season</label>
                <div className="grid md:grid-cols-2 gap-4">
                  {seasonOptions.map((season) => (
                    <InteractiveCard
                      key={season.id}
                      className={`p-4 cursor-pointer transition-all ${
                        params.season === season.id ? 'ring-2 ring-gold shadow-lg' : ''
                      }`}
                      onClick={() => setParams(prev => ({ ...prev, season: season.id }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{season.icon}</div>
                        <div>
                          <h4 className="font-semibold">{season.name}</h4>
                          <p className="text-sm text-gray-600">{season.colors}</p>
                        </div>
                      </div>
                    </InteractiveCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-serif mb-4">Your Wedding Vision</h3>
              <p className="text-gray-600 mb-6">
                Ready to see your {params.partySize} groomsmen in {params.suitColor} suits at your {params.venue} wedding?
              </p>

              <SatisfyingButton
                onClick={() => generateWeddingVisualization()}
                disabled={isGenerating}
                size="lg"
                className="mb-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Visualize Your Wedding
                  </>
                )}
              </SatisfyingButton>
            </div>

            {/* Generated Images Gallery */}
            {generatedImages.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-xl font-semibold text-center">Your Generated Visions</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {generatedImages.slice(-4).map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt="Wedding visualization"
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                      />

                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                        <button
                          onClick={() => toggleImageLike(image.id)}
                          className={`p-3 rounded-full transition-colors ${
                            image.liked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${image.liked ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => saveToBoard(image)}
                          className={`p-3 rounded-full transition-colors ${
                            image.saved ? 'bg-gold text-black' : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${image.saved ? 'fill-current' : ''}`} />
                        </button>

                        <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>

                        <button className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Image Info */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                        <p>{params.partySize} groomsmen • {params.suitColor} suits • {params.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Camera className="w-8 h-8 text-gold" />
          <h2 className="text-3xl font-serif">Wedding Studio</h2>
          <Wand2 className="w-8 h-8 text-gold" />
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualize your perfect wedding party with AI-powered imagery. See exactly how your chosen suits will look at your venue.
        </p>
      </div>

      {/* Preset Combinations */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-center">Quick Start Presets</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {presetCombinations.map((preset) => (
            <InteractiveCard
              key={preset.name}
              className={`p-4 cursor-pointer transition-all ${
                selectedPreset === preset.name ? 'ring-2 ring-gold shadow-lg' : ''
              }`}
              onClick={() => applyPreset(preset)}
            >
              <div className="text-center">
                <h4 className="font-semibold mb-2">{preset.name}</h4>
                <p className="text-sm text-gray-600">{preset.description}</p>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentStep === index
                    ? 'bg-gold text-black shadow-lg'
                    : currentStep > index
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => generateWeddingVisualization()}
            disabled={isGenerating}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate New Vision
              </>
            )}
          </Button>
        )}
      </div>

      {/* Saved Inspiration Board */}
      {savedBoards.length > 0 && (
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-gold fill-current" />
            Your Inspiration Board ({savedBoards.length})
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {savedBoards.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt="Saved vision"
                  className="w-full h-20 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <button className="p-2 bg-white/20 rounded-full">
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}