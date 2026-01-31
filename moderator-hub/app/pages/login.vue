<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import { useUserStore } from "~/stores/user";

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
function onSubmit(formData: FormSubmitEvent<Schema>) {
  login(formData.data);
}
</script>

<template>
  <UContainer class="h-screen flex items-center justify-center">
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
