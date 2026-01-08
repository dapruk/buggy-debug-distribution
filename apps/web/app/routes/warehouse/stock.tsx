import { VendorStockView } from "~/components/warehouse/vendor-stock";

export default function VendorStock() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Vendor Stock</h1>
      </div>
      <VendorStockView />
    </div>
  );
}
