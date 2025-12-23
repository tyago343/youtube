import { lazy } from "react";
import type { RouteObject } from "react-router";
import { PublicRoute } from "./public.routes";
import { PrivateRoute } from "./private.routes";
import MainLayout from "@/shared/layout/main.layout";
const Home = lazy(() => import("@/app/pages/Home"));
const Login = lazy(() => import("@auth/pages/Login"));
const Signup = lazy(() => import("@auth/pages/Signup"));
const Profile = lazy(() => import("@user/pages/Profile"));
const AuthLayout = lazy(() => import("@auth/layout/auth.layout"));
export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <MainLayout>
        <PublicRoute />
      </MainLayout>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <MainLayout>
        <PrivateRoute />
      </MainLayout>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
];
