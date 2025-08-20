-- Enhanced Products System Migration
-- Creates new products_enhanced table for individual products with 20-tier pricing

-- Main enhanced products table
CREATE TABLE IF NOT EXISTS products_enhanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT,
  
  -- Core pricing (base_price used for checkout)
  base_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  
  -- 20-tier pricing system stored as JSONB
  pricing_tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Enhanced image system with JSONB structure
  images JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Product information
  description TEXT NOT NULL,
  short_description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  care_instructions JSONB DEFAULT '[]'::jsonb,
  
  -- Product specifications stored as JSONB
  specifications JSONB DEFAULT '{}'::jsonb,
  
  -- Inventory and availability
  inventory JSONB NOT NULL DEFAULT '{
    "total_stock": 0,
    "reserved_stock": 0,
    "available_stock": 0,
    "low_stock_threshold": 5,
    "allow_backorder": false
  }'::jsonb,
  
  -- SEO data
  seo JSONB DEFAULT '{}'::jsonb,
  
  -- Product status and flags
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  featured BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  
  -- Stripe integration
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata for extensibility
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for enhanced products
CREATE INDEX idx_products_enhanced_category ON products_enhanced(category);
CREATE INDEX idx_products_enhanced_subcategory ON products_enhanced(subcategory);
CREATE INDEX idx_products_enhanced_status ON products_enhanced(status);
CREATE INDEX idx_products_enhanced_featured ON products_enhanced(featured);
CREATE INDEX idx_products_enhanced_trending ON products_enhanced(trending);
CREATE INDEX idx_products_enhanced_price ON products_enhanced(base_price);
CREATE INDEX idx_products_enhanced_slug ON products_enhanced(slug);
CREATE INDEX idx_products_enhanced_stripe_product ON products_enhanced(stripe_product_id);

-- Full-text search index
CREATE INDEX idx_products_enhanced_search ON products_enhanced 
USING gin(to_tsvector('english', name || ' ' || description || ' ' || COALESCE(short_description, '')));

-- JSONB indexes for better query performance
CREATE INDEX idx_products_enhanced_pricing_tiers ON products_enhanced USING gin(pricing_tiers);
CREATE INDEX idx_products_enhanced_images ON products_enhanced USING gin(images);
CREATE INDEX idx_products_enhanced_specifications ON products_enhanced USING gin(specifications);
CREATE INDEX idx_products_enhanced_inventory ON products_enhanced USING gin(inventory);

-- Product variants table (for size/color/style variants)
CREATE TABLE IF NOT EXISTS product_variants_enhanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products_enhanced(id) ON DELETE CASCADE,
  variant_type TEXT NOT NULL CHECK (variant_type IN ('size', 'color', 'style', 'material')),
  variant_name TEXT NOT NULL,
  variant_value TEXT NOT NULL,
  
  -- Variant-specific data
  sku TEXT,
  barcode TEXT,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  
  -- Inventory for this specific variant
  stock_count INTEGER DEFAULT 0,
  reserved_count INTEGER DEFAULT 0,
  available_count INTEGER GENERATED ALWAYS AS (stock_count - reserved_count) STORED,
  
  -- Variant metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combinations
  UNIQUE(product_id, variant_type, variant_value)
);

-- Indexes for variants
CREATE INDEX idx_product_variants_enhanced_product_id ON product_variants_enhanced(product_id);
CREATE INDEX idx_product_variants_enhanced_type ON product_variants_enhanced(variant_type);
CREATE INDEX idx_product_variants_enhanced_active ON product_variants_enhanced(active);
CREATE INDEX idx_product_variants_enhanced_stock ON product_variants_enhanced(available_count);

-- Product reviews table (for enhanced products)
CREATE TABLE IF NOT EXISTS product_reviews_enhanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products_enhanced(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  
  -- Review data
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT,
  
  -- Review metadata
  verified_purchase BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  
  -- Moderation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderated_by TEXT,
  moderated_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for reviews
CREATE INDEX idx_product_reviews_enhanced_product_id ON product_reviews_enhanced(product_id);
CREATE INDEX idx_product_reviews_enhanced_status ON product_reviews_enhanced(status);
CREATE INDEX idx_product_reviews_enhanced_rating ON product_reviews_enhanced(rating);

-- Product collections table (for grouping enhanced products)
CREATE TABLE IF NOT EXISTS product_collections_enhanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Collection metadata
  collection_type TEXT CHECK (collection_type IN ('seasonal', 'category', 'curated', 'promotional')),
  featured BOOLEAN DEFAULT false,
  
  -- Visual
  banner_image JSONB DEFAULT '{}'::jsonb,
  
  -- SEO
  seo JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for products in collections
CREATE TABLE IF NOT EXISTS collection_products_enhanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES product_collections_enhanced(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products_enhanced(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique product per collection
  UNIQUE(collection_id, product_id)
);

-- Indexes for collections
CREATE INDEX idx_product_collections_enhanced_slug ON product_collections_enhanced(slug);
CREATE INDEX idx_product_collections_enhanced_active ON product_collections_enhanced(active);
CREATE INDEX idx_collection_products_enhanced_collection ON collection_products_enhanced(collection_id);
CREATE INDEX idx_collection_products_enhanced_product ON collection_products_enhanced(product_id);

-- Enable Row Level Security
ALTER TABLE products_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products_enhanced ENABLE ROW LEVEL SECURITY;

-- Add updated_at triggers
CREATE TRIGGER update_products_enhanced_updated_at BEFORE UPDATE ON products_enhanced
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_enhanced_updated_at BEFORE UPDATE ON product_variants_enhanced
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_enhanced_updated_at BEFORE UPDATE ON product_reviews_enhanced
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_collections_enhanced_updated_at BEFORE UPDATE ON product_collections_enhanced
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper functions for JSONB operations

-- Function to calculate available stock from variants
CREATE OR REPLACE FUNCTION calculate_total_available_stock(product_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT SUM(available_count) 
     FROM product_variants_enhanced 
     WHERE product_id = product_uuid AND active = true),
    0
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get pricing tier by price
CREATE OR REPLACE FUNCTION get_pricing_tier_for_price(pricing_tiers_json JSONB, price DECIMAL)
RETURNS JSONB AS $$
DECLARE
  tier JSONB;
BEGIN
  FOR tier IN SELECT jsonb_array_elements(pricing_tiers_json)
  LOOP
    IF (tier->>'min')::DECIMAL <= price AND price <= (tier->>'max')::DECIMAL THEN
      RETURN tier;
    END IF;
  END LOOP;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Views for common queries

-- Enhanced products with calculated fields
CREATE OR REPLACE VIEW products_enhanced_with_stats AS
SELECT 
  p.*,
  calculate_total_available_stock(p.id) as total_available_stock,
  get_pricing_tier_for_price(p.pricing_tiers, p.base_price) as current_pricing_tier,
  (
    SELECT AVG(rating)::DECIMAL(3,2) 
    FROM product_reviews_enhanced 
    WHERE product_id = p.id AND status = 'approved'
  ) as average_rating,
  (
    SELECT COUNT(*) 
    FROM product_reviews_enhanced 
    WHERE product_id = p.id AND status = 'approved'
  ) as review_count,
  (
    SELECT COUNT(*) 
    FROM product_variants_enhanced 
    WHERE product_id = p.id AND active = true
  ) as variant_count
FROM products_enhanced p;

-- Popular enhanced products
CREATE OR REPLACE VIEW popular_products_enhanced AS
SELECT 
  p.id,
  p.name,
  p.slug,
  p.category,
  p.base_price,
  p.images,
  COUNT(o.id) as order_count,
  SUM(oi.quantity) as total_sold,
  AVG(pr.rating) as average_rating
FROM products_enhanced p
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'paid'
LEFT JOIN product_reviews_enhanced pr ON pr.product_id = p.id AND pr.status = 'approved'
WHERE p.status = 'active'
GROUP BY p.id, p.name, p.slug, p.category, p.base_price, p.images
ORDER BY total_sold DESC NULLS LAST;

-- Basic RLS policies (update based on your auth requirements)

-- Products: Anyone can view active products, authenticated users can view all
CREATE POLICY "Anyone can view active products" ON products_enhanced
  FOR SELECT USING (status = 'active');

-- Variants: Follow parent product visibility
CREATE POLICY "Anyone can view active product variants" ON product_variants_enhanced
  FOR SELECT USING (
    active = true AND 
    EXISTS (SELECT 1 FROM products_enhanced WHERE id = product_id AND status = 'active')
  );

-- Reviews: Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews" ON product_reviews_enhanced
  FOR SELECT USING (status = 'approved');

-- Collections: Anyone can view active collections
CREATE POLICY "Anyone can view active collections" ON product_collections_enhanced
  FOR SELECT USING (active = true);

-- Collection products: Anyone can view if collection is active
CREATE POLICY "Anyone can view active collection products" ON collection_products_enhanced
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM product_collections_enhanced WHERE id = collection_id AND active = true)
  );

-- Comments for documentation
COMMENT ON TABLE products_enhanced IS 'Enhanced products table with 20-tier pricing and JSONB images';
COMMENT ON COLUMN products_enhanced.base_price IS 'Base price used for checkout - actual selling price';
COMMENT ON COLUMN products_enhanced.pricing_tiers IS 'Array of pricing tiers for display/organization (1-20)';
COMMENT ON COLUMN products_enhanced.images IS 'JSONB structure containing all product images with CDN fallbacks';
COMMENT ON COLUMN products_enhanced.specifications IS 'Product specifications including materials, sizing, customization options';
COMMENT ON COLUMN products_enhanced.inventory IS 'Inventory data including stock counts and availability settings';