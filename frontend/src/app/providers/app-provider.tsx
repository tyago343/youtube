import { StrictMode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import store from "@/app/store";
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    </StrictMode>
  );
}
