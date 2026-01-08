import { useQuery } from "@tanstack/react-query";
import { fetchWarehouseStock } from "~/lib/data/fetch-stock";

export function useStock() {
  return useQuery({
    queryKey: ["stock"],
    queryFn: fetchWarehouseStock,
  });
}
