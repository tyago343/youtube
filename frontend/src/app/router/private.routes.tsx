import { selectUser } from "@/modules/user/model/user.selectors";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export const PrivateRoute = () => {
  const user = useSelector(selectUser);
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};
