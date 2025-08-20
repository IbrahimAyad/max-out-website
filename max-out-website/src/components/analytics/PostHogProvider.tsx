'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    
    // Capture settings
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    
    // Session recording settings
    enable_recording_console_log: true,
    session_recording: {
      // Only record 10% of sessions to stay within free tier
      sample_rate: 0.1,
      // Mask sensitive text by default
      maskAllInputs: true,
      maskTextFn: (text: string) => {
        // Mask credit card numbers
        if (/\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/.test(text)) {
          return '****'
        }
        return text
      }
    },
    
    // Performance settings
    bootstrap: {
      distinctId: undefined,
      isIdentifiedID: false,
    },
    
    // Privacy settings
    persistence: 'localStorage+cookie',
    cross_subdomain_cookie: true,
    
    // Opt-out settings
    opt_out_capturing_by_default: false,
    respect_dnt: true,
  })
}

// Track route changes
export function PostHogPageview() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>
}

// Export custom event tracking functions for e-commerce
export const trackEvent = {
  // Product events
  viewProduct: (product: any) => {
    posthog?.capture('product_viewed', {
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      product_price: product.price,
      currency: 'USD'
    })
  },

  addToCart: (product: any, quantity: number = 1) => {
    posthog?.capture('product_added_to_cart', {
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      product_price: product.price,
      quantity: quantity,
      cart_value: product.price * quantity,
      currency: 'USD'
    })
  },

  removeFromCart: (product: any) => {
    posthog?.capture('product_removed_from_cart', {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price
    })
  },

  // Checkout events
  startCheckout: (cartValue: number, itemCount: number) => {
    posthog?.capture('checkout_started', {
      cart_value: cartValue,
      item_count: itemCount,
      currency: 'USD'
    })
  },

  completePurchase: (orderId: string, orderValue: number, items: any[]) => {
    posthog?.capture('order_completed', {
      order_id: orderId,
      order_value: orderValue,
      item_count: items.length,
      items: items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      currency: 'USD'
    })
  },

  // User events
  signUp: (method: string, userId?: string) => {
    if (userId) {
      posthog?.identify(userId)
    }
    posthog?.capture('user_signed_up', {
      signup_method: method
    })
  },

  login: (method: string, userId?: string) => {
    if (userId) {
      posthog?.identify(userId)
    }
    posthog?.capture('user_logged_in', {
      login_method: method
    })
  },

  // Search events
  search: (query: string, resultsCount: number) => {
    posthog?.capture('search_performed', {
      search_query: query,
      results_count: resultsCount
    })
  },

  // Filter events
  applyFilter: (filterType: string, filterValue: any) => {
    posthog?.capture('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue
    })
  },

  // Custom KCT events
  viewSizeGuide: (productCategory: string) => {
    posthog?.capture('size_guide_viewed', {
      product_category: productCategory
    })
  },

  bookAppointment: (appointmentType: string) => {
    posthog?.capture('appointment_booked', {
      appointment_type: appointmentType
    })
  },

  useAIRecommendation: (feature: string) => {
    posthog?.capture('ai_feature_used', {
      feature_name: feature
    })
  },

  styleQuizCompleted: (result: string) => {
    posthog?.capture('style_quiz_completed', {
      quiz_result: result
    })
  }
}