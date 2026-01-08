import { supabase } from "~/lib/supabase";

export interface Stock {
  id: string;
  product_id: string;
  vendor_code: string;
  quantity: number;
  last_updated: string;
}

export async function fetchWarehouseStock(): Promise<Stock[]> {
  const { data, error } = await supabase.from("warehouse_stock").select("*");

  if (error) {
    console.error("Error fetching stock:", error);
    throw new Error(`Failed to fetch stock: ${error.message}`);
  }

  return (data || []) as Stock[];
}

export async function fetchProductStock(productId: string): Promise<Stock[]> {
  const { data, error } = await supabase
    .from("warehouse_stock")
    .select("*")
    .eq("product_id", productId);

  if (error) {
    console.error("Error fetching product stock:", error);
    throw new Error(`Failed to fetch product stock: ${error.message}`);
  }

  return (data || []) as Stock[];
}

export async function fetchStockByVendor(vendorCode: string): Promise<Stock[]> {
  const { data, error } = await supabase
    .from("warehouse_stock")
    .select("*")
    .eq("vendor_code", vendorCode);

  if (error) {
    console.error("Error fetching vendor stock:", error);
    return [];
  }

  return (data || []) as Stock[];
}

export async function updateStockQuantity(stockId: string, newQuantity: number): Promise<boolean> {
  const { error } = await supabase
    .from("warehouse_stock")
    .update({ quantity: newQuantity, last_updated: new Date().toISOString() })
    .eq("id", stockId);

  if (error) {
    console.error("Error updating stock:", error);
    return false;
  }

  return true;
}
