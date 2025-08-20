import { createClient } from '@/lib/supabase/client';

// Enhanced interfaces for the luxury profile system
export interface EnhancedUserProfile {
  id: string;
  email: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  bio?: string;
  location?: string;
  
  // Profile completion tracking
  profile_completion_score: number;
  onboarding_completed: boolean;
  onboarding_step: number;
  
  // Core profile sections
  size_profile: EnhancedSizeProfile;
  style_dna: StyleDNA;
  address_book: SmartAddress[];
  payment_methods: SavedPaymentMethod[];
  
  // Activity tracking
  wishlist_items: string[];
  favorite_brands: string[];
  style_score: number;
  loyalty_points: number;
  total_orders: number;
  total_spent: number;
  
  // Preferences and settings
  notification_preferences: NotificationPreferences;
  privacy_settings: PrivacySettings;
  communication_preferences: CommunicationPreferences;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface EnhancedSizeProfile {
  // Body measurements (inches)
  chest?: number;
  waist?: number;
  hips?: number;
  neck?: number;
  inseam?: number;
  outseam?: number;
  sleeve?: number;
  shoulder_width?: number;
  jacket_length?: number;
  trouser_length?: number;
  
  // Shoe sizing
  shoe_size: {
    us?: number;
    uk?: number;
    eu?: number;
    width: 'narrow' | 'medium' | 'wide' | 'extra_wide';
  };
  
  // Fit preferences with detailed options
  preferred_fit: {
    jackets: 'extra_slim' | 'slim' | 'tailored' | 'regular' | 'relaxed' | 'oversized';
    pants: 'skinny' | 'slim' | 'straight' | 'regular' | 'relaxed' | 'wide';
    shirts: 'extra_slim' | 'slim' | 'fitted' | 'regular' | 'relaxed';
  };
  
  // Body type classification
  body_type?: 'athletic' | 'slim' | 'regular' | 'muscular' | 'fuller' | 'tall' | 'petite';
  build_type?: 'ectomorph' | 'mesomorph' | 'endomorph';
  
  // Measurement metadata
  measured_by: 'self' | 'tailor' | 'kct_store' | 'ai_estimation';
  measurement_date?: string;
  confidence_level: number; // 0-100
  measurement_notes?: string;
  preferred_tailor?: string;
  
  // Size recommendations
  recommended_sizes: {
    suits: string[];
    shirts: string[];
    pants: string[];
    shoes: string[];
  };
  
  // Fit issues tracking
  common_fit_issues: string[];
  alteration_preferences: string[];
}

export interface StyleDNA {
  // Color preferences with hex codes
  signature_colors: ColorPreference[];
  accent_colors: ColorPreference[];
  neutral_colors: ColorPreference[];
  avoid_colors: ColorPreference[];
  
  // Style personality
  style_archetypes: StyleArchetype[];
  style_confidence_level: number; // 0-100
  fashion_risk_tolerance: 'conservative' | 'moderate' | 'adventurous' | 'avant_garde';
  
  // Occasion preferences with weights
  occasion_priorities: OccasionPreference[];
  lifestyle_requirements: LifestyleRequirement[];
  
  // Pattern and texture preferences
  pattern_preferences: PatternPreference[];
  texture_preferences: TexturePreference[];
  fabric_preferences: FabricPreference[];
  
  // Brand affinities and budget
  preferred_brands: BrandAffinity[];
  luxury_tier_preference: 'accessible' | 'contemporary' | 'luxury' | 'ultra_luxury';
  budget_ranges: BudgetRange[];
  value_priorities: ValuePriority[];
  
  // Seasonal preferences
  seasonal_style_shifts: SeasonalPreference[];
  climate_considerations: ClimatePreference;
  
  // Style evolution tracking
  style_journey_milestones: StyleMilestone[];
  inspiration_sources: InspirationSource[];
  style_goals: string[];
}

export interface ColorPreference {
  name: string;
  hex: string;
  category: 'primary' | 'secondary' | 'accent' | 'neutral';
  confidence: number; // 0-100
  occasions: string[];
  season_suitability: ('spring' | 'summer' | 'fall' | 'winter')[];
}

export interface StyleArchetype {
  name: string;
  description: string;
  weight: number; // 0-100, how much this archetype represents the user
  key_pieces: string[];
  inspiration_icons: string[];
}

export interface OccasionPreference {
  occasion: string;
  frequency: number; // How often they dress for this occasion
  importance: number; // How important looking good for this occasion is
  budget_allocation: number; // Percentage of wardrobe budget
  style_requirements: string[];
}

export interface SmartAddress {
  id: string;
  label: string;
  name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  
  // Smart features
  is_default_shipping: boolean;
  is_default_billing: boolean;
  address_type: 'home' | 'office' | 'other';
  delivery_instructions?: string;
  preferred_delivery_time?: string;
  
  // Location intelligence
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timezone?: string;
  delivery_zone?: string;
  
  // Usage tracking
  last_used?: string;
  usage_count: number;
  delivery_success_rate: number;
  
  // Verification status
  is_verified: boolean;
  verification_source?: 'user' | 'google' | 'usps' | 'fedex';
  
  created_at: string;
  updated_at: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  provider: string;
  last_four?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
  nickname?: string;
  billing_address_id?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email_notifications: {
    order_updates: boolean;
    shipping_notifications: boolean;
    new_arrivals: boolean;
    sales_promotions: boolean;
    style_recommendations: boolean;
    restock_alerts: boolean;
    size_fit_tips: boolean;
  };
  sms_notifications: {
    order_updates: boolean;
    shipping_notifications: boolean;
    appointment_reminders: boolean;
  };
  push_notifications: {
    order_updates: boolean;
    wishlist_sales: boolean;
    style_tips: boolean;
    new_collections: boolean;
  };
  notification_frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
    timezone: string;
  };
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  share_style_preferences: boolean;
  share_fit_data: boolean;
  allow_style_recommendations: boolean;
  data_sharing_consent: boolean;
  marketing_consent: boolean;
  analytics_consent: boolean;
}

export interface CommunicationPreferences {
  preferred_language: string;
  preferred_contact_method: 'email' | 'phone' | 'sms' | 'app';
  stylist_communication: boolean;
  personal_shopping_invites: boolean;
  vip_event_invites: boolean;
  feedback_requests: boolean;
}

// Additional supporting interfaces
export interface LifestyleRequirement {
  name: string;
  importance: number;
  description: string;
}

export interface PatternPreference {
  pattern: string;
  preference: 'love' | 'like' | 'neutral' | 'dislike' | 'avoid';
  occasions: string[];
}

export interface TexturePreference {
  texture: string;
  preference: 'love' | 'like' | 'neutral' | 'dislike' | 'avoid';
  season_suitability: string[];
}

export interface FabricPreference {
  fabric: string;
  preference: 'love' | 'like' | 'neutral' | 'dislike' | 'avoid';
  reasons: string[];
}

export interface BrandAffinity {
  brand: string;
  affinity_level: number; // 0-100
  owned_pieces: number;
  last_purchase?: string;
  categories: string[];
}

export interface BudgetRange {
  category: string;
  min_price: number;
  max_price: number;
  typical_spend: number;
  splurge_threshold: number;
}

export interface ValuePriority {
  factor: string;
  importance: number; // 0-100
  description: string;
}

export interface SeasonalPreference {
  season: 'spring' | 'summer' | 'fall' | 'winter';
  style_adjustments: string[];
  color_shifts: string[];
  fabric_preferences: string[];
}

export interface ClimatePreference {
  climate_type: string;
  temperature_sensitivity: 'high' | 'medium' | 'low';
  humidity_considerations: boolean;
  seasonal_wardrobe_rotation: boolean;
}

export interface StyleMilestone {
  date: string;
  milestone: string;
  description: string;
  impact_score: number;
}

export interface InspirationSource {
  source: string;
  type: 'celebrity' | 'influencer' | 'brand' | 'era' | 'culture' | 'art';
  influence_level: number;
}

// Enhanced User Profile Service
class EnhancedUserProfileService {
  private supabase = createClient();

  // Profile management
  async getProfile(userId?: string): Promise<EnhancedUserProfile | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    const id = userId || user?.id;
    
    if (!id) return null;

    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  async updateProfile(updates: Partial<EnhancedUserProfile>): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return false;

    // Calculate profile completion score
    const completionScore = this.calculateProfileCompletion({
      ...updates,
      id: user.id
    } as EnhancedUserProfile);

    const { error } = await this.supabase
      .from('user_profiles')
      .update({
        ...updates,
        profile_completion_score: completionScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    return !error;
  }

  // Size profile management
  async updateSizeProfile(sizeProfile: Partial<EnhancedSizeProfile>): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return false;

    // Generate size recommendations based on measurements
    const recommendations = this.generateSizeRecommendations(sizeProfile);
    
    const enhancedSizeProfile = {
      ...sizeProfile,
      recommended_sizes: recommendations,
      measurement_date: new Date().toISOString(),
      confidence_level: this.calculateMeasurementConfidence(sizeProfile)
    };

    const { error } = await this.supabase
      .from('user_profiles')
      .update({ 
        size_profile: enhancedSizeProfile,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    return !error;
  }

  // Style DNA management
  async updateStyleDNA(styleDNA: Partial<StyleDNA>): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return false;

    // Calculate style score based on completeness and consistency
    const styleScore = this.calculateStyleScore(styleDNA);

    const { error } = await this.supabase
      .from('user_profiles')
      .update({ 
        style_dna: styleDNA,
        style_score: styleScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    return !error;
  }

  // Address management
  async addAddress(address: Omit<SmartAddress, 'id' | 'created_at' | 'updated_at' | 'usage_count' | 'delivery_success_rate'>): Promise<boolean> {
    const profile = await this.getProfile();
    if (!profile) return false;

    // Verify and enhance address
    const enhancedAddress: SmartAddress = {
      ...address,
      id: this.generateId(),
      usage_count: 0,
      delivery_success_rate: 100,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add geocoding if needed
    try {
      const coordinates = await this.geocodeAddress(address);
      if (coordinates) {
        enhancedAddress.coordinates = coordinates;
      }
    } catch (error) {
      console.warn('Geocoding failed:', error);
    }

    const addresses = [...(profile.address_book || []), enhancedAddress];
    return this.updateProfile({ address_book: addresses });
  }

  async updateAddress(addressId: string, updates: Partial<SmartAddress>): Promise<boolean> {
    const profile = await this.getProfile();
    if (!profile) return false;

    const addresses = profile.address_book.map(addr =>
      addr.id === addressId 
        ? { ...addr, ...updates, updated_at: new Date().toISOString() }
        : addr
    );
    
    return this.updateProfile({ address_book: addresses });
  }

  async deleteAddress(addressId: string): Promise<boolean> {
    const profile = await this.getProfile();
    if (!profile) return false;

    const addresses = profile.address_book.filter(addr => addr.id !== addressId);
    return this.updateProfile({ address_book: addresses });
  }

  // Wishlist management
  async addToWishlist(productId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return false;

    const { error } = await this.supabase
      .rpc('add_to_wishlist', {
        user_id: user.id,
        product_id: productId
      });

    return !error;
  }

  async removeFromWishlist(productId: string): Promise<boolean> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return false;

    const { error } = await this.supabase
      .rpc('remove_from_wishlist', {
        user_id: user.id,
        product_id: productId
      });

    return !error;
  }

  // Analytics and insights
  async getStyleInsights(userId?: string): Promise<any> {
    const profile = await this.getProfile(userId);
    if (!profile) return null;

    return {
      stylePersonality: this.analyzeStylePersonality(profile.style_dna),
      fitRecommendations: this.generateFitRecommendations(profile.size_profile),
      colorAnalysis: this.analyzeColorPreferences(profile.style_dna.signature_colors),
      shoppingInsights: this.generateShoppingInsights(profile),
      styleEvolution: this.trackStyleEvolution(profile.style_dna.style_journey_milestones)
    };
  }

  // Private helper methods
  private calculateProfileCompletion(profile: EnhancedUserProfile): number {
    let score = 0;
    const sections = [
      { field: 'full_name', weight: 10 },
      { field: 'avatar_url', weight: 10 },
      { field: 'size_profile', weight: 30 },
      { field: 'style_dna', weight: 40 },
      { field: 'address_book', weight: 10 }
    ];

    sections.forEach(section => {
      const value = profile[section.field as keyof EnhancedUserProfile];
      if (value) {
        if (section.field === 'size_profile') {
          score += this.calculateSizeProfileCompleteness(value as EnhancedSizeProfile) * (section.weight / 100);
        } else if (section.field === 'style_dna') {
          score += this.calculateStyleDNACompleteness(value as StyleDNA) * (section.weight / 100);
        } else if (section.field === 'address_book') {
          score += (Array.isArray(value) && value.length > 0 ? 100 : 0) * (section.weight / 100);
        } else {
          score += section.weight;
        }
      }
    });

    return Math.round(score);
  }

  private calculateSizeProfileCompleteness(sizeProfile: EnhancedSizeProfile): number {
    const requiredFields = ['chest', 'waist', 'inseam', 'neck'];
    const completedFields = requiredFields.filter(field => 
      sizeProfile[field as keyof EnhancedSizeProfile] !== undefined
    );
    return (completedFields.length / requiredFields.length) * 100;
  }

  private calculateStyleDNACompleteness(styleDNA: StyleDNA): number {
    let score = 0;
    if (styleDNA.signature_colors?.length > 0) score += 25;
    if (styleDNA.style_archetypes?.length > 0) score += 25;
    if (styleDNA.occasion_priorities?.length > 0) score += 25;
    if (styleDNA.budget_ranges?.length > 0) score += 25;
    return score;
  }

  private calculateMeasurementConfidence(sizeProfile: Partial<EnhancedSizeProfile>): number {
    // Base confidence on measurement source and completeness
    let confidence = 50;
    
    if (sizeProfile.measured_by === 'kct_store') confidence = 95;
    else if (sizeProfile.measured_by === 'tailor') confidence = 90;
    else if (sizeProfile.measured_by === 'self') confidence = 70;
    else if (sizeProfile.measured_by === 'ai_estimation') confidence = 60;

    return confidence;
  }

  private calculateStyleScore(styleDNA: Partial<StyleDNA>): number {
    // Calculate style sophistication score based on preferences
    let score = 0;
    if (styleDNA.style_confidence_level) score += styleDNA.style_confidence_level * 0.3;
    if (styleDNA.signature_colors?.length) score += Math.min(styleDNA.signature_colors.length * 10, 30);
    if (styleDNA.style_archetypes?.length) score += Math.min(styleDNA.style_archetypes.length * 15, 40);
    return Math.min(Math.round(score), 100);
  }

  private generateSizeRecommendations(sizeProfile: Partial<EnhancedSizeProfile>) {
    const recommendations = {
      suits: [] as string[],
      shirts: [] as string[],
      pants: [] as string[],
      shoes: [] as string[]
    };

    if (sizeProfile.chest) {
      // Suit size recommendations based on chest measurement
      if (sizeProfile.chest >= 50) recommendations.suits.push('52R', '54R');
      else if (sizeProfile.chest >= 48) recommendations.suits.push('50R', '52R');
      else if (sizeProfile.chest >= 46) recommendations.suits.push('48R', '50R');
      else if (sizeProfile.chest >= 44) recommendations.suits.push('46R', '48R');
      else if (sizeProfile.chest >= 42) recommendations.suits.push('44R', '46R');
      else if (sizeProfile.chest >= 40) recommendations.suits.push('42R', '44R');
      else recommendations.suits.push('40R', '42R');
    }

    return recommendations;
  }

  private async geocodeAddress(address: Partial<SmartAddress>) {
    // Implement geocoding logic (Google Maps API, etc.)
    // This is a placeholder for the actual geocoding implementation
    return null;
  }

  private generateId(): string {
    return `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private analyzeStylePersonality(styleDNA: StyleDNA) {
    // Analyze and return style personality insights
    return {
      primary_archetype: styleDNA.style_archetypes?.[0]?.name || 'Classic',
      confidence_level: styleDNA.style_confidence_level || 50,
      risk_tolerance: styleDNA.fashion_risk_tolerance || 'moderate'
    };
  }

  private generateFitRecommendations(sizeProfile: EnhancedSizeProfile) {
    return {
      jacket_fit: sizeProfile.preferred_fit?.jackets || 'regular',
      pant_fit: sizeProfile.preferred_fit?.pants || 'straight',
      shirt_fit: sizeProfile.preferred_fit?.shirts || 'regular'
    };
  }

  private analyzeColorPreferences(colors: ColorPreference[] = []) {
    return {
      dominant_colors: colors.slice(0, 3),
      color_temperature: this.determineColorTemperature(colors),
      seasonal_palette: this.determineSeasonalPalette(colors)
    };
  }

  private determineColorTemperature(colors: ColorPreference[]): 'warm' | 'cool' | 'neutral' {
    // Analyze color temperatures
    return 'neutral';
  }

  private determineSeasonalPalette(colors: ColorPreference[]): string {
    // Determine seasonal color palette
    return 'Deep Autumn';
  }

  private generateShoppingInsights(profile: EnhancedUserProfile) {
    return {
      total_spent: profile.total_spent || 0,
      average_order_value: profile.total_spent / (profile.total_orders || 1),
      loyalty_tier: this.determineLoyaltyTier(profile.loyalty_points),
      style_evolution_trend: 'Becoming more adventurous'
    };
  }

  private determineLoyaltyTier(points: number): string {
    if (points >= 10000) return 'Platinum';
    if (points >= 5000) return 'Gold';
    if (points >= 1000) return 'Silver';
    return 'Bronze';
  }

  private trackStyleEvolution(milestones: StyleMilestone[] = []) {
    return {
      total_milestones: milestones.length,
      recent_changes: milestones.slice(-3),
      growth_trajectory: 'Expanding comfort zone'
    };
  }
}

export const enhancedUserProfileService = new EnhancedUserProfileService();