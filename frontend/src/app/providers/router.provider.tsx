import { Suspense } from "react";
import { RouterProvider as ReactRouterProvider } from "react-router";
import { router } from "../router";
import { Spinner } from "@/shared/ui/spinner/spinner";

/**
 * Provider del router con Suspense para lazy loading
 */
export const RouterProvider = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ReactRouterProvider router={router} />
    </Suspense>
  );
};
