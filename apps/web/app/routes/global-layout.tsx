import { Outlet } from "react-router";

export default function GlobalLayout() {
  return (
    <div className="relative min-h-screen w-full">
      {}
      <div
        className="fixed inset-0 z-[-1] h-full w-full"
        style={{
          backgroundImage: "url('/background-dashboard-desktop.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {}
      <div className="relative z-0">
        <Outlet />
      </div>
    </div>
  );
}
