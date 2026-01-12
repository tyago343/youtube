import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { RouteErrorBoundary } from "../error-boundary/route-error.boundary";
import Header from "../components/header/header.component";
import Sidebar from "../components/sidebar/sidebar";
import { SidebarProvider } from "../components/sidebar/sidebar.context";

export default function MainLayout() {
  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
}
