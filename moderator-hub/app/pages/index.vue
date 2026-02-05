<script setup lang="ts">
definePageMeta({
  title: "Dashboard",
});

const { reportList, pending, error } = await useReport();
</script>

<template>
  <ReportsTable
    :reports-list="reportList"
    :loading="pending"
    :error="error"
  />
</template>
