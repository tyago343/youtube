import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "../types/user.type";
import { Camera } from "lucide-react";
import {
  profileFormSchema,
  type profileFormSchemaType,
} from "../schemas/profile-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";

function Profile({ user }: { user: User }) {
  const { control, handleSubmit } = useForm<profileFormSchemaType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });
  async function onSubmit(data: profileFormSchemaType) {
    console.log(data);
  }
  async function onUploadAvatar(file: File | null) {
    console.log(file);
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
        <FieldGroup>
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
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
        </FieldGroup>
        <FieldGroup>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
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
        </FieldGroup>
        <Button type="button" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </section>
    </>
  );
}
export default Profile;
