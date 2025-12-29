import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { RouteErrorBoundary } from "@/shared/error-boundary/RouteErrorBoundary";

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
