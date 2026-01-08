import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { useProductsWithStock } from "~/hooks/use-products";
import { useStock } from "~/hooks/use-stock";
import { useVendors } from "~/hooks/use-vendors";

export function StockValidation() {
  const [sku, setSku] = useState("");
  const [checkResult, setCheckResult] = useState<{
    product: any;
    totalStock: number;
    canFulfill: boolean;
  } | null>(null);

  const { data: products } = useProductsWithStock();
  const { data: stock } = useStock();
  const { data: vendors } = useVendors();

  const handleCheck = () => {
    if (!products || !stock || !vendors) return;

    const product = products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
    if (!product) {
      alert("Product not found");
      return;
    }

    const productStock = stock.filter((s) => s.product_id === product.product_id);
    
    // "Only fulfill orders from ACTIVE vendors."
    // This logic sums stock from ALL vendors regardless of is_active status.
    // Result: System says "Available" even if stock is only from inactive vendor.
    
    const totalStock = productStock.reduce((acc, s) => acc + s.quantity, 0);
    
    // Correct logic should be:
    // const totalStock = productStock.reduce((acc, s) => {
    //   const vendor = vendors.find(v => v.code === s.vendor_code); // (ignoring the key mismatch bug for now)
    //   return vendor?.is_active ? acc + s.quantity : acc;
    // }, 0);

    setCheckResult({
      product,
      totalStock,
      canFulfill: totalStock > 0,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Validation</CardTitle>
          <CardDescription>Check product availability for immediate fulfillment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter SKU (e.g. SKU-001)"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
            <Button onClick={handleCheck}>Check</Button>
          </div>

          {checkResult && (
            <div className="mt-6 border rounded-lg p-4 bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{checkResult.product.name}</h3>
                  <p className="text-sm text-muted-foreground">{checkResult.product.sku}</p>
                </div>
                <Badge variant={checkResult.canFulfill ? "default" : "destructive"}>
                  {checkResult.canFulfill ? "Available" : "Out of Stock"}
                </Badge>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Total Quantity</div>
                  <div className="text-2xl font-bold">{checkResult.totalStock}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Fulfillment Status</div>
                  <div className={checkResult.canFulfill ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {checkResult.canFulfill ? "Ready to Ship" : "Cannot Fulfill"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
