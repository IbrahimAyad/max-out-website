'use client';

import { useState } from 'react';
import { VoiceSearch } from '@/components/search/VoiceSearch';
import { SmartSearchBar } from '@/components/search/SmartSearchBar';
import { PageTransition } from '@/components/ui/micro-interactions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Sparkles, 
  Volume2, 
  Search,
  ArrowLeft,
  CheckCircle,
  Clock,
  Users,
  AudioLines
} from 'lucide-react';
import Link from 'next/link';

// Mock search results
const mockSearchResults = [
  {
    id: '1',
    name: 'Navy Blue Wedding Suit',
    price: 79900,
    image: '/api/placeholder/400/500',
    category: 'Wedding Suits',
    rating: 4.8,
    reviews: 127
  },
  {
    id: '2',
    name: 'Charcoal Three-Piece Suit',
    price: 89900,
    image: '/api/placeholder/400/500',
    category: 'Formal Suits',
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Light Grey Summer Suit',
    price: 69900,
    image: '/api/placeholder/400/500',
    category: 'Summer Collection',
    rating: 4.7,
    reviews: 156
  }
];

const voiceSearchExamples = [
  {
    icon: '🤵',
    text: "Show me navy blue suits for a wedding",
    category: "Wedding",
    description: "Perfect for wedding parties and formal ceremonies"
  },
  {
    icon: '💼',
    text: "I need a black tuxedo for a formal event",
    category: "Formal",
    description: "Elegant options for black-tie occasions"
  },
  {
    icon: '🎓',
    text: "Find me colorful prom accessories",
    category: "Prom",
    description: "Vibrant accessories to complete your prom look"
  },
  {
    icon: '👔',
    text: "What business suits do you have in size 42?",
    category: "Business",
    description: "Professional attire for the workplace"
  },
  {
    icon: '🌟',
    text: "Show me your latest spring collection",
    category: "Seasonal",
    description: "Fresh styles for the new season"
  },
  {
    icon: '💍',
    text: "I want to see groomsmen suit packages",
    category: "Groups",
    description: "Coordinated looks for wedding parties"
  }
];

export default function VoiceSearchPage() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [searchType, setSearchType] = useState<'text' | 'visual' | 'voice' | null>(null);

  const handleSearch = (query: string, type: 'text' | 'visual' | 'voice') => {
    setLastQuery(query);
    setSearchType(type);

    // Simulate search results
    const filteredResults = mockSearchResults.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults.length > 0 ? filteredResults : mockSearchResults);

    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: query,
        search_type: type,
        results_count: filteredResults.length
      });
    }
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-40">
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
              <div className="flex items-center justify-center gap-3 mb-4">
                <Volume2 className="w-8 h-8 text-blue-600" />
                <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Voice Search
                </h1>
                <AudioLines className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience the future of shopping with AI-powered voice search. Just speak naturally to find exactly what you're looking for.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Feature Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">2.3s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Languages Supported</div>
            </Card>

            <Card className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">AI</div>
              <div className="text-sm text-gray-600">Powered by Whisper</div>
            </Card>
          </div>

          {/* Main Search Interface */}
          <Card className="p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-serif mb-2">Smart Search Experience</h2>
              <p className="text-gray-600">
                Use voice, text, or visual search to find your perfect style
              </p>
            </div>

            <SmartSearchBar 
              onSearch={handleSearch}
              placeholder="Search with voice, text, or images..."
              className="max-w-4xl mx-auto"
            />
          </Card>

          {/* Voice Search Examples */}
          <Card className="p-8 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Try These Voice Commands</h3>
              <p className="text-gray-600">Click any example to hear how natural voice search works</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {voiceSearchExamples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(example.text, 'voice')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{example.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {example.category}
                        </Badge>
                      </div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                        "{example.text}"
                      </p>
                      <p className="text-sm text-gray-600">{example.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Standalone Voice Search Component */}
          <Card className="p-8 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Dedicated Voice Search</h3>
              <p className="text-gray-600">
                Experience our advanced voice recognition with real-time audio visualization
              </p>
            </div>

            <VoiceSearch
              onTranscription={(text) => handleSearch(text, 'voice')}
              className="max-w-md mx-auto"
            />
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {searchType === 'voice' && 'Voice'} Search Results
                  {lastQuery && ` for "${lastQuery}"`}
                </h3>
                <Badge variant="secondary">
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[3/4] relative bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-2 right-2">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2">{product.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">
                          {formatPrice(product.price)}
                        </span>
                        <Button size="sm">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}