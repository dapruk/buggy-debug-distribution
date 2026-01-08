import { useQuery } from "@tanstack/react-query";
import { fetchVendors } from "~/lib/data/fetch-vendors";

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });
}
