Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { 
      interactionType, 
      sessionId, 
      userId,
      productId,
      pageUrl,
      interactionData = {},
      batch = false,
      interactions = []
    } = await req.json();

    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    // Get user from auth header if available
    let currentUserId = userId;
    const authHeader = req.headers.get('authorization');
    if (authHeader && !currentUserId) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': serviceRoleKey
          }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          currentUserId = userData.id;
        }
      } catch (error) {
        console.log('Could not get user from token:', error.message);
      }
    }

    // Extract IP and user agent from request
    const clientIP = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || '';

    let result;

    if (batch && interactions.length > 0) {
      // Handle batch interactions
      result = await processBatchInteractions(supabaseUrl, serviceRoleKey, {
        interactions,
        sessionId,
        userId: currentUserId,
        clientIP,
        userAgent,
        referrer
      });
    } else if (interactionType) {
      // Handle single interaction
      result = await processSingleInteraction(supabaseUrl, serviceRoleKey, {
        interactionType,
        sessionId,
        userId: currentUserId,
        productId,
        pageUrl,
        interactionData,
        clientIP,
        userAgent,
        referrer
      });
    } else {
      throw new Error('Either interactionType or batch interactions required');
    }

    // Update user behavior patterns
    if (currentUserId) {
      await updateUserBehaviorPatterns(supabaseUrl, serviceRoleKey, currentUserId, {
        interactionType: batch ? 'batch' : interactionType,
        productId,
        interactionData
      });
    }

    // Update product affinity matrix if needed
    if ((interactionType === 'add_to_cart' || interactionType === 'product_view') && currentUserId) {
      await updateProductAffinityAsync(supabaseUrl, serviceRoleKey, currentUserId, productId);
    }

    return new Response(JSON.stringify({
      data: {
        success: true,
        tracked: result.tracked,
        sessionId,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);

    const errorResponse = {
      error: {
        code: 'ANALYTICS_TRACKING_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Process single interaction
async function processSingleInteraction(supabaseUrl, serviceRoleKey, data) {
  const {
    interactionType,
    sessionId,
    userId,
    productId,
    pageUrl,
    interactionData,
    clientIP,
    userAgent,
    referrer
  } = data;

  const interactionRecord = {
    user_id: userId,
    session_id: sessionId,
    interaction_type: interactionType,
    product_id: productId,
    interaction_data: interactionData,
    page_url: pageUrl,
    referrer: referrer,
    user_agent: userAgent,
    ip_address: clientIP,
    created_at: new Date().toISOString()
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/user_interactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(interactionRecord)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to store interaction: ${errorText}`);
  }

  return { tracked: 1 };
}

// Process batch interactions
async function processBatchInteractions(supabaseUrl, serviceRoleKey, data) {
  const {
    interactions,
    sessionId,
    userId,
    clientIP,
    userAgent,
    referrer
  } = data;

  const interactionRecords = interactions.map(interaction => ({
    user_id: userId,
    session_id: sessionId,
    interaction_type: interaction.interactionType,
    product_id: interaction.productId,
    interaction_data: interaction.interactionData || {},
    page_url: interaction.pageUrl,
    referrer: referrer,
    user_agent: userAgent,
    ip_address: clientIP,
    created_at: new Date().toISOString()
  }));

  const response = await fetch(`${supabaseUrl}/rest/v1/user_interactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(interactionRecords)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to store batch interactions: ${errorText}`);
  }

  return { tracked: interactionRecords.length };
}

// Update user behavior patterns and preferences
async function updateUserBehaviorPatterns(supabaseUrl, serviceRoleKey, userId, interactionData) {
  try {
    // Get or create user style profile
    const profileResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_style_profiles?user_id=eq.${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const profiles = await profileResponse.json();
    let profile = profiles && profiles.length > 0 ? profiles[0] : null;

    if (!profile) {
      // Create new profile
      profile = {
        user_id: userId,
        style_personality: 'classic',
        preferred_colors: [],
        avoided_colors: [],
        preferred_patterns: [],
        avoided_patterns: [],
        fit_preferences: {},
        occasion_preferences: {},
        budget_preferences: {},
        size_preferences: {},
        brand_preferences: {},
        style_confidence_score: 0.5
      };
    }

    // Update profile based on interaction
    const updatedProfile = await updateProfileFromInteraction(profile, interactionData);

    if (profiles && profiles.length > 0) {
      // Update existing profile
      await fetch(
        `${supabaseUrl}/rest/v1/user_style_profiles?user_id=eq.${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProfile)
        }
      );
    } else {
      // Create new profile
      await fetch(
        `${supabaseUrl}/rest/v1/user_style_profiles`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedProfile)
        }
      );
    }
  } catch (error) {
    console.error('Error updating user behavior patterns:', error);
  }
}

// Update profile based on interaction data
async function updateProfileFromInteraction(profile, interactionData) {
  const { interactionType, productId, interactionData: data } = interactionData;

  // Extract insights from interaction
  if (data?.product) {
    const product = data.product;
    
    // Update color preferences based on viewed/purchased products
    if (interactionType === 'product_view' || interactionType === 'add_to_cart') {
      const productColors = extractColorsFromProduct(product);
      profile.preferred_colors = updatePreferenceArray(profile.preferred_colors || [], productColors, 0.1);
    }
    
    // Update category preferences
    if (product.category) {
      profile.occasion_preferences = profile.occasion_preferences || {};
      const category = product.category;
      profile.occasion_preferences[category] = (profile.occasion_preferences[category] || 0) + 0.1;
    }
    
    // Update price preferences
    if (product.base_price) {
      profile.budget_preferences = profile.budget_preferences || {};
      const price = product.base_price;
      
      if (!profile.budget_preferences.price_points) {
        profile.budget_preferences.price_points = [];
      }
      profile.budget_preferences.price_points.push(price);
      
      // Calculate average preferred price range
      if (profile.budget_preferences.price_points.length > 5) {
        const prices = profile.budget_preferences.price_points.slice(-10); // Last 10 prices
        profile.budget_preferences.avg_price = prices.reduce((a, b) => a + b, 0) / prices.length;
        profile.budget_preferences.min_price = Math.min(...prices) * 0.8;
        profile.budget_preferences.max_price = Math.max(...prices) * 1.2;
      }
    }
  }

  // Update confidence score based on interaction frequency
  if (profile.style_confidence_score < 0.9) {
    profile.style_confidence_score = Math.min(0.9, (profile.style_confidence_score || 0.5) + 0.02);
  }

  profile.updated_at = new Date().toISOString();
  
  return profile;
}

// Extract colors from product data
function extractColorsFromProduct(product) {
  const colors = [];
  
  if (product.specifications?.color) {
    colors.push(product.specifications.color);
  }
  
  if (product.specifications?.colors) {
    colors.push(...product.specifications.colors);
  }
  
  // Extract from name
  const name = product.name?.toLowerCase() || '';
  const colorKeywords = ['navy', 'black', 'white', 'gray', 'brown', 'burgundy', 'blue', 'red'];
  colorKeywords.forEach(color => {
    if (name.includes(color)) colors.push(color);
  });
  
  return colors;
}

// Update preference array with weighted scoring
function updatePreferenceArray(currentArray, newItems, weight) {
  const preferences = [...(currentArray || [])];
  
  newItems.forEach(item => {
    const existingIndex = preferences.findIndex(p => 
      typeof p === 'string' ? p === item : p.item === item
    );
    
    if (existingIndex >= 0) {
      // Update existing preference
      if (typeof preferences[existingIndex] === 'string') {
        preferences[existingIndex] = { item: preferences[existingIndex], score: 1 + weight };
      } else {
        preferences[existingIndex].score = Math.min(2, preferences[existingIndex].score + weight);
      }
    } else {
      // Add new preference
      preferences.push({ item, score: weight });
    }
  });
  
  // Sort by score and return top preferences
  return preferences
    .sort((a, b) => {
      const scoreA = typeof a === 'string' ? 1 : a.score;
      const scoreB = typeof b === 'string' ? 1 : b.score;
      return scoreB - scoreA;
    })
    .slice(0, 10) // Keep top 10 preferences
    .map(p => typeof p === 'string' ? p : p.item);
}

// Update product affinity matrix asynchronously
async function updateProductAffinityAsync(supabaseUrl, serviceRoleKey, userId, productId) {
  try {
    // Get user's recent product interactions
    const interactionsResponse = await fetch(
      `${supabaseUrl}/rest/v1/user_interactions?user_id=eq.${userId}&interaction_type=in.(product_view,add_to_cart)&product_id=not.is.null&order=created_at.desc&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const interactions = await interactionsResponse.json();
    const relatedProductIds = interactions
      .map(i => i.product_id)
      .filter(id => id !== productId)
      .slice(0, 10);

    // Update affinity for each related product
    for (const relatedProductId of relatedProductIds) {
      await updateProductPairAffinity(supabaseUrl, serviceRoleKey, productId, relatedProductId);
    }
  } catch (error) {
    console.error('Error updating product affinity:', error);
  }
}

// Update affinity between two specific products
async function updateProductPairAffinity(supabaseUrl, serviceRoleKey, productA, productB) {
  try {
    // Check if affinity record exists
    const existingResponse = await fetch(
      `${supabaseUrl}/rest/v1/product_affinity?product_a_id=eq.${productA}&product_b_id=eq.${productB}`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const existing = await existingResponse.json();
    
    if (existing && existing.length > 0) {
      // Update existing record
      const record = existing[0];
      const newCoOccurrence = record.co_occurrence_count + 1;
      const newScore = Math.min(1, record.affinity_score + 0.1);
      
      await fetch(
        `${supabaseUrl}/rest/v1/product_affinity?id=eq.${record.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            co_occurrence_count: newCoOccurrence,
            affinity_score: newScore,
            last_calculated: new Date().toISOString()
          })
        }
      );
    } else {
      // Create new record
      await fetch(
        `${supabaseUrl}/rest/v1/product_affinity`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product_a_id: productA,
            product_b_id: productB,
            affinity_score: 0.1,
            co_occurrence_count: 1,
            confidence_score: 0.1,
            last_calculated: new Date().toISOString()
          })
        }
      );
    }
  } catch (error) {
    console.error('Error updating product pair affinity:', error);
  }
}