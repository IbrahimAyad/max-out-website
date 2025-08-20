'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, Paperclip, Image, Sparkles, ShoppingBag,
  User, Bot, Camera, Heart, Star, ChevronDown, X, Maximize2, Minimize2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { personalStylistChat, ChatMessage, StylistResponse } from '@/lib/services/personalStylistChat';

interface PersonalStylistChatProps {
  customerId: string;
  customerName?: string;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
}

export function PersonalStylistChat({
  customerId,
  customerName,
  isMinimized = false,
  onMinimize,
  onMaximize,
  className = ""
}: PersonalStylistChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize conversation
    const context = personalStylistChat.initializeConversation(customerId, customerName);
    setMessages(context.conversationHistory);
  }, [customerId, customerName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && selectedFiles.length === 0) return;

    setIsTyping(true);

    try {
      const response = await personalStylistChat.processMessage(
        customerId,
        inputValue,
        selectedFiles
      );

      // Update messages with the complete conversation history
      const updatedHistory = personalStylistChat.getConversationHistory(customerId);
      setMessages(updatedHistory);

      setInputValue('');
      setSelectedFiles([]);
    } catch (error) {

      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files.slice(0, 3 - prev.length)]); // Max 3 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === 'user';

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}

        <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>

            {/* Fashion-CLIP Analysis */}
            {message.fashionClipAnalysis && (
              <div className="mt-3 p-3 bg-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-medium">AI Analysis</span>
                </div>
                <div className="text-xs space-y-1">
                  <div>Styles: {message.fashionClipAnalysis.styles.join(', ')}</div>
                  <div>Colors: {message.fashionClipAnalysis.colors.join(', ')}</div>
                  <div>Confidence: {Math.round(message.fashionClipAnalysis.confidence * 100)}%</div>
                </div>
              </div>
            )}

            {/* File Attachments */}
            {message.attachments?.map((attachment, index) => (
              <div key={index} className="mt-2">
                {attachment.type === 'image' && (
                  <div className="w-32 h-32 bg-white/20 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(attachment.data)}
                      alt="Uploaded image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {isUser && (
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                <User className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  if (isMinimized) {
    return (
      <Card className={`fixed bottom-4 right-4 w-80 shadow-xl ${className}`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-sm">Personal Stylist</div>
                <div className="text-xs text-gray-600">AI-powered fashion advice</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMaximize}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-3">
            Ready to help you find the perfect style!
          </p>
          <Button 
            onClick={onMaximize}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Styling Session
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-96 h-[600px] shadow-xl flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm">Personal Stylist</div>
              <div className="text-xs text-white/80">Powered by Fashion-CLIP AI</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white"
      >
        {messages.map(renderMessage)}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="flex gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about style, outfits, or upload a photo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10 p-0"
              disabled={selectedFiles.length >= 3}
            >
              <Camera className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && selectedFiles.length === 0}
              className="h-10 w-10 p-0 bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Card>
  );
}