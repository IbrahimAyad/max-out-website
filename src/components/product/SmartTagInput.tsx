'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, X, Plus, Zap, AlertTriangle, CheckCircle, 
  TrendingUp, Eye, ThumbsUp, ThumbsDown, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAutoTagging, useTagValidation } from '@/lib/hooks/useAutoTagging';

interface SmartTagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  productId?: string;
  productImageUrl?: string;
  productName?: string;
  productDescription?: string;
  placeholder?: string;
  maxTags?: number;
  enableAutoTagging?: boolean;
  className?: string;
}

interface TagSuggestion {
  tag: string;
  confidence: number;
  source: 'ai' | 'seo' | 'similar';
  reason: string;
}

export function SmartTagInput({
  value = [],
  onChange,
  productId,
  productImageUrl,
  productName,
  productDescription,
  placeholder = "Add tags...",
  maxTags = 20,
  enableAutoTagging = true,
  className = ""
}: SmartTagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<TagSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isAnalyzing,
    analyzeProduct,
    getSEORecommendations,
    validateTags,
    pendingSuggestions
  } = useAutoTagging({
    onTagsUpdated: (id, tags) => onChange(tags)
  });

  const {
    isValid,
    conflicts,
    suggestions: seoSuggestions,
    seoScore,
    validateTags: validateCurrentTags
  } = useTagValidation();

  // Validate tags whenever they change
  useEffect(() => {
    validateCurrentTags(value);
  }, [value, validateCurrentTags]);

  // Get AI suggestions when product details are available
  useEffect(() => {
    if (enableAutoTagging && productImageUrl && productId) {
      generateAISuggestions();
    }
  }, [productImageUrl, productName, productDescription, enableAutoTagging]);

  const generateAISuggestions = async () => {
    if (!productImageUrl || !productId) return;

    const result = await analyzeProduct(
      productId,
      productImageUrl,
      value,
      productName,
      productDescription
    );

    if (result) {
      const suggestions: TagSuggestion[] = result.addedTags.map(tag => ({
        tag,
        confidence: Math.random() * 0.4 + 0.6, // Mock confidence 60-100%
        source: 'ai' as const,
        reason: 'Detected by Fashion-CLIP AI'
      }));
      
      setAiSuggestions(suggestions);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (!trimmedTag || value.includes(trimmedTag) || value.length >= maxTags) return;

    // Validate against conflicts
    const validation = validateTags(value, [trimmedTag]);
    if (validation.conflicts.length > 0) {
      alert(`Tag "${trimmedTag}" conflicts with existing tags: ${validation.conflicts.join(', ')}`);
      return;
    }

    onChange([...value, trimmedTag]);
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const applySuggestion = (suggestion: TagSuggestion) => {
    addTag(suggestion.tag);
    setAiSuggestions(prev => prev.filter(s => s.tag !== suggestion.tag));
  };

  const rejectSuggestion = (suggestion: TagSuggestion) => {
    setAiSuggestions(prev => prev.filter(s => s.tag !== suggestion.tag));
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSourceIcon = (source: TagSuggestion['source']) => {
    switch (source) {
      case 'ai': return <Sparkles className="w-3 h-3" />;
      case 'seo': return <TrendingUp className="w-3 h-3" />;
      case 'similar': return <Eye className="w-3 h-3" />;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Tag Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Product Tags
          </label>
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-medium ${getSEOScoreColor(seoScore)}`}>
              SEO Score: {seoScore}
            </span>
            {enableAutoTagging && (
              <Button
                size="sm"
                variant="outline"
                onClick={generateAISuggestions}
                disabled={isAnalyzing || !productImageUrl}
                className="h-6 px-2 text-xs gap-1"
              >
                {isAnalyzing ? (
                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Zap className="w-3 h-3" />
                )}
                AI Suggest
              </Button>
            )}
          </div>
        </div>

        {/* Tags Display and Input */}
        <div 
          className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-gold focus-within:border-gold cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex flex-wrap gap-2">
            {value.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
            
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={value.length === 0 ? placeholder : ""}
              className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
              disabled={value.length >= maxTags}
            />
          </div>
        </div>

        {/* Tag Counter and Validation */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className={value.length >= maxTags ? 'text-red-500' : 'text-gray-500'}>
              {value.length} / {maxTags} tags
            </span>
            
            {!isValid && conflicts.length > 0 && (
              <div className="flex items-center gap-1 text-red-500">
                <AlertTriangle className="w-3 h-3" />
                <span>Tag conflicts detected</span>
              </div>
            )}
            
            {isValid && value.length > 0 && (
              <div className="flex items-center gap-1 text-green-500">
                <CheckCircle className="w-3 h-3" />
                <span>Tags look good</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <AnimatePresence>
        {aiSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-blue-200 rounded-lg p-4 bg-blue-50"
          >
            <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Suggestions from Fashion-CLIP
            </h4>
            
            <div className="space-y-2">
              {aiSuggestions.slice(0, 6).map((suggestion, index) => (
                <motion.div
                  key={suggestion.tag}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-blue-600">
                      {getSourceIcon(suggestion.source)}
                      <span className="text-xs font-medium">AI</span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-900">
                        {suggestion.tag}
                      </span>
                      <p className="text-xs text-gray-500">
                        {suggestion.reason}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">
                      {Math.round(suggestion.confidence * 100)}%
                    </div>
                    
                    <button
                      onClick={() => applySuggestion(suggestion)}
                      className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                      title="Accept suggestion"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={() => rejectSuggestion(suggestion)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Reject suggestion"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO Recommendations */}
      {seoSuggestions.length > 0 && (
        <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
          <h4 className="text-sm font-medium text-yellow-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            SEO Recommendations
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            {seoSuggestions.slice(0, 3).map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conflict Warnings */}
      {conflicts.length > 0 && (
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <h4 className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Tag Conflicts
          </h4>
          <div className="space-y-2">
            {conflicts.map((conflict, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-red-800">
                  Duplicate variation: "{conflict}"
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeTag(conflict)}
                  className="h-6 px-2 text-xs border-red-300 text-red-700 hover:bg-red-100"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Add Common Tags */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-500 self-center">Quick add:</span>
        {['formal', 'business', 'wedding', 'slim fit', 'modern', 'classic'].map(quickTag => (
          <button
            key={quickTag}
            onClick={() => addTag(quickTag)}
            disabled={value.includes(quickTag)}
            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-3 h-3 inline mr-1" />
            {quickTag}
          </button>
        ))}
      </div>
    </div>
  );
}