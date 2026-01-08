import { POSCatalog } from "~/components/pos/product-catalog";

export default function POSCatalogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
      </div>
      <POSCatalog />
    </div>
  );
}
