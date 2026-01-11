import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { RouteErrorBoundary } from "@/shared/error-boundary/route-error.boundary";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-right" />
      <RouteErrorBoundary context="auth">
        <Outlet />
      </RouteErrorBoundary>
    </div>
  );
}
