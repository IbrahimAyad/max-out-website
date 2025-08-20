-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  shipping_address JSONB,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Product options table (for caching Stripe product data)
CREATE TABLE IF NOT EXISTS product_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_product_id TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  available_colors JSONB DEFAULT '[]'::jsonb,
  available_sizes JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer requests table
CREATE TABLE IF NOT EXISTS customer_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  name TEXT,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('sizing_help', 'custom_order', 'general', 'wedding', 'bulk_order')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for customer requests
CREATE INDEX idx_customer_requests_email ON customer_requests(email);
CREATE INDEX idx_customer_requests_status ON customer_requests(status);
CREATE INDEX idx_customer_requests_type ON customer_requests(type);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_requests ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_options_updated_at BEFORE UPDATE ON product_options
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for order analytics
CREATE OR REPLACE VIEW order_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as order_date,
  COUNT(*) as order_count,
  SUM(total) as daily_revenue,
  AVG(total) as average_order_value,
  COUNT(DISTINCT customer_email) as unique_customers
FROM orders
WHERE status = 'paid'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY order_date DESC;

-- Create view for popular products
CREATE OR REPLACE VIEW popular_products AS
SELECT 
  item->>'productName' as product_name,
  item->>'color' as color,
  item->>'size' as size,
  COUNT(*) as order_count,
  SUM((item->>'quantity')::int) as total_quantity
FROM orders, jsonb_array_elements(items) as item
WHERE status = 'paid'
GROUP BY 1, 2, 3
ORDER BY total_quantity DESC;

-- Policies (adjust based on your auth setup)
-- For now, we'll create basic policies that can be updated later

-- Orders: Only authenticated users can read their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (true); -- Update this based on your auth

-- Product options: Everyone can read
CREATE POLICY "Anyone can view product options" ON product_options
  FOR SELECT USING (true);

-- Customer requests: Users can create and view their own
CREATE POLICY "Anyone can create customer requests" ON customer_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own requests" ON customer_requests
  FOR SELECT USING (true); -- Update this based on your auth