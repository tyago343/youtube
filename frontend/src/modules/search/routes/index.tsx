import { lazy } from "react";
import type { RouteObject } from "react-router";
import MainLayout from "@/shared/layout/main.layout";
import { PublicGuard } from "@/core/router/guards/public.guard";

const SearchResults = lazy(() => import("../pages/SearchResults"));

export const searchRoutes: RouteObject[] = [
  {
    path: "/search",
    element: <MainLayout />,
    children: [
      {
        element: <PublicGuard />,
        children: [
          {
            index: true,
            element: <SearchResults />,
          },
        ],
      },
    ],
  },
];

