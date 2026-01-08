import { TransactionDetail } from "~/components/pos/transaction-detail";

export default function TransactionDetailPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Details</h1>
      </div>
      <TransactionDetail />
    </div>
  );
}
