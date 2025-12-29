import { lazy } from "react";
import type { RouteObject } from "react-router";
import MainLayout from "@/shared/layout/main.layout";
import { PrivateGuard } from "@/core/router/guards/private.guard";

const Profile = lazy(() => import("../pages/Profile"));

export const userRoutes: RouteObject[] = [
  {
    path: "/profile",
    element: <MainLayout />,
    children: [
      {
        element: <PrivateGuard />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
        ],
      },
    ],
  },
];

