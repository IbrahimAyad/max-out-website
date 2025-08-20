import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PUT /api/user-profiles/{userId}/style-preferences
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is updating their own profile
    if (user.id !== userId) {
      // Check if user is admin
      const { data: adminCheck } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!adminCheck) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Get style preferences data
    const stylePreferencesUpdate = await request.json();

    // Validate style preferences
    const validatedPreferences = validateStylePreferences(stylePreferencesUpdate);

    // Get current profile to merge preferences
    const { data: currentProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('style_preferences')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Merge with existing style preferences
    const mergedStylePreferences = {
      ...(currentProfile.style_preferences || {}),
      ...validatedPreferences,
      updated_at: new Date().toISOString()
    };

    // Update style preferences
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        style_preferences: mergedStylePreferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, style_preferences')
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Log style preferences update for AI recommendations
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: 'style_preferences_updated',
        metadata: {
          fields_updated: Object.keys(validatedPreferences),
          updated_by: user.id,
          ai_recommendation_trigger: true
        }
      });

    // Trigger AI recommendation update (if enabled)
    if (validatedPreferences.preferred_colors || validatedPreferences.preferred_styles) {
      await triggerAIRecommendationUpdate(userId, mergedStylePreferences);
    }

    return NextResponse.json({
      message: 'Style preferences updated successfully',
      style_preferences: updatedProfile.style_preferences
    });
  } catch (error) {
    console.error('Error updating style preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/user-profiles/{userId}/style-preferences
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    if (user.id !== userId) {
      const { data: adminCheck } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!adminCheck) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Fetch style preferences
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('style_preferences')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile.style_preferences || getDefaultStylePreferences());
  } catch (error) {
    console.error('Error fetching style preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to validate style preferences
function validateStylePreferences(data: any) {
  const validated: any = {};

  // Validate color preferences
  if (data.preferred_colors && Array.isArray(data.preferred_colors)) {
    // Map common color names to luxury menswear colors
    const colorMap: { [key: string]: string } = {
      'navy': '#003366',
      'grey': '#808080',
      'gray': '#808080',
      'black': '#000000',
      'charcoal': '#36454F',
      'brown': '#964B00',
      'tan': '#D2B48C',
      'burgundy': '#800020',
      'white': '#FFFFFF',
      'cream': '#FFFDD0',
      'blue': '#0000FF',
      'dark blue': '#00008B',
      'light blue': '#ADD8E6',
      'olive': '#808000',
      'forest green': '#228B22'
    };

    validated.preferred_colors = data.preferred_colors
      .map((color: string) => {
        const normalized = color.toLowerCase().trim();
        return colorMap[normalized] || normalized;
      })
      .filter((color: string) => color.length > 0)
      .slice(0, 10); // Limit to 10 colors
  }

  // Validate accent colors
  if (data.accent_colors && Array.isArray(data.accent_colors)) {
    validated.accent_colors = data.accent_colors
      .filter((color: string) => typeof color === 'string' && color.length > 0)
      .slice(0, 5);
  }

  // Validate colors to avoid
  if (data.avoid_colors && Array.isArray(data.avoid_colors)) {
    validated.avoid_colors = data.avoid_colors
      .filter((color: string) => typeof color === 'string' && color.length > 0)
      .slice(0, 5);
  }

  // Validate preferred styles
  if (data.preferred_styles && Array.isArray(data.preferred_styles)) {
    const validStyles = [
      'business casual',
      'smart casual',
      'formal',
      'black tie',
      'cocktail',
      'business professional',
      'casual',
      'athletic',
      'trendy',
      'classic',
      'modern',
      'vintage',
      'minimalist',
      'preppy',
      'streetwear'
    ];

    validated.preferred_styles = data.preferred_styles
      .map((style: string) => style.toLowerCase().trim())
      .filter((style: string) => validStyles.includes(style))
      .slice(0, 5);
  }

  // Validate occasions
  if (data.occasions && Array.isArray(data.occasions)) {
    const validOccasions = [
      'work',
      'wedding',
      'dinner',
      'events',
      'date night',
      'casual',
      'travel',
      'interview',
      'presentation',
      'gala',
      'graduation',
      'prom',
      'funeral',
      'cocktail party',
      'business meeting'
    ];

    validated.occasions = data.occasions
      .map((occasion: string) => occasion.toLowerCase().trim())
      .filter((occasion: string) => validOccasions.includes(occasion))
      .slice(0, 10);
  }

  // Validate brands
  if (data.brands && Array.isArray(data.brands)) {
    validated.brands = data.brands
      .filter((brand: string) => typeof brand === 'string' && brand.length > 0)
      .slice(0, 10);
  }

  // Validate materials to avoid
  if (data.avoid_materials && Array.isArray(data.avoid_materials)) {
    const validMaterials = [
      'wool',
      'cotton',
      'linen',
      'silk',
      'polyester',
      'rayon',
      'nylon',
      'cashmere',
      'leather',
      'suede',
      'velvet',
      'tweed',
      'denim',
      'synthetic'
    ];

    validated.avoid_materials = data.avoid_materials
      .map((material: string) => material.toLowerCase().trim())
      .filter((material: string) => validMaterials.includes(material))
      .slice(0, 5);
  }

  // Validate budget ranges
  if (data.budget_ranges) {
    validated.budget_ranges = {};
    
    ['suits', 'shirts', 'accessories'].forEach(category => {
      if (data.budget_ranges[category]) {
        const min = parseFloat(data.budget_ranges[category].min);
        const max = parseFloat(data.budget_ranges[category].max);
        
        if (!isNaN(min) && !isNaN(max) && min >= 0 && max > min && max <= 10000) {
          validated.budget_ranges[category] = {
            min: Math.round(min),
            max: Math.round(max)
          };
        }
      }
    });
  }

  return validated;
}

// Default style preferences structure
function getDefaultStylePreferences() {
  return {
    preferred_colors: [],
    accent_colors: [],
    avoid_colors: [],
    preferred_styles: [],
    occasions: [],
    brands: [],
    avoid_materials: [],
    budget_ranges: {
      suits: { min: 0, max: 0 },
      shirts: { min: 0, max: 0 },
      accessories: { min: 0, max: 0 }
    }
  };
}

// Trigger AI recommendation update
async function triggerAIRecommendationUpdate(userId: string, preferences: any) {
  try {
    // Call your AI recommendation service here
    // This could be your KCT Knowledge API or another AI service
    
    const response = await fetch(process.env.NEXT_PUBLIC_KCT_API_URL + '/api/recommendations/trigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.NEXT_PUBLIC_KCT_API_KEY || ''
      },
      body: JSON.stringify({
        user_id: userId,
        style_preferences: preferences,
        trigger_type: 'preferences_updated'
      })
    });

    if (!response.ok) {
      console.error('Failed to trigger AI recommendations');
    }
  } catch (error) {
    console.error('Error triggering AI recommendations:', error);
    // Don't fail the main request if AI trigger fails
  }
}