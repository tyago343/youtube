<script setup lang="ts">
definePageMeta({
  title: "Dashboard",
});

const { data: reports, status, error } = await useReports();
</script>

<template>
  <ReportsTable
    :reports="reports"
    :loading="status === 'pending'"
    :error="error"
  />
</template>
