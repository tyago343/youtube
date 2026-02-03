<script setup lang="ts">
import { useReports } from "~/composables/useReports";

definePageMeta({
  title: "Dashboard",
});

const { data: reports, status } = await useReports();
</script>

<template>
  <ReportsTable :reports="reports" :loading="status === 'pending'" />
</template>
