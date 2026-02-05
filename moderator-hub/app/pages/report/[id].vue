<script setup lang="ts">
definePageMeta({
  title: "Report",
});

const route = useRoute();
const id = computed(() => route.params.id);

const { report, reportableItem, fullReport, pending, error } =
  await useReport(id);
</script>

<template>
  <div>
    <h1>Report {{ id }}</h1>
    <div v-if="pending">Loading…</div>
    <div v-else-if="error">Error loading report.</div>
    <template v-else-if="report">
      <pre>{{ report }}</pre>
      <pre v-if="reportableItem">{{ reportableItem }}</pre>
    </template>
  </div>
</template>
