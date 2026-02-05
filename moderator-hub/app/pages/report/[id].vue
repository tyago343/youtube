<script setup lang="ts">
import type { UseReportDetailReturn } from "~/composables/useReport";
import type { VideoReportableItem } from "#shared/schemas/report";

definePageMeta({
  title: "Report",
});

const route = useRoute();
const id = computed(() => route.params.id);

const { report, reportableItem, pending, error } = (await useReport(
  id
)) as UseReportDetailReturn;

const isVideoReport = computed(() => report.value?.reportableType === "VIDEO");

const videoItem = computed<VideoReportableItem | null>(() =>
  isVideoReport.value && reportableItem.value
    ? (reportableItem.value as VideoReportableItem)
    : null
);

function formatDateUS(isoDate: string | null | undefined): string {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function onDeleteVideo() {
  // TODO: implement
}

function onStrikeChannel() {
  // TODO: implement
}

function onSuspension() {
  // TODO: implement
}

function onPermanentBan() {
  // TODO: implement
}
</script>

<template>
  <div>
    <div v-if="pending" class="flex items-center justify-center py-12">
      <span class="text-gray-500 dark:text-gray-400">Loading…</span>
    </div>
    <div
      v-else-if="error"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
    >
      Error loading report.
    </div>

    <template v-else-if="report && isVideoReport && videoItem">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Left column ~33% -->
        <aside
          class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/50"
        >
          <div>
            <h2
              class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              Report reason
            </h2>
            <p class="text-gray-900 dark:text-gray-100">
              {{ report.reason }}
            </p>
          </div>
          <div>
            <h2
              class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              Date
            </h2>
            <p class="text-gray-900 dark:text-gray-100">
              {{ formatDateUS(report.createdAt) }}
            </p>
          </div>

          <!-- Action buttons 2x2 -->
          <div
            class="mt-2 grid grid-cols-2 grid-rows-2 gap-2 rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800/80"
          >
            <UButton
              block
              color="error"
              variant="soft"
              label="Delete video"
              class="h-full justify-center"
              @click="onDeleteVideo"
            />
            <UButton
              block
              color="warning"
              variant="soft"
              label="Strike to channel"
              class="h-full justify-center"
              @click="onStrikeChannel"
            />
            <UButton
              block
              color="warning"
              variant="soft"
              label="Suspension"
              class="h-full justify-center"
              @click="onSuspension"
            />
            <UButton
              block
              color="error"
              variant="soft"
              label="Permanent ban"
              class="h-full justify-center"
              @click="onPermanentBan"
            />
          </div>
        </aside>

        <!-- Right column: video + info -->
        <div class="flex flex-col gap-4 lg:col-span-2">
          <div
            class="aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-black dark:border-gray-800"
          >
            <video
              v-if="videoItem.url"
              :src="videoItem.url"
              controls
              class="h-full w-full object-contain"
              :poster="videoItem.thumbnailUrl ?? undefined"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div
            class="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/50"
          >
            <h2
              class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              Title
            </h2>
            <p class="mb-4 text-gray-900 dark:text-gray-100">
              {{ videoItem.title }}
            </p>
            <h2
              class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              Description
            </h2>
            <p
              class="mb-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300"
            >
              {{ videoItem.description || "—" }}
            </p>
            <h2
              class="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
            >
              Dislikes
            </h2>
            <p class="text-gray-900 dark:text-gray-100">
              {{ videoItem.dislikes }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- Fallback when report is not a video report -->
    <div
      v-else-if="report && !isVideoReport"
      class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
    >
      This report type ({{ report.reportableType }}) is not supported yet.
    </div>

    <div
      v-else-if="report && !reportableItem"
      class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200"
    >
      Report content could not be loaded.
    </div>
  </div>
</template>
