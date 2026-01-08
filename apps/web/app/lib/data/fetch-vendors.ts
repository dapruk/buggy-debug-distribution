import { supabase } from "~/lib/supabase";

export interface Vendor {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
}

export async function fetchVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase.from("vendors").select("*");

  if (error) {
    console.error("Error fetching vendors:", error);
    throw new Error(`Failed to fetch vendors: ${error.message}`);
  }

  return (data || []) as Vendor[];
}

export async function fetchActiveVendors(): Promise<Vendor[]> {
  const vendors = await fetchVendors();
  return vendors.filter((v) => v.is_active);
}

export async function fetchVendorByCode(code: string): Promise<Vendor | null> {
  const { data, error } = await supabase.from("vendors").select("*").eq("code", code).single();

  if (error) {
    return null;
  }

  return data as Vendor;
}
