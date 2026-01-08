import { VendorReportGenerator } from "~/components/warehouse/vendor-report";

export default function VendorReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendor Report Generator</h1>
        <p className="text-muted-foreground mt-2">Test state batching and hook ordering issues</p>
      </div>
      <VendorReportGenerator />
    </div>
  );
}
