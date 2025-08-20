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
      searchType = 'similar', 
      sessionId, 
      userId,
      similarityThreshold = 0.75,
      limit = 12
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

    // Upload image to storage first
    const imageUrl = await uploadSearchImage(supabaseUrl, serviceRoleKey, imageData, sessionId);
    
    // Analyze image with AI
    const imageAnalysis = await analyzeImageWithAI(openaiApiKey, imageData);
    
    // Extract visual features
    const visualFeatures = extractVisualFeatures(imageAnalysis);
    
    // Find similar products
    const searchResults = await findSimilarProducts(
      supabaseUrl, 
      serviceRoleKey, 
      visualFeatures, 
      searchType,
      similarityThreshold,
      limit
    );

    const processingTime = Date.now() - startTime;

    // Store search query in database
    await storeSearchQuery(supabaseUrl, serviceRoleKey, {
      userId: currentUserId,
      sessionId,
      imageUrl,
      imageAnalysis,
      visualFeatures,
      searchResults,
      similarityThreshold,
      processingTime
    });

    return new Response(JSON.stringify({
      data: {
        searchResults,
        imageAnalysis,
        visualFeatures,
        processingTime,
        imageUrl,
        searchType,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Visual search error:', error);

    const errorResponse = {
      error: {
        code: 'VISUAL_SEARCH_FAILED',
        message: error.message
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

// Upload search image to storage
async function uploadSearchImage(supabaseUrl, serviceRoleKey, imageData, sessionId) {
  try {
    // Extract base64 data from data URL
    const base64Data = imageData.split(',')[1];
    const mimeType = imageData.split(';')[0].split(':')[1];
    
    // Convert base64 to binary
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `visual-search/${sessionId}/${Date.now()}.jpg`;
    
    // Upload to Supabase Storage
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
      throw new Error(`Upload failed: ${errorText}`);
    }

    // Return public URL
    return `${supabaseUrl}/storage/v1/object/public/visual-search/${fileName}`;
    
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload search image');
  }
}

// Analyze image with OpenAI Vision API
async function analyzeImageWithAI(openaiApiKey, imageData) {
  if (!openaiApiKey) {
    console.log('OpenAI API key not available, using fallback analysis');
    return getFallbackAnalysis(imageData);
  }

  try {
    const prompt = `Analyze this menswear image and provide detailed information about:
1. Style classification (formal, casual, business, evening, etc.)
2. Color palette (dominant colors and accent colors)
3. Patterns and textures (solid, striped, plaid, textured, etc.)
4. Garment types and categories
5. Occasion suitability
6. Season appropriateness
7. Fabric characteristics (if visible)
8. Overall style personality (classic, modern, trendy, bold, etc.)

Provide the response in JSON format with clear categories.`;

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
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageData } }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3
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
      // If JSON parsing fails, create structured data from text
      return parseTextualAnalysis(analysisText);
    }

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return getFallbackAnalysis(imageData);
  }
}

// Fallback analysis when AI is not available
function getFallbackAnalysis(imageData) {
  return {
    style_classification: ['formal', 'business'],
    color_palette: {
      dominant_colors: ['navy', 'white'],
      accent_colors: ['silver']
    },
    patterns: ['solid'],
    garment_types: ['suit', 'dress-shirt'],
    occasions: ['business', 'formal'],
    season: 'year_round',
    fabric_characteristics: ['smooth', 'tailored'],
    style_personality: 'classic',
    confidence_score: 0.5
  };
}

// Parse textual analysis into structured data
function parseTextualAnalysis(analysisText) {
  const analysis = {
    style_classification: [],
    color_palette: { dominant_colors: [], accent_colors: [] },
    patterns: [],
    garment_types: [],
    occasions: [],
    season: 'year_round',
    fabric_characteristics: [],
    style_personality: 'classic',
    confidence_score: 0.7
  };

  const lowerText = analysisText.toLowerCase();

  // Extract style classification
  if (lowerText.includes('formal')) analysis.style_classification.push('formal');
  if (lowerText.includes('casual')) analysis.style_classification.push('casual');
  if (lowerText.includes('business')) analysis.style_classification.push('business');
  if (lowerText.includes('evening')) analysis.style_classification.push('evening');

  // Extract colors
  const colors = ['navy', 'black', 'white', 'gray', 'brown', 'burgundy', 'blue', 'red', 'green'];
  colors.forEach(color => {
    if (lowerText.includes(color)) {
      analysis.color_palette.dominant_colors.push(color);
    }
  });

  // Extract patterns
  if (lowerText.includes('stripe')) analysis.patterns.push('striped');
  if (lowerText.includes('plaid') || lowerText.includes('check')) analysis.patterns.push('plaid');
  if (lowerText.includes('solid')) analysis.patterns.push('solid');
  if (lowerText.includes('pattern')) analysis.patterns.push('patterned');

  // Extract garment types
  if (lowerText.includes('suit')) analysis.garment_types.push('suit');
  if (lowerText.includes('shirt')) analysis.garment_types.push('shirt');
  if (lowerText.includes('tie')) analysis.garment_types.push('tie');
  if (lowerText.includes('blazer')) analysis.garment_types.push('blazer');
  if (lowerText.includes('tuxedo')) analysis.garment_types.push('tuxedo');

  return analysis;
}

// Extract visual features for matching
function extractVisualFeatures(imageAnalysis) {
  return {
    primary_style: imageAnalysis.style_classification?.[0] || 'formal',
    dominant_color: imageAnalysis.color_palette?.dominant_colors?.[0] || 'navy',
    pattern_type: imageAnalysis.patterns?.[0] || 'solid',
    garment_category: imageAnalysis.garment_types?.[0] || 'suit',
    formality_level: calculateFormalityLevel(imageAnalysis),
    style_keywords: extractStyleKeywords(imageAnalysis),
    color_family: getColorFamily(imageAnalysis.color_palette?.dominant_colors || ['navy'])
  };
}

// Calculate formality level from analysis
function calculateFormalityLevel(analysis) {
  const styles = analysis.style_classification || [];
  
  if (styles.includes('black-tie') || styles.includes('white-tie')) return 10;
  if (styles.includes('formal') || styles.includes('evening')) return 8;
  if (styles.includes('business')) return 6;
  if (styles.includes('smart-casual')) return 4;
  if (styles.includes('casual')) return 2;
  
  return 6; // Default business level
}

// Extract style keywords for matching
function extractStyleKeywords(analysis) {
  const keywords = [];
  
  // Add style classifications
  if (analysis.style_classification) {
    keywords.push(...analysis.style_classification);
  }
  
  // Add garment types
  if (analysis.garment_types) {
    keywords.push(...analysis.garment_types);
  }
  
  // Add patterns
  if (analysis.patterns) {
    keywords.push(...analysis.patterns);
  }
  
  // Add occasions
  if (analysis.occasions) {
    keywords.push(...analysis.occasions);
  }
  
  return keywords;
}

// Get color family for broader matching
function getColorFamily(colors) {
  const colorFamilies = {
    'navy': 'blue',
    'royal-blue': 'blue',
    'light-blue': 'blue',
    'black': 'neutral',
    'white': 'neutral',
    'gray': 'neutral',
    'grey': 'neutral',
    'burgundy': 'red',
    'brown': 'earth',
    'tan': 'earth',
    'beige': 'earth'
  };
  
  const primaryColor = colors[0] || 'navy';
  return colorFamilies[primaryColor.toLowerCase()] || 'neutral';
}

// Find similar products based on visual features
async function findSimilarProducts(supabaseUrl, serviceRoleKey, visualFeatures, searchType, threshold, limit) {
  try {
    // Get all active products
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
    
    // Calculate similarity scores
    const scoredProducts = products
      .map(product => ({
        product,
        similarity_score: calculateSimilarityScore(product, visualFeatures),
        match_reasons: getMatchReasons(product, visualFeatures)
      }))
      .filter(item => item.similarity_score >= threshold)
      .sort((a, b) => b.similarity_score - a.similarity_score)
      .slice(0, limit);

    return scoredProducts;

  } catch (error) {
    console.error('Product search error:', error);
    return [];
  }
}

// Calculate similarity score between product and visual features
function calculateSimilarityScore(product, features) {
  let score = 0;
  let factors = 0;
  
  // Category matching (40% weight)
  if (product.category?.toLowerCase().includes(features.garment_category?.toLowerCase())) {
    score += 0.4;
  }
  factors += 0.4;
  
  // Color matching (25% weight)
  const productColors = extractProductColors(product);
  if (productColors.includes(features.dominant_color?.toLowerCase())) {
    score += 0.25;
  } else if (productColors.some(color => getColorFamily([color]) === features.color_family)) {
    score += 0.15; // Partial color family match
  }
  factors += 0.25;
  
  // Style matching (20% weight)
  const productStyle = extractProductStyle(product);
  if (features.style_keywords?.some(keyword => productStyle.includes(keyword.toLowerCase()))) {
    score += 0.2;
  }
  factors += 0.2;
  
  // Formality matching (15% weight)
  const productFormality = estimateProductFormality(product);
  const formalityDiff = Math.abs(productFormality - (features.formality_level || 6));
  const formalityScore = Math.max(0, 1 - (formalityDiff / 10));
  score += formalityScore * 0.15;
  factors += 0.15;
  
  return Math.min(score / factors, 1.0);
}

// Extract colors from product data
function extractProductColors(product) {
  const colors = [];
  
  if (product.specifications?.color) {
    colors.push(product.specifications.color.toLowerCase());
  }
  
  if (product.specifications?.colors) {
    colors.push(...product.specifications.colors.map(c => c.toLowerCase()));
  }
  
  // Extract from name
  const name = product.name?.toLowerCase() || '';
  const colorKeywords = ['navy', 'black', 'white', 'gray', 'brown', 'burgundy', 'blue'];
  colorKeywords.forEach(color => {
    if (name.includes(color)) colors.push(color);
  });
  
  return colors.length > 0 ? colors : ['navy']; // Default
}

// Extract style information from product
function extractProductStyle(product) {
  const style = [];
  
  const name = product.name?.toLowerCase() || '';
  const description = product.description?.toLowerCase() || '';
  const category = product.category?.toLowerCase() || '';
  
  const text = `${name} ${description} ${category}`;
  
  const styleKeywords = ['formal', 'casual', 'business', 'wedding', 'tuxedo', 'suit', 'blazer'];
  styleKeywords.forEach(keyword => {
    if (text.includes(keyword)) style.push(keyword);
  });
  
  return style;
}

// Estimate product formality level
function estimateProductFormality(product) {
  const name = product.name?.toLowerCase() || '';
  const category = product.category?.toLowerCase() || '';
  
  if (category.includes('tuxedo') || name.includes('black-tie')) return 10;
  if (category.includes('suit') || name.includes('formal')) return 8;
  if (category.includes('blazer') || name.includes('business')) return 6;
  if (name.includes('casual')) return 3;
  
  return 6; // Default business level
}

// Get match reasons for display
function getMatchReasons(product, features) {
  const reasons = [];
  
  if (product.category?.toLowerCase().includes(features.garment_category?.toLowerCase())) {
    reasons.push(`Similar ${features.garment_category} style`);
  }
  
  const productColors = extractProductColors(product);
  if (productColors.includes(features.dominant_color?.toLowerCase())) {
    reasons.push(`Matching ${features.dominant_color} color`);
  }
  
  if (features.style_keywords?.some(keyword => product.name?.toLowerCase().includes(keyword))) {
    reasons.push('Similar style classification');
  }
  
  return reasons.length > 0 ? reasons : ['Visual similarity match'];
}

// Store search query in database
async function storeSearchQuery(supabaseUrl, serviceRoleKey, data) {
  const {
    userId,
    sessionId,
    imageUrl,
    imageAnalysis,
    visualFeatures,
    searchResults,
    similarityThreshold,
    processingTime
  } = data;
  
  const queryData = {
    user_id: userId,
    session_id: sessionId,
    image_url: imageUrl,
    image_analysis: imageAnalysis,
    visual_features: visualFeatures,
    search_results: searchResults.map(r => ({
      product_id: r.product.id,
      similarity_score: r.similarity_score,
      match_reasons: r.match_reasons
    })),
    color_palette: imageAnalysis.color_palette || {},
    style_classification: imageAnalysis.style_classification || {},
    pattern_detection: { patterns: imageAnalysis.patterns || [] },
    similarity_threshold: similarityThreshold,
    results_count: searchResults.length,
    processing_time_ms: processingTime
  };

  try {
    await fetch(`${supabaseUrl}/rest/v1/visual_search_queries`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryData)
    });
  } catch (error) {
    console.error('Error storing search query:', error);
  }
}