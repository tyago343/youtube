import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import { Route } from "react-router";
import Home from "@pages/Home";
export const publicRoutes = [
  <Route path="/login" element={<Login />} />,
  <Route path="/signup" element={<Signup />} />,
  <Route path="/" element={<Home />} />,
];
