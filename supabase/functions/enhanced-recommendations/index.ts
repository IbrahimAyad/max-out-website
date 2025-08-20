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
      type, 
      context, 
      sessionId, 
      userId, 
      productId, 
      limit = 8 
    } = await req.json();

    if (!type || !sessionId) {
      throw new Error('Recommendation type and session ID are required');
    }

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

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

    let recommendations = [];

    switch (type) {
      case 'complementary':
        recommendations = await getComplementaryRecommendations(supabaseUrl, serviceRoleKey, productId, context, limit);
        break;
      case 'behavioral':
        recommendations = await getBehavioralRecommendations(supabaseUrl, serviceRoleKey, currentUserId, sessionId, limit);
        break;
      case 'occasion_based':
        recommendations = await getOccasionBasedRecommendations(supabaseUrl, serviceRoleKey, context, limit);
        break;
      case 'trending':
        recommendations = await getTrendingRecommendations(supabaseUrl, serviceRoleKey, context, limit);
        break;
      case 'style_match':
        recommendations = await getStyleMatchRecommendations(supabaseUrl, serviceRoleKey, currentUserId, context, limit);
        break;
      case 'complete_outfit':
        recommendations = await getCompleteOutfitRecommendations(supabaseUrl, serviceRoleKey, productId, context, limit);
        break;
      case 'ai_powered':
        recommendations = await getAIPoweredRecommendations(supabaseUrl, serviceRoleKey, openaiApiKey, context, currentUserId, limit);
        break;
      default:
        recommendations = await getGeneralRecommendations(supabaseUrl, serviceRoleKey, context, limit);
    }

    // Track recommendations in database
    await trackRecommendations(supabaseUrl, serviceRoleKey, {
      userId: currentUserId,
      sessionId,
      recommendations,
      type,
      context
    });

    return new Response(JSON.stringify({
      data: {
        recommendations,
        type,
        context,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Enhanced recommendation error:', error);

    const errorResponse = {
      error: {
        code: 'RECOMMENDATION_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Complementary item recommendations
async function getComplementaryRecommendations(supabaseUrl, serviceRoleKey, productId, context, limit) {
  if (!productId) return [];

  // Get the source product
  const productResponse = await fetch(`${supabaseUrl}/rest/v1/products_enhanced?id=eq.${productId}&select=*`, {
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    }
  });

  const products = await productResponse.json();
  if (!products || products.length === 0) return [];

  const sourceProduct = products[0];
  const category = sourceProduct.category;
  
  // Define complementary categories
  const complementaryMap = {
    'suits': ['dress-shirts', 'ties', 'dress-shoes', 'belts', 'pocket-squares'],
    'tuxedos': ['dress-shirts', 'bow-ties', 'dress-shoes', 'cummerbunds', 'cufflinks'],
    'blazers': ['dress-shirts', 'ties', 'dress-pants', 'loafers', 'pocket-squares'],
    'dress-shirts': ['ties', 'suits', 'blazers', 'cufflinks', 'tie-clips'],
    'ties': ['dress-shirts', 'suits', 'blazers', 'tie-clips', 'pocket-squares'],
    'dress-shoes': ['suits', 'dress-shirts', 'belts', 'socks']
  };

  const complementaryCategories = complementaryMap[category] || [];
  if (complementaryCategories.length === 0) return [];

  // Build query for complementary products
  const categoryFilter = complementaryCategories.map(cat => `category.eq.${cat}`).join(',');
  
  const complementaryResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?or=(${categoryFilter})&status=eq.active&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const complementaryProducts = await complementaryResponse.json();
  
  return complementaryProducts.map((product, index) => ({
    product,
    reason: `Complements your ${sourceProduct.name}`,
    score: 0.9 - (index * 0.1),
    type: 'complementary'
  }));
}

// Behavioral recommendations based on user history
async function getBehavioralRecommendations(supabaseUrl, serviceRoleKey, userId, sessionId, limit) {
  if (!userId) return [];

  // Get user's recent interactions
  const interactionsResponse = await fetch(
    `${supabaseUrl}/rest/v1/user_interactions?user_id=eq.${userId}&order=created_at.desc&limit=50`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const interactions = await interactionsResponse.json();
  const viewedProductIds = interactions
    .filter(i => i.interaction_type === 'product_view' && i.product_id)
    .map(i => i.product_id)
    .slice(0, 10);

  if (viewedProductIds.length === 0) return [];

  // Get affinity recommendations
  const affinityResponse = await fetch(
    `${supabaseUrl}/rest/v1/product_affinity?product_a_id=in.(${viewedProductIds.join(',')})&order=affinity_score.desc&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const affinityData = await affinityResponse.json();
  const recommendedProductIds = affinityData.map(a => a.product_b_id);

  if (recommendedProductIds.length === 0) return [];

  // Get product details
  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?id=in.(${recommendedProductIds.join(',')})&status=eq.active`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const products = await productsResponse.json();
  
  return products.map((product, index) => {
    const affinityItem = affinityData.find(a => a.product_b_id === product.id);
    return {
      product,
      reason: `Customers who viewed similar items also loved this`,
      score: affinityItem?.affinity_score || 0.5,
      type: 'behavioral'
    };
  });
}

// Occasion-based recommendations
async function getOccasionBasedRecommendations(supabaseUrl, serviceRoleKey, context, limit) {
  const { occasion, season, formalityLevel } = context || {};
  if (!occasion) return [];

  // Get outfit templates for occasion
  const templatesResponse = await fetch(
    `${supabaseUrl}/rest/v1/outfit_templates?occasion_type=eq.${occasion}&limit=5`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const templates = await templatesResponse.json();
  if (!templates || templates.length === 0) {
    // Fallback to general occasion search
    return getOccasionFallbackRecommendations(supabaseUrl, serviceRoleKey, occasion, limit);
  }

  // Get products for the best template
  const bestTemplate = templates[0];
  const requiredItems = bestTemplate.required_items || [];
  
  const recommendations = [];
  
  for (const itemType of requiredItems.slice(0, limit)) {
    const itemResponse = await fetch(
      `${supabaseUrl}/rest/v1/products_enhanced?category=eq.${itemType}&status=eq.active&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const items = await itemResponse.json();
    if (items && items.length > 0) {
      recommendations.push({
        product: items[0],
        reason: `Essential for ${occasion}`,
        score: 0.95,
        type: 'occasion_based'
      });
    }
  }

  return recommendations;
}

// Fallback for occasion-based recommendations
async function getOccasionFallbackRecommendations(supabaseUrl, serviceRoleKey, occasion, limit) {
  // Define occasion-category mappings
  const occasionCategories = {
    'wedding': ['suits', 'tuxedos', 'dress-shirts', 'ties'],
    'business': ['suits', 'dress-shirts', 'ties', 'dress-shoes'],
    'prom': ['tuxedos', 'bow-ties', 'dress-shoes', 'cummerbunds'],
    'cocktail': ['blazers', 'dress-shirts', 'dress-pants', 'loafers']
  };

  const categories = occasionCategories[occasion] || ['suits', 'dress-shirts'];
  const categoryFilter = categories.map(cat => `category.eq.${cat}`).join(',');
  
  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?or=(${categoryFilter})&status=eq.active&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const products = await productsResponse.json();
  
  return products.map((product, index) => ({
    product,
    reason: `Perfect for ${occasion}`,
    score: 0.8 - (index * 0.05),
    type: 'occasion_based'
  }));
}

// Trending recommendations
async function getTrendingRecommendations(supabaseUrl, serviceRoleKey, context, limit) {
  // Use the trending function
  const trendingResponse = await fetch(
    `${supabaseUrl}/rest/v1/rpc/get_trending_products?days_back=7&limit_count=${limit}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!trendingResponse.ok) {
    // Fallback to recent popular products
    return getTrendingFallback(supabaseUrl, serviceRoleKey, limit);
  }

  const trendingData = await trendingResponse.json();
  const productIds = trendingData.map(t => t.product_id);

  if (productIds.length === 0) return [];

  // Get product details
  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?id=in.(${productIds.join(',')})&status=eq.active`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const products = await productsResponse.json();
  
  return products.map((product, index) => {
    const trendingItem = trendingData.find(t => t.product_id === product.id);
    return {
      product,
      reason: `Trending now - ${trendingItem?.view_count || 0} views this week`,
      score: Number(trendingItem?.trend_score) || 0.5,
      type: 'trending'
    };
  });
}

// Fallback for trending
async function getTrendingFallback(supabaseUrl, serviceRoleKey, limit) {
  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?status=eq.active&trending=eq.true&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const products = await productsResponse.json();
  
  return products.map((product, index) => ({
    product,
    reason: 'Trending this season',
    score: 0.8 - (index * 0.05),
    type: 'trending'
  }));
}

// Style match recommendations
async function getStyleMatchRecommendations(supabaseUrl, serviceRoleKey, userId, context, limit) {
  if (!userId) return [];

  // Get user style profile
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
  if (!profiles || profiles.length === 0) {
    return getStyleFallbackRecommendations(supabaseUrl, serviceRoleKey, context, limit);
  }

  const profile = profiles[0];
  const preferredColors = profile.preferred_colors || [];
  
  // Build query for style-matched products
  let query = `${supabaseUrl}/rest/v1/products_enhanced?status=eq.active&limit=${limit}`;
  
  // Add color filter if preferences exist
  if (preferredColors.length > 0) {
    // This would need a more sophisticated color matching system
    // For now, we'll use a simpler approach
    query += '&order=created_at.desc';
  }

  const productsResponse = await fetch(query, {
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    }
  });

  const products = await productsResponse.json();
  
  return products.map((product, index) => ({
    product,
    reason: `Matches your ${profile.style_personality || 'classic'} style`,
    score: Number(profile.style_confidence_score) || 0.7,
    type: 'style_match'
  }));
}

// Style fallback
async function getStyleFallbackRecommendations(supabaseUrl, serviceRoleKey, context, limit) {
  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?status=eq.active&featured=eq.true&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const products = await productsResponse.json();
  
  return products.map((product, index) => ({
    product,
    reason: 'Curator\'s choice',
    score: 0.8,
    type: 'style_match'
  }));
}

// Complete outfit recommendations
async function getCompleteOutfitRecommendations(supabaseUrl, serviceRoleKey, productId, context, limit) {
  if (!productId) return [];

  // Get product combinations that include this product
  const combinationsResponse = await fetch(
    `${supabaseUrl}/rest/v1/product_combinations?products=cs.{"${productId}"}&limit=5`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const combinations = await combinationsResponse.json();
  
  if (!combinations || combinations.length === 0) {
    // Fallback to complementary items
    return getComplementaryRecommendations(supabaseUrl, serviceRoleKey, productId, context, limit);
  }

  // Get products from the best combination
  const bestCombination = combinations[0];
  const productIds = bestCombination.products.filter(id => id !== productId);
  
  if (productIds.length === 0) return [];

  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?id=in.(${productIds.join(',')})&status=eq.active&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const products = await productsResponse.json();
  
  return products.map((product, index) => ({
    product,
    reason: `Complete the outfit: ${bestCombination.combination_name || 'Perfect match'}`,
    score: Number(bestCombination.style_rating) || 0.9,
    type: 'complete_outfit'
  }));
}

// AI-powered recommendations using OpenAI
async function getAIPoweredRecommendations(supabaseUrl, serviceRoleKey, openaiApiKey, context, userId, limit) {
  if (!openaiApiKey) {
    console.log('OpenAI API key not available, falling back to general recommendations');
    return getGeneralRecommendations(supabaseUrl, serviceRoleKey, context, limit);
  }

  try {
    // Get user context and preferences
    let userContext = '';
    if (userId) {
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
      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        userContext = `User style: ${profile.style_personality || 'classic'}, preferred colors: ${(profile.preferred_colors || []).join(', ')}`;
      }
    }

    // Get available products sample for context
    const productsResponse = await fetch(
      `${supabaseUrl}/rest/v1/products_enhanced?status=eq.active&limit=20&select=id,name,category,base_price`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );
    const availableProducts = await productsResponse.json();

    const prompt = `
You are a luxury menswear stylist for KCT Menswear. Based on the following context, recommend ${limit} products from our collection:

Context: ${JSON.stringify(context)}
${userContext ? `User Profile: ${userContext}` : ''}

Available Products (sample):
${availableProducts.map(p => `${p.id}: ${p.name} (${p.category}) - $${p.base_price}`).join('\n')}

Please recommend product IDs that would work well together, considering style, occasion, and color coordination. Return only a JSON array of product IDs, no other text.
`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('OpenAI API request failed');
    }

    const openaiData = await openaiResponse.json();
    const recommendedIds = JSON.parse(openaiData.choices[0].message.content);
    
    // Get product details for recommended IDs
    const finalProductsResponse = await fetch(
      `${supabaseUrl}/rest/v1/products_enhanced?id=in.(${recommendedIds.join(',')})&status=eq.active`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const finalProducts = await finalProductsResponse.json();
    
    return finalProducts.map((product, index) => ({
      product,
      reason: 'AI-curated for your style',
      score: 0.95 - (index * 0.02),
      type: 'ai_powered'
    }));

  } catch (error) {
    console.error('AI recommendation error:', error);
    return getGeneralRecommendations(supabaseUrl, serviceRoleKey, context, limit);
  }
}

// General recommendations fallback
async function getGeneralRecommendations(supabaseUrl, serviceRoleKey, context, limit) {
  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?status=eq.active&order=created_at.desc&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const products = await productsResponse.json();
  
  return products.map((product, index) => ({
    product,
    reason: 'Recommended for you',
    score: 0.7,
    type: 'general'
  }));
}

// Track recommendations for analytics
async function trackRecommendations(supabaseUrl, serviceRoleKey, data) {
  const { userId, sessionId, recommendations, type, context } = data;
  
  const trackingData = recommendations.map((rec, index) => ({
    user_id: userId,
    session_id: sessionId,
    recommendation_type: type,
    source_product_id: context?.productId || null,
    recommended_product_id: rec.product.id,
    recommendation_score: rec.score,
    recommendation_reason: rec.reason,
    context_data: context || {},
    position_in_list: index + 1
  }));

  try {
    await fetch(`${supabaseUrl}/rest/v1/product_recommendations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trackingData)
    });
  } catch (error) {
    console.error('Error tracking recommendations:', error);
  }
}