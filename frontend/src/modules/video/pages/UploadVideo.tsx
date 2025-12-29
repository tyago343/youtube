/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User } from "@/modules/user/types/user.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  uploadVideoSchema,
  type UploadVideoForm,
} from "../schemas/UploadVideoForm.schema";
import { useSelector } from "react-redux";
import { selectUser } from "@user/model/user.selectors";

function UploadVideo() {
  // @ts-expect-error - User is not used
  const _user = useSelector(selectUser) as User;
  // @ts-expect-error - User is not used

  const { control, handleSubmit } = useForm<UploadVideoForm>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      video: undefined,
      thumbnail: undefined,
    },
  });
  // @ts-expect-error - User is not used
  async function _onSubmit(data: UploadVideoForm) {
    console.log(data);
  }
  return (
    <div>
      <h1>Upload Video</h1>
    </div>
  );
}

export default UploadVideo;
