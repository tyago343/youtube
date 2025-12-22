import { createRoot } from "react-dom/client";
import InitApp from "./app/index.tsx";
import { AppProvider } from "./app/providers/app-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <InitApp />
  </AppProvider>
);
