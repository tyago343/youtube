<script setup lang="ts">
definePageMeta({
  title: "Report",
});

const { id } = useRoute().params;
</script>

<template>
  <div>
    <h1>Report {{ id }}</h1>
  </div>
</template>
