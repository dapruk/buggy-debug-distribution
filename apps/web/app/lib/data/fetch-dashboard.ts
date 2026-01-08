import { supabase } from "~/lib/supabase";

export async function fetchDashboardStats() {
  const { data, error } = await supabase.rpc("get_dashboard_stats");
  if (error) throw error;

  return data?.[0] || { total_revenue: 0, total_transactions: 0, top_product: "N/A" };
}
