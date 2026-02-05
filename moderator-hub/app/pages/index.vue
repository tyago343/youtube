<script setup lang="ts">
definePageMeta({
  title: "Dashboard",
});

const { reportList, status, error } = await useReports();
</script>

<template>
  <ReportsTable
    :reports-list="reportList"
    :loading="status === 'pending'"
    :error="error"
  />
</template>
