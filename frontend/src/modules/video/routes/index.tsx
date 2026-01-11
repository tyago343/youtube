import { lazy } from "react";
import type { RouteObject } from "react-router";
import { PrivateGuard } from "@core/router/guards/private.guard";
import MainLayout from "@shared/layouts/main.layout";
import { VideoLayout } from "../layout/video.layout";

const VideoWatch = lazy(() => import("../pages/VideoWatch"));
const UploadVideo = lazy(() => import("../pages/UploadVideo"));

export const videoRoutes: RouteObject[] = [
  {
    path: "/watch/:videoId",
    element: <VideoLayout />,
    children: [
      {
        index: true,
        element: <VideoWatch />,
      },
    ],
  },
  {
    path: "/upload-video",
    element: <MainLayout />,
    children: [
      {
        element: <PrivateGuard />,
        children: [
          {
            index: true,
            element: <UploadVideo />,
          },
        ],
      },
    ],
  },
];
