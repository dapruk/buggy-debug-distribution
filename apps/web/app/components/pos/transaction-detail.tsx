import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { TransactionItemsTable } from "~/components/shared/transaction-items-table";
import { TransactionDetailSkeleton } from "./transaction-detail.skeleton";

import { fetchTransactionDetail } from "~/lib/data/fetch-transactions";

export function TransactionDetail() {
  const { id } = useParams();

  const { data: transaction, isLoading } = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => fetchTransactionDetail(id!),
    enabled: !!id,
  });

  if (isLoading) return <TransactionDetailSkeleton />;
  if (!transaction) return <div>Transaction not found</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction {transaction.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div>{new Date(transaction.created_at).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="font-bold">${transaction.total_price.toFixed(2)}</div>
            </div>
          </div>

          {/* We use TransactionItemsTable.
              We pass showStock={true} because we copied it from the POS view or thought it would be nice to show stock.
              But we DO NOT pass `currentStock` (it's undefined).
              The component renders the Header "Availability" (because showStock is true).
        {/* Without it, the columns misalign because it tries to render availability column but has no data */}
          <TransactionItemsTable
            items={transaction.items.map((item) => ({
              productId: item.product_id,
              name: item.product?.name || "Unknown Product",
              quantity: item.quantity,
              price: item.price,
            }))}
            showStock={true}
            // currentStock is missing!
          />
        </CardContent>
      </Card>
    </div>
  );
}
