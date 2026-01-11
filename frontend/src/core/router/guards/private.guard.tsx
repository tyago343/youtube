import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";
import { RouterFallback } from "@core/providers/router-fallback";
import { useAuthInit } from "@shared/hooks/use-auth-init.hook.";
import { AuthenticatedUserProvider } from "@auth/context/authenticated-user.provider";
import { selectUser } from "@user/model/user.selectors";

export function PrivateGuard() {
  const { isInitialized } = useAuthInit();
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isInitialized) {
    return <RouterFallback />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return (
    <AuthenticatedUserProvider user={user}>
      <Outlet />
    </AuthenticatedUserProvider>
  );
}
