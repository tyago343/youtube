import { selectUser } from "@user/model/user.selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export const PublicRoute = () => {
  const user = useSelector(selectUser);
  if (user && window.location.pathname.startsWith("/auth")) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
