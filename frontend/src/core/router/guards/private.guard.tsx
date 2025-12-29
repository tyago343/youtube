import { selectUser } from "@user/model/user.selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

export function PrivateGuard() {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
