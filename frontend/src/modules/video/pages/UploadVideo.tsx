import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shared/ui/field/field";
import { Input } from "@shared/ui/input/input";
import { Textarea } from "@shared/ui/input/textarea";
import { Switch } from "@shared/ui/switch";
import Button from "@shared/ui/button/button";
import { FileDropZone } from "@shared/components/file-drop-zone/FileDropZone";
import { useAuthenticatedUser } from "@auth/context/authenticated-user.context";
import {
  uploadVideoSchema,
  type UploadVideoForm,
} from "../schemas/UploadVideoForm.schema";
import { useUploadVideoMutation } from "../model/video.api";
import ThumbnailPreview from "../components/thumbnail-preview.component";

function UploadVideo() {
  const user = useAuthenticatedUser();
  const userId = user.id;
  const [uploadVideo] = useUploadVideoMutation();
  const { control, handleSubmit } = useForm<UploadVideoForm>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      video: undefined,
      thumbnail: undefined,
      isPublic: false,
    },
  });
  async function onSubmit(data: UploadVideoForm) {
    try {
      const response = await uploadVideo({ ...data, ownerId: userId }).unwrap();
      if (response?.id) {
        toast.success("Video uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload video: " + error);
    }
  }
  return (
    <div>
      <h1>Upload Video</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="mt-4">
          <Controller
            control={control}
            name="isPublic"
            render={({ field, fieldState }) => (
              <div>
                <FieldLabel htmlFor={field.name}>Public?</FieldLabel>
                <Switch
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            )}
          />
        </FieldGroup>
        <div className="flex items-stretch gap-4 min-h-[400px]">
          <FieldGroup className="mt-4 flex-1">
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    rows={4}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="thumbnail"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Thumbnail</FieldLabel>
                  <FileDropZone
                    value={field.value}
                    onFileChange={field.onChange}
                    accept={["image/*"]}
                    label="Max size: 10MB, Accepted formats: JPEG, PNG, GIF, WEBP"
                    placeholder="Drop your thumbnail here or click to select"
                    variant="compact"
                    orientation="horizontal"
                    maxSize={1024 * 1024 * 10}
                    previewComponent={(file) => (
                      <ThumbnailPreview file={file} />
                    )}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className="mt-4 flex-1 w-100% h-100%">
            <Controller
              control={control}
              name="video"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FileDropZone
                    value={field.value}
                    onFileChange={field.onChange}
                    accept={["video/*"]}
                    label="Max size: 100MB, Accepted formats: MP4, MOV, AVI, WMV, MKV"
                    placeholder="Drop your video here or click to select"
                    variant="large"
                    maxSize={1024 * 1024 * 100}
                  />
                </Field>
              )}
            />
          </FieldGroup>
        </div>
        <Button type="submit" size="lg" className="mt-4 px-12">
          Upload
        </Button>
      </form>
    </div>
  );
}

export default UploadVideo;
