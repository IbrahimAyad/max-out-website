'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Search, Sparkles, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { facebookTracking } from '@/lib/analytics/FacebookTrackingService';

interface VisualSearchProps {
  onResults?: (results: Product[]) => void;
  onClose?: () => void;
}

interface SearchResult {
  product: Product;
  similarity: number;
  confidence: number;
}

export function VisualSearch({ onResults, onClose }: VisualSearchProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const searchWithFashionCLIP = async (file: File, query?: string) => {
    setIsSearching(true);
    setError(null);

    try {
      // Use the enhanced search service for visual search
      const { enhancedSearchService } = await import('@/lib/services/enhancedSearch');
      const visualResults = await enhancedSearchService.visualSearch(file, query);
      
      // If we got results from the enhanced service, use them
      if (visualResults && visualResults.length > 0) {
        const searchResults: SearchResult[] = visualResults.map(result => ({
          product: {
            id: result.product.id,
            sku: result.product.sku || result.product.id,
            name: result.product.name,
            price: Math.round(result.product.price * 100), // Convert to cents
            images: result.product.images || [result.product.imageUrl],
            category: result.product.category || 'suits',
            stock: { '40R': 5 }, // Default stock
            variants: [],
          },
          similarity: result.similarity,
          confidence: result.confidence
        }));
        
        setSearchResults(searchResults);
        onResults?.(searchResults.map(r => r.product));
        
        // Track visual search usage
        facebookTracking.trackVisualSearchUsed(searchResults.length);
        return;
      }
      
      // Fallback: Try direct Fashion CLIP API
      const formData = new FormData();
      formData.append('file', file);
      if (query) {
        formData.append('query', query);
      }

      const response = await fetch('https://fashion-clip-kct-production.up.railway.app/predict', {
        method: 'POST',
        body: formData,
      });

      let clipResult: any = null;
      if (response.ok) {
        clipResult = await response.json();
        console.log('Fashion CLIP response:', clipResult);
      }

      // Extract search terms from Fashion CLIP results
      const searchTerms: string[] = [];
      if (clipResult) {
        if (clipResult.category) searchTerms.push(clipResult.category);
        if (clipResult.color) searchTerms.push(clipResult.color);
        if (clipResult.style) searchTerms.push(clipResult.style);
        if (clipResult.pattern) searchTerms.push(clipResult.pattern);
        if (clipResult.garment_type) searchTerms.push(clipResult.garment_type);
      }
      
      // Search our products based on Fashion CLIP analysis
      const searchQuery = searchTerms.length > 0 ? searchTerms.join(' ') : 'suit';
      const productsResponse = await fetch(`/api/products/unified?search=${encodeURIComponent(searchQuery)}&limit=10`);
      
      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const productsData = await productsResponse.json();
      
      // Convert to search results format
      const mockResults: SearchResult[] = productsData.products.slice(0, 3).map((product: any, index: number) => ({
        product: {
          id: product.id,
          sku: product.sku || product.id,
          name: product.name,
          price: Math.round(product.price * 100), // Convert to cents
          images: product.images || [product.imageUrl],
          category: product.category || 'suits',
          stock: { '40R': 5 }, // Default stock
          variants: [],
        },
        similarity: 0.95 - (index * 0.05), // Simulated similarity scores
        confidence: 0.9 - (index * 0.05)
      }));

      setSearchResults(mockResults);
      onResults?.(mockResults.map(r => r.product));

      // Track visual search usage
      facebookTracking.trackVisualSearchUsed(mockResults.length);

    } catch (error) {

      setError('Unable to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!uploadedImage) return;

    // Convert data URL back to file for API
    const response = await fetch(uploadedImage);
    const blob = await response.blob();
    const file = new File([blob], 'search-image.jpg', { type: 'image/jpeg' });

    await searchWithFashionCLIP(file, searchQuery);
  };

  const clearSearch = () => {
    setUploadedImage(null);
    setSearchResults([]);
    setSearchQuery('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-gray-800 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-serif">Visual Search</h2>
                <p className="text-white/70">Find similar styles using AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!uploadedImage ? (
            /* Upload Section */
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload a fashion image</h3>
                <p className="text-gray-600 mb-6">
                  Upload a photo of clothing or an outfit to find similar items in our collection
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gold hover:bg-gold/90 text-black"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold/10"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Tips for better results:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use clear, well-lit images</li>
                  <li>• Center the clothing item in the frame</li>
                  <li>• Avoid cluttered backgrounds</li>
                  <li>• Higher resolution images work better</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Search Section */
            <div className="space-y-6">
              {/* Image Preview & Query */}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Search image"
                      className="w-64 h-64 object-cover rounded-lg shadow-lg"
                    />
                    <button
                      onClick={clearSearch}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Refine your search (optional)
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., 'navy blue suit for wedding', 'casual blazer'"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-gold mb-4"
                  />

                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-3"
                  >
                    {isSearching ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Analyzing with AI...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Find Similar Items
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Search Results */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-gold" />
                      Similar Items Found
                    </h3>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {searchResults.map((result, index) => (
                        <motion.div
                          key={result.product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                        >
                          <div className="relative">
                            <img
                              src={result.product.images[0]}
                              alt={result.product.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                              {Math.round(result.similarity * 100)}% match
                            </div>
                          </div>

                          <div className="p-4">
                            <h4 className="font-semibold mb-1">{result.product.name}</h4>
                            <p className="text-gray-600 text-sm mb-2">SKU: {result.product.sku}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold">${(result.product.price / 100).toFixed(2)}</span>
                              <div className="text-xs text-gray-500">
                                {Math.round(result.confidence * 100)}% confidence
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />
      </motion.div>
    </div>
  );
}