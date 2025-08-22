import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Singleton instance for consistent client usage
let supabaseInstance: any = null

import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Singleton instances for consistent client usage
let browserClientInstance: any = null
let supabaseInstance: any = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, return a mock client to prevent errors
    if (typeof window === 'undefined') {
      return null as any
    }
    throw new Error('Missing Supabase environment variables')
  }

  // Return singleton instance for browser
  if (typeof window !== 'undefined' && browserClientInstance) {
    return browserClientInstance
  }

  const client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  
  // Store singleton instance for browser
  if (typeof window !== 'undefined') {
    browserClientInstance = client
  }
  
  return client
}

// Singleton getter for shared service usage
export function getSupabaseClient() {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'kct-auth-session'
      }
    })
  }
  
  return supabaseInstance
}

// Admin client for server-side operations (with service role key)
export const supabaseAdmin = (() => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return null as any
    }

    return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false // Admin client doesn't need session persistence
      }
    })
  } catch (error) {
    return null as any
  }
})()

// Export the default client instance as 'supabase' for compatibility
export const supabase = getSupabaseClient()