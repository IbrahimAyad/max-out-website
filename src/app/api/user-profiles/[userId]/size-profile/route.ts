import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// PUT /api/user-profiles/{userId}/size-profile
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

    // Get size profile data
    const sizeProfileUpdate = await request.json();

    // Validate size profile data
    const validatedSizeProfile = validateSizeProfile(sizeProfileUpdate);

    // Get current profile to merge size data
    const { data: currentProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('size_profile')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Merge with existing size profile
    const mergedSizeProfile = {
      ...(currentProfile.size_profile || {}),
      ...validatedSizeProfile,
      updated_at: new Date().toISOString()
    };

    // Update size profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        size_profile: mergedSizeProfile,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, size_profile')
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Log size profile update for analytics
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: 'size_profile_updated',
        metadata: {
          fields_updated: Object.keys(validatedSizeProfile),
          updated_by: user.id
        }
      });

    return NextResponse.json({
      message: 'Size profile updated successfully',
      size_profile: updatedProfile.size_profile
    });
  } catch (error) {
    console.error('Error updating size profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/user-profiles/{userId}/size-profile
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

    // Fetch size profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('size_profile')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile.size_profile || getDefaultSizeProfile());
  } catch (error) {
    console.error('Error fetching size profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to validate size profile data
function validateSizeProfile(data: any) {
  const validated: any = {};

  // Validate measurements (in inches)
  const measurements = ['chest', 'waist', 'inseam', 'neck', 'sleeve', 'shoulder_width', 'jacket_length'];
  measurements.forEach(field => {
    if (data[field] !== undefined) {
      const value = parseFloat(data[field]);
      if (!isNaN(value) && value > 0 && value < 100) {
        validated[field] = value;
      }
    }
  });

  // Validate shoe size
  if (data.shoe_size) {
    validated.shoe_size = {};
    if (data.shoe_size.us) {
      const us = parseFloat(data.shoe_size.us);
      if (!isNaN(us) && us >= 6 && us <= 20) {
        validated.shoe_size.us = us;
      }
    }
    if (data.shoe_size.uk) {
      const uk = parseFloat(data.shoe_size.uk);
      if (!isNaN(uk) && uk >= 5 && uk <= 19) {
        validated.shoe_size.uk = uk;
      }
    }
    if (data.shoe_size.eu) {
      const eu = parseFloat(data.shoe_size.eu);
      if (!isNaN(eu) && eu >= 38 && eu <= 54) {
        validated.shoe_size.eu = eu;
      }
    }
    if (data.shoe_size.width && ['narrow', 'medium', 'wide'].includes(data.shoe_size.width)) {
      validated.shoe_size.width = data.shoe_size.width;
    }
  }

  // Validate fit preferences
  if (data.preferred_fit) {
    validated.preferred_fit = {};
    const fitOptions = ['slim', 'regular', 'athletic', 'loose'];
    ['jackets', 'pants', 'shirts'].forEach(garment => {
      if (data.preferred_fit[garment] && fitOptions.includes(data.preferred_fit[garment])) {
        validated.preferred_fit[garment] = data.preferred_fit[garment];
      }
    });
  }

  // Validate body type
  if (data.body_type && ['athletic', 'regular', 'full', 'tall', 'short'].includes(data.body_type)) {
    validated.body_type = data.body_type;
  }

  // Validate measured by
  if (data.measured_by && ['self', 'tailor', 'kct_store'].includes(data.measured_by)) {
    validated.measured_by = data.measured_by;
  }

  // Validate confidence level
  if (data.confidence_level !== undefined) {
    const level = parseInt(data.confidence_level);
    if (!isNaN(level) && level >= 1 && level <= 5) {
      validated.confidence_level = level;
    }
  }

  return validated;
}

// Default size profile structure
function getDefaultSizeProfile() {
  return {
    chest: null,
    waist: null,
    inseam: null,
    neck: null,
    sleeve: null,
    shoulder_width: null,
    jacket_length: null,
    shoe_size: {
      us: null,
      uk: null,
      eu: null,
      width: 'medium'
    },
    preferred_fit: {
      jackets: 'regular',
      pants: 'regular',
      shirts: 'regular'
    },
    body_type: null,
    measured_by: 'self',
    confidence_level: 3
  };
}