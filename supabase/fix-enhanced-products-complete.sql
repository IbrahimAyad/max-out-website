-- COMPLETE FIX FOR ENHANCED PRODUCTS TABLE
-- This fixes both the permission issues AND the schema mismatch
-- Run this in Supabase SQL Editor

-- =========================================
-- PART 1: FIX SCHEMA MISMATCH
-- =========================================

-- The admin created 'handle' but our code expects 'slug'
-- Check if we have handle column and need to rename it
DO $$ 
BEGIN
  -- If 'handle' exists but 'slug' doesn't, rename handle to slug
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products_enhanced' AND column_name = 'handle'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products_enhanced' AND column_name = 'slug'
  ) THEN
    ALTER TABLE products_enhanced RENAME COLUMN handle TO slug;
    RAISE NOTICE 'Renamed handle column to slug';
  
  -- If neither exists, add slug column
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products_enhanced' AND column_name = 'slug'
  ) THEN
    ALTER TABLE products_enhanced ADD COLUMN slug TEXT;
    -- Generate slugs from names for existing products
    UPDATE products_enhanced 
    SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
    WHERE slug IS NULL;
    -- Make it unique and not null
    ALTER TABLE products_enhanced ALTER COLUMN slug SET NOT NULL;
    ALTER TABLE products_enhanced ADD CONSTRAINT products_enhanced_slug_unique UNIQUE (slug);
    RAISE NOTICE 'Added slug column and populated with generated values';
  
  ELSE
    RAISE NOTICE 'Slug column already exists';
  END IF;
END $$;

-- Create index on slug if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_products_enhanced_slug ON products_enhanced(slug);

-- =========================================
-- PART 2: FIX BASE PERMISSIONS
-- =========================================

-- Grant basic permissions to the anon role (this is what Supabase uses for public access)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON products_enhanced TO anon;
GRANT SELECT ON product_variants_enhanced TO anon;
GRANT SELECT ON product_reviews_enhanced TO anon;
GRANT SELECT ON product_collections_enhanced TO anon;
GRANT SELECT ON collection_products_enhanced TO anon;

-- Also grant to authenticated role for logged-in users
GRANT SELECT ON products_enhanced TO authenticated;
GRANT SELECT ON product_variants_enhanced TO authenticated;
GRANT SELECT ON product_reviews_enhanced TO authenticated;
GRANT SELECT ON product_collections_enhanced TO authenticated;
GRANT SELECT ON collection_products_enhanced TO authenticated;

-- For testing, also allow INSERT and UPDATE (remove in production)
GRANT INSERT, UPDATE ON products_enhanced TO anon;
GRANT INSERT, UPDATE ON products_enhanced TO authenticated;

-- =========================================
-- PART 3: FIX ROW LEVEL SECURITY
-- =========================================

-- Enable RLS on all tables
ALTER TABLE products_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products_enhanced ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Allow public read" ON products_enhanced;
DROP POLICY IF EXISTS "Public read access to products" ON products_enhanced;
DROP POLICY IF EXISTS "Allow insert for testing" ON products_enhanced;
DROP POLICY IF EXISTS "Allow update for testing" ON products_enhanced;

-- Create new comprehensive policies for products_enhanced
CREATE POLICY "Enable read access for all users" 
ON products_enhanced FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for all users (testing)" 
ON products_enhanced FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for all users (testing)" 
ON products_enhanced FOR UPDATE 
USING (true);

-- Policies for related tables
CREATE POLICY "Enable read access for all users" 
ON product_variants_enhanced FOR SELECT 
USING (true);

CREATE POLICY "Enable read access for all users" 
ON product_reviews_enhanced FOR SELECT 
USING (true);

CREATE POLICY "Enable read access for all users" 
ON product_collections_enhanced FOR SELECT 
USING (true);

CREATE POLICY "Enable read access for all users" 
ON collection_products_enhanced FOR SELECT 
USING (true);

-- =========================================
-- PART 4: CHECK OTHER EXPECTED COLUMNS
-- =========================================

-- Ensure all expected columns exist with proper types
-- Add any missing columns that the code expects

-- Check for base_price (might be called price in admin's table)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products_enhanced' AND column_name = 'base_price'
  ) THEN
    -- Check if there's a 'price' column to rename
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'products_enhanced' AND column_name = 'price'
    ) THEN
      ALTER TABLE products_enhanced RENAME COLUMN price TO base_price;
      RAISE NOTICE 'Renamed price column to base_price';
    ELSE
      ALTER TABLE products_enhanced ADD COLUMN base_price DECIMAL(10,2) DEFAULT 0;
      RAISE NOTICE 'Added base_price column';
    END IF;
  END IF;
END $$;

-- Check for status column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products_enhanced' AND column_name = 'status'
  ) THEN
    ALTER TABLE products_enhanced ADD COLUMN status TEXT DEFAULT 'active';
    RAISE NOTICE 'Added status column';
  END IF;
END $$;

-- Check for images JSONB column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products_enhanced' AND column_name = 'images'
  ) THEN
    ALTER TABLE products_enhanced ADD COLUMN images JSONB DEFAULT '{}'::jsonb;
    RAISE NOTICE 'Added images JSONB column';
  END IF;
END $$;

-- Check for inventory JSONB column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products_enhanced' AND column_name = 'inventory'
  ) THEN
    ALTER TABLE products_enhanced ADD COLUMN inventory JSONB DEFAULT '{
      "total_stock": 0,
      "reserved_stock": 0,
      "available_stock": 0,
      "low_stock_threshold": 5,
      "allow_backorder": false
    }'::jsonb;
    RAISE NOTICE 'Added inventory JSONB column';
  END IF;
END $$;

-- Check for pricing_tiers JSONB column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products_enhanced' AND column_name = 'pricing_tiers'
  ) THEN
    ALTER TABLE products_enhanced ADD COLUMN pricing_tiers JSONB DEFAULT '[]'::jsonb;
    RAISE NOTICE 'Added pricing_tiers JSONB column';
  END IF;
END $$;

-- =========================================
-- PART 5: ADD COMPUTED COLUMN FOR STOCK
-- =========================================

-- Add total_available_stock as a generated column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products_enhanced' AND column_name = 'total_available_stock'
  ) THEN
    ALTER TABLE products_enhanced 
    ADD COLUMN total_available_stock INTEGER 
    GENERATED ALWAYS AS (
      COALESCE((inventory->>'available_stock')::INTEGER, 0)
    ) STORED;
    RAISE NOTICE 'Added total_available_stock computed column';
  END IF;
END $$;

-- =========================================
-- PART 6: VERIFICATION QUERIES
-- =========================================

-- Test that everything works
DO $$
DECLARE
  product_count INTEGER;
  can_select BOOLEAN;
BEGIN
  -- Test SELECT permission
  BEGIN
    SELECT COUNT(*) INTO product_count FROM products_enhanced;
    can_select := true;
    RAISE NOTICE 'SUCCESS: Can SELECT from products_enhanced. Found % products', product_count;
  EXCEPTION
    WHEN OTHERS THEN
      can_select := false;
      RAISE NOTICE 'ERROR: Cannot SELECT from products_enhanced: %', SQLERRM;
  END;
  
  -- List columns to verify schema
  RAISE NOTICE 'Columns in products_enhanced:';
  FOR r IN 
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'products_enhanced'
    ORDER BY ordinal_position
  LOOP
    RAISE NOTICE '  - %: %', r.column_name, r.data_type;
  END LOOP;
END $$;

-- Final verification query - this should work if everything is fixed
SELECT 
  'Schema and permissions fixed successfully!' as message,
  COUNT(*) as total_products,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_products
FROM products_enhanced;

-- Show sample product to verify structure
SELECT 
  id,
  name,
  slug,  -- This should now exist
  COALESCE(base_price, 0) as base_price,
  status,
  COALESCE(jsonb_array_length(COALESCE(images->'gallery', '[]'::jsonb)), 0) as gallery_images
FROM products_enhanced
LIMIT 3;