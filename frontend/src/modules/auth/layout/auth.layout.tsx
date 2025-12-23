import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function AuthLayout() {
  return (
    <div className="dark min-h-screen bg-background text-white ">
      <Toaster richColors position="top-right" />
      <Outlet />
    </div>
  );
}
