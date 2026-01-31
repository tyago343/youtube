<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import { useUserStore } from "~/stores/user";
const toast = useToast();
const schema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});
const { login } = useUserStore();
async function onSubmit(formData: FormSubmitEvent<Schema>) {
  try {
    await login(formData.data);
    navigateTo("/");
  } catch (error) {
    toast.add({
      title: "Invalid credentials",
      description: "Please check your email and password",
      color: "error",
    });
    console.error(error);
  }
}
</script>

<template>
  <UContainer class="h-screen flex items-center justify-center">
    <NuxtLink to="/">hoem</NuxtLink>
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4 w-full max-w-md"
      @submit="onSubmit"
    >
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormField>

      <UButton type="submit">Submit</UButton>
    </UForm>
  </UContainer>
</template>
