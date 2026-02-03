<script setup lang="ts">
import type { Report } from "~/types/report";

definePageMeta({
  title: "Dashboard",
});

const { data: reports, status } = await useFetch<Report[]>("/api/reports", {
  key: "reports",
});
</script>

<template>
  <ReportsTable :reports="reports ?? []" :loading="status === 'pending'" />
</template>
