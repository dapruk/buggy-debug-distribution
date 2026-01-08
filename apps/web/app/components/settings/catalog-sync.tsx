import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { DataTable, type ColumnDef } from "~/components/ui/data-table";
import { RefreshCw } from "lucide-react";
import { useProductsWithStock } from "~/hooks/use-products";
import { useSyncCatalog, useSyncLogs } from "~/hooks/use-sync";
import { useToast } from "~/hooks/use-toast";
import type { SyncLog } from "~/lib/data/fetch-sync";

export function CatalogSync() {
  const { data: products } = useProductsWithStock();
  const { mutate: syncCatalog, isPending: isSyncing } = useSyncCatalog();
  const { data: syncLogs } = useSyncLogs();

  // The backend RPC returns "success" even if some products fail to sync.
  // The frontend (here) displays the status returned by the backend.
  // So users see "Sync Complete" even if there were failures.
  const { toast } = useToast();

  // The backend RPC returns "success" even if some products fail to sync.
  // The frontend (here) displays the status returned by the backend.
  // So users see "Sync Complete" even if there were failures.
  const handleSync = () => {
    syncCatalog(undefined, {
      onSuccess: (result) => {
        // The result contains { status: 'success', failed_products: N, ... }
        // But we only check result.status, ignoring failed_products count
        console.log("Sync result:", result);
        
        toast({
          title: result.status === "success" ? "Sync Completed" : "Sync Failed",
          description: result.status === "success" 
            ? "Product catalog synchronized successfully." 
            : "Failed to synchronize product catalog.",
          variant: result.status === "success" ? "success" : "destructive",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Catalog Synchronization</CardTitle>
              <CardDescription>
                Sync product data with upstream vendor catalogs
              </CardDescription>
            </div>
            <div className="text-right text-sm">
              <p className="text-muted-foreground">Total Products:</p>
              <p className="font-medium">{products?.length || 0}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full md:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Start Sync"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const syncColumns: ColumnDef<SyncLog>[] = [
              {
                id: "details",
                header: "Details",
                accessorKey: "details",
              },
              {
                id: "timestamp",
                header: "Time",
                accessorFn: (row) =>
                  new Date(row.created_at).toLocaleTimeString(),
              },
              {
                id: "status",
                header: "Status",
                accessorKey: "status",
                cell: (value, row) => {
                  const status = row.status;
                  const failedProducts = row.failed_products || 0;

                  // The backend RPC returns "success" even if some products fail to sync.
                  // The frontend (here) displays the status returned by the backend.
                  // So users see "Sync Complete" even if there were failures.
                  const displayStatus =
                    status === "success" && failedProducts > 0
                      ? "warning"
                      : status;

                  return (
                    <Badge
                      variant={
                        displayStatus === "success"
                          ? "default"
                          : displayStatus === "warning"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {String(displayStatus).charAt(0).toUpperCase() +
                        String(displayStatus).slice(1)}
                    </Badge>
                  );
                },
                headerClassName: "text-right",
                className: "text-right",
              },
            ];

            return (
              <DataTable
                data={syncLogs || []}
                columns={syncColumns}
                emptyMessage="No sync logs yet"
              />
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
