import { useEffect } from 'react'
import { useCustomerStore } from '@/store/customerStore'
import { createClient } from '@supabase/supabase-js'
import type { CustomerProfile, LoyaltyTier } from '@/lib/customer/types'

// Create Supabase client with build-time guard
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function useAuth() {
  const { login, logout, profile, isAuthenticated } = useCustomerStore()

  useEffect(() => {
    // Check for existing session
    checkSession()

    // Listen for auth changes
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await handleSignIn(session.user.id, session.user.email!)
        } else if (event === 'SIGNED_OUT') {
          logout()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkSession = async () => {
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await handleSignIn(session.user.id, session.user.email!)
    }
  }

  const handleSignIn = async (userId: string, email: string) => {
    try {
      const supabase = getSupabaseClient();
      // Fetch user profile from database
      const { data: profileData, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      // If table doesn't exist or error, create a temporary profile
      if (error) {
        console.warn('Customer profiles table not available, using temporary profile')
        const tempProfile: CustomerProfile = {
          id: userId,
          email,
          preferences: {
            favoriteColors: [],
            preferredFit: 'regular',
            stylePersonality: 'classic',
            occasionFrequency: {
              business: 0,
              formal: 0,
              casual: 0,
              special: 0
            },
            brands: []
          },
          measurements: [],
          addresses: [],
          paymentMethods: [],
          orderHistory: [],
          wishlist: [],
          loyaltyPoints: 0,
          tier: getLoyaltyTier(0),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        login(tempProfile)
        return
      }

      if (profileData) {
        // Load existing profile
        const profile: CustomerProfile = {
          ...profileData,
          createdAt: new Date(profileData.created_at),
          updatedAt: new Date(profileData.updated_at),
          dateOfBirth: profileData.date_of_birth ? new Date(profileData.date_of_birth) : undefined,
          tier: getLoyaltyTier(profileData.loyalty_points || 0)
        }
        
        login(profile)
      } else {
        // Create new profile
        const newProfile = await createNewProfile(userId, email)
        login(newProfile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      // Create temporary profile on any error
      const tempProfile: CustomerProfile = {
        id: userId,
        email,
        preferences: {
          favoriteColors: [],
          preferredFit: 'regular',
          stylePersonality: 'classic',
          occasionFrequency: {
            business: 0,
            formal: 0,
            casual: 0,
            special: 0
          },
          brands: []
        },
        measurements: [],
        addresses: [],
        paymentMethods: [],
        orderHistory: [],
        wishlist: [],
        loyaltyPoints: 0,
        tier: getLoyaltyTier(0),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      login(tempProfile)
    }
  }

  const createNewProfile = async (userId: string, email: string): Promise<CustomerProfile> => {
    const profile: CustomerProfile = {
      id: userId,
      email,
      preferences: {
        favoriteColors: [],
        preferredFit: 'regular',
        stylePersonality: 'classic',
        occasionFrequency: {
          business: 0,
          formal: 0,
          casual: 0,
          special: 0
        },
        brands: []
      },
      measurements: [],
      addresses: [],
      paymentMethods: [],
      orderHistory: [],
      wishlist: [],
      loyaltyPoints: 0,
      tier: getLoyaltyTier(0),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Save to database
    await supabase.from('customer_profiles').insert({
      user_id: userId,
      email,
      preferences: profile.preferences,
      loyalty_points: 0,
      created_at: profile.createdAt.toISOString(),
      updated_at: profile.updatedAt.toISOString()
    })

    return profile
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    logout()
  }

  const updateProfile = async (updates: Partial<CustomerProfile>) => {
    if (!profile) return

    const { error } = await supabase
      .from('customer_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', profile.id)

    if (error) throw error
  }

  return {
    profile,
    user: profile, // Alias for backward compatibility
    isAuthenticated,
    loading: false, // This hook doesn't track loading state currently
    signIn,
    signUp,
    signOut,
    updateProfile
  }
}

function getLoyaltyTier(points: number): LoyaltyTier {
  if (points >= 10000) {
    return {
      name: 'Crown',
      benefits: [
        'Free shipping on all orders',
        'Priority customer support',
        'Exclusive access to new collections',
        '25% discount on all purchases',
        'Personal stylist consultations',
        'VIP event invitations'
      ],
      pointsRequired: 10000,
      discountPercentage: 25,
      freeShipping: true,
      prioritySupport: true,
      exclusiveAccess: true
    }
  } else if (points >= 5000) {
    return {
      name: 'Platinum',
      benefits: [
        'Free shipping on orders over $100',
        'Priority customer support',
        'Early access to sales',
        '15% discount on all purchases',
        'Quarterly style guides'
      ],
      pointsRequired: 5000,
      discountPercentage: 15,
      freeShipping: true,
      prioritySupport: true,
      exclusiveAccess: true
    }
  } else if (points >= 1000) {
    return {
      name: 'Gold',
      benefits: [
        'Free shipping on orders over $200',
        'Extended return window',
        '10% discount on all purchases',
        'Birthday rewards'
      ],
      pointsRequired: 1000,
      discountPercentage: 10,
      freeShipping: false,
      prioritySupport: false,
      exclusiveAccess: false
    }
  } else {
    return {
      name: 'Sterling',
      benefits: [
        'Earn points on every purchase',
        'Exclusive member offers',
        '5% welcome discount',
        'Style tips and guides'
      ],
      pointsRequired: 0,
      discountPercentage: 5,
      freeShipping: false,
      prioritySupport: false,
      exclusiveAccess: false
    }
  }
}