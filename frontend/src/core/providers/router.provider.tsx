import { Suspense } from "react";
import { RouterProvider as ReactRouterProvider } from "react-router";
import { router } from "../router";
import { RouterFallback } from "./router-fallback";

export const RouterProvider = () => {
  return (
    <Suspense fallback={<RouterFallback />}>
      <ReactRouterProvider router={router} />
    </Suspense>
  );
};
