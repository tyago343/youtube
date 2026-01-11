import { Outlet } from "react-router";
import Header from "@/shared/components/header/header.component";
import { Toaster } from "sonner";
import { RouteErrorBoundary } from "@/shared/error-boundary/route-error.boundary";

export function VideoLayout() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex">
          <section className="flex-1 px-8">
            <RouteErrorBoundary context="video">
              <Outlet />
            </RouteErrorBoundary>
          </section>
          <aside className="w-1/4  hidden lg:block h-[calc(100vh-73px)] top-[73px] z-10">
            <div className="text-muted-foreground text-sm p-4">
              Recommended videos
            </div>
          </aside>
        </main>
      </div>
    </>
  );
}
