import { StrictMode } from "react";
import { RouterProvider } from "./providers/router.provider";
import { StoreProvider } from "./providers/store.provider";
import "./index.css";

export function AppInit() {
  return (
    <StrictMode>
      <StoreProvider>
        <RouterProvider />
      </StoreProvider>
    </StrictMode>
  );
}
