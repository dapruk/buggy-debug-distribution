import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { usePOSProducts } from "~/hooks/use-products";
import { ProductCatalogSkeleton } from "./product-catalog.skeleton";

export function POSCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  // The query key is static ["pos-products"], so it won't refetch when search or category changes.
  // Result: Filter updates state but data remains stale until cache timeout.
  const { data: products, isLoading, error, isError } = usePOSProducts(search, category);

  // Derive categories from the current product list (or hardcode if needed)
  // For now, we'll just use a static list or derive from loaded products if available
  const categories = ["Electronics", "Furniture", "Lighting", "Accessories", "General"];

  if (isError) {
    return (
      <div className="p-4 border border-red-200 rounded bg-red-50 text-red-800">
        <h3 className="font-bold">Error loading catalog</h3>
        <p>{error?.message || "Unknown error occurred"}</p>
        <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Input 
          placeholder="Search products..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-white rounded"
        />
        <div className="flex gap-2">
          <Button 
            variant={category === null ? "default" : "outline"}
            onClick={() => setCategory(null)}
          >
            All
          </Button>
          {categories.map(c => (
            <Button
              key={c}
              variant={category === c ? "default" : "outline"}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <ProductCatalogSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map((product) => (
            <Card key={product.product_id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.sku}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                  <Badge>{(product as any).category || "General"}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
          {products?.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
