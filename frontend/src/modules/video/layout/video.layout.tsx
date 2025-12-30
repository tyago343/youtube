import { Outlet } from "react-router";
import Header from "@/shared/components/header/Header";
import { Toaster } from "sonner";
import { RouteErrorBoundary } from "@/shared/error-boundary/RouteErrorBoundary";

export function VideoLayout() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex">
          <section className="flex-1">
            <RouteErrorBoundary context="video">
              <Outlet />
            </RouteErrorBoundary>
          </section>
          <aside className="w-80 bg-sidebar p-4 border-l hidden lg:block h-[calc(100vh-73px)] sticky top-[73px] z-10">
            <div className="text-muted-foreground text-sm">
              Recommended videos
            </div>
          </aside>
        </main>
      </div>
    </>
  );
}
