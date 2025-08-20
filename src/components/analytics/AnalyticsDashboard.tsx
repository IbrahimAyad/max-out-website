'use client'

import { useState, useEffect } from 'react'
import { BarChart, Users, ShoppingCart, TrendingUp, Eye, MousePointer, Clock, DollarSign, Facebook } from 'lucide-react'

interface AnalyticsEvent {
  event: string
  timestamp: Date
  parameters?: any
  platform: 'GA4' | 'Facebook'
}

export function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    // Intercept gtag calls
    const originalGtag = window.gtag
    if (originalGtag) {
      window.gtag = function(...args: any[]) {
        // Call original gtag
        originalGtag.apply(window, args)
        
        // Log event
        if (args[0] === 'event') {
          const newEvent: AnalyticsEvent = {
            event: args[1],
            timestamp: new Date(),
            parameters: args[2],
            platform: 'GA4'
          }
          setEvents(prev => [...prev.slice(-49), newEvent])
        }
      }
    }

    // Intercept Facebook Pixel calls
    const originalFbq = window.fbq
    if (originalFbq) {
      window.fbq = function(...args: any[]) {
        // Call original fbq
        originalFbq.apply(window, args)
        
        // Log event
        if (args[0] === 'track' || args[0] === 'trackCustom') {
          const newEvent: AnalyticsEvent = {
            event: args[1],
            timestamp: new Date(),
            parameters: args[2],
            platform: 'Facebook'
          }
          setEvents(prev => [...prev.slice(-49), newEvent])
        }
      }
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') return null

  const getEventIcon = (eventName: string) => {
    switch (eventName) {
      case 'page_view':
        return <Eye className="w-4 h-4" />
      case 'view_item':
      case 'view_item_list':
        return <Eye className="w-4 h-4 text-blue-500" />
      case 'add_to_cart':
      case 'remove_from_cart':
        return <ShoppingCart className="w-4 h-4 text-green-500" />
      case 'begin_checkout':
      case 'purchase':
        return <DollarSign className="w-4 h-4 text-green-600" />
      case 'click':
      case 'select_item':
        return <MousePointer className="w-4 h-4 text-purple-500" />
      case 'user_engagement':
        return <Clock className="w-4 h-4 text-orange-500" />
      case 'login':
      case 'sign_up':
        return <Users className="w-4 h-4 text-indigo-500" />
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500" />
    }
  }

  const formatEventName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        title="Toggle Analytics Dashboard"
      >
        <BarChart className="w-5 h-5" />
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-black text-white p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Analytics Monitor
            </h3>
            <p className="text-xs text-gray-300 mt-1">Real-time GA4 & Facebook Pixel tracking</p>
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                No events tracked yet. Navigate the site to see events.
              </p>
            ) : (
              <div className="space-y-2">
                {events.slice().reverse().map((event, index) => (
                  <div
                    key={`${event.timestamp.getTime()}-${index}`}
                    className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.event)}
                        <span className="font-medium text-sm">
                          {formatEventName(event.event)}
                        </span>
                        {event.platform === 'Facebook' && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Facebook className="w-3 h-3" />
                            FB
                          </span>
                        )}
                        {event.platform === 'GA4' && (
                          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                            GA4
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {event.parameters && (
                      <div className="mt-2 text-xs text-gray-600">
                        <details className="cursor-pointer">
                          <summary className="hover:text-gray-800">Parameters</summary>
                          <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
                            {JSON.stringify(event.parameters, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t p-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Total Events: {events.length}</span>
              <button
                onClick={() => setEvents([])}
                className="text-red-600 hover:text-red-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}