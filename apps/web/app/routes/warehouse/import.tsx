import { ImportPreview } from "~/components/warehouse/import-preview";

export default function ProductImport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Import</h1>
      </div>
      <ImportPreview />
    </div>
  );
}
