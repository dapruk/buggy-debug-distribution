import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "~/lib/data/fetch-transactions";
import type { CreateTransactionRequest } from "~/lib/data/fetch-transactions";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTransactionRequest) => createTransaction(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
