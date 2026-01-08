import { CatalogSync } from "~/components/settings/catalog-sync";

export default function SyncPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Catalog Sync</h1>
        <p className="text-muted-foreground text-sm">
          Synchronize product catalog with upstream vendors
        </p>
      </div>
      <CatalogSync />
    </div>
  );
}
