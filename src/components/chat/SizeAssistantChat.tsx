"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Ruler, 
  Send, 
  Bot,
  ChevronLeft,
  Sparkles,
  Calculator
} from "lucide-react";
import { ModernSizeBot } from "@/components/sizing/ModernSizeBot";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface SizeAssistantChatProps {
  onClose: () => void;
  productType?: 'suit' | 'shirt' | 'tuxedo';
}

export function SizeAssistantChat({ onClose, productType = 'suit' }: SizeAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI Size Assistant. I can help you find your perfect fit in just 30 seconds! Would you like to:",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [showSizeCalculator, setShowSizeCalculator] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSizeCalculatorResult = (recommendation: any) => {
    setShowSizeCalculator(false);
    
    // Add result message
    const resultMessage: Message = {
      id: Date.now().toString(),
      text: `Perfect! Based on your measurements, I recommend:\n\n📏 **Size ${recommendation.primarySizeFull}**\n${recommendation.confidence > 0.85 ? '✅ High confidence match!' : '⚠️ You might want to consider alterations'}\n\n${recommendation.alterations ? `Suggested alterations: ${recommendation.alterations.join(', ')}` : 'This should fit you perfectly!'}`,
      sender: 'assistant',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, resultMessage]);
    
    // Add follow-up
    setTimeout(() => {
      const followUp: Message = {
        id: (Date.now() + 1).toString(),
        text: "Would you like me to:\n• Show you products in your size\n• Explain our alteration services\n• Help with something else?",
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, followUp]);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simulate assistant response
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerInput = input.toLowerCase();
      let response = "";
      
      if (lowerInput.includes('size') || lowerInput.includes('fit') || lowerInput.includes('measure')) {
        response = "I'd be happy to help you find your size! Let me open our AI Size Calculator for you.";
        setTimeout(() => setShowSizeCalculator(true), 500);
      } else if (lowerInput.includes('alter')) {
        response = "We offer professional alteration services! Most alterations take 3-5 business days. Common alterations include:\n• Hemming pants ($15)\n• Taking in waist ($25)\n• Shortening sleeves ($20)\n• Adjusting jacket length ($35)";
      } else if (lowerInput.includes('return') || lowerInput.includes('exchange')) {
        response = "Our return policy is simple:\n• 30-day returns on unworn items\n• Free exchanges for different sizes\n• We'll help ensure you get the perfect fit!";
      } else {
        response = "I can help you with:\n• Finding your perfect size\n• Understanding our size charts\n• Alteration services\n• Fit preferences (Slim, Regular, Relaxed)\n\nWhat would you like to know?";
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy to-burgundy-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Size Assistant</h3>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Powered by Atelier AI
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/20 p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages or Size Calculator */}
      {showSizeCalculator ? (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={() => setShowSizeCalculator(false)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to chat
            </button>
            <ModernSizeBot
              productType={productType}
              onSizeSelected={handleSizeCalculatorResult}
              onClose={() => setShowSizeCalculator(false)}
              isModal={false}
              compact={true}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-burgundy text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.sender === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4" />
                      <span className="text-xs font-medium">Size Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Actions - shown after initial message */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setShowSizeCalculator(true)}
                  className="px-4 py-2 bg-burgundy text-white rounded-full text-sm hover:bg-burgundy-700 transition-colors flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Use AI Size Calculator
                </button>
                <button
                  onClick={() => {
                    setInput("Tell me about alterations");
                    handleSend();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  Alteration Services
                </button>
                <button
                  onClick={() => {
                    setInput("What's the return policy?");
                    handleSend();
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  Returns & Exchanges
                </button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about sizing, fit, or alterations..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by Atelier AI
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}