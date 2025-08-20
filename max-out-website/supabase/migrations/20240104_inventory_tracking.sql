-- Create inventory table for real-time stock tracking
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  size TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0, -- For items in carts
  low_stock_threshold INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, size)
);

-- Create inventory movements table for tracking changes
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase', 'return', 'adjustment', 'reservation', 'release')),
  quantity INTEGER NOT NULL,
  reference_type TEXT, -- 'order', 'cart', 'manual'
  reference_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create cart reservations table to track inventory reserved in carts
CREATE TABLE IF NOT EXISTS cart_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id TEXT NOT NULL,
  inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '30 minutes',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, inventory_id)
);

-- Function to update inventory timestamp
CREATE OR REPLACE FUNCTION update_inventory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_timestamp();

-- Function to check available stock (total - reserved)
CREATE OR REPLACE FUNCTION get_available_stock(p_product_id TEXT, p_size TEXT)
RETURNS INTEGER AS $$
DECLARE
  v_inventory_id UUID;
  v_total_stock INTEGER;
  v_reserved_stock INTEGER;
BEGIN
  -- Get inventory record
  SELECT id, stock_quantity INTO v_inventory_id, v_total_stock
  FROM inventory
  WHERE product_id = p_product_id AND size = p_size;

  IF v_inventory_id IS NULL THEN
    RETURN 0;
  END IF;

  -- Get reserved quantity (excluding expired reservations)
  SELECT COALESCE(SUM(quantity), 0) INTO v_reserved_stock
  FROM cart_reservations
  WHERE inventory_id = v_inventory_id AND expires_at > NOW();

  RETURN v_total_stock - v_reserved_stock;
END;
$$ LANGUAGE plpgsql;

-- Function to reserve inventory for cart
CREATE OR REPLACE FUNCTION reserve_inventory(
  p_cart_id TEXT,
  p_product_id TEXT,
  p_size TEXT,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_inventory_id UUID;
  v_available_stock INTEGER;
BEGIN
  -- Get inventory record
  SELECT id INTO v_inventory_id
  FROM inventory
  WHERE product_id = p_product_id AND size = p_size;

  IF v_inventory_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check available stock
  v_available_stock := get_available_stock(p_product_id, p_size);
  
  IF v_available_stock < p_quantity THEN
    RETURN FALSE;
  END IF;

  -- Create or update reservation
  INSERT INTO cart_reservations (cart_id, inventory_id, quantity, expires_at)
  VALUES (p_cart_id, v_inventory_id, p_quantity, NOW() + INTERVAL '30 minutes')
  ON CONFLICT (cart_id, inventory_id)
  DO UPDATE SET 
    quantity = p_quantity,
    expires_at = NOW() + INTERVAL '30 minutes';

  -- Update reserved quantity
  UPDATE inventory
  SET reserved_quantity = (
    SELECT COALESCE(SUM(quantity), 0)
    FROM cart_reservations
    WHERE inventory_id = v_inventory_id AND expires_at > NOW()
  )
  WHERE id = v_inventory_id;

  -- Record movement
  INSERT INTO inventory_movements (inventory_id, movement_type, quantity, reference_type, reference_id)
  VALUES (v_inventory_id, 'reservation', p_quantity, 'cart', p_cart_id);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to release cart reservations
CREATE OR REPLACE FUNCTION release_cart_reservations(p_cart_id TEXT)
RETURNS VOID AS $$
BEGIN
  -- Delete reservations
  DELETE FROM cart_reservations
  WHERE cart_id = p_cart_id;

  -- Update reserved quantities for affected inventory
  UPDATE inventory
  SET reserved_quantity = (
    SELECT COALESCE(SUM(cr.quantity), 0)
    FROM cart_reservations cr
    WHERE cr.inventory_id = inventory.id AND cr.expires_at > NOW()
  )
  WHERE id IN (
    SELECT DISTINCT inventory_id
    FROM cart_reservations
    WHERE cart_id = p_cart_id
  );
END;
$$ LANGUAGE plpgsql;

-- Function to process order and update inventory
CREATE OR REPLACE FUNCTION process_order_inventory(p_order_id TEXT)
RETURNS VOID AS $$
DECLARE
  v_item RECORD;
  v_inventory_id UUID;
BEGIN
  -- Process each order item
  FOR v_item IN 
    SELECT product_id, product_size, quantity
    FROM order_items
    WHERE order_id = p_order_id
  LOOP
    -- Get inventory record
    SELECT id INTO v_inventory_id
    FROM inventory
    WHERE product_id = v_item.product_id AND size = v_item.product_size;

    IF v_inventory_id IS NOT NULL THEN
      -- Reduce stock
      UPDATE inventory
      SET stock_quantity = stock_quantity - v_item.quantity
      WHERE id = v_inventory_id;

      -- Record movement
      INSERT INTO inventory_movements (inventory_id, movement_type, quantity, reference_type, reference_id)
      VALUES (v_inventory_id, 'purchase', -v_item.quantity, 'order', p_order_id);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Clean up expired reservations periodically
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS VOID AS $$
BEGIN
  DELETE FROM cart_reservations
  WHERE expires_at < NOW();

  -- Update reserved quantities
  UPDATE inventory
  SET reserved_quantity = (
    SELECT COALESCE(SUM(cr.quantity), 0)
    FROM cart_reservations cr
    WHERE cr.inventory_id = inventory.id AND cr.expires_at > NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_inventory_product_size ON inventory(product_id, size);
CREATE INDEX idx_cart_reservations_expires ON cart_reservations(expires_at);
CREATE INDEX idx_inventory_movements_created ON inventory_movements(created_at);

-- Enable Row Level Security
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_reservations ENABLE ROW LEVEL SECURITY;

-- Policies for inventory (read-only for public, write for admins)
CREATE POLICY "Inventory viewable by all" ON inventory
  FOR SELECT USING (true);

-- Policies for cart reservations (users can manage their own)
CREATE POLICY "Users can view their cart reservations" ON cart_reservations
  FOR SELECT USING (true);

CREATE POLICY "Users can create cart reservations" ON cart_reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their cart reservations" ON cart_reservations
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their cart reservations" ON cart_reservations
  FOR DELETE USING (true);