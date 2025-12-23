import { Suspense } from "react";
import { RouterProvider as ReactRouterProvider } from "react-router";
import { router } from "../router";
import { Spinner } from "@/shared/ui/spinner/spinner";

export const RouterProvider = () => {
  return (
    <Suspense
      fallback={
        <div className="dark min-h-screen bg-background text-white flex justify-center items-center h-screen">
          <Spinner className="size-10 animate-spin" />
        </div>
      }
    >
      <ReactRouterProvider router={router} />
    </Suspense>
  );
};
