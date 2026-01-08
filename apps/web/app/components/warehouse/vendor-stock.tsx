import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { DataTable, type ColumnDef } from "~/components/ui/data-table";
import { useVendors } from "~/hooks/use-vendors";
import { useStock } from "~/hooks/use-stock";
import { useProductsWithStock } from "~/hooks/use-products";

import { VendorStockSkeleton } from "./vendor-stock.skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchVendors } from "~/lib/data/fetch-vendors";
import { fetchWarehouseStock } from "~/lib/data/fetch-stock";

export function VendorStockView() {
  const { data: vendors = [], isLoading: isLoadingVendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });
  const { data: stock = [], isLoading: isLoadingStock } = useQuery({
    queryKey: ["stock"],
    queryFn: fetchWarehouseStock,
  });
  const { data: products } = useProductsWithStock();

  if (isLoadingVendors || isLoadingStock) {
    return <VendorStockSkeleton />;
  }

  // The reduce logic is used to sum stock by vendor.
  // But the key matching doesn't normalize case, so "ven-002" won't match "VEN-002".
  // Result: Some vendors' totals are incomplete or missing entries.
  // Description: The vendor stock summary uses a reduce operation to accumulate stock quantities, but the filtering logic doesn't normalize vendor codes. When a stock entry has "ven-002" and the vendor is "VEN-002", the filter `s.vendor_code === vendor.code` fails, resulting in missing entries for that vendor.
  const stockByVendor = stock.reduce((acc, item) => {
    acc[code] = (acc[code] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  const vendorStockSummary = vendors.map((vendor) => {
    const vendorStockEntries = stock.filter(
      (s) => s.vendor_code === vendor.code  // This also doesn't normalize
    );
    
    const vendorTotal = vendorStockEntries.reduce((sum, s) => sum + s.quantity, 0);
    const itemCount = vendorStockEntries.length;

    return {
      vendor,
      stockEntries: vendorStockEntries,
      totalQuantity: vendorTotal,
      itemCount,
    };
  });

  const productsWithVendor = products?.map((product) => {
    const vendor = vendors.find((v) => v.code === product.vendor_code); // Case mismatch issue
    return { ...product, vendor };
  });

  const allStockEntries = stock.map((s) => {
    const product = productsWithVendor?.find((p) => p.product_id === s.product_id);
    const vendor = vendors.find(
      (v) => v.code === s.vendor_code  // Case mismatch issue
    );

    return {
      id: s.id,
      product,
      vendor,
      quantity: s.quantity,
      vendorCode: s.vendor_code,
    };
  });

  return (
    <div className="space-y-6">
      {vendorStockSummary.map((summary) => {
        // Define columns for stock entries table
        type StockEntry = typeof allStockEntries[0];
        const stockColumns: ColumnDef<StockEntry>[] = [
          {
            id: "sku",
            header: "Product SKU",
            accessorFn: (row) => row.product?.sku || "Unknown",
            className: "font-medium",
          },
          {
            id: "name",
            header: "Product Name",
            accessorFn: (row) => row.product?.name || "Unknown Product",
          },
          {
            id: "quantity",
            header: "Quantity",
            accessorKey: "quantity",
            className: "text-right font-semibold",
            headerClassName: "text-right",
          },
          {
            id: "status",
            header: "Status",
            accessorKey: "quantity",
            cell: (value) =>
              (value as number) > 0 ? (
                <Badge>In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out</Badge>
              ),
          },
        ];

        const vendorStockEntries = allStockEntries.filter(
          (s) => s.vendor?.code === summary.vendor.code
        );

        return (
          <Card key={summary.vendor.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{summary.vendor.name}</CardTitle>
                  <CardDescription>Code: {summary.vendor.code}</CardDescription>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-lg">
                    {summary.totalQuantity} units
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {summary.itemCount} product types
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={vendorStockEntries}
                columns={stockColumns}
                emptyMessage="No stock entries for this vendor"
              />
            </CardContent>
          </Card>
        );
      })}

      {vendorStockSummary.length === 0 && (
        <Card>
          <CardContent className="pt-8">
            <p className="text-center text-muted-foreground">
              No vendor stock data available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
