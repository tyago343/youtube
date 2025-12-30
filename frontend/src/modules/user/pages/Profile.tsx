import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar/avatar";
import type { User } from "../types/user.type";
import { Camera } from "lucide-react";
import { type profileFormSchemaType } from "../schemas/profile-form.schema";
import { useSelector } from "react-redux";
import { selectUser } from "@user/model/user.selectors";
import {
  useUpdateAvatarMutation,
  useUpdateUserMutation,
} from "../model/user.api";
import ProfileFormComponent from "../components/profile-form.component";

function Profile() {
  const user = useSelector(selectUser) as User;
  const [updateAvatar] = useUpdateAvatarMutation();
  const [updateUser] = useUpdateUserMutation();
  async function onSubmit(data: Partial<profileFormSchemaType>) {
    await updateUser({ id: user.id, data });
  }
  async function onUploadAvatar(file: File | null) {
    if (file) {
      await updateAvatar({ id: user.id, file });
    }
  }
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
          onChange={(e) => onUploadAvatar(e.target.files?.[0] ?? null)}
        />
        <ProfileFormComponent onSubmit={onSubmit} user={user} />
      </section>
    </>
  );
}
export default Profile;
