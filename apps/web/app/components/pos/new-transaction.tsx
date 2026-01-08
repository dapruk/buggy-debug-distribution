import { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { fetchProductsWithStock } from "~/lib/data/fetch-products";
import { fetchWarehouseStock } from "~/lib/data/fetch-stock";
import { createTransaction } from "~/lib/data/fetch-transactions";

interface CartItem {
  productId: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

export function NewTransaction() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const { data: products } = useQuery({
    queryKey: ["products-with-stock"],
    queryFn: fetchProductsWithStock,
  });

  // Fetch stock to show availability
  const { data: stock } = useQuery({
    queryKey: ["stock"],
    queryFn: fetchWarehouseStock,
  });

  const addToCart = () => {
    const product = products?.find((p) => p.product_id === selectedProductId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.product_id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.product_id,
          sku: product.sku,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      // Call backend RPC to create transaction
      return await createTransaction({
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    },
    onSuccess: (data) => {
      // Frontend shows success alert without knowing there was a violation
      
      // Stock is updated in backend but frontend cache ["stock"] is still old.
      // Result: User sees old stock quantities until manual refresh.
      // But now it's harder to detect because we're using real backend
      
      toast({
        title: "Transaction Successful",
        description: `Transaction ${data.id.substring(0, 8)}... created!`,
        variant: "success",
        action: (
          <Button
            size="sm"
            variant="outline"
            className="bg-white text-black hover:bg-gray-100 border-gray-200"
            onClick={() => navigate(`/pos/transaction/${data.id}`)}
          >
            View
          </Button>
        ),
      });
      setCart([]);
    },
    onError: (error) => {
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Add Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Select a product...</option>
              {products?.map((p) => {
                const productStock = stock?.filter(s => s.product_id === p.product_id).reduce((acc, s) => acc + s.quantity, 0) || 0;
                return (
                  <option key={p.product_id} value={p.product_id}>
                    {p.name} (${p.price}) - Stock: {productStock}
                  </option>
                );
              })}
            </select>
            <Button onClick={addToCart} disabled={!selectedProductId}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cart */}
      <Card>
        <CardHeader>
          <CardTitle>Current Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {cart.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                    Cart is empty
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            disabled={cart.length === 0 || mutation.isPending}
            onClick={() => mutation.mutate(cart)}
          >
            {mutation.isPending ? "Processing..." : "Submit Transaction"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
