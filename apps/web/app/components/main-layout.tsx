import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  Truck,
  History,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

import UserProfileDialog from "~/components/settings/user-profile-dialog";
import RoleSwitcherPopover from "~/components/settings/role-switcher-popover";

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarItem({ to, icon, label, active }: SidebarItemProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn("w-full justify-start", active && "bg-secondary")}
      asChild
    >
      <Link to={to}>
        {icon}
        <span className="ml-2">{label}</span>
      </Link>
    </Button>
  );
}

function SidebarContent({ path }: { path: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-6">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-sm">BITEUK POS & Werhos</span>
        </h1>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
        <div>
          <h2 className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-tight uppercase">
            General
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Dashboard"
              active={path.startsWith("/dashboard")}
            />
            <SidebarItem
              to="/customers"
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Customers"
              active={path.startsWith("/customers")}
            />
          </div>
        </div>

        <div>
          <h2 className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-tight uppercase">
            Warehouse
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/warehouse/import"
              icon={<Truck className="h-4 w-4" />}
              label="Product Import"
              active={path.startsWith("/warehouse/import")}
            />
            <SidebarItem
              to="/warehouse/products"
              icon={<Package className="h-4 w-4" />}
              label="Product List"
              active={path.startsWith("/warehouse/products")}
            />
            <SidebarItem
              to="/warehouse/stock"
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Vendor Stock"
              active={path.startsWith("/warehouse/stock")}
            />
            <SidebarItem
              to="/warehouse/reports"
              icon={<Package className="h-4 w-4" />}
              label="Vendor Reports"
              active={path.startsWith("/warehouse/reports")}
            />
          </div>
        </div>

        <div>
          <h2 className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-tight uppercase">
            Point of Sale
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/pos/catalog"
              icon={<ShoppingCart className="h-4 w-4" />}
              label="Catalog"
              active={path.startsWith("/pos/catalog")}
            />
            <SidebarItem
              to="/pos/transaction/new"
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="New Transaction"
              active={path.startsWith("/pos/transaction/new")}
            />
            <SidebarItem
              to="/pos/stock-check"
              icon={<History className="h-4 w-4" />}
              label="Stock Validation"
              active={path.startsWith("/pos/stock-check")}
            />
          </div>
        </div>

        <div>
          <h2 className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-tight uppercase">
            System
          </h2>
          <div className="space-y-1">
            <SidebarItem
              to="/settings/sync"
              icon={<Settings className="h-4 w-4" />}
              label="Catalog Sync"
              active={path.startsWith("/settings/sync")}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2 border-t p-4">
        <RoleSwitcherPopover />
        <div className="text-muted-foreground text-center text-xs">v1.0.0-beta (Internal)</div>
      </div>
    </div>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex h-screen w-full bg-transparent">
      {/* Desktop Sidebar */}
      <aside className="bg-card hidden w-64 flex-col border-r md:flex">
        <SidebarContent path={path} />
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card flex items-center justify-between border-b px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent path={path} />
              </SheetContent>
            </Sheet>
            
            <div className="font-medium">
              Dashboard
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserProfileDialog />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl space-y-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
