-- Create customers table
CREATE TABLE customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone_number text,
  email text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed customers
INSERT INTO customers (name, phone_number, email) VALUES
('John Doe', '555-0101', 'john@example.com'),
('Jane Smith', '555-0102', 'jane@example.com'),
('Bob Johnson', '555-0103', 'bob@example.com'),
('Alice Brown', '555-0104', 'alice@example.com'),
('Charlie Wilson', '555-0105', 'charlie@example.com'),
('Budi Santoso', '555-0106', 'budi@example.com');

-- RPC: get_customers (Bug 16: Returns all, implying no filter for "deleted" if we had soft delete, 
-- but let's make it simpler: It returns phone_number as snake_case, frontend expects camelCase for Bug 15)
CREATE OR REPLACE FUNCTION get_customers()
RETURNS TABLE (
  id uuid,
  name text,
  phone_number text,
  email text,
  is_active boolean
) LANGUAGE sql AS $$
  SELECT id, name, phone_number, email, is_active FROM customers ORDER BY created_at DESC;
$$;

-- RPC: update_user_profile (Bug 18: Expects p_email, frontend sends email)
-- Also we need a 'profiles' table or just mock it. Let's add a 'user_settings' table.
CREATE TABLE user_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL, -- Simulated user ID
  full_name text,
  email text,
  role text DEFAULT 'cashier'
);

INSERT INTO user_settings (user_id, full_name, email, role) 
VALUES ('current-user', 'Demo User', 'demo@biteuk.com', 'manager');

CREATE OR REPLACE FUNCTION update_user_profile(
  p_user_id text,
  p_full_name text,
  p_email text -- Frontend might send 'email' in body, but RPC args must match order or name
)
RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
  UPDATE user_settings 
  SET 
    full_name = COALESCE(p_full_name, full_name),
    email = COALESCE(p_email, email) -- If frontend sends undefined/null for p_email, it won't update or will set to null
  WHERE user_id = p_user_id;
  RETURN FOUND;
END;
$$;

-- RPC: get_dashboard_stats (Bug 20: Aggregation Error)
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_revenue numeric,
  total_transactions integer,
  top_product text
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY SELECT 
    COALESCE(SUM(price), 0)::numeric as total_revenue,
    COUNT(DISTINCT transaction_id)::integer as total_transactions,
    (SELECT name FROM products LIMIT 1) as top_product -- Mock top product
  FROM pos_transaction_items;
END;
$$;
