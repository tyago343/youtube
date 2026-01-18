import { lazy } from "react";
import type { RouteObject } from "react-router";
import MainLayout from "@shared/layouts/main.layout";
import { PrivateGuard } from "@core/router/guards/private.guard";

const MyChannel = lazy(() => import("../pages/MyChannel"));

export const channelRoutes: RouteObject[] = [
  {
    path: "/channel/:username",
    element: <MainLayout />,
    children: [
      {
        element: <PrivateGuard />,
        children: [
          {
            index: true,
            element: <MyChannel />,
          },
        ],
      },
    ],
  },
];
