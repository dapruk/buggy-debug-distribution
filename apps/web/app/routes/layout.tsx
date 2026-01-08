import { Outlet } from "react-router";
import { MainLayout } from "~/components/main-layout";

export default function Layout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
