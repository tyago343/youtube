import Login from "../features/auth/pages/Login";
import Signup from "../features/auth/pages/Signup";
import { Route, Routes } from "react-router";
import Home from "@pages/Home";
function PublicRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
export default PublicRoutes;
