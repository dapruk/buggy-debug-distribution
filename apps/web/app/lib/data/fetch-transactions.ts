import { supabase } from "~/lib/supabase";

export interface PosTransaction {
  id: string;
  created_at: string;
  total_price: number;
  status: "pending" | "completed" | "failed";
}

export interface PosTransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface CreateTransactionRequest {
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

export async function createTransaction(
  request: CreateTransactionRequest
): Promise<PosTransaction> {
  const { data, error } = await supabase.rpc("create_pos_transaction", {
    p_items: request.items,
  });

  if (error || !data || !data[0]) {
    console.error("Error creating transaction:", error);
    throw new Error(`Failed to create transaction: ${error?.message}`);
  }

  const result = data[0];

  if (result.success) {
    return {
      id: result.transaction_id,
      created_at: new Date().toISOString(),
      total_price: result.total_price,
      status: "completed",
    };
  }

  throw new Error(result.message || "Transaction creation failed");
}

export async function fetchTransaction(transactionId: string): Promise<PosTransaction | null> {
  const { data, error } = await supabase
    .from("pos_transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (error) {
    return null;
  }

  return data as PosTransaction;
}

export async function fetchTransactionItems(transactionId: string): Promise<PosTransactionItem[]> {
  const { data, error } = await supabase
    .from("pos_transaction_items")
    .select("*")
    .eq("transaction_id", transactionId);

  if (error) {
    console.error("Error fetching transaction items:", error);
    return [];
  }

  return (data || []) as PosTransactionItem[];
}

export async function fetchRecentTransactions(limit: number = 10): Promise<PosTransaction[]> {
  const { data, error } = await supabase
    .from("pos_transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return (data || []) as PosTransaction[];
}

export interface TransactionDetail extends PosTransaction {
  items: Array<PosTransactionItem & { product: { name: string } }>;
}

/**
 * Fetch full transaction details including items and product names
 */
export async function fetchTransactionDetail(transactionId: string): Promise<TransactionDetail | null> {
  const transaction = await fetchTransaction(transactionId);
  if (!transaction) return null;

  const { data: items, error } = await supabase
    .from("pos_transaction_items")
    .select("*, product:products(name)")
    .eq("transaction_id", transactionId);

  if (error) {
    console.error("Error fetching transaction details:", error);
    return null;
  }

  return {
    ...transaction,
    items: (items || []).map((item: any) => ({
      ...item,
      product: item.product, // Supabase returns joined data in 'product' property
    })),
  };
}
