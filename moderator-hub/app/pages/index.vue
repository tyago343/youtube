<script setup lang="ts">
definePageMeta({
  title: "Dashboard",
});

const { clear, user } = useUserSession();
const logout = async () => {
  await clear();
  navigateTo("login");
};
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1 class="text-2xl font-bold">Welcome to Moderator Hub</h1>
    <p class="mt-2 text-gray-600 dark:text-gray-400">
      You are logged in as {{ user?.email }}.
    </p>
    <UButton class="mt-4" @click="logout">Logout</UButton>
  </div>
</template>
