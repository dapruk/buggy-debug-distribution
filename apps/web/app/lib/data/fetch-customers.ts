import { supabase } from "~/lib/supabase";

export async function fetchCustomers() {
  const { data, error } = await supabase.rpc("get_customers");

  if (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }

  return data as any[];
}
