import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useVendors } from "~/hooks/use-vendors";

interface VendorPickerProps {
  onSelect: (vendorId: string, vendorCode: string) => void;
  selectedVendor?: string;
}

export function VendorPicker({ onSelect, selectedVendor }: VendorPickerProps) {
  const { data: vendors } = useVendors();

  const handleSelect = (vendorId: string) => {
    const vendor = vendors?.find((v) => v.id === vendorId);
    if (vendor) {
      onSelect(vendorId, vendor.code);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Vendor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedVendor || ""} onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a vendor..." />
          </SelectTrigger>
          <SelectContent>
            {vendors?.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id}>
                <div className="flex items-center gap-2">
                  {vendor.name}
                  {vendor.is_active ? (
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Inactive
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedVendor && (
          <div className="text-muted-foreground text-sm">
            Selected: {vendors?.find((v) => v.id === selectedVendor)?.name}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
