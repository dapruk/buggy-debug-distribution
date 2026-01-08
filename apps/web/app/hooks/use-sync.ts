import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { syncCatalog, fetchRecentSyncLogs } from "~/lib/data/fetch-sync";

export function useSyncCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncCatalog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sync-logs"] });
      queryClient.invalidateQueries({ queryKey: ["products-with-stock"] });
    },
  });
}

export function useSyncLogs() {
  return useQuery({
    queryKey: ["sync-logs"],
    queryFn: () => fetchRecentSyncLogs(),
  });
}
