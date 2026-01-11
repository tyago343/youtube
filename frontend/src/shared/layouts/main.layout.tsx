import { Outlet } from "react-router";
import { Toaster } from "sonner";
import Header from "@shared/components/header/Header";
import { RouteErrorBoundary } from "@shared/error-boundary/RouteErrorBoundary";
import Sidebar from "../components/sidebar/Sidebar";

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
