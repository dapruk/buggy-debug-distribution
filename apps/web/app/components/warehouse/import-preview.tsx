import { Upload } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useProductsWithStock } from "~/hooks/use-products";
import { useVendors } from "~/hooks/use-vendors";

interface ImportedProduct {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  vendorCode: string;
}

export function ImportPreview() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [importedProducts, setImportedProducts] = useState<ImportedProduct[]>([]);

  const { data: vendors } = useVendors();
  const { data: products } = useProductsWithStock();

  // The vendor code "ven-002" (lowercase) doesn't match "VEN-002" (uppercase).
  // The data is fetched and rendered, but shows "Unknown Vendor" for one item.
  const enrichedProducts = importedProducts.map((imported) => {
    const existingProduct = products?.find((p) => p.sku === imported.sku);
    const matchedVendor = vendors?.find((v) => v.code === imported.vendorCode);

    return {
      ...imported,
      isNew: !existingProduct,
      vendorName: matchedVendor?.name || "undefined",
    };
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setImportedProducts([]); // Reset previous import
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split("\n");
      const parsed: ImportedProduct[] = [];

      // Parse headers
      const headers = lines[0].split(",").map((h) => h.trim());

      // The CSV has "vendor_name", but code expects "Primary Vendor"
      const skuIndex = headers.indexOf("sku");
      const nameIndex = headers.indexOf("name");
      const priceIndex = headers.indexOf("price");
      const quantityIndex = headers.indexOf("quantity");
      const vendorIndex = headers.indexOf("vendorCode");

      // Skip header row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(",");

        // Only process if we have enough columns for the basic fields
        if (columns[skuIndex] && columns[nameIndex]) {
          parsed.push({
            sku: columns[skuIndex]?.trim() || "",
            name: columns[nameIndex]?.trim() || "",
            price: parseFloat(columns[priceIndex]?.trim() || "0"),
            // parseInt("1O") is 1, Number("1O") is NaN. Let's use parseInt to show 1 but it's actually 10
            quantity: parseInt(columns[quantityIndex]?.trim() || "0", 10),
            vendorCode: columns[vendorIndex]?.trim() || "", // Will be empty string due to bad index
          });
        }
      }

      setImportedProducts(parsed);
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const validData = enrichedProducts;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV/Excel File</CardTitle>
          <CardDescription>
            Import products from a spreadsheet. Supports CSV and Excel formats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <Button onClick={handleImport} disabled={!file || isProcessing}>
                <Upload className="mr-2 h-4 w-4" />
                {isProcessing ? "Processing..." : "Preview"}
              </Button>
            </div>
            {file && !isProcessing && (
              <p className="text-muted-foreground text-sm">Selected: {file.name}</p>
            )}

            <div className="text-muted-foreground pt-2 text-sm">
              <p className="mb-1 font-medium">Sample File:</p>
              <div className="flex gap-4">
                <a
                  href="/samples/inventory.csv"
                  download
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <span>📄 Download Inventory CSV</span>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Import Preview</CardTitle>
          <CardDescription>{validData.length} items will be imported</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validData.map((product) => (
                <TableRow key={product.sku}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                  <TableCell>
                    <span>{product.vendorName}</span>
                  </TableCell>
                  <TableCell>
                    {product.isNew ? <Badge>New</Badge> : <Badge variant="secondary">Update</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
