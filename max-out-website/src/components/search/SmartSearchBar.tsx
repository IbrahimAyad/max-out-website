'use client';

import { useState, useRef } from 'react';
import { Search, Camera, Sparkles, X, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualSearch } from './VisualSearch';
import { VoiceSearch } from './VoiceSearch';
import { fashionClipService } from '@/lib/services/fashionClipService';

interface SmartSearchBarProps {
  onSearch?: (query: string, type: 'text' | 'visual' | 'voice') => void;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'style' | 'occasion';
  icon?: string;
}

export function SmartSearchBar({ onSearch, placeholder = "Search products, upload an image, or use voice...", className }: SmartSearchBarProps) {
  const [query, setQuery] = useState('');
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Get dynamic suggestions from enhanced search service
  const getSmartSuggestions = async (input: string): Promise<SearchSuggestion[]> => {
    if (input.length < 2) return [];
    
    try {
      const { enhancedSearchService } = await import('@/lib/services/enhancedSearch');
      const suggestions = await enhancedSearchService.getDynamicSuggestions(input);
      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      // Fallback to basic suggestions
      return getBasicSuggestions(input);
    }
  };
  
  const getBasicSuggestions = (input: string): SearchSuggestion[] => {
    const lower = input.toLowerCase();
    const suggestions: SearchSuggestion[] = [];

    // Basic fallback suggestions
    if (lower.includes('wedding')) {
      suggestions.push(
        { id: '1', text: 'Wedding tuxedos', type: 'category', icon: '🤵' },
        { id: '2', text: 'Groomsmen suits', type: 'category', icon: '👔' }
      );
    } else if (lower.includes('prom')) {
      suggestions.push(
        { id: '3', text: 'Prom tuxedos', type: 'category', icon: '🎩' },
        { id: '4', text: 'Prom accessories', type: 'category', icon: '💫' }
      );
    } else if (lower.includes('business')) {
      suggestions.push(
        { id: '5', text: 'Business suits', type: 'category', icon: '💼' },
        { id: '6', text: 'Professional shirts', type: 'category', icon: '👔' }
      );
    }

    // Color-based suggestions
    if (lower.includes('navy') || lower.includes('blue')) {
      suggestions.push(
        { id: '11', text: 'Navy suits', type: 'product', icon: '🔵' },
        { id: '12', text: 'Blue dress shirts', type: 'product', icon: '👔' }
      );
    } else if (lower.includes('black')) {
      suggestions.push(
        { id: '13', text: 'Black tuxedos', type: 'product', icon: '⚫' },
        { id: '14', text: 'Black bow ties', type: 'product', icon: '🎀' }
      );
    }

    // Style suggestions
    if (lower.includes('casual')) {
      suggestions.push(
        { id: '15', text: 'Casual blazers', type: 'category', icon: '👔' },
        { id: '16', text: 'Smart casual looks', type: 'style', icon: '✨' }
      );
    } else if (lower.includes('formal')) {
      suggestions.push(
        { id: '17', text: 'Formal wear', type: 'category', icon: '🎩' },
        { id: '18', text: 'Black tie options', type: 'style', icon: '✨' }
      );
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      const newSuggestions = await getSmartSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      onSearch?.(finalQuery, 'text');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
    setShowSuggestions(false);
  };

  const handleVisualSearchResults = (results: any[]) => {
    onSearch?.(`Found ${results.length} similar items`, 'visual');
    setShowVisualSearch(false);
  };

  const handleVoiceTranscription = (text: string) => {
    setQuery(text);
    setShowSuggestions(false);
  };

  const handleVoiceSearchSubmit = (searchQuery: string) => {
    onSearch?.(searchQuery, 'voice');
    setShowVoiceSearch(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="relative flex items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => query.length > 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={placeholder}
              className="w-full pl-12 pr-20 py-4 border border-gray-300 rounded-l-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-lg"
            />
            
            {/* Clear button */}
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Voice Search Button */}
          <button
            onClick={() => setShowVoiceSearch(true)}
            className="px-6 py-4 bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-300 transition-colors group"
            title="Voice Search"
          >
            <Mic className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>

          {/* Visual Search Button */}
          <button
            onClick={() => setShowVisualSearch(true)}
            className="px-6 py-4 bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-300 transition-colors group"
            title="Visual Search"
          >
            <Camera className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
          </button>

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            className="px-8 py-4 bg-gold hover:bg-gold/90 text-black font-semibold rounded-r-lg transition-colors"
          >
            Search
          </button>
        </div>

        {/* AI Enhancement Indicator */}
        {isAnalyzing && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm text-blue-800">AI is analyzing your search...</span>
          </div>
        )}
      </div>

      {/* Smart Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="py-2">
              <div className="px-4 py-2 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm font-medium text-gray-700">AI Suggestions</span>
                </div>
              </div>
              
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <div className="flex-1">
                    <span className="text-gray-900 group-hover:text-gold transition-colors">
                      {suggestion.text}
                    </span>
                    <div className="text-xs text-gray-500 capitalize">
                      {suggestion.type}
                    </div>
                  </div>
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-gold transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Search Modal */}
      <AnimatePresence>
        {showVoiceSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowVoiceSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif">Voice Search</h2>
                  <button
                    onClick={() => setShowVoiceSearch(false)}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <VoiceSearch
                  onTranscription={handleVoiceTranscription}
                  onSearchSubmit={handleVoiceSearchSubmit}
                  placeholder="Try saying: 'Show me navy blue suits for a wedding'"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Search Modal */}
      <AnimatePresence>
        {showVisualSearch && (
          <VisualSearch
            onResults={handleVisualSearchResults}
            onClose={() => setShowVisualSearch(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}