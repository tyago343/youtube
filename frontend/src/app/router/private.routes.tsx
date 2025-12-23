import { selectUser } from "@/modules/user/selector/user.selector";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export const PrivateRoute = () => {
  const user = useSelector(selectUser);
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};
