import { Route, Routes } from "react-router";
import UploadVideo from "@/features/video/pages/UploadVideo";
import type { User } from "@/features/user/types/user.type";
import Home from "@/pages/Home";
import Profile from "@/features/user/pages/Profile";
function PrivateRoutes({ user }: { user: User }) {
  return (
    <Routes>
      <Route path="/upload-video" element={<UploadVideo user={user} />} />
      <Route path="/profile" element={<Profile user={user} />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
export default PrivateRoutes;
