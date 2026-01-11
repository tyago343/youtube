import { lazy } from "react";
import type { RouteObject } from "react-router";
import MainLayout from "@/shared/layouts/main.layout";
import { PublicGuard } from "./guards/public.guard";

const Home = lazy(() => import("@/core/pages/Home"));
const NotFound = lazy(() => import("@/core/pages/NotFound"));

import { authRoutes } from "@auth/routes";
import { videoRoutes } from "@video/routes";
import { searchRoutes } from "@search/routes";
import { userRoutes } from "@user/routes";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        element: <PublicGuard />,
        children: [
          {
            index: true,
            element: <Home />,
          },
        ],
      },
    ],
  },

  ...authRoutes,

  ...searchRoutes,

  ...videoRoutes,

  ...userRoutes,

  {
    path: "*",
    element: <NotFound />,
  },
];
