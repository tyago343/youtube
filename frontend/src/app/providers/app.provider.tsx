import { StrictMode, type ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/app/store";
import { RouterProvider } from "./router.provider";

interface AppProviderProps {
  children?: ReactNode; // Opcional si no lo usas
}

/**
 * Provider principal de la aplicación
 * Agrupa todos los providers necesarios
 */
export function AppProvider({ children }: AppProviderProps) {
  return (
    <StrictMode>
      <Provider store={store}>
        <RouterProvider />
        {children}
      </Provider>
    </StrictMode>
  );
}
