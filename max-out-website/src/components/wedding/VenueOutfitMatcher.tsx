'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { venueCompatibility, colorCoordinationMatrix } from '@/lib/data/knowledgeBank/wedding-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InteractiveCard, SatisfyingButton } from '@/components/ui/micro-interactions';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  CheckCircle,
  AlertCircle,
  Palette,
  Shirt,
  Wind,
  Sun,
  CloudRain,
  Award
} from 'lucide-react';

interface VenueOutfitMatcherProps {
  onSelect?: (outfit: any) => void;
  selectedVenue?: string;
}

const venueIcons: Record<string, any> = {
  beach: Sun,
  church: MapPin,
  garden: Sparkles,
  ballroom: Award,
  vineyard: MapPin,
  barn: MapPin
};

export function VenueOutfitMatcher({ onSelect, selectedVenue }: VenueOutfitMatcherProps) {
  const [venue, setVenue] = useState(selectedVenue || '');
  const [season, setSeason] = useState('');
  const [formality, setFormality] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const venues = Object.keys(venueCompatibility);

  const generateRecommendations = () => {
    if (!venue) return;

    const venueData = venue in venueCompatibility
      ? venueCompatibility[venue as keyof typeof venueCompatibility]
      : null;
    if (!venueData) return;
    const recs = venueData.idealSuits.map((suit, index) => {
      // Get color coordination data
      const suitColorKey = suit.color.toLowerCase().replace(/\s+/g, '');
      
      // Type-safe lookup with fallback
      let coordination;
      if (suitColorKey in colorCoordinationMatrix) {
        coordination = colorCoordinationMatrix[suitColorKey as keyof typeof colorCoordinationMatrix];
      } else {
        // Default coordination for colors not in the matrix
        coordination = {
          perfectMatches: {
            shirts: ['White', 'Light Blue'],
            ties: ['Navy', 'Burgundy'],
            confidence: 85
          }
        };
      }

      return {
        id: `${venue}-${index}`,
        suit: suit.color,
        confidence: suit.confidence,
        reason: suit.reason,
        shirts: coordination.perfectMatches.shirts,
        ties: coordination.perfectMatches.ties,
        fabric: venueData.fabricRequirements?.ideal?.[0] || 'Premium Wool',
        avoid: venueData.avoid,
        stylingNotes: venueData.stylingNotes
      };
    });

    setRecommendations(recs);
  };

  const seasons = [
    { id: 'spring', name: 'Spring', icon: '🌸', colors: 'Pastels & Light Tones' },
    { id: 'summer', name: 'Summer', icon: '☀️', colors: 'Light & Breathable' },
    { id: 'fall', name: 'Fall', icon: '🍂', colors: 'Rich & Warm Tones' },
    { id: 'winter', name: 'Winter', icon: '❄️', colors: 'Deep & Luxurious' }
  ];

  const formalityLevels = [
    { id: 'casual', name: 'Casual', description: 'Relaxed beach or garden' },
    { id: 'semi-formal', name: 'Semi-Formal', description: 'Cocktail attire' },
    { id: 'formal', name: 'Formal', description: 'Traditional wedding' },
    { id: 'black-tie', name: 'Black Tie', description: 'Evening elegance' }
  ];

  return (
    <div className="space-y-6">
      {/* Venue Selection */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold" />
          Select Wedding Venue
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {venues.map((v) => {
            const Icon = v in venueIcons ? venueIcons[v as keyof typeof venueIcons] : MapPin;
            const data = v in venueCompatibility ? venueCompatibility[v as keyof typeof venueCompatibility] : null;
            if (!data) return null;
            return (
              <InteractiveCard
                key={v}
                className={`p-4 cursor-pointer transition-all ${
                  venue === v ? 'ring-2 ring-gold shadow-lg' : ''
                }`}
                onClick={() => setVenue(v)}
              >
                <div className="text-center space-y-2">
                  <Icon className="w-8 h-8 mx-auto text-gold" />
                  <h4 className="font-semibold capitalize">{v}</h4>
                  <p className="text-xs text-gray-600">
                    {data.characteristics.formalityRange.replace(/_/g, ' ')}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {data.characteristics.environment}
                  </Badge>
                </div>
              </InteractiveCard>
            );
          })}
        </div>
      </Card>

      {/* Season Selection */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gold" />
          Wedding Season
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {seasons.map((s) => (
            <InteractiveCard
              key={s.id}
              className={`p-4 cursor-pointer transition-all ${
                season === s.id ? 'ring-2 ring-gold shadow-lg' : ''
              }`}
              onClick={() => setSeason(s.id)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <h4 className="font-semibold">{s.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{s.colors}</p>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </Card>

      {/* Formality Level */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-gold" />
          Formality Level
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {formalityLevels.map((f) => (
            <InteractiveCard
              key={f.id}
              className={`p-4 cursor-pointer transition-all ${
                formality === f.id ? 'ring-2 ring-gold shadow-lg' : ''
              }`}
              onClick={() => setFormality(f.id)}
            >
              <div className="text-center">
                <h4 className="font-semibold">{f.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{f.description}</p>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </Card>

      {/* Generate Recommendations */}
      <div className="text-center">
        <SatisfyingButton
          onClick={generateRecommendations}
          disabled={!venue}
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Get Venue-Perfect Recommendations
        </SatisfyingButton>
      </div>

      {/* Recommendations Display */}
      <AnimatePresence>
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-serif text-center">
              Perfect Outfits for Your {venue.charAt(0).toUpperCase() + venue.slice(1)} Wedding
            </h3>

            {recommendations.map((rec, index) => (
              <Card key={rec.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      {rec.suit} Suit
                      <Badge className="bg-gold text-black">
                        {rec.confidence}% Match
                      </Badge>
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">{rec.reason}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">
                      Rank #{index + 1}
                    </Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {/* Shirt Options */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Shirt className="w-4 h-4" />
                      Best Shirt Colors
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rec.shirts.map((shirt: string) => (
                        <Badge key={shirt} variant="outline">
                          {shirt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tie Options */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Palette className="w-4 h-4" />
                      Recommended Ties
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rec.ties.map((tie: string) => (
                        <Badge key={tie} variant="outline">
                          {tie}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Fabric */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Wind className="w-4 h-4" />
                      Ideal Fabric
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">
                      {rec.fabric}
                    </Badge>
                  </div>
                </div>

                {/* Styling Notes */}
                {rec.stylingNotes && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      Venue-Specific Tips
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {Object.entries(rec.stylingNotes).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium capitalize">{key}:</span> {String(value)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Avoid List */}
                {rec.avoid.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      Avoid for This Venue
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {rec.avoid.map((item: string) => (
                        <Badge key={item} variant="outline" className="border-red-200 text-red-700">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <SatisfyingButton
                    onClick={() => onSelect?.(rec)}
                    variant="secondary"
                    size="sm"
                  >
                    Select This Combination
                  </SatisfyingButton>
                </div>
              </Card>
            ))}

            {/* Weather Contingency Card */}
            {venue && ['beach', 'garden', 'vineyard'].includes(venue) && (
              <Card className="p-6 bg-yellow-50">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-yellow-600" />
                  Weather Contingency Tips
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">☔ Rain Plan</h5>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Avoid linen (shows water spots)</li>
                      <li>• Choose darker colors</li>
                      <li>• Consider water-resistant treatments</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">☀️ Heat Plan</h5>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Prioritize breathable fabrics</li>
                      <li>• Lighter colors reflect heat</li>
                      <li>• Pack extra dress shirts</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}