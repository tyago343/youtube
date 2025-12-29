import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { RouteErrorBoundary } from "@/shared/error-boundary/RouteErrorBoundary";

export default function AuthLayout() {
  return (
    <div className="dark min-h-screen bg-background text-white ">
      <Toaster richColors position="top-right" />
      <RouteErrorBoundary context="auth">
        <Outlet />
      </RouteErrorBoundary>
    </div>
  );
}
