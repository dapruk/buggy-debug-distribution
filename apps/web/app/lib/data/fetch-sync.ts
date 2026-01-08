import { supabase } from "~/lib/supabase";

export interface SyncLog {
  id: string;
  product_id: string | null;
  status: "success" | "warning" | "error";
  details: string;
  vendor_code: string | null;
  created_at: string;
}

export interface SyncResult {
  sync_id: string;
  total_products: number;
  synced_products: number;
  failed_products: number;
  status: "success" | "failed";
}

export async function syncCatalog(): Promise<SyncResult> {
  const { data, error } = await supabase.rpc("sync_product_catalog");

  if (error || !data || !data[0]) {
    console.error("Error syncing catalog:", error);
    throw new Error(`Failed to sync catalog: ${error?.message}`);
  }

  const result = data[0];

  return {
    sync_id: result.sync_id,
    total_products: result.total_products,
    synced_products: result.synced_products,
    failed_products: result.failed_products,
    status: result.status === "success" ? "success" : "failed",
  };
}

export async function fetchSyncLogs(syncId: string): Promise<SyncLog[]> {
  const { data, error } = await supabase
    .from("sync_logs")
    .select("*")
    .eq("id", syncId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sync logs:", error);
    return [];
  }

  return (data || []) as SyncLog[];
}

export async function fetchRecentSyncLogs(limit: number = 50): Promise<SyncLog[]> {
  const { data, error } = await supabase
    .from("sync_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent sync logs:", error);
    return [];
  }

  return (data || []) as SyncLog[];
}
