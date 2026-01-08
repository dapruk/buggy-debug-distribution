import { ImportProgress } from "~/components/warehouse/import-progress";

export default function ImportProgressPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Progress Monitor</h1>
        <p className="text-muted-foreground mt-2">
          Test animation timing with live import progress
        </p>
      </div>
      <ImportProgress />
    </div>
  );
}
