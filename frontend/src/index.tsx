import { useSelector } from "react-redux";
import { selectUser } from "./features/user/selector/user.selector";
import PrivateRoutes from "./routes/private.routes";
import PublicRoutes from "./routes/public.routes";
import MainLayout from "./layout/main.layout";
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
