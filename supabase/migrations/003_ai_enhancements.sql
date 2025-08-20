-- AI Enhancements Migration
-- Enhanced recommendation system and visual search capabilities

-- User interaction tracking for behavioral analytics
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- nullable for anonymous users
  session_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN (
    'product_view', 'product_click', 'add_to_cart', 'remove_from_cart',
    'search', 'visual_search', 'chat_interaction', 'recommendation_click',
    'outfit_generation', 'style_quiz', 'size_consultation'
  )),
  product_id UUID, -- references products_enhanced(id)
  interaction_data JSONB DEFAULT '{}'::jsonb, -- flexible data storage
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product recommendations tracking
CREATE TABLE IF NOT EXISTS product_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- nullable for anonymous users
  session_id TEXT NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN (
    'complementary', 'similar', 'behavioral', 'trending', 'occasion_based',
    'style_match', 'color_coordination', 'complete_outfit', 'upsell', 'cross_sell'
  )),
  source_product_id UUID, -- the product that triggered the recommendation
  recommended_product_id UUID NOT NULL, -- the recommended product
  recommendation_score DECIMAL(5,4) DEFAULT 0, -- 0.0000 to 1.0000
  recommendation_reason TEXT,
  context_data JSONB DEFAULT '{}'::jsonb, -- occasion, style preferences, etc.
  was_clicked BOOLEAN DEFAULT false,
  was_purchased BOOLEAN DEFAULT false,
  position_in_list INTEGER, -- position in recommendation list
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked_at TIMESTAMP WITH TIME ZONE,
  purchased_at TIMESTAMP WITH TIME ZONE
);

-- Visual search queries and results
CREATE TABLE IF NOT EXISTS visual_search_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID, -- nullable for anonymous users
  session_id TEXT NOT NULL,
  image_url TEXT NOT NULL, -- uploaded image URL
  image_analysis JSONB DEFAULT '{}'::jsonb, -- AI analysis results
  search_results JSONB DEFAULT '{}'::jsonb, -- product matches
  visual_features JSONB DEFAULT '{}'::jsonb, -- extracted visual features
  color_palette JSONB DEFAULT '{}'::jsonb, -- dominant colors
  style_classification JSONB DEFAULT '{}'::jsonb, -- style categories
  pattern_detection JSONB DEFAULT '{}'::jsonb, -- patterns found
  similarity_threshold DECIMAL(3,2) DEFAULT 0.75,
  results_count INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product affinity matrix (customers who bought X also bought Y)
CREATE TABLE IF NOT EXISTS product_affinity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_a_id UUID NOT NULL,
  product_b_id UUID NOT NULL,
  affinity_score DECIMAL(5,4) NOT NULL DEFAULT 0,
  co_occurrence_count INTEGER DEFAULT 0,
  total_product_a_purchases INTEGER DEFAULT 0,
  confidence_score DECIMAL(5,4) DEFAULT 0, -- affinity_score / total_product_a_purchases
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique pairs
  UNIQUE(product_a_id, product_b_id)
);

-- Style profiles for personalized recommendations
CREATE TABLE IF NOT EXISTS user_style_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  style_personality TEXT, -- classic, modern, bold, etc.
  preferred_colors JSONB DEFAULT '[]'::jsonb,
  avoided_colors JSONB DEFAULT '[]'::jsonb,
  preferred_patterns JSONB DEFAULT '[]'::jsonb,
  avoided_patterns JSONB DEFAULT '[]'::jsonb,
  fit_preferences JSONB DEFAULT '{}'::jsonb, -- slim, regular, relaxed by category
  occasion_preferences JSONB DEFAULT '{}'::jsonb,
  budget_preferences JSONB DEFAULT '{}'::jsonb, -- min, max, preferred ranges
  size_preferences JSONB DEFAULT '{}'::jsonb, -- preferred sizes by category
  brand_preferences JSONB DEFAULT '{}'::jsonb,
  style_confidence_score DECIMAL(3,2) DEFAULT 0.5, -- how well we know their style
  last_quiz_taken TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Chat conversation context for AI recommendations
CREATE TABLE IF NOT EXISTS chat_contexts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID, -- nullable for anonymous users
  extracted_preferences JSONB DEFAULT '{}'::jsonb, -- preferences extracted from chat
  mentioned_occasions JSONB DEFAULT '[]'::jsonb,
  mentioned_colors JSONB DEFAULT '[]'::jsonb,
  mentioned_styles JSONB DEFAULT '[]'::jsonb,
  mentioned_budget JSONB DEFAULT '{}'::jsonb,
  current_intent TEXT, -- what the user is trying to achieve
  conversation_stage TEXT, -- discovery, recommendation, refinement, checkout
  active_products JSONB DEFAULT '[]'::jsonb, -- products being discussed
  recommendation_context JSONB DEFAULT '{}'::jsonb,
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(session_id)
);

-- Occasion-based outfit templates
CREATE TABLE IF NOT EXISTS outfit_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  occasion_type TEXT NOT NULL,
  season TEXT CHECK (season IN ('spring', 'summer', 'fall', 'winter', 'year_round')),
  formality_level INTEGER CHECK (formality_level >= 1 AND formality_level <= 10),
  style_category TEXT, -- classic, modern, trendy, etc.
  required_items JSONB NOT NULL DEFAULT '[]'::jsonb, -- list of required item types
  optional_items JSONB DEFAULT '[]'::jsonb, -- list of optional item types
  color_scheme JSONB DEFAULT '{}'::jsonb, -- suggested colors
  price_range JSONB DEFAULT '{}'::jsonb, -- min/max price ranges
  popularity_score DECIMAL(3,2) DEFAULT 0.5,
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product combinations that work well together
CREATE TABLE IF NOT EXISTS product_combinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  combination_name TEXT,
  products JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of product IDs
  combination_type TEXT CHECK (combination_type IN (
    'complete_outfit', 'color_coordination', 'style_match', 'occasion_specific'
  )),
  occasion TEXT,
  season TEXT,
  style_rating DECIMAL(3,2) DEFAULT 0,
  purchase_frequency INTEGER DEFAULT 0,
  customer_rating DECIMAL(3,2) DEFAULT 0,
  created_by TEXT, -- ai_system, stylist, customer_data
  is_curated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI model performance tracking
CREATE TABLE IF NOT EXISTS ai_model_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_type TEXT NOT NULL, -- recommendation_engine, visual_search, style_classifier
  model_version TEXT NOT NULL,
  performance_metric TEXT NOT NULL, -- accuracy, precision, recall, conversion_rate
  metric_value DECIMAL(5,4) NOT NULL,
  test_dataset_size INTEGER,
  measurement_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX idx_user_interactions_product_id ON user_interactions(product_id);
CREATE INDEX idx_user_interactions_created_at ON user_interactions(created_at);

CREATE INDEX idx_product_recommendations_user_id ON product_recommendations(user_id);
CREATE INDEX idx_product_recommendations_session_id ON product_recommendations(session_id);
CREATE INDEX idx_product_recommendations_type ON product_recommendations(recommendation_type);
CREATE INDEX idx_product_recommendations_source ON product_recommendations(source_product_id);
CREATE INDEX idx_product_recommendations_target ON product_recommendations(recommended_product_id);
CREATE INDEX idx_product_recommendations_score ON product_recommendations(recommendation_score);

CREATE INDEX idx_visual_search_user_id ON visual_search_queries(user_id);
CREATE INDEX idx_visual_search_session_id ON visual_search_queries(session_id);
CREATE INDEX idx_visual_search_created_at ON visual_search_queries(created_at);

CREATE INDEX idx_product_affinity_product_a ON product_affinity(product_a_id);
CREATE INDEX idx_product_affinity_product_b ON product_affinity(product_b_id);
CREATE INDEX idx_product_affinity_score ON product_affinity(affinity_score DESC);

CREATE INDEX idx_user_style_profiles_user_id ON user_style_profiles(user_id);

CREATE INDEX idx_chat_contexts_session_id ON chat_contexts(session_id);
CREATE INDEX idx_chat_contexts_user_id ON chat_contexts(user_id);

CREATE INDEX idx_outfit_templates_occasion ON outfit_templates(occasion_type);
CREATE INDEX idx_outfit_templates_season ON outfit_templates(season);
CREATE INDEX idx_outfit_templates_formality ON outfit_templates(formality_level);
CREATE INDEX idx_outfit_templates_trending ON outfit_templates(is_trending);

-- Enable Row Level Security
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_affinity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_style_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_performance ENABLE ROW LEVEL SECURITY;

-- Helper functions

-- Function to calculate product affinity scores
CREATE OR REPLACE FUNCTION calculate_product_affinity(product_a UUID, product_b UUID)
RETURNS DECIMAL AS $$
DECLARE
  co_purchases INTEGER;
  total_a_purchases INTEGER;
  affinity DECIMAL;
BEGIN
  -- Count times products were purchased together
  SELECT COUNT(DISTINCT o.id) INTO co_purchases
  FROM orders o
  JOIN order_items oi1 ON o.id = oi1.order_id
  JOIN order_items oi2 ON o.id = oi2.order_id
  WHERE oi1.product_id = product_a 
    AND oi2.product_id = product_b
    AND o.status = 'paid';
  
  -- Count total purchases of product A
  SELECT COUNT(DISTINCT oi.order_id) INTO total_a_purchases
  FROM order_items oi
  JOIN orders o ON oi.order_id = o.id
  WHERE oi.product_id = product_a AND o.status = 'paid';
  
  -- Calculate affinity score
  IF total_a_purchases > 0 THEN
    affinity := CAST(co_purchases AS DECIMAL) / CAST(total_a_purchases AS DECIMAL);
  ELSE
    affinity := 0;
  END IF;
  
  RETURN LEAST(affinity, 1.0);
END;
$$ LANGUAGE plpgsql;

-- Function to update product affinity matrix
CREATE OR REPLACE FUNCTION update_product_affinity_matrix()
RETURNS void AS $$
DECLARE
  product_pair RECORD;
BEGIN
  -- Get all unique product pairs from orders
  FOR product_pair IN
    SELECT DISTINCT 
      oi1.product_id as product_a,
      oi2.product_id as product_b
    FROM order_items oi1
    JOIN order_items oi2 ON oi1.order_id = oi2.order_id
    JOIN orders o ON oi1.order_id = o.id
    WHERE oi1.product_id != oi2.product_id
      AND o.status = 'paid'
      AND o.created_at >= NOW() - INTERVAL '30 days'
  LOOP
    -- Calculate and upsert affinity score
    INSERT INTO product_affinity (
      product_a_id, 
      product_b_id, 
      affinity_score,
      last_calculated
    )
    VALUES (
      product_pair.product_a,
      product_pair.product_b,
      calculate_product_affinity(product_pair.product_a, product_pair.product_b),
      NOW()
    )
    ON CONFLICT (product_a_id, product_b_id) 
    DO UPDATE SET
      affinity_score = calculate_product_affinity(product_pair.product_a, product_pair.product_b),
      last_calculated = NOW();
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending products
CREATE OR REPLACE FUNCTION get_trending_products(days_back INTEGER DEFAULT 7, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  product_id UUID,
  trend_score DECIMAL,
  view_count BIGINT,
  purchase_count BIGINT,
  cart_add_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    -- Weighted trend score
    CAST(
      (COALESCE(views.count, 0) * 0.1 + 
       COALESCE(purchases.count, 0) * 1.0 + 
       COALESCE(cart_adds.count, 0) * 0.5) AS DECIMAL
    ) as trend_score,
    COALESCE(views.count, 0) as view_count,
    COALESCE(purchases.count, 0) as purchase_count,
    COALESCE(cart_adds.count, 0) as cart_add_count
  FROM products_enhanced p
  LEFT JOIN (
    SELECT product_id, COUNT(*) as count
    FROM user_interactions
    WHERE interaction_type = 'product_view'
      AND created_at >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY product_id
  ) views ON p.id = views.product_id
  LEFT JOIN (
    SELECT oi.product_id, COUNT(*) as count
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status = 'paid'
      AND o.created_at >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY oi.product_id
  ) purchases ON p.id = purchases.product_id
  LEFT JOIN (
    SELECT product_id, COUNT(*) as count
    FROM user_interactions
    WHERE interaction_type = 'add_to_cart'
      AND created_at >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY product_id
  ) cart_adds ON p.id = cart_adds.product_id
  WHERE p.status = 'active'
  ORDER BY trend_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Updated at triggers
CREATE TRIGGER update_user_style_profiles_updated_at BEFORE UPDATE ON user_style_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outfit_templates_updated_at BEFORE UPDATE ON outfit_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for analytics

-- Daily analytics summary
CREATE OR REPLACE VIEW daily_analytics AS
SELECT 
  DATE(created_at) as analytics_date,
  COUNT(*) FILTER (WHERE interaction_type = 'product_view') as product_views,
  COUNT(*) FILTER (WHERE interaction_type = 'add_to_cart') as cart_additions,
  COUNT(*) FILTER (WHERE interaction_type = 'search') as searches,
  COUNT(*) FILTER (WHERE interaction_type = 'visual_search') as visual_searches,
  COUNT(*) FILTER (WHERE interaction_type = 'chat_interaction') as chat_interactions,
  COUNT(*) FILTER (WHERE interaction_type = 'recommendation_click') as recommendation_clicks,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT user_id) as unique_users
FROM user_interactions
GROOP BY DATE(created_at)
ORDER BY analytics_date DESC;

-- Product recommendation performance
CREATE OR REPLACE VIEW recommendation_performance AS
SELECT 
  recommendation_type,
  COUNT(*) as total_recommendations,
  COUNT(*) FILTER (WHERE was_clicked = true) as clicked_recommendations,
  COUNT(*) FILTER (WHERE was_purchased = true) as purchased_recommendations,
  ROUND(COUNT(*) FILTER (WHERE was_clicked = true)::DECIMAL / COUNT(*) * 100, 2) as click_through_rate,
  ROUND(COUNT(*) FILTER (WHERE was_purchased = true)::DECIMAL / COUNT(*) * 100, 2) as conversion_rate,
  AVG(recommendation_score) as avg_recommendation_score
FROM product_recommendations
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY recommendation_type
ORDER BY conversion_rate DESC;
