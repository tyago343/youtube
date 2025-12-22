import { Route, Routes } from "react-router";
import UploadVideo from "@/modules/video/pages/UploadVideo";
import type { User } from "@/modules/user/types/user.type";
import Home from "@/pages/Home";
import Profile from "@/modules/user/pages/Profile";
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
