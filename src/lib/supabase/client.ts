import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Global singleton instance for browser client to prevent multiple instances
let browserClientInstance: any = null

export function createClient() {
  // Return existing instance if available (browser only)
  if (typeof window !== 'undefined' && browserClientInstance) {
    return browserClientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, return a mock client to prevent errors
    if (typeof window === 'undefined') {
      return null as any
    }
    throw new Error('Missing Supabase environment variables')
  }

  const client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'kct-auth-session'
    }
  })
  
  // Store singleton instance for browser
  if (typeof window !== 'undefined') {
    browserClientInstance = client
  }
  
  return client
}

// Admin client for server-side operations (with service role key)
export const supabaseAdmin = (() => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return null as any
    }

    // Import createClient from supabase-js for admin client
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    
    return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
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
export const supabase = createClient()