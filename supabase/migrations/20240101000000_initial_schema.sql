
create table vendors (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text,
  is_active boolean default true
);


create table products (
  id uuid primary key default gen_random_uuid(),
  sku text,
  name text,
  price numeric,
  is_active boolean default true
);


create table warehouse_stock (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  vendor_code text, 
  quantity integer default 0
);


create table pos_transactions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  total_price numeric
);


create table pos_transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references pos_transactions(id),
  product_id uuid references products(id),
  quantity integer,
  price numeric
);
