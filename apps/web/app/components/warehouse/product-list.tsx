import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { DataTable, type ColumnDef } from "~/components/ui/data-table";
import { fetchProductsWithStock } from "~/lib/data/fetch-products";
import { fetchVendors } from "~/lib/data/fetch-vendors";

import { ProductListSkeleton } from "./product-list.skeleton";

export function ProductList() {
  // Fetch products with stock from backend RPC
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products-with-stock"],
    queryFn: fetchProductsWithStock,
  });

  // Fetch vendors for reference
  const { data: vendors = [] } = useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  if (!productsData) {
    return <div>No data available</div>;
  }

  // Description: The product list attempts to match warehouse stock to vendors using a direct string comparison on vendor codes without case normalization. Since the mock data contains both "VEN-002" and "ven-002", some products appear with "Unknown Vendor".

  // Frontend tries to display it but gets null value
  const productsWithDetails = productsData.map((product) => {
    const vendor = vendors.find(v => v.code.toLowerCase() === product.vendor_code?.toLowerCase());
    return {
      ...product,
      // Try to enrich vendor_name if backend didn't provide it or if it's null
      vendorName: product.vendor_name || vendor?.name || "Unknown Vendor",
    };
  });

  // Define columns using data-driven pattern
  type ProductDetail = typeof productsWithDetails[0];
  const columns: ColumnDef<ProductDetail>[] = [
    {
      id: "sku",
      header: "SKU",
      accessorKey: "sku",
      className: "font-medium",
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
    },
    {
      id: "price",
      header: "Price",
      accessorFn: (row) => `$${(row.price as number).toFixed(2)}`,
      className: "text-right",
      headerClassName: "text-right",
    },
    {
      id: "totalStock",
      header: "Total Stock",
      accessorFn: (row) => row.total_stock,
      className: "text-right",
      headerClassName: "text-right",
    },
    {
      id: "vendor",
      header: "Primary Vendor",
      accessorKey: "vendorName",
      cell: (value) =>
        value === "Unknown Vendor" ? (
          <span className="text-muted-foreground italic">Unknown Vendor</span>
        ) : (
          value
        ),
    },
    {
      id: "vendorCode",
      header: "Vendor Code",
      accessorKey: "vendor_code",
      cell: (value) => (
        <span className="text-xs text-muted-foreground">{value || "N/A"}</span>
      ),
    },
  ];

  // Helper for correct stock status (Desktop)
  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: "Out of Stock", color: "destructive" as const };
    if (quantity < 10) return { label: "Low Stock", color: "warning" as const };
    return { label: "In Stock", color: "success" as const };
  };

  // Always returns "In Stock" regardless of quantity
  const getMobileStockStatus = (quantity: number) => {
    // Intentional bug: ignoring quantity check
    return { label: "In Stock", color: "success" as const };
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <div className="pt-2 text-sm text-muted-foreground">
            <p className="mb-1">Reported Issue: Vendors missing after import.</p>
            <a href="/samples/inventory_buggy.csv" download className="text-red-600 hover:underline flex items-center gap-1">
              <span>📄 Download Reported CSV</span>
            </a>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop View: Table */}
          <div className="hidden md:block">
            <DataTable data={productsWithDetails} columns={columns} emptyMessage="No products found" />
          </div>

          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {productsWithDetails.map((product) => {
              const status = getMobileStockStatus(product.total_stock);
              
              return (
                <div key={product.sku} className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                    <Badge variant={status.color}>{status.label}</Badge>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium">${Number(product.price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stock</p>
                      <p className="font-medium">{product.total_stock}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vendor</p>
                      <p className="font-medium">
                        {product.vendorName === "Unknown Vendor" ? (
                          <span className="text-muted-foreground italic">Unknown</span>
                        ) : (
                          product.vendorName
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Code</p>
                      <p className="font-medium">{product.vendor_code || "N/A"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {productsWithDetails.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                No products found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
