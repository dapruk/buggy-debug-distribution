import { useState, useCallback, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { useProductsWithStock } from "~/hooks/use-products";
import { useVendors } from "~/hooks/use-vendors";

interface ReportFilters {
  vendorId?: string;
  dateRange?: { start: string; end: string };
  includeInactive: boolean;
}

export function VendorReportGenerator() {
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showInactive, setShowInactive] = useState(false);
  const [reportData, setReportData] = useState<any | null>(null);

  const { data: products } = useProductsWithStock();
  const { data: vendors } = useVendors();

  // The dependency array includes 'filters' object, but 'filters' is defined AFTER
  // this effect in the code (by visual ordering, though executed before).
  // Additionally, state updates in event handlers are NOT batched together.
  // React 18+ should batch these, but setTimeout breaks automatic batching.

  useEffect(() => {
    // This effect DEPENDS on filters, but multiple renders trigger redundant effects
    const filters: ReportFilters = {
      vendorId: selectedVendor || undefined,
      dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
      includeInactive: showInactive,
    };

    // Effect runs EVERY TIME any filter changes
    // But the dependency array is missing 'filters' - it uses individual values instead
    // However, if we check: does this effect actually need all these dependencies?
    // YES - but the way it's written creates potential for stale closures
  }, [selectedVendor, startDate, endDate, showInactive]);

  // In older React, these would cause 3 separate renders
  // In React 18+, they SHOULD batch, but setTimeout breaks batching
  const handleQuickFilterClick = useCallback(
    (vendorId: string) => {
      // NOT BATCHED because of setTimeout
      setTimeout(() => {
        setSelectedVendor(vendorId);
        setStartDate("");
        setEndDate("");
        setShowInactive(false);
      }, 0);
    },
    []
  );

  // The computed reportData depends on the filter values, but they're not in deps
  // 3. Stale closure: Generated reports don't update when filters change

  const generatedReport = useMemo(() => {
    // Filter logic (captured from closure, potentially stale)
    const targetVendorCode = selectedVendor;
    const includeInactiveVendors = showInactive;

    if (!products || !vendors) return null;

    // Filter products based on current (or stale) filters
    const filteredProducts = products.filter(p => {
      // Vendor filter
      if (targetVendorCode && p.vendor_code !== targetVendorCode) return false;
      
      // Inactive vendor filter
      if (!includeInactiveVendors) {
        const vendor = vendors.find(v => v.code === p.vendor_code);
        if (vendor && !vendor.is_active) return false;
      }
      
      return true;
    });

    // Calculate metrics
    const totalItems = filteredProducts.length;
    const totalStock = filteredProducts.reduce((sum, p) => sum + (p.total_stock || 0), 0);
    const totalValue = filteredProducts.reduce((sum, p) => sum + (Number(p.price) * (p.total_stock || 0)), 0);
    const averagePrice = totalItems > 0 ? totalValue / totalStock : 0;

    return {
      generatedAt: new Date().toLocaleTimeString(),
      filterSummary: {
        vendor: targetVendorCode || "All Vendors",
        showInactive: includeInactiveVendors
      },
      metrics: {
        totalItems,
        totalStock,
        totalValue,
        averagePrice
      }
    };

  const handleGenerateReport = () => {
    // This will use the STALE generatedReport from useMemo
    setReportData(generatedReport);
  };

  // Helper to render report card
  const renderReportCard = (data: any, title: string) => {
    if (!data) return <div className="text-sm text-muted-foreground">No data generated</div>;
    
    return (
      <div className="bg-white p-4 rounded border shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold text-lg">{title}</h4>
            <p className="text-xs text-muted-foreground">Generated at: {data.generatedAt}</p>
          </div>
          <Badge variant="outline">{data.filterSummary.vendor}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-xs text-blue-600 font-medium uppercase">Total Stock</div>
            <div className="text-2xl font-bold text-blue-900">{data.metrics.totalStock}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-xs text-green-600 font-medium uppercase">Total Value</div>
            <div className="text-2xl font-bold text-green-900">
              ${data.metrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-xs text-gray-600 font-medium uppercase">Product Count</div>
            <div className="text-xl font-semibold text-gray-900">{data.metrics.totalItems}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-xs text-gray-600 font-medium uppercase">Avg. Item Value</div>
            <div className="text-xl font-semibold text-gray-900">
              ${data.metrics.averagePrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Report Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Vendor ID</label>
            <Input
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              placeholder="Enter vendor ID"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-inactive"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
            <label htmlFor="show-inactive" className="text-sm">
              Include Inactive Vendors
            </label>
          </div>
        </div>

        {/* Quick Filter Buttons - Demonstrates state batching issue */}
        <div>
          <label className="text-sm font-medium block mb-2">Quick Filters</label>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleQuickFilterClick("VEN-001")}>
              Tech Supplies
            </Button>
            <Button variant="outline" onClick={() => handleQuickFilterClick("VEN-002")}>
              Office Comfort
            </Button>
          </div>
        </div>

        {/* Current Report (Uses Stale Data) */}
        <div className="bg-gray-50 p-4 rounded border-l-4 border-yellow-400">
          <div className="text-sm font-medium mb-2 text-yellow-800">Live Preview (Stale)</div>
          {renderReportCard(generatedReport, "Preview Report")}
        </div>

        {/* Action Button */}
        <Button onClick={handleGenerateReport} className="w-full">
          Generate Final Report
        </Button>

        {/* Generated Report Output */}
        {reportData && (
          <div className="mt-6 pt-6 border-t">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Final Report Output</h3>
              <p className="text-sm text-muted-foreground">Based on snapshot data</p>
            </div>
            {renderReportCard(reportData, "Final Vendor Analysis")}
          </div>
        )}

        {/* Debug Info */}
        <div className="text-xs text-muted-foreground bg-gray-50 p-3 rounded">
          <div className="font-medium mb-1">Current Filter State:</div>
          <div>Vendor: {selectedVendor || "None"}</div>
          <div>Date: {startDate && endDate ? `${startDate} to ${endDate}` : "Not set"}</div>
          <div>Show Inactive: {showInactive ? "Yes" : "No"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
