import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/user-profiles/{userId}/addresses
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

    // Fetch saved addresses
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('saved_addresses')
      .eq('id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile.saved_addresses || []);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user-profiles/{userId}/addresses
export async function POST(
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

    // Check if user is adding to their own profile
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get new address data
    const newAddress = await request.json();

    // Validate address
    const validatedAddress = validateAddress(newAddress);
    if (!validatedAddress) {
      return NextResponse.json({ error: 'Invalid address data' }, { status: 400 });
    }

    // Add unique ID and timestamp
    validatedAddress.id = crypto.randomUUID();
    validatedAddress.created_at = new Date().toISOString();
    validatedAddress.last_used = null;

    // Get current addresses
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('saved_addresses')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const currentAddresses = profile.saved_addresses || [];

    // Check address limit (max 10 addresses)
    if (currentAddresses.length >= 10) {
      return NextResponse.json({ 
        error: 'Maximum number of addresses (10) reached' 
      }, { status: 400 });
    }

    // If this is the first address or marked as default, set it as default
    if (currentAddresses.length === 0 || validatedAddress.is_default) {
      // Unset other defaults if this is marked as default
      if (validatedAddress.is_default) {
        currentAddresses.forEach((addr: any) => {
          addr.is_default = false;
        });
      }
      validatedAddress.is_default = true;
    }

    // Add new address
    const updatedAddresses = [...currentAddresses, validatedAddress];

    // Update profile with new addresses
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        saved_addresses: updatedAddresses,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Address added successfully',
      address: validatedAddress
    });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user-profiles/{userId}/addresses/{addressId}
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = createClient();
    
    // Get addressId from query params or body
    const url = new URL(request.url);
    const addressId = url.searchParams.get('addressId');
    
    if (!addressId) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is updating their own profile
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get update data
    const updates = await request.json();

    // Get current addresses
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('saved_addresses')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const currentAddresses = profile.saved_addresses || [];
    const addressIndex = currentAddresses.findIndex((addr: any) => addr.id === addressId);

    if (addressIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Validate updates
    const validatedUpdates = validateAddress(updates, true);

    // Merge updates with existing address
    currentAddresses[addressIndex] = {
      ...currentAddresses[addressIndex],
      ...validatedUpdates,
      updated_at: new Date().toISOString()
    };

    // Handle default address changes
    if (validatedUpdates.is_default === true) {
      currentAddresses.forEach((addr: any, index: number) => {
        if (index !== addressIndex) {
          addr.is_default = false;
        }
      });
    }

    // Update profile with modified addresses
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        saved_addresses: currentAddresses,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Address updated successfully',
      address: currentAddresses[addressIndex]
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/user-profiles/{userId}/addresses/{addressId}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = createClient();
    
    // Get addressId from query params
    const url = new URL(request.url);
    const addressId = url.searchParams.get('addressId');
    
    if (!addressId) {
      return NextResponse.json({ error: 'Address ID required' }, { status: 400 });
    }

    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is deleting from their own profile
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get current addresses
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('saved_addresses')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const currentAddresses = profile.saved_addresses || [];
    const addressToDelete = currentAddresses.find((addr: any) => addr.id === addressId);

    if (!addressToDelete) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Filter out the deleted address
    const updatedAddresses = currentAddresses.filter((addr: any) => addr.id !== addressId);

    // If deleted address was default and there are other addresses, set first as default
    if (addressToDelete.is_default && updatedAddresses.length > 0) {
      updatedAddresses[0].is_default = true;
    }

    // Update profile with remaining addresses
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        saved_addresses: updatedAddresses,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to validate address data
function validateAddress(data: any, isPartialUpdate = false) {
  const validated: any = {};

  // For partial updates, only validate provided fields
  if (!isPartialUpdate) {
    // Required fields for new addresses
    if (!data.label || !data.recipient || !data.address) {
      return null;
    }
    
    if (!data.recipient.first_name || !data.recipient.last_name) {
      return null;
    }
    
    if (!data.address.line1 || !data.address.city || 
        !data.address.state || !data.address.postal_code || !data.address.country) {
      return null;
    }
  }

  // Validate label
  if (data.label) {
    validated.label = data.label.substring(0, 50);
  }

  // Validate recipient
  if (data.recipient) {
    validated.recipient = {};
    if (data.recipient.first_name) {
      validated.recipient.first_name = data.recipient.first_name.substring(0, 50);
    }
    if (data.recipient.last_name) {
      validated.recipient.last_name = data.recipient.last_name.substring(0, 50);
    }
    if (data.recipient.company) {
      validated.recipient.company = data.recipient.company.substring(0, 100);
    }
  }

  // Validate address
  if (data.address) {
    validated.address = {};
    if (data.address.line1) {
      validated.address.line1 = data.address.line1.substring(0, 100);
    }
    if (data.address.line2) {
      validated.address.line2 = data.address.line2.substring(0, 100);
    }
    if (data.address.city) {
      validated.address.city = data.address.city.substring(0, 50);
    }
    if (data.address.state) {
      validated.address.state = data.address.state.substring(0, 50);
    }
    if (data.address.postal_code) {
      validated.address.postal_code = data.address.postal_code.substring(0, 20);
    }
    if (data.address.country) {
      validated.address.country = data.address.country.substring(0, 2); // ISO country code
    }
  }

  // Validate delivery instructions
  if (data.delivery_instructions !== undefined) {
    validated.delivery_instructions = data.delivery_instructions.substring(0, 500);
  }

  // Validate address type
  if (data.address_type && ['residential', 'business'].includes(data.address_type)) {
    validated.address_type = data.address_type;
  }

  // Validate is_default flag
  if (typeof data.is_default === 'boolean') {
    validated.is_default = data.is_default;
  }

  return validated;
}