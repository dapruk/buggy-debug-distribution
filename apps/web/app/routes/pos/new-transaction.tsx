import { NewTransaction } from "~/components/pos/new-transaction";

export default function NewTransactionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">New Transaction</h1>
      </div>
      <NewTransaction />
    </div>
  );
}
