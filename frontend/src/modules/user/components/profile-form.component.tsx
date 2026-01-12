import { useTranslation } from "react-i18next";
import type { User } from "../types/user.type";
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
} from "@/shared/ui/field/field";
import { Input } from "@/shared/ui/input/input";
import Button from "@/shared/ui/button/button";

export interface ProfileFormComponentProps {
  onSubmit: (data: Partial<profileFormSchemaType>) => void;
  user: User;
}

function ProfileFormComponent({ onSubmit, user }: ProfileFormComponentProps) {
  const { t } = useTranslation("shared");
  const { control, handleSubmit, formState } = useForm<profileFormSchemaType>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
    },
  });

  const isDirty = formState.isDirty;
  const dirtyFields = formState.dirtyFields;

  const handleFormSubmit = (data: profileFormSchemaType) => {
    const changedData: Partial<profileFormSchemaType> = {};

    if (dirtyFields.username) {
      changedData.username = data.username;
    }

    if (dirtyFields.email) {
      changedData.email = data.email;
    }

    if (Object.keys(changedData).length > 0) {
      onSubmit(changedData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full max-w-md mt-4"
    >
      <FieldGroup className="mt-4">
          <Controller
          control={control}
          name="username"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("username")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup className="mt-4">
          <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("email")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="mt-4 float-right" disabled={!isDirty}>
        {t("save")}
      </Button>
    </form>
  );
}
export default ProfileFormComponent;
