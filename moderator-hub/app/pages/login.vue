<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { loginSchema, type LoginSchema } from "#shared/schemas/auth";

definePageMeta({
  layout: "auth",
  title: "Login",
});

const { fetch: fetchSession } = useUserSession();

const toast = useToast();

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];
async function onSubmit(formData: FormSubmitEvent<LoginSchema>) {
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: formData.data,
    });
    await fetchSession();
    navigateTo("/");
  } catch (error) {
    toast.add({
      title: "Invalid credentials",
      description: "Please check your email and password",
      color: "error",
    });
  }
}

onMounted(async () => {
  await fetchSession();
  const { loggedIn } = useUserSession();
  if (loggedIn.value) navigateTo("/");
});
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="loginSchema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit.prevent="onSubmit"
      />
    </UPageCard>
  </div>
</template>
