import type { User } from "@/modules/user/types/user.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  uploadVideoSchema,
  type UploadVideoForm,
} from "../schemas/UploadVideoForm.schema";

function UploadVideo({ user }: { user: User }) {
  const { control, handleSubmit } = useForm<UploadVideoForm>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      video: undefined,
      thumbnail: undefined,
    },
  });
  async function onSubmit(data: UploadVideoForm) {
    console.log(data);
  }
  return (
    <div>
      <h1>Upload Video</h1>
    </div>
  );
}

export default UploadVideo;
