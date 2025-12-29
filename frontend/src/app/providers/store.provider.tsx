import store from "../store";
import { Provider } from "react-redux";
import { useAuthInit } from "@/shared/hooks/use-auth-init";
import { RouterFallback } from "./router-fallback";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { isInitialized } = useAuthInit();

  if (!isInitialized) {
    return <RouterFallback />;
  }

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
