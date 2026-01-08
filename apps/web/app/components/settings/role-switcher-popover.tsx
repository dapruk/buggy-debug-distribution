import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ArrowLeftRight } from "lucide-react";

export default function RoleSwitcherPopover() {
  const [role, setRole] = useState("cashier");

  useEffect(() => {
  // Saves to "app_role", reads from "user_role".
    const savedRole = localStorage.getItem("user_role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleRoleChange = (value: string) => {
    setRole(value);
    // Saving to "app_role"
    localStorage.setItem("app_role", value);
    
    // Simulate app reload/effect
    window.location.reload();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <ArrowLeftRight className="mr-2 h-4 w-4" />
          Switch Role
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Role Selection</h4>
            <p className="text-sm text-muted-foreground">
              Select your active role.
            </p>
          </div>
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cashier">Cashier</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Current: <span className="font-semibold capitalize">{role}</span>
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
