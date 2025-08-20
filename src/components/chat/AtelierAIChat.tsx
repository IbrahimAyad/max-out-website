'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  Sparkles, 
  MessageCircle,
  ChevronDown,
  Crown,
  Loader2,
  Image as ImageIcon,
  Mic,
  Hash,
  MicOff,
  Volume2
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { knowledgeChatCommerceService } from '@/services/knowledge-chat-commerce-service'
import { voiceChatService } from '@/services/voice-chat-service'
import { ChatProductCard } from './ChatProductCard'
import { UnifiedProduct } from '@/types/unified-shop'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
  layerLevel?: 1 | 2 | 3
  products?: Array<{
    product: UnifiedProduct
    reason: string
    matchScore: number
  }>
  actions?: Array<{
    type: 'view' | 'add_to_cart' | 'buy_now' | 'size_guide'
    label: string
    productId?: string
  }>
}

interface AtelierAIChatProps {
  onClose?: () => void
  isOpen?: boolean
  className?: string
}

export function AtelierAIChat({ onClose, isOpen = true, className }: AtelierAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChat()
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      // Cleanup voice service
      voiceChatService.cleanup()
    }
  }, [isOpen, isInitialized])

  const initializeChat = async () => {
    // Welcome message
    setMessages([{
      id: '1',
      content: "Welcome to Atelier AI, your personal luxury menswear consultant. I embody the Sterling Crown philosophy - where luxury is a mindset, not just a price tag. How may I elevate your style today?",
      sender: 'assistant',
      timestamp: new Date(),
      layerLevel: 1
    }])
    setIsInitialized(true)
  }

  const quickActions = [
    { label: "Find my perfect suit", icon: Crown },
    { label: "Wedding styling", icon: Sparkles },
    { label: "Business attire guide", icon: Hash },
    { label: "Seasonal recommendations", icon: MessageCircle }
  ]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await knowledgeChatCommerceService.processEnhancedMessage(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        sender: 'assistant',
        timestamp: new Date(),
        layerLevel: response.layerLevel || 1,
        products: response.products,
        actions: response.actions
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
      // Update quick actions with suggestions
      if (response.suggestions) {
        // Could update quick actions dynamically
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize for the inconvenience. Let me help you with style guidance based on our extensive fashion knowledge. What specific aspect of menswear can I assist you with today?",
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    inputRef.current?.focus()
  }

  const handleVoiceRecord = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      try {
        const audioBlob = await voiceChatService.stopRecording()
        setIsTyping(true)
        
        // Transcribe and send voice message
        const voiceResponse = await voiceChatService.sendVoiceMessage(audioBlob)
        
        // Add user message (transcript)
        if (voiceResponse.transcript) {
          const userMessage: Message = {
            id: Date.now().toString(),
            content: voiceResponse.transcript,
            sender: 'user',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, userMessage])
        }
        
        // Add AI response
        if (voiceResponse.message) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: voiceResponse.message,
            sender: 'assistant',
            timestamp: new Date(),
            layerLevel: 1
          }
          setMessages(prev => [...prev, aiMessage])
          
          // Play voice response if available
          if (voiceResponse.audioUrl || voiceResponse.audioBase64) {
            setIsPlaying(true)
            await voiceChatService.playAudio(voiceResponse.audioUrl || voiceResponse.audioBase64!)
            setIsPlaying(false)
          }
        }
      } catch (error) {
        console.error('Voice recording error:', error)
        
        // Add error message to chat
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: "I'm having trouble with voice features right now. The CORS settings need to be configured on the server. Please use text input for now, and I'll help you just as well!",
          sender: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    } else {
      // Start recording
      try {
        await voiceChatService.startRecording()
        setIsRecording(true)
      } catch (error) {
        console.error('Failed to start recording:', error)
        alert('Microphone access denied. Please enable microphone permissions.')
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={cn(
          // Desktop styles
          "fixed bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl border border-red-900/20 overflow-hidden z-50",
          // Mobile styles - full screen on small devices
          "bottom-0 right-0 left-0 md:bottom-6 md:right-6 md:left-auto",
          "w-full md:w-[420px]",
          "rounded-none md:rounded-2xl",
          isMinimized && "h-16",
          !isMinimized && "mobile-full-height md:h-[650px]",
          // Mobile safe areas
          "pb-0 md:pb-0",
          className
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-gray-900 p-4 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-gold via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="h-7 w-7 text-black" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-wide">Atelier AI</h3>
                <p className="text-xs text-gray-200 font-medium">Powered by KCT Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isMinimized && "rotate-180"
                )} />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-gray-50/50 mobile-messages-container md:h-[420px]">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 chat-message",
                    message.sender === 'user' 
                      ? "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-md chat-message-user" 
                      : "bg-white text-gray-900 shadow-sm border border-gray-200 chat-message-ai"
                  )}>
                    {message.sender === 'assistant' && (
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="h-3 w-3 text-red-700" />
                        <span className="text-xs font-semibold text-red-700">Atelier AI</span>
                        {message.layerLevel && (
                          <Badge className="text-xs py-0 px-1.5 bg-red-100 text-red-800 border-red-200">
                            Layer {message.layerLevel}
                          </Badge>
                        )}
                        {isPlaying && messages[messages.length - 1]?.id === message.id && (
                          <div className="flex items-center gap-1">
                            <Volume2 className="h-3 w-3 text-red-700 animate-pulse" />
                            <span className="text-xs text-red-700">Speaking</span>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {/* Product Cards */}
                    {message.products && message.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((item, index) => (
                          <ChatProductCard
                            key={index}
                            product={item.product}
                            reason={item.reason}
                            matchScore={item.matchScore}
                            compact={true}
                            onAction={(action, product) => {
                              if (action === 'add_to_cart') {
                                toast.success(`Added ${product.name} to cart`)
                              } else if (action === 'buy_now') {
                                // Handle buy now
                                window.location.href = `/checkout?product=${product.id}`
                              }
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    {message.actions && message.actions.length > 0 && message.products && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.slice(0, 3).map((action, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              if (action.type === 'view') {
                                // Handle view action
                                window.open(action.url, '_blank');
                              } else if (action.type === 'add') {
                                // Handle add to cart action
                              }
                            }}
                            className="px-3 py-1.5 bg-burgundy-600 text-white text-sm rounded-lg hover:bg-burgundy-700 transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about styling, sizing, or recommendations..."
                  className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none"
                  rows={1}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-red-900 hover:bg-red-800"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Export the chat button component for use in layout
export function AtelierAIChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      {isOpen && <AtelierAIChat isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
