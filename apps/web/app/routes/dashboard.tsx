import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { fetchDashboardStats } from "~/lib/data/fetch-dashboard";
import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  // We want to show "Last Updated: Today".
  // But we create a date object and formatting it might shift it to tomorrow if close to midnight UTC
  // Incorrect date parsing/timezone handling adds 1 day or uses wrong timezone.
  const date = new Date();
  date.setDate(date.getDate() + 1); // Intentional bug: Always show tomorrow
  const lastUpdated = date.toLocaleDateString("en-US", {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: "Asia/Jakarta" // Hardcoded timezone
  });

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Last Updated: {lastUpdated}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.total_revenue?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transactions
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_transactions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Product
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {stats?.top_product || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Most sold item
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
