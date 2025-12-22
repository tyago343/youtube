import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "../types/user.type";
import { Camera } from "lucide-react";

function Profile({ user }: { user: User }) {
  return (
    <>
      <h1>Profile</h1>
      <section className="flex flex-col items-center justify-center">
        <label className="relative" htmlFor="upload-avatar">
          <Avatar className="cursor-pointer w-32 h-32">
            <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 bg-black rounded-full p-1.5 cursor-pointer z-10">
            <Camera className="size-4 text-white" />
          </div>
        </label>
        <input
          type="file"
          name="upload-avatar"
          id="upload-avatar"
          className="hidden"
        />
      </section>
    </>
  );
}
export default Profile;
