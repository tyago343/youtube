import { lazy } from "react";
import type { RouteObject } from "react-router";
import { VideoLayout } from "../layout/video.layout";
import MainLayout from "@/shared/layout/main.layout";
import { PrivateGuard } from "@/core/router/guards/private.guard";

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
