import { selectUser } from "@user/model/user.selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

export function PublicGuard() {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (user && location.pathname.startsWith("/auth")) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
