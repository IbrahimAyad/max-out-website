"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Sparkles, 
  Ruler, 
  HeadphonesIcon,
  Zap,
  Bell
} from "lucide-react";
import { SizeAssistantChat } from "./SizeAssistantChat";

interface ChatOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'welcome' | 'tip' | 'offer' | 'reminder';
  from?: string;
  icon?: React.ReactNode;
}

export function SmartChatLauncher() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showSizeAssistant, setShowSizeAssistant] = useState(false);

  const chatOptions: ChatOption[] = [
    {
      id: "support",
      title: "Customer Support",
      icon: <HeadphonesIcon className="w-5 h-5" />,
      color: "text-white",
      bgColor: "bg-burgundy"
    },
    {
      id: "stylist",
      title: "Atelier Stylist",
      icon: <Sparkles className="w-5 h-5" />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-burgundy-600 to-purple-700"
    },
    {
      id: "sizing",
      title: "Size Assistant",
      icon: <Ruler className="w-5 h-5" />,
      color: "text-white",
      bgColor: "bg-gradient-to-br from-burgundy-500 to-pink-600"
    }
  ];

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    setIsExpanded(false);
    
    // Open the specific chat interface
    switch(chatId) {
      case 'support':
        // Open customer support chat (to be implemented)
        console.log('Opening customer support chat');
        break;
      case 'stylist':
        // Open AI stylist chat (to be implemented)
        console.log('Opening Atelier Stylist chat');
        break;
      case 'sizing':
        // Open size assistant
        setShowSizeAssistant(true);
        break;
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setHasInteracted(true);
    if (activeChat) {
      setActiveChat(null);
    }
    // Dismiss notification when user interacts
    if (notification) {
      setNotification(null);
    }
  };

  // Smart notification system
  const showNotification = useCallback((msg: string, type: Notification['type'] = 'tip', from?: string) => {
    const notifications: Notification = {
      id: Date.now().toString(),
      message: msg,
      type,
      from,
      icon: type === 'welcome' ? <Sparkles className="w-4 h-4" /> : 
            type === 'offer' ? <Bell className="w-4 h-4" /> :
            type === 'reminder' ? <Ruler className="w-4 h-4" /> : 
            <MessageCircle className="w-4 h-4" />
    };
    setNotification(notifications);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []);

  // Trigger smart notifications based on user behavior
  useEffect(() => {
    // Welcome message after 2 seconds
    if (!hasInteracted) {
      const welcomeTimer = setTimeout(() => {
        showNotification(
          "Hi! I'm here to help with sizing, styling, or any questions 👋",
          'welcome',
          'Atelier AI'
        );
      }, 2000);

      return () => clearTimeout(welcomeTimer);
    }
  }, [hasInteracted, showNotification]);

  // Context-aware notifications (you can add more triggers)
  useEffect(() => {
    // Example: Show size help if user is on a product page for more than 30 seconds
    const contextTimer = setTimeout(() => {
      if (!hasInteracted && !notification) {
        showNotification(
          "Need help finding your perfect size? Click to chat!",
          'reminder',
          'Size Assistant'
        );
      }
    }, 30000);

    return () => clearTimeout(contextTimer);
  }, [hasInteracted, notification, showNotification]);

  // Expose notification system globally so other components can trigger notifications
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).showChatNotification = showNotification;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).showChatNotification;
      }
    };
  }, [showNotification]);

  return (
    <>
      {/* Stacked Chat Bubbles */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
        
        {/* Additional Chat Options - Show when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {chatOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 500,
                      damping: 25
                    }
                  }}
                  exit={{ 
                    scale: 0, 
                    opacity: 0, 
                    y: 20,
                    transition: {
                      delay: (chatOptions.length - index - 1) * 0.05
                    }
                  }}
                  className="relative"
                  onMouseEnter={() => setHoveredChat(option.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                >
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredChat === option.id && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
                      >
                        {option.title}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Chat Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChatSelect(option.id)}
                    className={`w-14 h-14 ${option.bgColor} ${option.color} rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center`}
                  >
                    {option.icon}
                  </motion.button>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Chat Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleExpanded}
          className={`relative w-14 h-14 ${
            isExpanded ? 'bg-gray-800' : 'bg-burgundy'
          } text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center`}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulse indicator for attention */}
          {!isExpanded && (
            <>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="absolute inset-0 rounded-full bg-burgundy animate-ping opacity-30" />
            </>
          )}
        </motion.button>

        {/* Subtle Atelier AI branding - only show when expanded */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-8 right-0 flex items-center gap-1 text-xs text-gray-400"
            >
              <Zap className="w-3 h-3" />
              <span className="text-[10px]">Atelier AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Smart Notification Popup */}
      <AnimatePresence>
        {notification && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-24 z-40 max-w-xs"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Notification Header */}
              {notification.from && (
                <div className="bg-gradient-to-r from-burgundy to-burgundy-700 text-white px-4 py-2">
                  <div className="flex items-center gap-2">
                    {notification.icon}
                    <span className="text-xs font-semibold">{notification.from}</span>
                  </div>
                </div>
              )}
              
              {/* Notification Message */}
              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{notification.message}</p>
                
                {/* Quick Actions based on notification type */}
                {notification.type === 'reminder' && (
                  <button
                    onClick={() => {
                      setShowSizeAssistant(true);
                      setActiveChat('sizing');
                      setNotification(null);
                    }}
                    className="mt-3 text-xs text-burgundy font-medium hover:underline"
                  >
                    Open Size Assistant →
                  </button>
                )}
                
                {notification.type === 'welcome' && (
                  <button
                    onClick={() => {
                      setIsExpanded(true);
                      setNotification(null);
                    }}
                    className="mt-3 text-xs text-burgundy font-medium hover:underline"
                  >
                    View chat options →
                  </button>
                )}
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setNotification(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Pointer arrow */}
            <div className="absolute -right-2 bottom-8 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Assistant Chat */}
      <AnimatePresence>
        {showSizeAssistant && (
          <SizeAssistantChat
            onClose={() => {
              setShowSizeAssistant(false);
              setActiveChat(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Other Chat Windows - Placeholder for future implementation */}
      <AnimatePresence>
        {activeChat && activeChat !== 'sizing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-burgundy to-burgundy-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {chatOptions.find(o => o.id === activeChat)?.icon}
                <div>
                  <h3 className="font-semibold">{chatOptions.find(o => o.id === activeChat)?.title}</h3>
                  <p className="text-xs text-white/80">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setActiveChat(null)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="flex-1 p-4 bg-gray-50">
              <div className="text-center text-gray-500 mt-20">
                <p className="text-sm">Chat interface for {activeChat}</p>
                <p className="text-xs mt-2">Coming soon!</p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}