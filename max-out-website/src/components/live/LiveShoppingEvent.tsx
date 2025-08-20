'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Heart, 
  ShoppingCart, 
  Send, 
  Star, 
  Gift, 
  Zap, 
  Clock,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Eye,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/types';

interface LiveEvent {
  id: string;
  title: string;
  host: {
    name: string;
    avatar: string;
    title: string;
  };
  status: 'upcoming' | 'live' | 'ended';
  startTime: Date;
  viewers: number;
  featuredProducts: Product[];
  streamUrl: string;
  specialOffers: Array<{
    id: string;
    product: Product;
    originalPrice: number;
    livePrice: number;
    timeLeft: number;
    claimed: number;
    limit: number;
  }>;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'purchase' | 'heart' | 'join';
  productId?: string;
}

interface LiveShoppingEventProps {
  event: LiveEvent;
  onProductClick: (product: Product) => void;
  onPurchase: (productId: string, price: number) => void;
}

export function LiveShoppingEvent({ event, onProductClick, onPurchase }: LiveShoppingEventProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'StyleMaster23',
      message: 'This navy suit is perfect for my wedding! 🔥',
      timestamp: new Date(),
      type: 'message'
    },
    {
      id: '2',
      user: 'GroomToBe',
      message: 'Just ordered the complete set!',
      timestamp: new Date(),
      type: 'purchase',
      productId: 'navy-suit-1'
    },
    {
      id: '3',
      user: 'BestManBuddy',
      message: '❤️❤️❤️',
      timestamp: new Date(),
      type: 'heart'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [hearts, setHearts] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [cartItems, setCartItems] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!isJoined) return;

    const interval = setInterval(() => {
      // Add random chat messages
      const randomMessages = [
        'Love this style! 😍',
        'Perfect for prom season',
        'That fit is incredible',
        'Adding to cart now!',
        'How much is the full set?',
        'This collection is amazing',
        'Best live shopping ever!'
      ];
      
      const randomUsers = [
        'StyleExpert',
        'FashionFan',
        'SuitLover',
        'DapperDude',
        'StyleSeeker',
        'TrendWatcher'
      ];

      if (Math.random() > 0.7) {
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          type: Math.random() > 0.8 ? 'purchase' : 'message'
        };
        
        setMessages(prev => [...prev, newMsg].slice(-50)); // Keep last 50 messages
      }

      // Update viewer count
      event.viewers += Math.floor(Math.random() * 3) - 1;
    }, 2000);

    return () => clearInterval(interval);
  }, [isJoined]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const joinEvent = () => {
    setIsJoined(true);
    // Simulate join message
    const joinMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: 'joined the live event',
      timestamp: new Date(),
      type: 'join'
    };
    setMessages(prev => [...prev, joinMsg]);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: newMessage,
      timestamp: new Date(),
      type: 'message'
    };
    
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const sendHeart = () => {
    const heart = {
      id: Date.now().toString(),
      x: Math.random() * 100,
      y: Math.random() * 50 + 50
    };
    
    setHearts(prev => [...prev, heart]);
    
    // Remove heart after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== heart.id));
    }, 3000);
  };

  const handleQuickPurchase = (offer: any) => {
    setCartItems(prev => [...prev, offer.product.id]);
    onPurchase(offer.product.id, offer.livePrice);
    
    // Add purchase message to chat
    const purchaseMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'You',
      message: `purchased ${offer.product.name}!`,
      timestamp: new Date(),
      type: 'purchase',
      productId: offer.product.id
    };
    setMessages(prev => [...prev, purchaseMsg]);
  };

  if (!isJoined) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-purple-500/20">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            LIVE NOW
          </div>
          
          <h2 className="text-3xl font-serif text-white mb-2">{event.title}</h2>
          <p className="text-white/70 mb-4">
            Join {event.viewers.toLocaleString()} viewers for exclusive deals and styling tips
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6 text-white/60">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{event.viewers.toLocaleString()} watching</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>Exclusive offers</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Limited time</span>
            </div>
          </div>

          <img
            src={event.host.avatar}
            alt={event.host.name}
            className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-gold"
          />
          <p className="text-white mb-6">
            <span className="font-semibold">{event.host.name}</span><br />
            <span className="text-sm text-white/70">{event.host.title}</span>
          </p>

          <Button
            onClick={joinEvent}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Users className="w-5 h-5 mr-2" />
            Join Live Event
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
      {/* Main Video Stream */}
      <div className="lg:col-span-2 relative bg-black rounded-xl overflow-hidden">
        {/* Video Player */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          loop
          poster="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
        >
          <source src="/api/placeholder/video.mp4" type="video/mp4" />
        </video>

        {/* Live Overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            LIVE
          </div>
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            <Eye className="w-4 h-4" />
            {event.viewers.toLocaleString()}
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Hearts */}
        <AnimatePresence>
          {hearts.map((heart) => (
            <motion.div
              key={heart.id}
              initial={{ 
                opacity: 1, 
                scale: 0,
                x: `${heart.x}%`,
                y: `${heart.y}%`
              }}
              animate={{ 
                opacity: 0, 
                scale: 1.5,
                y: `${heart.y - 50}%`
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute pointer-events-none"
            >
              <Heart className="w-8 h-8 text-red-500 fill-current" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Live Offers Overlay */}
        <div className="absolute bottom-16 left-4 right-4">
          <AnimatePresence>
            {event.specialOffers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="bg-gradient-to-r from-gold/90 to-yellow-600/90 backdrop-blur-sm rounded-lg p-4 mb-4 border border-gold"
              >
                <div className="flex items-center justify-between text-black">
                  <div className="flex items-center gap-3">
                    <img
                      src={offer.product.images[0]}
                      alt={offer.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold">{offer.product.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="line-through text-black/60">
                          ${(offer.originalPrice / 100).toFixed(2)}
                        </span>
                        <span className="font-bold text-lg">
                          ${(offer.livePrice / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Clock className="w-4 h-4" />
                      {Math.floor(offer.timeLeft / 60)}:{(offer.timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleQuickPurchase(offer)}
                      disabled={cartItems.includes(offer.product.id)}
                      className="bg-black hover:bg-gray-800 text-white"
                    >
                      {cartItems.includes(offer.product.id) ? 'Added!' : 'Quick Buy'}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between text-sm text-black/70">
                  <span>{offer.claimed}/{offer.limit} claimed</span>
                  <span>Live exclusive - Save ${((offer.originalPrice - offer.livePrice) / 100).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat and Interaction Panel */}
      <div className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Host Info */}
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <img
              src={event.host.avatar}
              alt={event.host.name}
              className="w-12 h-12 rounded-full border-2 border-gold"
            />
            <div>
              <h3 className="font-semibold">{event.host.name}</h3>
              <p className="text-sm text-gray-600">{event.host.title}</p>
            </div>
          </div>
        </div>

        {/* Live Chat */}
        <div className="flex-1 flex flex-col">
          <div 
            ref={chatRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-2 ${
                  msg.user === 'You' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`max-w-[80%] ${
                  msg.type === 'purchase' 
                    ? 'bg-green-100 border border-green-200' 
                    : msg.type === 'heart'
                    ? 'bg-red-100 border border-red-200'
                    : msg.user === 'You'
                    ? 'bg-purple-100 border border-purple-200'
                    : 'bg-white border border-gray-200'
                } rounded-lg p-2`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{msg.user}</span>
                    {msg.type === 'purchase' && <ShoppingCart className="w-3 h-3 text-green-600" />}
                    {msg.type === 'heart' && <Heart className="w-3 h-3 text-red-500 fill-current" />}
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2 mb-3">
              <button
                onClick={sendHeart}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm">Love</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors">
                <Star className="w-4 h-4" />
                <span className="text-sm">Rate</span>
              </button>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Say something..."
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              />
              <Button
                onClick={sendMessage}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}