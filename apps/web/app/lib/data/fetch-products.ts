import { supabase } from "~/lib/supabase";

export interface Product {
  product_id: string;
  sku: string;
  name: string;
  price: number;
  total_stock: number;
  vendor_code: string;
  vendor_name: string | null;
}

export async function fetchProductsWithStock(): Promise<Product[]> {
  const { data, error } = await supabase.rpc("get_products_with_stock");

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  return (data || []) as Product[];
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  const products = await fetchProductsWithStock();
  return products.find((p) => p.product_id === productId) || null;
}

export async function fetchProductsByVendor(vendorCode: string): Promise<Product[]> {
  const products = await fetchProductsWithStock();
  return products.filter((p) => p.vendor_code === vendorCode);
}
