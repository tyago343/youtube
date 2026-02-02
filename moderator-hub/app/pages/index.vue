<script setup lang="ts">
import { useUserSession } from "#imports";
const { clear } = useUserSession();
const logout = async () => {
  await clear();
  navigateTo("login");
};
</script>

<template>
  <h1>Index page</h1>
  <UButton @click="logout">Logout</UButton>
</template>
