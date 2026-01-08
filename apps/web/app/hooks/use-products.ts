import { useQuery } from "@tanstack/react-query";
import { fetchProductsWithStock } from "~/lib/data/fetch-products";
import type { Product } from "~/lib/data/fetch-products";

export function useProductsWithStock() {
  return useQuery({
    queryKey: ["products-with-stock"],
    queryFn: fetchProductsWithStock,
  });
}

export function usePOSProducts(search: string, category: string | null) {
  return useQuery({
    queryKey: ["pos-products"],
    queryFn: async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out")), 10000)
        );

        const productsPromise = fetchProductsWithStock();

        const products = (await Promise.race([productsPromise, timeoutPromise])) as Product[];

        if (!products || !Array.isArray(products)) {
          console.warn("fetchProductsWithStock returned invalid data:", products);
          return [];
        }

        let filtered = products.map((p) => ({
          ...p,

          category: determineCategory(p.name || ""),
        }));

        if (search) {
          filtered = filtered.filter(
            (p) =>
              (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
              (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
          );
        }

        if (category) {
          filtered = filtered.filter((p) => p.category === category);
        }

        return filtered;
      } catch (err) {
        console.error("Error in usePOSProducts:", err);
        throw err;
      }
    },
  });
}

function determineCategory(name: string): string {
  const n = name.toLowerCase();
  if (
    n.includes("chair") ||
    n.includes("desk") ||
    n.includes("table") ||
    n.includes("cabinet") ||
    n.includes("shelf")
  )
    return "Furniture";
  if (
    n.includes("mouse") ||
    n.includes("keyboard") ||
    n.includes("monitor") ||
    n.includes("usb") ||
    n.includes("drive") ||
    n.includes("ssd") ||
    n.includes("webcam")
  )
    return "Electronics";
  if (n.includes("lamp") || n.includes("light")) return "Lighting";
  if (n.includes("cable") || n.includes("adapter") || n.includes("hub")) return "Accessories";
  return "General";
}
