-- BITEUK POS & Werhos Database Schema with Intentional Backend Bugs
-- This schema is ACTUALLY USED (not mock)

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Create warehouse_stock table (intentionally non-relational)
CREATE TABLE IF NOT EXISTS warehouse_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  vendor_code text NOT NULL, -- NOT a foreign key - intentional design flaw
  quantity integer NOT NULL DEFAULT 0,
  last_updated timestamp DEFAULT now()
);

-- Create pos_transactions table
CREATE TABLE IF NOT EXISTS pos_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now(),
  total_price numeric NOT NULL,
  status text DEFAULT 'pending' -- pending, completed, failed
);

-- Create pos_transaction_items table
CREATE TABLE IF NOT EXISTS pos_transaction_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES pos_transactions(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  price numeric NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Create sync_logs table for catalog sync tracking
CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  status text NOT NULL, -- success, warning, error
  details text,
  vendor_code text,
  created_at timestamp DEFAULT now()
);

-- Insert comprehensive seed data (production-like after 1 week)
-- Total: 12 vendors, 80+ products, 500+ transactions

-- Safely add missing columns if tables already exist from initial schema
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();
ALTER TABLE warehouse_stock ADD COLUMN IF NOT EXISTS last_updated timestamp DEFAULT now();
ALTER TABLE pos_transactions ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE pos_transaction_items ADD COLUMN IF NOT EXISTS created_at timestamp DEFAULT now();

INSERT INTO vendors (code, name, is_active) VALUES
  -- Active suppliers
  ('VEN-001', 'TechSupplies Inc', true),
  ('VEN-002', 'OfficeComfort Ltd', true),
  ('VEN-003', 'GlobalImports Co', true),
  ('VEN-004', 'Premium Electronics', true),
  ('VEN-005', 'Budget Warehouse', true),
  ('VEN-006', 'EuroGoods Ltd', true),
  ('VEN-007', 'Asia Distribution', true),
  ('VEN-008', 'LocalManufacture', true),
  ('VEN-009', 'DirectImport', true),
  ('VEN-010', 'Quality Supplies', true),
  ('VEN-011', 'Express Logistics', true),
  -- Inactive supplier (for testing)
  ('VEN-012', 'Discontinued Partner', false)
ON CONFLICT DO NOTHING;

INSERT INTO products (sku, name, price, is_active) VALUES
  -- Furniture
  ('SKU-001', 'Ergonomic Office Chair', 199.99, true),
  ('SKU-002', 'Standing Desk Converter', 149.99, true),
  ('SKU-003', 'L-Shaped Desk', 349.99, true),
  ('SKU-004', 'Mesh Task Chair', 89.99, true),
  ('SKU-005', 'Conference Table', 499.99, true),
  ('SKU-006', 'Filing Cabinet', 129.99, true),
  ('SKU-007', 'Bookshelf Unit', 79.99, true),
  -- Electronics
  ('SKU-008', 'USB-C Hub', 49.99, true),
  ('SKU-009', 'Wireless Mouse', 29.99, true),
  ('SKU-010', 'Mechanical Keyboard', 89.99, true),
  ('SKU-011', 'Monitor Arm', 59.99, true),
  ('SKU-012', 'Webcam HD', 69.99, true),
  ('SKU-013', 'External SSD 1TB', 119.99, true),
  ('SKU-014', 'Laptop Dock', 139.99, true),
  ('SKU-015', 'USB-A Hub', 39.99, true),
  -- Lighting
  ('SKU-016', 'LED Desk Lamp', 45.50, true),
  ('SKU-017', 'Monitor Light Bar', 99.99, true),
  ('SKU-018', 'RGB Ambient Light', 35.99, true),
  ('SKU-019', 'Task Lamp Adjustable', 55.99, true),
  ('SKU-020', 'Natural Light Lamp', 75.99, true),
  -- Storage & Organization
  ('SKU-021', 'Laptop Stand Metal', 79.99, true),
  ('SKU-022', 'Monitor Stand Riser', 34.99, true),
  ('SKU-023', 'Desk Organizer Set', 24.99, true),
  ('SKU-024', 'Cable Management Kit', 19.99, true),
  ('SKU-025', 'Drawer Dividers', 15.99, true),
  ('SKU-026', 'Vertical File Holder', 29.99, true),
  -- Audio
  ('SKU-027', 'Desk Speaker Pair', 89.99, true),
  ('SKU-028', 'Noise Cancelling Headphones', 199.99, true),
  ('SKU-029', 'USB Microphone', 79.99, true),
  ('SKU-030', 'Desktop Speaker', 49.99, true),
  -- Accessories
  ('SKU-031', 'Mouse Pad Large', 19.99, true),
  ('SKU-032', 'Keyboard Wrist Rest', 24.99, true),
  ('SKU-033', 'Monitor Privacy Filter', 39.99, true),
  ('SKU-034', 'Anti-Fatigue Mat', 79.99, true),
  ('SKU-035', 'Desk Pad', 29.99, true),
  -- Network
  ('SKU-036', 'Ethernet Cable 10m', 14.99, true),
  ('SKU-037', 'WiFi Extender', 59.99, true),
  ('SKU-038', 'Network Switch 8-Port', 89.99, true),
  ('SKU-039', 'USB Ethernet Adapter', 19.99, true),
  ('SKU-040', 'HDMI Cable 2m', 12.99, true),
  -- Power Management
  ('SKU-041', 'Power Strip 6-Outlet', 24.99, true),
  ('SKU-042', 'USB Power Strip', 39.99, true),
  ('SKU-043', 'Wireless Charger', 44.99, true),
  ('SKU-044', 'Multi-Device Charger', 79.99, true),
  ('SKU-045', 'Power Bank 20000mAh', 34.99, true),
  -- Monitors
  ('SKU-046', '24 inch Monitor IPS', 199.99, true),
  ('SKU-047', '27 inch Monitor 4K', 349.99, true),
  ('SKU-048', '32 inch Ultrawide', 449.99, true),
  ('SKU-049', 'Portable Monitor 15.6', 249.99, true),
  ('SKU-050', 'Touch Display 24inch', 399.99, true),
  -- Printing
  ('SKU-051', 'Laser Printer Mono', 199.99, true),
  ('SKU-052', 'Color Inkjet Printer', 149.99, true),
  ('SKU-053', 'Label Printer', 129.99, true),
  ('SKU-054', 'Thermal Printer', 179.99, true),
  -- Scanners
  ('SKU-055', 'Document Scanner', 129.99, true),
  ('SKU-056', 'Portable Scanner', 99.99, true),
  -- Shredders
  ('SKU-057', 'Paper Shredder', 89.99, true),
  ('SKU-058', 'Cross-Cut Shredder', 149.99, true),
  -- Software & Licenses
  ('SKU-059', 'Office Suite License', 69.99, true),
  ('SKU-060', 'Antivirus Annual', 49.99, true),
  -- Miscellaneous
  ('SKU-061', 'Document Holder', 14.99, true),
  ('SKU-062', 'Desk Shelf Floating', 44.99, true),
  ('SKU-063', 'Task Light Clip', 19.99, true),
  ('SKU-064', 'Monitor Screen Filter', 34.99, true),
  ('SKU-065', 'Laptop Sleeve 15inch', 24.99, true),
  ('SKU-066', 'USB Extension Cable', 9.99, true),
  ('SKU-067', 'Screen Cleaner Kit', 14.99, true),
  ('SKU-068', 'Desk Organizer Drawer', 39.99, true),
  ('SKU-069', 'Cable Clips Pack', 8.99, true),
  ('SKU-070', 'Desk Fan', 34.99, true)
ON CONFLICT DO NOTHING;

-- Insert warehouse stock (distribute across vendors)
INSERT INTO warehouse_stock (product_id, vendor_code, quantity) VALUES
  -- TechSupplies Inc (VEN-001)
  ((SELECT id FROM products WHERE sku = 'SKU-008'), 'VEN-001', 150),
  ((SELECT id FROM products WHERE sku = 'SKU-009'), 'VEN-001', 320),
  ((SELECT id FROM products WHERE sku = 'SKU-010'), 'VEN-001', 85),
  ((SELECT id FROM products WHERE sku = 'SKU-011'), 'VEN-001', 120),
  ((SELECT id FROM products WHERE sku = 'SKU-012'), 'VEN-001', 45),
  ((SELECT id FROM products WHERE sku = 'SKU-013'), 'VEN-001', 38),
  -- OfficeComfort Ltd (VEN-002 - lowercase for bug testing)
  ((SELECT id FROM products WHERE sku = 'SKU-001'), 'ven-002', 95),
  ((SELECT id FROM products WHERE sku = 'SKU-002'), 'ven-002', 67),
  ((SELECT id FROM products WHERE sku = 'SKU-003'), 'ven-002', 22),
  ((SELECT id FROM products WHERE sku = 'SKU-004'), 'ven-002', 143),
  -- GlobalImports Co (VEN-003)
  ((SELECT id FROM products WHERE sku = 'SKU-014'), 'VEN-003', 55),
  ((SELECT id FROM products WHERE sku = 'SKU-015'), 'VEN-003', 200),
  ((SELECT id FROM products WHERE sku = 'SKU-016'), 'VEN-003', 180),
  ((SELECT id FROM products WHERE sku = 'SKU-017'), 'VEN-003', 42),
  -- Premium Electronics (VEN-004)
  ((SELECT id FROM products WHERE sku = 'SKU-027'), 'VEN-004', 78),
  ((SELECT id FROM products WHERE sku = 'SKU-028'), 'VEN-004', 28),
  ((SELECT id FROM products WHERE sku = 'SKU-029'), 'VEN-004', 91),
  -- Budget Warehouse (VEN-005)
  ((SELECT id FROM products WHERE sku = 'SKU-031'), 'VEN-005', 500),
  ((SELECT id FROM products WHERE sku = 'SKU-032'), 'VEN-005', 380),
  ((SELECT id FROM products WHERE sku = 'SKU-033'), 'VEN-005', 220),
  ((SELECT id FROM products WHERE sku = 'SKU-034'), 'VEN-005', 110),
  -- EuroGoods Ltd (VEN-006)
  ((SELECT id FROM products WHERE sku = 'SKU-046'), 'VEN-006', 35),
  ((SELECT id FROM products WHERE sku = 'SKU-047'), 'VEN-006', 18),
  ((SELECT id FROM products WHERE sku = 'SKU-048'), 'VEN-006', 12),
  -- Asia Distribution (VEN-007)
  ((SELECT id FROM products WHERE sku = 'SKU-036'), 'VEN-007', 800),
  ((SELECT id FROM products WHERE sku = 'SKU-037'), 'VEN-007', 95),
  ((SELECT id FROM products WHERE sku = 'SKU-038'), 'VEN-007', 42),
  ((SELECT id FROM products WHERE sku = 'SKU-039'), 'VEN-007', 310),
  -- LocalManufacture (VEN-008)
  ((SELECT id FROM products WHERE sku = 'SKU-051'), 'VEN-008', 15),
  ((SELECT id FROM products WHERE sku = 'SKU-052'), 'VEN-008', 22),
  ((SELECT id FROM products WHERE sku = 'SKU-053'), 'VEN-008', 8),
  -- DirectImport (VEN-009)
  ((SELECT id FROM products WHERE sku = 'SKU-041'), 'VEN-009', 210),
  ((SELECT id FROM products WHERE sku = 'SKU-042'), 'VEN-009', 145),
  ((SELECT id FROM products WHERE sku = 'SKU-043'), 'VEN-009', 75),
  ((SELECT id FROM products WHERE sku = 'SKU-044'), 'VEN-009', 38),
  -- Quality Supplies (VEN-010)
  ((SELECT id FROM products WHERE sku = 'SKU-018'), 'VEN-010', 105),
  ((SELECT id FROM products WHERE sku = 'SKU-019'), 'VEN-010', 82),
  ((SELECT id FROM products WHERE sku = 'SKU-020'), 'VEN-010', 55),
  -- Express Logistics (VEN-011)
  ((SELECT id FROM products WHERE sku = 'SKU-061'), 'VEN-011', 340),
  ((SELECT id FROM products WHERE sku = 'SKU-062'), 'VEN-011', 128),
  ((SELECT id FROM products WHERE sku = 'SKU-063'), 'VEN-011', 265),
  -- Discontinued Partner (VEN-012 - inactive)
  ((SELECT id FROM products WHERE sku = 'SKU-050'), 'VEN-012', 250)
ON CONFLICT DO NOTHING;

-- Insert realistic transaction history (1 week of operations, ~500 transactions)
DO $$
DECLARE
  v_start_date timestamp := now() - interval '7 days';
  v_date timestamp;
  v_transaction_id uuid;
  v_total numeric;
  v_products uuid[];
  v_quantities integer[];
  v_prices numeric[];
  v_item_count integer;
  i integer;
  v_random_sku text;
  v_random_qty integer;
  v_product_id uuid;
  v_price numeric;
BEGIN
  -- Create 400+ transactions over the past 7 days
  FOR i IN 1..420 LOOP
    -- Random date within past week, with more transactions during business hours
    v_date := v_start_date + (random() * interval '7 days');
    
    -- Reset arrays
    v_products := ARRAY[]::uuid[];
    v_quantities := ARRAY[]::integer[];
    v_prices := ARRAY[]::numeric[];
    v_total := 0;
    
    -- Random number of items per transaction (1-5)
    v_item_count := floor(random() * 4 + 1)::integer;
    
    FOR j IN 1..v_item_count LOOP
      -- Pick random product
      SELECT id, price INTO v_product_id, v_price FROM products 
      WHERE is_active = true 
      ORDER BY random() LIMIT 1;
      
      v_random_qty := floor(random() * 10 + 1)::integer;
      
      v_products := array_append(v_products, v_product_id);
      v_quantities := array_append(v_quantities, v_random_qty);
      v_prices := array_append(v_prices, v_price);
      
      v_total := v_total + (v_price * v_random_qty);
    END LOOP;
    
    -- Insert transaction
    INSERT INTO pos_transactions (created_at, total_price, status)
    VALUES (v_date, v_total, CASE WHEN random() > 0.95 THEN 'failed' WHEN random() > 0.10 THEN 'completed' ELSE 'pending' END)
    RETURNING id INTO v_transaction_id;
    
    -- Insert transaction items
    FOR j IN 1..array_length(v_products, 1) LOOP
      INSERT INTO pos_transaction_items (transaction_id, product_id, quantity, price, created_at)
      VALUES (v_transaction_id, v_products[j], v_quantities[j], v_prices[j], v_date);
    END LOOP;
  END LOOP;
END $$;

-- Insert sync log history
DO $$
DECLARE
  v_start_date timestamp := now() - interval '7 days';
  v_date timestamp;
  v_sync_count integer := 1;
  i integer;
BEGIN
  -- Create 28 sync operations (4 per day for a week)
  FOR i IN 1..28 LOOP
    v_date := v_start_date + (random() * interval '7 days');
    
    -- Insert sync start log
    INSERT INTO sync_logs (created_at, status, details)
    VALUES (v_date, 'sync_start', 'Catalog synchronization initiated');
    
    -- Insert per-product sync logs (simulate 70 successful, 10-15 failed)
    INSERT INTO sync_logs (product_id, created_at, status, details, vendor_code)
    SELECT p.id, v_date, 'success', 'Product synced', 'VEN-001'
    FROM (SELECT * FROM products WHERE is_active = true ORDER BY random() LIMIT 70) p;
    
    INSERT INTO sync_logs (product_id, created_at, status, details, vendor_code)
    SELECT p.id, v_date, 'warning', 'Stock mismatch detected', 'ven-002'
    FROM (SELECT * FROM products WHERE is_active = true ORDER BY random() LIMIT 12) p;
  END LOOP;
END $$;

-- ============================================
-- ============================================

-- Function: get_products_with_stock
-- Issue: Returns NULL for vendor_name, frontend expects it populated
CREATE OR REPLACE FUNCTION get_products_with_stock()
RETURNS TABLE (
  product_id uuid,
  sku text,
  name text,
  price numeric,
  total_stock integer,
  vendor_code text,
  vendor_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.sku,
    p.name,
    p.price,
    COALESCE(SUM(ws.quantity), 0)::integer,
    MAX(ws.vendor_code),
  FROM products p
  LEFT JOIN warehouse_stock ws ON p.id = ws.product_id
  GROUP BY p.id, p.sku, p.name, p.price
  ORDER BY p.sku;
END;
$$ LANGUAGE plpgsql;

-- Function: create_pos_transaction  
-- Issue: Accepts stock from inactive vendors without error
CREATE OR REPLACE FUNCTION create_pos_transaction(
  p_items jsonb
)
RETURNS TABLE (
  transaction_id uuid,
  success boolean,
  message text,
  total_price numeric
) AS $$
DECLARE
  v_transaction_id uuid;
  v_total numeric := 0;
  v_item jsonb;
  v_product_id uuid;
  v_quantity integer;
  v_price numeric;
BEGIN
  INSERT INTO pos_transactions (total_price, status) 
  VALUES (0, 'pending') 
  RETURNING id INTO v_transaction_id;

  FOR v_item IN SELECT jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;
    v_price := (v_item->>'price')::numeric;
    
    INSERT INTO pos_transaction_items (transaction_id, product_id, quantity, price)
    VALUES (v_transaction_id, v_product_id, v_quantity, v_price);

    v_total := v_total + (v_price * v_quantity);

    -- Update stock (simple FIFO or arbitrary vendor selection for now)
    -- We pick the stock entry with the most quantity to avoid negative stock issues if possible
    UPDATE warehouse_stock
    SET quantity = quantity - v_quantity
    WHERE id = (
      SELECT id FROM warehouse_stock 
      WHERE product_id = v_product_id 
      ORDER BY quantity DESC 
      LIMIT 1
    );
  END LOOP;

  UPDATE pos_transactions SET total_price = v_total WHERE id = v_transaction_id;

  RETURN QUERY SELECT v_transaction_id, true::boolean, 'Transaction created'::text, v_total;
END;
$$ LANGUAGE plpgsql;

-- Function: sync_product_catalog
-- Issue: Silently skips products, returns success anyway
CREATE OR REPLACE FUNCTION sync_product_catalog()
RETURNS TABLE (
  sync_id uuid,
  total_products integer,
  synced_products integer,
  failed_products integer,
  status text
) AS $$
DECLARE
  v_total integer;
  v_synced integer := 0;
  v_failed integer := 0;
  v_product record;
  v_vendor_exists boolean;
  v_sync_id uuid;
BEGIN
  INSERT INTO sync_logs (status, details) 
  VALUES ('sync_start', 'Sync initiated')
  RETURNING id INTO v_sync_id;

  SELECT COUNT(*) INTO v_total FROM products WHERE is_active = true;

  FOR v_product IN SELECT id, sku FROM products WHERE is_active = true
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM vendors 
      WHERE code = (SELECT vendor_code FROM warehouse_stock WHERE product_id = v_product.id LIMIT 1)
      AND is_active = true
    ) INTO v_vendor_exists;

    IF v_vendor_exists THEN
      v_synced := v_synced + 1;
    ELSE
      v_failed := v_failed + 1;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_sync_id, v_total, v_synced, v_failed, 'success'::text;
END;
$$ LANGUAGE plpgsql;
