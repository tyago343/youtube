import { publicRoutes } from "./public.routes";
import { Routes } from "react-router";
export const AppRoutes = () => {
  return <Routes>{publicRoutes.map((route) => route)}</Routes>;
};
