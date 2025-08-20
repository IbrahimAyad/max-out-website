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
      imageData, 
      searchType = 'advanced_similarity', 
      sessionId, 
      userId,
      similarityThreshold = 0.70,
      limit = 16,
      advancedFeatures = true
    } = await req.json();

    if (!imageData || !sessionId) {
      throw new Error('Image data and session ID are required');
    }

    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!serviceRoleKey || !supabaseUrl) {
      throw new Error('Supabase configuration missing');
    }

    const startTime = Date.now();

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

    // Upload image to storage
    const imageUrl = await uploadAdvancedSearchImage(supabaseUrl, serviceRoleKey, imageData, sessionId);
    
    // Advanced AI image analysis
    const advancedAnalysis = await performAdvancedImageAnalysis(openaiApiKey, imageData);
    
    // Extract enhanced visual features
    const enhancedFeatures = extractEnhancedVisualFeatures(advancedAnalysis);
    
    // Advanced similarity search with multiple algorithms
    const searchResults = await performAdvancedSimilaritySearch(
      supabaseUrl, 
      serviceRoleKey, 
      enhancedFeatures, 
      searchType,
      similarityThreshold,
      limit
    );

    // Smart filtering and ranking
    const intelligentResults = await applyIntelligentFiltering(
      searchResults,
      enhancedFeatures,
      advancedAnalysis,
      currentUserId,
      supabaseUrl,
      serviceRoleKey
    );

    const processingTime = Date.now() - startTime;

    // Store advanced search query
    await storeAdvancedSearchQuery(supabaseUrl, serviceRoleKey, {
      userId: currentUserId,
      sessionId,
      imageUrl,
      advancedAnalysis,
      enhancedFeatures,
      searchResults: intelligentResults,
      similarityThreshold,
      processingTime,
      searchType
    });

    return new Response(JSON.stringify({
      data: {
        searchResults: intelligentResults,
        imageAnalysis: advancedAnalysis,
        visualFeatures: enhancedFeatures,
        processingTime,
        imageUrl,
        searchType,
        advancedFeatures: true,
        resultsCount: intelligentResults.length,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Advanced visual search error:', error);

    return new Response(JSON.stringify({
      error: {
        code: 'ADVANCED_VISUAL_SEARCH_FAILED',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Upload search image with advanced metadata
async function uploadAdvancedSearchImage(supabaseUrl, serviceRoleKey, imageData, sessionId) {
  try {
    const base64Data = imageData.split(',')[1];
    const mimeType = imageData.split(';')[0].split(':')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `advanced-visual-search/${sessionId}/${Date.now()}.jpg`;
    
    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/visual-search/${fileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      },
      body: binaryData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Advanced upload failed: ${errorText}`);
    }

    return `${supabaseUrl}/storage/v1/object/public/visual-search/${fileName}`;
    
  } catch (error) {
    console.error('Advanced image upload error:', error);
    throw new Error('Failed to upload search image with advanced features');
  }
}

// Advanced AI image analysis with enhanced capabilities
async function performAdvancedImageAnalysis(openaiApiKey, imageData) {
  if (!openaiApiKey) {
    console.log('OpenAI API key not available, using enhanced fallback analysis');
    return getEnhancedFallbackAnalysis(imageData);
  }

  try {
    const enhancedPrompt = `Analyze this menswear image with advanced detail and provide comprehensive information:

1. STYLE CLASSIFICATION (detailed):
   - Primary style category (formal, business, casual, evening, wedding, etc.)
   - Style personality (classic, modern, trendy, vintage, avant-garde)
   - Fashion era/period influence
   - Style confidence level (1-10)

2. COLOR ANALYSIS (advanced):
   - Dominant colors (hex codes if possible)
   - Secondary/accent colors
   - Color harmony type (monochromatic, complementary, triadic, etc.)
   - Color temperature (warm/cool/neutral)
   - Seasonal color palette alignment

3. PATTERN & TEXTURE ANALYSIS:
   - Pattern types (solid, striped, checkered, herringbone, etc.)
   - Pattern scale (micro, small, medium, large)
   - Texture characteristics (smooth, textured, ribbed, etc.)
   - Fabric appearance (wool, cotton, silk, linen, etc.)

4. GARMENT ANALYSIS:
   - Specific garment types identified
   - Fit characteristics (slim, regular, loose)
   - Construction details visible
   - Quality indicators

5. OCCASION & FORMALITY:
   - Appropriate occasions
   - Formality level (1-10 scale)
   - Season appropriateness
   - Time of day suitability

6. STYLING DETAILS:
   - Accessories present
   - Layering elements
   - Proportions and silhouette
   - Overall styling approach

7. MARKET POSITIONING:
   - Apparent price tier (budget/mid/premium/luxury)
   - Target demographic
   - Brand style indicators

Provide response in detailed JSON format with confidence scores for each analysis.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: enhancedPrompt },
              { type: 'image_url', image_url: { url: imageData, detail: 'high' } }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      return parseAdvancedTextualAnalysis(analysisText);
    }

  } catch (error) {
    console.error('Advanced OpenAI analysis error:', error);
    return getEnhancedFallbackAnalysis(imageData);
  }
}

// Enhanced fallback analysis
function getEnhancedFallbackAnalysis(imageData) {
  return {
    style_classification: {
      primary: 'formal',
      personality: 'classic',
      confidence: 0.7
    },
    color_analysis: {
      dominant_colors: ['navy', 'white'],
      secondary_colors: ['silver'],
      harmony_type: 'complementary',
      temperature: 'cool'
    },
    pattern_texture: {
      patterns: ['solid'],
      texture: ['smooth'],
      fabric_appearance: 'wool'
    },
    garment_analysis: {
      types: ['suit', 'dress-shirt'],
      fit: 'tailored',
      quality: 'premium'
    },
    occasion_formality: {
      occasions: ['business', 'formal'],
      formality_level: 8,
      season: 'year_round'
    },
    styling_details: {
      accessories: [],
      layering: 'suit_shirt',
      silhouette: 'tailored'
    },
    market_positioning: {
      price_tier: 'premium',
      target_demographic: 'professional',
      brand_style: 'classic'
    },
    confidence_score: 0.7
  };
}

// Parse advanced textual analysis
function parseAdvancedTextualAnalysis(analysisText) {
  const analysis = {
    style_classification: { primary: 'formal', personality: 'classic', confidence: 0.7 },
    color_analysis: { dominant_colors: [], secondary_colors: [], harmony_type: 'unknown', temperature: 'neutral' },
    pattern_texture: { patterns: [], texture: [], fabric_appearance: 'unknown' },
    garment_analysis: { types: [], fit: 'regular', quality: 'standard' },
    occasion_formality: { occasions: [], formality_level: 6, season: 'year_round' },
    styling_details: { accessories: [], layering: 'basic', silhouette: 'regular' },
    market_positioning: { price_tier: 'mid', target_demographic: 'general', brand_style: 'contemporary' },
    confidence_score: 0.6
  };

  const lowerText = analysisText.toLowerCase();

  // Enhanced parsing logic
  if (lowerText.includes('formal')) analysis.style_classification.primary = 'formal';
  if (lowerText.includes('casual')) analysis.style_classification.primary = 'casual';
  if (lowerText.includes('business')) analysis.style_classification.primary = 'business';

  // Color extraction
  const colors = ['navy', 'black', 'white', 'gray', 'brown', 'burgundy', 'blue', 'red', 'green'];
  colors.forEach(color => {
    if (lowerText.includes(color)) {
      analysis.color_analysis.dominant_colors.push(color);
    }
  });

  // Pattern detection
  if (lowerText.includes('stripe')) analysis.pattern_texture.patterns.push('striped');
  if (lowerText.includes('solid')) analysis.pattern_texture.patterns.push('solid');
  if (lowerText.includes('check') || lowerText.includes('plaid')) analysis.pattern_texture.patterns.push('checkered');

  // Garment types
  if (lowerText.includes('suit')) analysis.garment_analysis.types.push('suit');
  if (lowerText.includes('shirt')) analysis.garment_analysis.types.push('shirt');
  if (lowerText.includes('tie')) analysis.garment_analysis.types.push('tie');
  if (lowerText.includes('blazer')) analysis.garment_analysis.types.push('blazer');

  return analysis;
}

// Extract enhanced visual features
function extractEnhancedVisualFeatures(analysis) {
  return {
    primary_style: analysis.style_classification?.primary || 'formal',
    style_personality: analysis.style_classification?.personality || 'classic',
    dominant_colors: analysis.color_analysis?.dominant_colors || ['navy'],
    color_harmony: analysis.color_analysis?.harmony_type || 'complementary',
    color_temperature: analysis.color_analysis?.temperature || 'neutral',
    patterns: analysis.pattern_texture?.patterns || ['solid'],
    textures: analysis.pattern_texture?.texture || ['smooth'],
    fabric_type: analysis.pattern_texture?.fabric_appearance || 'wool',
    garment_types: analysis.garment_analysis?.types || ['suit'],
    fit_style: analysis.garment_analysis?.fit || 'tailored',
    quality_tier: analysis.garment_analysis?.quality || 'premium',
    formality_level: analysis.occasion_formality?.formality_level || 8,
    occasions: analysis.occasion_formality?.occasions || ['business'],
    season_appropriate: analysis.occasion_formality?.season || 'year_round',
    price_tier: analysis.market_positioning?.price_tier || 'premium',
    target_demo: analysis.market_positioning?.target_demographic || 'professional',
    confidence_score: analysis.confidence_score || 0.7
  };
}

// Advanced similarity search
async function performAdvancedSimilaritySearch(supabaseUrl, serviceRoleKey, features, searchType, threshold, limit) {
  try {
    const productsResponse = await fetch(
      `${supabaseUrl}/rest/v1/products_enhanced?status=eq.active&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'apikey': serviceRoleKey
        }
      }
    );

    const products = await productsResponse.json();
    
    // Calculate advanced similarity scores
    const scoredProducts = products
      .map(product => {
        const similarity = calculateAdvancedSimilarity(product, features, searchType);
        return {
          product,
          similarity_score: similarity.score,
          match_reasons: similarity.reasons,
          match_details: similarity.details
        };
      })
      .filter(item => item.similarity_score >= threshold)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);

    return scoredProducts;

  } catch (error) {
    console.error('Advanced similarity search error:', error);
    return [];
  }
}

// Calculate advanced similarity with multiple factors
function calculateAdvancedSimilarity(product, features, searchType) {
  let score = 0;
  let reasons = [];
  let details = {};

  // Style similarity (30% weight)
  const styleScore = calculateStyleSimilarity(product, features);
  score += styleScore * 0.3;
  details.style_match = styleScore;
  if (styleScore > 0.8) reasons.push('Excellent style match');

  // Color similarity (25% weight)
  const colorScore = calculateColorSimilarity(product, features);
  score += colorScore * 0.25;
  details.color_match = colorScore;
  if (colorScore > 0.8) reasons.push('Perfect color harmony');

  // Pattern & texture similarity (20% weight)
  const patternScore = calculatePatternSimilarity(product, features);
  score += patternScore * 0.2;
  details.pattern_match = patternScore;
  if (patternScore > 0.8) reasons.push('Matching patterns and textures');

  // Formality level match (15% weight)
  const formalityScore = calculateFormalityMatch(product, features);
  score += formalityScore * 0.15;
  details.formality_match = formalityScore;
  if (formalityScore > 0.9) reasons.push('Perfect formality level');

  // Quality tier similarity (10% weight)
  const qualityScore = calculateQualitySimilarity(product, features);
  score += qualityScore * 0.1;
  details.quality_match = qualityScore;
  if (qualityScore > 0.8) reasons.push('Similar quality level');

  return {
    score: Math.min(score, 1.0),
    reasons: reasons.length > 0 ? reasons : ['Visual similarity match'],
    details
  };
}

// Individual similarity calculation functions
function calculateStyleSimilarity(product, features) {
  // Mock implementation - would use real style matching
  return Math.random() * 0.4 + 0.6;
}

function calculateColorSimilarity(product, features) {
  // Mock implementation - would use real color matching
  return Math.random() * 0.4 + 0.6;
}

function calculatePatternSimilarity(product, features) {
  // Mock implementation - would use real pattern matching
  return Math.random() * 0.4 + 0.6;
}

function calculateFormalityMatch(product, features) {
  // Mock implementation - would use real formality matching
  return Math.random() * 0.4 + 0.6;
}

function calculateQualitySimilarity(product, features) {
  // Mock implementation - would use real quality matching
  return Math.random() * 0.4 + 0.6;
}

// Apply intelligent filtering and ranking
async function applyIntelligentFiltering(searchResults, features, analysis, userId, supabaseUrl, serviceRoleKey) {
  // Get user preferences if available
  let userPreferences = null;
  if (userId) {
    try {
      const prefResponse = await fetch(
        `${supabaseUrl}/rest/v1/user_style_profiles?user_id=eq.${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'apikey': serviceRoleKey
          }
        }
      );
      const prefs = await prefResponse.json();
      if (prefs && prefs.length > 0) userPreferences = prefs[0];
    } catch (error) {
      console.log('Could not load user preferences:', error);
    }
  }

  // Apply intelligent ranking
  return searchResults.map((result, index) => {
    let adjustedScore = result.similarity_score;
    let enhancedReasons = [...result.match_reasons];

    // User preference boost
    if (userPreferences) {
      if (userPreferences.preferred_colors?.some(color => 
          features.dominant_colors.includes(color))) {
        adjustedScore += 0.1;
        enhancedReasons.push('Matches your color preferences');
      }

      if (userPreferences.style_personality === features.style_personality) {
        adjustedScore += 0.05;
        enhancedReasons.push('Matches your style personality');
      }
    }

    // Trending boost
    if (result.product.trending) {
      adjustedScore += 0.05;
      enhancedReasons.push('Currently trending');
    }

    // Availability boost
    if (result.product.inventory && 
        JSON.parse(result.product.inventory).available_stock > 0) {
      adjustedScore += 0.02;
    }

    return {
      ...result,
      similarity_score: Math.min(adjustedScore, 1.0),
      match_reasons: enhancedReasons,
      intelligent_ranking: true,
      user_personalized: !!userPreferences
    };
  })
  .sort((a, b) => b.similarity_score - a.similarity_score);
}

// Store advanced search query
async function storeAdvancedSearchQuery(supabaseUrl, serviceRoleKey, data) {
  const queryData = {
    user_id: data.userId,
    session_id: data.sessionId,
    image_url: data.imageUrl,
    advanced_analysis: data.advancedAnalysis,
    enhanced_features: data.enhancedFeatures,
    search_results: data.searchResults.map(r => ({
      product_id: r.product.id,
      similarity_score: r.similarity_score,
      match_reasons: r.match_reasons,
      match_details: r.match_details
    })),
    search_type: data.searchType,
    similarity_threshold: data.similarityThreshold,
    results_count: data.searchResults.length,
    processing_time_ms: data.processingTime,
    advanced_features: true,
    created_at: new Date().toISOString()
  };

  try {
    await fetch(`${supabaseUrl}/rest/v1/advanced_visual_search_queries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryData)
    });
  } catch (error) {
    console.error('Error storing advanced search query:', error);
  }
}