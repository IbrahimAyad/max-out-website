"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  X,
  Sparkles,
  MessageSquare,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { AIResponse, Action, ProductSuggestion } from '@/lib/ai/types'
import Image from 'next/image'
import Link from 'next/link'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  intent?: string
  productRecommendations?: any[]
  suggestedActions?: Action[]
}

interface ChatAssistantProps {
  sessionId?: string
  userId?: string
  initialMessage?: string
  className?: string
  onProductClick?: (productId: string) => void
}

export function ChatAssistant({ 
  sessionId = `session_${Date.now()}`,
  userId,
  initialMessage,
  className,
  onProductClick
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send initial message if provided
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: initialMessage || "Hello! I'm your personal shopping assistant. How can I help you find the perfect outfit today?",
        timestamp: new Date()
      }])
    }
  }, [initialMessage, messages.length])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          sessionId,
          userId,
          context: {
            extractedPreferences: {},
            activeProducts: []
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        const aiMessage: ChatMessage = {
          id: `msg_${Date.now()}_ai`,
          role: 'assistant',
          content: data.response.message,
          timestamp: new Date(),
          intent: data.response.intent,
          productRecommendations: data.response.productRecommendations,
          suggestedActions: data.response.suggestedActions
        }
        setMessages(prev => [...prev, aiMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting. Please try again in a moment.",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleAction = (action: Action) => {
    switch (action.type) {
      case 'navigate':
        window.location.href = action.data.url
        break
      case 'filter':
        // Handle filter action
        break
      case 'size-guide':
        // Open size guide modal
        break
      case 'contact-support':
        window.location.href = '/contact'
        break
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 'welcome_new',
      role: 'assistant',
      content: "Chat cleared! How can I help you today?",
      timestamp: new Date()
    }])
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50",
      isExpanded ? "w-96 h-[600px]" : "w-96 h-[500px]",
      className
    )}>
      <Card className="h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-burgundy to-burgundy-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-8 w-8" />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold">Atelier AI Assistant</h3>
                <p className="text-xs text-white/80">Powered by Fashion CLIP</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white hover:bg-white/20"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearChat}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-burgundy/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-burgundy" />
                    </div>
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[80%] space-y-2",
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}>
                  <div className={cn(
                    "rounded-lg px-4 py-2",
                    message.role === 'user' 
                      ? 'bg-burgundy text-white' 
                      : 'bg-gray-100 text-gray-800'
                  )}>
                    <p className="text-sm">{message.content}</p>
                  </div>

                  {/* Intent Badge */}
                  {message.intent && (
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {message.intent.replace('-', ' ')}
                    </Badge>
                  )}

                  {/* Product Recommendations */}
                  {message.productRecommendations && message.productRecommendations.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {message.productRecommendations.map((rec, idx) => (
                        <Card 
                          key={idx}
                          className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onProductClick?.(rec.productId)}
                        >
                          <div className="flex items-center gap-3">
                            {rec.product?.image && (
                              <Image
                                src={rec.product.image}
                                alt={rec.product.name}
                                width={60}
                                height={60}
                                className="rounded object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{rec.product?.name || 'Product'}</h5>
                              <p className="text-xs text-gray-600">{rec.reason}</p>
                              <p className="text-sm font-semibold text-burgundy mt-1">
                                ${rec.product?.price || '---'}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Suggested Actions */}
                  {message.suggestedActions && message.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {message.suggestedActions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(action)}
                          className="text-xs"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="h-8 w-8 rounded-full bg-burgundy/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-burgundy" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about our collection..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy focus:border-transparent"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-burgundy hover:bg-burgundy-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by Fashion CLIP & GPT-4
          </p>
        </div>
      </Card>
    </div>
  )
}