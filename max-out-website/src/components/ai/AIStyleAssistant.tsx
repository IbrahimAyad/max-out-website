'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Camera, Upload, X, ChevronDown, Loader2 } from 'lucide-react';
import { Product, StylePreferences, Customer } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  products?: Product[];
  images?: string[];
}

interface AIStyleAssistantProps {
  customer?: Customer;
  onProductRecommend?: (products: Product[]) => void;
  onStyleProfileUpdate?: (preferences: StylePreferences) => void;
}

const quickQuestions = [
  "What's your style personality?",
  "What occasion are you shopping for?",
  "Show me trending looks",
  "Help me match colors",
  "What's my size?",
  "Build a complete outfit"
];

const stylePersonalities = [
  { id: 'classic', name: 'Classic Gentleman', icon: '🎩', description: 'Timeless, sophisticated, traditional' },
  { id: 'modern', name: 'Modern Professional', icon: '💼', description: 'Clean, contemporary, minimalist' },
  { id: 'trendy', name: 'Fashion Forward', icon: '✨', description: 'Bold, experimental, on-trend' },
  { id: 'casual', name: 'Smart Casual', icon: '👔', description: 'Relaxed, versatile, comfortable' },
];

export function AIStyleAssistant({ customer, onProductRecommend, onStyleProfileUpdate }: AIStyleAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi${customer?.firstName ? ` ${customer.firstName}` : ''}! I'm your AI style assistant. I can help you find the perfect suit, create outfits, or answer any style questions. How can I help you look your best today?`,
      timestamp: new Date(),
      suggestions: quickQuestions.slice(0, 3),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() && uploadedImages.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      images: uploadedImages,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedImages([]);
    setShowImageUpload(false);
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content, uploadedImages);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string, images: string[]): Message => {
    const lowerInput = userInput.toLowerCase();

    // Enhanced image analysis with Fashion CLIP
    if (images.length > 0) {
      // In a real implementation, this would call Fashion CLIP API
      analyzeFashionImage(images[0]);

      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've analyzed your image using advanced Fashion AI! Based on the style, colors, and fabric patterns I detect, here are personalized recommendations that match your aesthetic:",
        timestamp: new Date(),
        products: generateMockProducts(3),
        suggestions: ["Find exact matches", "Similar styles", "Complete the outfit", "Different occasions"],
      };
    }

    // Style personality response
    if (lowerInput.includes('style') && lowerInput.includes('personality')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Let's discover your style personality! Choose the one that resonates with you most:",
        timestamp: new Date(),
        suggestions: stylePersonalities.map(p => `${p.icon} ${p.name}`),
      };
    }

    // Occasion-based response
    if (lowerInput.includes('wedding') || lowerInput.includes('prom') || lowerInput.includes('occasion')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Great! I'll help you find the perfect outfit for your ${lowerInput.includes('wedding') ? 'wedding' : lowerInput.includes('prom') ? 'prom' : 'special occasion'}. Here are some curated options:`,
        timestamp: new Date(),
        products: generateMockProducts(4),
        suggestions: ["Show accessories", "Different styles", "Group packages"],
      };
    }

    // Size assistance
    if (lowerInput.includes('size') || lowerInput.includes('fit') || lowerInput.includes('measurement')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'll help you find your perfect fit! Based on your profile, I recommend starting with a 40R jacket and 32x32 trousers. Would you like me to guide you through taking accurate measurements?",
        timestamp: new Date(),
        suggestions: ["Measurement guide", "Schedule fitting", "Size chart"],
      };
    }

    // Color matching
    if (lowerInput.includes('color') || lowerInput.includes('match')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Color coordination is key to a polished look! For your skin tone and the occasion, I recommend these color combinations:",
        timestamp: new Date(),
        products: generateMockProducts(3),
        suggestions: ["Seasonal colors", "Classic combinations", "Bold choices"],
      };
    }

    // Default intelligent response
    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: "Based on your style profile and recent browsing, here are my personalized recommendations for you:",
      timestamp: new Date(),
      products: generateMockProducts(3),
      suggestions: ["Tell me more", "Different options", "Complete outfit"],
    };
  };

  const generateMockProducts = (count: number): Product[] => {
    const products = [
      { name: 'Midnight Navy Tuxedo', price: 89900, category: 'suits' as const },
      { name: 'Charcoal Three-Piece Suit', price: 79900, category: 'suits' as const },
      { name: 'Classic Black Dinner Jacket', price: 69900, category: 'suits' as const },
      { name: 'Burgundy Velvet Blazer', price: 59900, category: 'suits' as const },
    ];

    return products.slice(0, count).map((p, i) => ({
      id: `ai-rec-${Date.now()}-${i}`,
      sku: `SKU-${Date.now()}-${i}`,
      name: p.name,
      price: p.price,
      images: [`/api/placeholder/400/500`],
      category: p.category,
      stock: { '40R': 5, '42R': 3 },
      variants: [],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          newImages.push(e.target.result as string);
          setUploadedImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const analyzeFashionImage = async (imageUrl: string) => {
    try {
      // Convert data URL to file for Fashion CLIP API
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'style-image.jpg', { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file);

      const fashionResponse = await fetch('https://fashion-clip-kct-production.up.railway.app/predict', {
        method: 'POST',
        body: formData,
      });

      if (fashionResponse.ok) {
        const result = await fashionResponse.json();

        // Use this result to enhance recommendations
        return result;
      }
    } catch (error) {

    }
    return null;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-black to-gray-800 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Style Assistant</h3>
                    <p className="text-xs text-white/70">Powered by KCT Intelligence</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' ? 'bg-gold' : 'bg-gray-100'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-black" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-gray-600" />
                    )}
                  </div>

                  <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-gold text-black' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.content}</p>

                      {message.images && message.images.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {message.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="Uploaded"
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {message.products && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((product) => (
                          <motion.div
                            key={product.id}
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => onProductRecommend?.([product])}
                          >
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{product.name}</h4>
                              <p className="text-sm text-gray-600">${(product.price / 100).toFixed(2)}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {message.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs px-3 py-1 bg-white border rounded-full hover:bg-gray-50 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Image Upload Preview */}
            {uploadedImages.length > 0 && (
              <div className="px-4 py-2 border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="relative flex-shrink-0">
                      <img
                        src={img}
                        alt="Upload preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <button
                        onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about style..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-gold"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() && uploadedImages.length === 0}
                  className="w-10 h-10 rounded-lg bg-gold hover:bg-gold/90 disabled:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Send className="w-5 h-5 text-black" />
                </motion.button>
              </div>

              {showImageUpload && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gold transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Upload style photos</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed State */}
      {!isExpanded && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 bg-gold rounded-full shadow-lg flex items-center justify-center"
        >
          <Bot className="w-7 h-7 text-black" />
        </motion.button>
      )}
    </div>
  );
}