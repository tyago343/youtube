import { useSelector } from "react-redux";
import { selectUser } from "../modules/user/selector/user.selector";
import PrivateRoutes from "./router/private.routes";
import PublicRoutes from "./router/public.routes";
import MainLayout from "../layout/main.layout";
import "./index.css";
function InitApp() {
  const user = useSelector(selectUser);
  if (user) {
    return (
      <MainLayout user={user}>
        <PrivateRoutes user={user} />
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <PublicRoutes />
    </MainLayout>
  );
}
export default InitApp;
