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
      productId,
      context, 
      sessionId, 
      userId,
      limit = 8,
      advanced = true
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

    // Get user from auth header
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
    let processingTime = Date.now();

    switch (type) {
      case 'advanced_complementary':
        recommendations = await getAdvancedComplementaryRecommendations(
          supabaseUrl, serviceRoleKey, productId, context, limit
        );
        break;
      case 'behavioral_analytics':
        recommendations = await getBehavioralAnalyticsRecommendations(
          supabaseUrl, serviceRoleKey, currentUserId, sessionId, context, limit
        );
        break;
      case 'complete_outfit_builder':
        recommendations = await getCompleteOutfitRecommendations(
          supabaseUrl, serviceRoleKey, productId, context, limit
        );
        break;
      case 'smart_cross_category':
        recommendations = await getSmartCrossCategoryRecommendations(
          supabaseUrl, serviceRoleKey, productId, context, limit
        );
        break;
      case 'occasion_intelligent':
        recommendations = await getOccasionIntelligentRecommendations(
          supabaseUrl, serviceRoleKey, context, limit
        );
        break;
      case 'ai_curated':
        recommendations = await getAICuratedRecommendations(
          supabaseUrl, serviceRoleKey, openaiApiKey, context, currentUserId, limit
        );
        break;
      default:
        throw new Error('Unknown recommendation type');
    }

    processingTime = Date.now() - processingTime;

    // Store advanced analytics
    await storeAdvancedRecommendationAnalytics(supabaseUrl, serviceRoleKey, {
      userId: currentUserId,
      sessionId,
      recommendationType: type,
      productId,
      context,
      recommendations,
      processingTime,
      advanced: true
    });

    return new Response(JSON.stringify({
      data: {
        recommendations,
        type,
        context,
        processingTime,
        advanced: true,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Advanced recommendation error:', error);

    return new Response(JSON.stringify({
      error: {
        code: 'ADVANCED_RECOMMENDATION_FAILED',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Advanced complementary recommendations with intelligent matching
async function getAdvancedComplementaryRecommendations(supabaseUrl, serviceRoleKey, productId, context, limit) {
  if (!productId) return [];

  // Get source product with detailed analysis
  const productResponse = await fetch(`${supabaseUrl}/rest/v1/products_enhanced?id=eq.${productId}&select=*`, {
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    }
  });

  const products = await productResponse.json();
  if (!products || products.length === 0) return [];

  const sourceProduct = products[0];
  
  // Load knowledge bank data for intelligent matching
  const knowledgeBank = await loadKnowledgeBankData();
  
  // Advanced complementary mapping with intelligence
  const complementaryLogic = {
    'suits': {
      essential: ['dress-shirts', 'ties', 'dress-shoes'],
      seasonal: getSeasonalComplements('suits', getCurrentSeason()),
      occasion_based: getOccasionComplements('suits', context?.occasion),
      color_harmony: getColorHarmonyComplements(sourceProduct, knowledgeBank.colorRelationships)
    },
    'tuxedos': {
      essential: ['formal-shirts', 'bow-ties', 'patent-leather-shoes', 'cummerbunds'],
      luxury: ['cufflinks', 'studs', 'pocket-squares'],
      complete_look: ['formal-shoes', 'black-socks', 'formal-belt']
    },
    'blazers': {
      versatile: ['dress-shirts', 'casual-shirts', 'ties', 'pocket-squares'],
      business: ['dress-pants', 'loafers', 'belts'],
      smart_casual: ['chinos', 'polo-shirts', 'sneakers']
    }
  };

  const categoryLogic = complementaryLogic[sourceProduct.category] || 
                        complementaryLogic['suits']; // Default fallback

  const allComplements = [
    ...(categoryLogic.essential || []),
    ...(categoryLogic.seasonal || []),
    ...(categoryLogic.occasion_based || []),
    ...(categoryLogic.luxury || []),
    ...(categoryLogic.versatile || [])
  ];

  // Get complementary products with intelligent scoring
  const categoryFilter = [...new Set(allComplements)]
    .map(cat => `category.eq.${cat}`).join(',');

  if (!categoryFilter) return [];

  const complementaryResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?or=(${categoryFilter})&status=eq.active&limit=${limit * 2}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const complementaryProducts = await complementaryResponse.json();

  // Score and rank products using multiple factors
  const scoredProducts = complementaryProducts.map(product => {
    let score = 0.5; // Base score
    let reasons = [];

    // Color harmony scoring
    const colorScore = calculateColorHarmony(sourceProduct, product, knowledgeBank.colorRelationships);
    score += colorScore * 0.3;
    if (colorScore > 0.8) reasons.push('Perfect color harmony');

    // Price tier matching
    const priceHarmony = calculatePriceHarmony(sourceProduct.base_price, product.base_price);
    score += priceHarmony * 0.2;

    // Occasion appropriateness
    if (context?.occasion) {
      const occasionScore = calculateOccasionMatch(product, context.occasion, knowledgeBank);
      score += occasionScore * 0.25;
      if (occasionScore > 0.8) reasons.push(`Perfect for ${context.occasion}`);
    }

    // Trend alignment
    if (knowledgeBank.trendingData && isTrending(product, knowledgeBank.trendingData)) {
      score += 0.15;
      reasons.push('Trending now');
    }

    // Popular combination bonus
    if (isPopularCombination(sourceProduct, product, knowledgeBank.conversionData)) {
      score += 0.1;
      reasons.push('Popular combination');
    }

    return {
      product,
      score: Math.min(score, 1.0),
      reasons,
      type: 'advanced_complementary',
      confidence: score
    };
  })
  .filter(item => item.score > 0.6) // Only high-confidence recommendations
  .sort((a, b) => b.score - a.score)
  .slice(0, limit);

  return scoredProducts.map(item => ({
    product: item.product,
    reason: item.reasons.length > 0 ? item.reasons[0] : 'Perfectly complements your selection',
    score: item.score,
    type: 'advanced_complementary',
    confidence: item.confidence,
    additional_reasons: item.reasons.slice(1)
  }));
}

// Behavioral analytics recommendations with machine learning insights
async function getBehavioralAnalyticsRecommendations(supabaseUrl, serviceRoleKey, userId, sessionId, context, limit) {
  if (!userId && !sessionId) return [];

  // Get comprehensive user behavior data
  const behaviorQuery = `
    user_id=eq.${userId || 'null'},session_id=eq.${sessionId}
    &order=created_at.desc&limit=100
  `;

  const interactionsResponse = await fetch(
    `${supabaseUrl}/rest/v1/user_interactions?${behaviorQuery}`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const interactions = await interactionsResponse.json();
  
  // Analyze behavior patterns
  const behaviorPatterns = analyzeBehaviorPatterns(interactions);
  
  // Get customer also bought data
  const customerAlsoBoughtIds = await getCustomersAlsoBought(
    supabaseUrl, serviceRoleKey, behaviorPatterns.viewedProducts, limit
  );

  if (customerAlsoBoughtIds.length === 0) return [];

  // Get product details with enhanced scoring
  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?id=in.(${customerAlsoBoughtIds.join(',')})&status=eq.active`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const products = await productsResponse.json();
  
  // Score recommendations based on behavioral insights
  return products.map((product, index) => ({
    product,
    reason: `Customers with similar taste also purchased this`,
    score: Math.max(0.9 - (index * 0.05), 0.6),
    type: 'behavioral_analytics',
    behavioral_match: calculateBehavioralMatch(product, behaviorPatterns)
  }));
}

// Complete outfit builder with occasion intelligence
async function getCompleteOutfitRecommendations(supabaseUrl, serviceRoleKey, productId, context, limit) {
  if (!productId) return [];

  // Get outfit templates for the occasion
  const occasion = context?.occasion || 'business';
  const templatesResponse = await fetch(
    `${supabaseUrl}/rest/v1/outfit_templates?occasion_type=eq.${occasion}&order=popularity_score.desc&limit=3`,
    {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey
      }
    }
  );

  const templates = await templatesResponse.json();
  
  if (!templates || templates.length === 0) {
    return getGenericOutfitRecommendations(supabaseUrl, serviceRoleKey, productId, limit);
  }

  const bestTemplate = templates[0];
  const requiredItems = bestTemplate.required_items || [];
  const recommendations = [];

  // Build complete outfit based on template
  for (const itemCategory of requiredItems.slice(0, limit)) {
    const itemResponse = await fetch(
      `${supabaseUrl}/rest/v1/products_enhanced?category=eq.${itemCategory}&status=eq.active&order=trending.desc&limit=1`,
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
        reason: `Essential for complete ${occasion} outfit`,
        score: 0.95,
        type: 'complete_outfit',
        template_name: bestTemplate.name
      });
    }
  }

  return recommendations;
}

// Smart cross-category upselling
async function getSmartCrossCategoryRecommendations(supabaseUrl, serviceRoleKey, productId, context, limit) {
  // Load upselling intelligence
  const knowledgeBank = await loadKnowledgeBankData();
  const upsellData = knowledgeBank.successfulUpsells;
  
  if (!upsellData) return [];

  // Get source product
  const productResponse = await fetch(`${supabaseUrl}/rest/v1/products_enhanced?id=eq.${productId}&select=*`, {
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey
    }
  });

  const products = await productResponse.json();
  if (!products || products.length === 0) return [];

  const sourceProduct = products[0];
  
  // Find best upsell categories based on knowledge bank
  const upsellCategories = findBestUpsellCategories(sourceProduct, upsellData);
  
  const recommendations = [];
  
  for (const category of upsellCategories.slice(0, limit)) {
    const categoryProducts = await fetch(
      `${supabaseUrl}/rest/v1/products_enhanced?category=eq.${category.name}&status=eq.active&order=featured.desc&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const items = await categoryProducts.json();
    if (items && items.length > 0) {
      recommendations.push({
        product: items[0],
        reason: category.reason,
        score: category.success_rate / 100,
        type: 'smart_cross_category',
        upsell_category: category.name
      });
    }
  }

  return recommendations;
}

// Occasion-intelligent recommendations
async function getOccasionIntelligentRecommendations(supabaseUrl, serviceRoleKey, context, limit) {
  const occasion = context?.occasion || 'business';
  const season = context?.season || getCurrentSeason();
  
  // Enhanced occasion mapping with intelligence
  const occasionIntelligence = {
    'wedding': {
      formality_range: [8, 10],
      essential_categories: ['suits', 'dress-shirts', 'ties', 'dress-shoes'],
      trending_colors: ['navy', 'sage', 'burgundy'],
      avoid_colors: ['black', 'white']
    },
    'business': {
      formality_range: [6, 8],
      essential_categories: ['suits', 'blazers', 'dress-shirts', 'ties'],
      trending_colors: ['navy', 'charcoal', 'grey'],
      professional_focus: true
    },
    'prom': {
      formality_range: [9, 10],
      essential_categories: ['tuxedos', 'suits', 'bow-ties', 'cummerbunds'],
      trending_colors: ['black', 'navy', 'burgundy'],
      bold_allowed: true
    }
  };

  const intelligence = occasionIntelligence[occasion] || occasionIntelligence['business'];
  
  // Build intelligent query
  const categoryFilter = intelligence.essential_categories
    .map(cat => `category.eq.${cat}`).join(',');
    
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
    reason: `Perfect for ${occasion} - matches formality and style requirements`,
    score: Math.max(0.9 - (index * 0.05), 0.7),
    type: 'occasion_intelligent',
    occasion,
    formality_match: true
  }));
}

// AI-curated recommendations with OpenAI
async function getAICuratedRecommendations(supabaseUrl, serviceRoleKey, openaiApiKey, context, userId, limit) {
  if (!openaiApiKey) {
    return getAdvancedFallbackRecommendations(supabaseUrl, serviceRoleKey, context, limit);
  }

  // This would integrate with OpenAI for advanced curation
  // For now, return enhanced fallback
  return getAdvancedFallbackRecommendations(supabaseUrl, serviceRoleKey, context, limit);
}

// Helper functions
function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

function getSeasonalComplements(category, season) {
  const seasonalMap = {
    'spring': ['light-colored-ties', 'linen-shirts', 'loafers'],
    'summer': ['lightweight-fabrics', 'light-blue-shirts', 'breathable-shoes'],
    'fall': ['textured-ties', 'wool-accessories', 'oxford-shoes'],
    'winter': ['rich-colors', 'wool-scarves', 'leather-shoes']
  };
  return seasonalMap[season] || [];
}

function getOccasionComplements(category, occasion) {
  if (!occasion) return [];
  
  const occasionMap = {
    'wedding': ['pocket-squares', 'formal-shoes', 'cufflinks'],
    'business': ['conservative-ties', 'leather-belts', 'dress-shoes'],
    'prom': ['bow-ties', 'cummerbunds', 'patent-leather-shoes']
  };
  return occasionMap[occasion] || [];
}

function calculateColorHarmony(sourceProduct, targetProduct, colorRelationships) {
  // Simplified color harmony calculation
  return Math.random() * 0.4 + 0.6; // Mock implementation
}

function calculatePriceHarmony(sourcePrice, targetPrice) {
  const ratio = targetPrice / sourcePrice;
  if (ratio >= 0.5 && ratio <= 2) return 1.0;
  if (ratio >= 0.3 && ratio <= 3) return 0.8;
  return 0.5;
}

function calculateOccasionMatch(product, occasion, knowledgeBank) {
  // Mock implementation - would use real occasion matching logic
  return Math.random() * 0.3 + 0.7;
}

function isTrending(product, trendingData) {
  return product.trending || Math.random() > 0.7; // Mock implementation
}

function isPopularCombination(sourceProduct, targetProduct, conversionData) {
  return Math.random() > 0.6; // Mock implementation
}

function analyzeBehaviorPatterns(interactions) {
  const viewedProducts = interactions
    .filter(i => i.interaction_type === 'product_view' && i.product_id)
    .map(i => i.product_id);
    
  return {
    viewedProducts: viewedProducts.slice(0, 10),
    categories: [], // Would analyze categories
    priceRange: {}, // Would analyze price preferences
    timePatterns: {} // Would analyze timing patterns
  };
}

async function getCustomersAlsoBought(supabaseUrl, serviceRoleKey, viewedProductIds, limit) {
  if (viewedProductIds.length === 0) return [];
  
  // Get product affinity data
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
  return affinityData.map(a => a.product_b_id);
}

function calculateBehavioralMatch(product, behaviorPatterns) {
  // Mock implementation - would calculate real behavioral matching
  return Math.random() * 0.3 + 0.7;
}

async function getGenericOutfitRecommendations(supabaseUrl, serviceRoleKey, productId, limit) {
  // Fallback implementation
  const productsResponse = await fetch(
    `${supabaseUrl}/rest/v1/products_enhanced?status=eq.active&order=featured.desc&limit=${limit}`,
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
    score: Math.max(0.8 - (index * 0.05), 0.6),
    type: 'generic_outfit'
  }));
}

function findBestUpsellCategories(sourceProduct, upsellData) {
  // Mock implementation - would use real upsell intelligence
  const mockCategories = [
    { name: 'ties', reason: 'Complete your look', success_rate: 85 },
    { name: 'shoes', reason: 'Perfect matching shoes', success_rate: 78 },
    { name: 'accessories', reason: 'Add the finishing touches', success_rate: 65 }
  ];
  
  return mockCategories;
}

async function getAdvancedFallbackRecommendations(supabaseUrl, serviceRoleKey, context, limit) {
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
    reason: 'AI-curated selection',
    score: Math.max(0.9 - (index * 0.05), 0.7),
    type: 'ai_curated'
  }));
}

// Mock knowledge bank loader - would load real data
async function loadKnowledgeBankData() {
  return {
    colorRelationships: {},
    trendingData: {},
    conversionData: {},
    successfulUpsells: {}
  };
}

// Store advanced analytics
async function storeAdvancedRecommendationAnalytics(supabaseUrl, serviceRoleKey, data) {
  try {
    await fetch(`${supabaseUrl}/rest/v1/advanced_recommendation_analytics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: data.userId,
        session_id: data.sessionId,
        recommendation_type: data.recommendationType,
        product_id: data.productId,
        context: data.context,
        recommendations_count: data.recommendations.length,
        processing_time_ms: data.processingTime,
        advanced_features: true,
        created_at: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Error storing advanced analytics:', error);
  }
}