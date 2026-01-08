import { StockValidation } from "~/components/pos/stock-validation";

export default function StockCheck() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stock Validation</h1>
      </div>
      <StockValidation />
    </div>
  );
}
