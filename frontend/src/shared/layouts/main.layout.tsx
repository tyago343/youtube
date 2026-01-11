import { Outlet } from "react-router";
import { Toaster } from "sonner";
import Header from "@/shared/components/header/header.component";
import { RouteErrorBoundary } from "@/shared/error-boundary/route-error.boundary";
import Sidebar from "../components/sidebar/sidebar";

export default function MainLayout() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-background text-foreground">
        <Header showSearch={false} />
        <main className="flex">
          <Sidebar />
          <section className="flex-1 p-4 text-3xl">
            <RouteErrorBoundary context="route">
              <Outlet />
            </RouteErrorBoundary>
          </section>
        </main>
      </div>
    </>
  );
}
