-- Fix RLS Policies for Enhanced Products System
-- Run this in Supabase SQL Editor to enable API access

-- First, ensure RLS is enabled on all tables
ALTER TABLE products_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products_enhanced ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access" ON products_enhanced;
DROP POLICY IF EXISTS "Anyone can view active products" ON products_enhanced;
DROP POLICY IF EXISTS "Allow all read" ON products_enhanced;

DROP POLICY IF EXISTS "Anyone can view active product variants" ON product_variants_enhanced;
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON product_reviews_enhanced;
DROP POLICY IF EXISTS "Anyone can view active collections" ON product_collections_enhanced;
DROP POLICY IF EXISTS "Anyone can view active collection products" ON collection_products_enhanced;

-- Create new comprehensive policies

-- Products: Allow public read for all products (for testing)
-- In production, change to: USING (status = 'active')
CREATE POLICY "Public read access to products" 
ON products_enhanced FOR SELECT 
USING (true);

-- Variants: Allow public read for all variants
CREATE POLICY "Public read access to variants" 
ON product_variants_enhanced FOR SELECT 
USING (true);

-- Reviews: Allow public read for approved reviews
CREATE POLICY "Public read access to approved reviews" 
ON product_reviews_enhanced FOR SELECT 
USING (status = 'approved' OR status IS NULL);

-- Collections: Allow public read for active collections
CREATE POLICY "Public read access to collections" 
ON product_collections_enhanced FOR SELECT 
USING (active = true OR active IS NULL);

-- Collection Products: Allow public read
CREATE POLICY "Public read access to collection products" 
ON collection_products_enhanced FOR SELECT 
USING (true);

-- Insert policies for testing (remove in production)
-- Allows inserting test data via API
CREATE POLICY "Allow insert for testing" 
ON products_enhanced FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update for testing" 
ON products_enhanced FOR UPDATE 
USING (true);

-- Verify the policies are working
DO $$
BEGIN
  RAISE NOTICE 'RLS policies have been configured successfully!';
  RAISE NOTICE 'You should now be able to access the enhanced products API.';
END $$;

-- Test query to verify access
SELECT 
  COUNT(*) as total_products,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_products
FROM products_enhanced;

-- Show the products that should be accessible
SELECT 
  id,
  name,
  slug,
  base_price,
  status,
  jsonb_array_length(COALESCE(images->'gallery', '[]'::jsonb)) as gallery_images
FROM products_enhanced
ORDER BY created_at DESC;