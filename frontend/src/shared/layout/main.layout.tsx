import { Outlet } from "react-router";
import Header from "@shared/components/header/Header";
import { Toaster } from "sonner";
import { RouteErrorBoundary } from "@/shared/error-boundary/RouteErrorBoundary";

export default function MainLayout() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="dark min-h-screen bg-background text-white">
        <Header showSearch={false} />
        <main className="flex">
          <aside className="w-64 bg-sidebar p-4 border-r hidden md:block h-[calc(100vh-73px)] sticky top-[73px]">
            Sidebar
          </aside>
          <section className="flex-1 p-4">
            <RouteErrorBoundary context="route">
              <Outlet />
            </RouteErrorBoundary>
          </section>
        </main>
      </div>
    </>
  );
}
