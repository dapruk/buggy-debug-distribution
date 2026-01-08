import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/global-layout.tsx", [
    layout("routes/layout.tsx", [
      index("routes/home.tsx"),
      route("dashboard", "routes/dashboard.tsx"),
      route("customers", "routes/customers.tsx"),

      route("warehouse/import", "routes/warehouse/import.tsx"),
      route("warehouse/products", "routes/warehouse/products.tsx"),
      route("warehouse/stock", "routes/warehouse/stock.tsx"),
      route("warehouse/reports", "routes/warehouse/reports.tsx"),

      route("pos/catalog", "routes/pos/catalog.tsx"),
      route("pos/transaction/new", "routes/pos/new-transaction.tsx"),
      route("pos/transaction/:id", "routes/pos/transaction-detail.tsx"),
      route("pos/stock-check", "routes/pos/stock-check.tsx"),

      route("settings/sync", "routes/settings/sync.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
