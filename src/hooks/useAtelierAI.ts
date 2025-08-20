'use client';

import { useState, useCallback, useEffect } from 'react';

interface AIMessage {
  id: string;
  text: string;
  type: 'greeting' | 'tip' | 'compliment' | 'suggestion' | 'warning' | 'celebration';
  timestamp: Date;
  duration?: number;
}

interface AtelierAIConfig {
  personality?: 'friendly' | 'professional' | 'playful' | 'sophisticated';
  frequency?: 'high' | 'medium' | 'low';
  context?: string;
}

export function useAtelierAI(config: AtelierAIConfig = {}) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<AIMessage | null>(null);
  const { 
    personality = 'sophisticated', 
    frequency = 'medium',
    context = 'shopping'
  } = config;

  // Message templates based on personality
  const getMessages = useCallback(() => {
    const baseMessages: Record<string, string[]> = {
      greeting: [
        "Welcome to your personal style journey ✨",
        "Hello! Ready to discover something extraordinary?",
        "Greetings! Let's find your perfect look today",
        "Welcome back! Your style awaits 🎩"
      ],
      browsing: [
        "That would look stunning on you!",
        "A timeless choice - very sophisticated",
        "This piece is part of our exclusive collection",
        "Perfect for your next special occasion"
      ],
      encouragement: [
        "You have impeccable taste!",
        "Your style profile is truly unique",
        "Building the perfect wardrobe, one piece at a time",
        "Your confidence shines through your choices"
      ],
      suggestion: [
        "May I suggest our matching accessories?",
        "This pairs beautifully with our new arrivals",
        "Consider our tailoring service for the perfect fit",
        "Complete the look with our premium collection"
      ],
      seasonal: [
        "New season, new style possibilities",
        "Our fall collection just arrived",
        "Summer essentials now available",
        "Trending this season: bold patterns"
      ]
    };

    if (personality === 'playful') {
      return {
        ...baseMessages,
        greeting: [
          "Hey there, style star! 🌟",
          "Ready to turn some heads? 😎",
          "Let's make magic happen! ✨",
          "Fashion adventure starts now! 🚀"
        ],
        encouragement: [
          "You're absolutely killing it! 🔥",
          "That's what we call style goals! 💯",
          "Obsessed with your choices! 💖",
          "You've got that fashion sense! 👌"
        ]
      };
    }

    if (personality === 'professional') {
      return {
        ...baseMessages,
        greeting: [
          "Good day. How may we assist you?",
          "Welcome to KCT Menswear",
          "We're here to help you look your best",
          "Professional styling at your service"
        ],
        suggestion: [
          "We recommend exploring our business collection",
          "Our tailors can ensure a perfect fit",
          "Consider our premium fabric options",
          "Schedule a consultation with our style experts"
        ]
      };
    }

    return baseMessages;
  }, [personality]);

  // Send a message
  const sendMessage = useCallback((
    text: string, 
    type: AIMessage['type'] = 'tip',
    duration: number = 4000
  ) => {
    const message: AIMessage = {
      id: `ai-${Date.now()}`,
      text,
      type,
      timestamp: new Date(),
      duration
    };

    setCurrentMessage(message);
    setMessages(prev => [...prev, message]);

    // Auto-hide after duration
    setTimeout(() => {
      setCurrentMessage(null);
    }, duration);
  }, []);

  // Context-aware automatic messages
  const triggerContextualMessage = useCallback((action: string, data?: any) => {
    const messages = getMessages();
    let message = '';
    let type: AIMessage['type'] = 'tip';

    switch (action) {
      case 'page-load':
        message = messages.greeting[Math.floor(Math.random() * messages.greeting.length)];
        type = 'greeting';
        break;
      
      case 'product-view':
        if (data?.price > 500) {
          message = "An investment piece - timeless elegance 💎";
          type = 'tip';
        } else {
          message = messages.browsing[Math.floor(Math.random() * messages.browsing.length)];
          type = 'suggestion';
        }
        break;
      
      case 'add-to-cart':
        message = "Excellent choice! Added to your collection 🛍️";
        type = 'celebration';
        break;
      
      case 'remove-from-cart':
        message = "No worries, take your time exploring";
        type = 'tip';
        break;
      
      case 'swipe-right':
        message = messages.encouragement[Math.floor(Math.random() * messages.encouragement.length)];
        type = 'compliment';
        break;
      
      case 'achievement':
        message = `Achievement unlocked: ${data?.name || 'Style Master'} 🏆`;
        type = 'celebration';
        break;
      
      case 'idle':
        message = "Need any styling advice? I'm here to help!";
        type = 'suggestion';
        break;
      
      default:
        return;
    }

    if (message) {
      sendMessage(message, type);
    }
  }, [getMessages, sendMessage]);

  // Smart timing for messages based on frequency
  useEffect(() => {
    if (frequency === 'low') return;

    const interval = frequency === 'high' ? 30000 : 60000; // 30s or 1min
    const timer = setInterval(() => {
      // Random encouraging message
      const messages = getMessages();
      const categories = Object.keys(messages);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomMessages = messages[randomCategory];
      if (randomMessages && randomMessages.length > 0) {
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        sendMessage(randomMessage, 'tip', 3000);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [frequency, getMessages, sendMessage]);

  // Quick message presets
  const quickMessages = {
    welcome: () => sendMessage("Welcome! I'm your AI style assistant 🎩", 'greeting'),
    compliment: () => sendMessage("You have excellent taste! ✨", 'compliment'),
    sizeReminder: () => sendMessage("Don't forget to check our size guide for the perfect fit!", 'suggestion'),
    newArrivals: () => sendMessage("New arrivals just dropped! Want to take a look? 🆕", 'tip'),
    limitedStock: () => sendMessage("⚡ Limited stock remaining on this item!", 'warning'),
    thankYou: () => sendMessage("Thank you for shopping with us! 🙏", 'celebration'),
    styleMatch: () => sendMessage("This matches perfectly with your style profile! 🎯", 'tip'),
    trending: () => sendMessage("🔥 This item is trending right now!", 'tip'),
    exclusive: () => sendMessage("Exclusive piece - only at KCT Menswear 👑", 'tip'),
    perfectFit: () => sendMessage("Based on your measurements, this should fit perfectly! 📏", 'suggestion')
  };

  return {
    currentMessage,
    messages,
    sendMessage,
    triggerContextualMessage,
    quickMessages,
    clearMessage: () => setCurrentMessage(null)
  };
}