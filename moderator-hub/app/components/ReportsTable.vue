<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type {
  Report,
  ReportStatus,
  ReportSeverity,
} from "#shared/schemas/report";

const UBadge = resolveComponent("UBadge");

const props = defineProps<{
  reports: Report[];
  loading?: boolean;
  error?: unknown;
}>();

const {
  statusFilter,
  sortField,
  sortOrder,
  filterAndSort,
  setStatusFilter,
  setSort,
} = useReportsFilters();

const tableData = computed(() => {
  const list = props.reports ?? [];
  return filterAndSort(list);
});

const statusFilters: { label: string; value: ReportStatus | null }[] = [
  { label: "All", value: null },
  { label: "Pending", value: "PENDING" },
  { label: "In Review", value: "IN_REVIEW" },
  { label: "Escalated to Legal", value: "ESCALATED_TO_LEGAL" },
  { label: "Resolved", value: "RESOLVED" },
];

function reportableTypeLabel(type: string): string {
  const map: Record<string, string> = {
    VIDEO: "Video",
    CHANNEL: "Channel",
    COMMENT: "Comment",
    PLAYLIST: "Playlist",
    USER: "User",
  };
  return map[type] ?? type;
}

function severityDotColor(severity: ReportSeverity): string {
  const map: Record<ReportSeverity, string> = {
    LOW: "bg-success",
    MEDIUM: "bg-warning",
    HIGH: "bg-error",
    CRITICAL: "bg-error",
  };
  return map[severity] ?? "bg-muted";
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    PENDING: "Pending",
    ASSIGNED: "Assigned",
    IN_REVIEW: "In Review",
    ESCALATED_TO_LEGAL: "Escalated to Legal",
    RESOLVED: "Resolved",
    DISMISSED: "Dismissed",
  };
  return map[s] ?? s;
}

function statusBadgeColor(
  s: string
): "success" | "warning" | "error" | "info" | "neutral" {
  const map: Record<
    string,
    "success" | "warning" | "error" | "info" | "neutral"
  > = {
    PENDING: "success",
    ASSIGNED: "info",
    IN_REVIEW: "warning",
    ESCALATED_TO_LEGAL: "info",
    RESOLVED: "neutral",
    DISMISSED: "neutral",
  };
  return map[s] ?? "neutral";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const columns: TableColumn<Report>[] = [
  {
    accessorKey: "reportableType",
    header: "Type",
    cell: ({ row }) => {
      const r = row.original;
      const typeLabel = reportableTypeLabel(r.reportableType);
      const dotClass = severityDotColor(r.severity as ReportSeverity);
      return h("div", { class: "flex items-center gap-2" }, [
        h("span", {
          class: `size-2.5 rounded-full shrink-0 ${dotClass}`,
          "aria-hidden": "true",
        }),
        h("span", {}, `${typeLabel}: ${r.reason}`),
      ]);
    },
  },
  {
    accessorKey: "reason",
    header: "Title / Description",
    cell: ({ row }) => row.original.reason,
  },
  {
    accessorKey: "createdAt",
    header: () => {
      const isSorted = sortField.value === "createdAt";
      const isAsc = sortOrder.value === "asc";
      return h(
        "button",
        {
          type: "button",
          class:
            "flex items-center gap-1 font-semibold text-highlighted hover:opacity-80",
          onClick: () =>
            setSort("createdAt", isSorted && isAsc ? "desc" : "asc"),
        },
        ["Date", isSorted ? (isAsc ? " ↑" : " ↓") : ""]
      );
    },
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "status",
    header: () => {
      const isSorted = sortField.value === "status";
      const isAsc = sortOrder.value === "asc";
      return h(
        "button",
        {
          type: "button",
          class:
            "flex items-center gap-1 font-semibold text-highlighted hover:opacity-80",
          onClick: () => setSort("status", isSorted && isAsc ? "desc" : "asc"),
        },
        ["Status", isSorted ? (isAsc ? " ↑" : " ↓") : ""]
      );
    },
    cell: ({ row }) => {
      const s = row.original.status;
      const color = statusBadgeColor(s);
      return h(
        UBadge,
        {
          class: "capitalize",
          variant: "subtle",
          color,
        },
        () => statusLabel(s)
      );
    },
  },
];
</script>

<template>
  <div class="flex flex-1 flex-col gap-4">
    <div class="flex flex-wrap items-center gap-2">
      <UButton
        v-for="f in statusFilters"
        :key="f.value ?? 'all'"
        :color="statusFilter === f.value ? 'primary' : 'neutral'"
        :variant="statusFilter === f.value ? 'solid' : 'outline'"
        size="sm"
        :label="f.label"
        @click="setStatusFilter(f.value)"
      />
    </div>

    <div
      v-if="error"
      class="flex min-h-[200px] flex-1 items-center justify-center rounded-lg border border-default bg-default p-6"
    >
      <p class="text-center text-muted">
        Could not load reports. Check the notification or try again.
      </p>
    </div>
    <div
      v-else
      class="min-w-0 flex-1 divide-y divide-accented rounded-lg border border-default bg-default"
    >
      <UTable
        :data="tableData"
        :columns="columns"
        :loading="loading"
        sticky
        class="min-w-full"
      >
        <template #empty>
          <p class="py-6 text-center text-muted">
            No reports match the filters.
          </p>
        </template>
      </UTable>
    </div>
  </div>
</template>

<style scoped>
:deep(tbody tr:nth-child(odd)) {
  background-color: transparent;
}

:deep(tbody tr:nth-child(even)) {
  background-color: rgb(248 250 252);
}

:deep(tbody tr:hover) {
  background-color: rgb(226 232 240);
}

@media (prefers-color-scheme: dark) {
  :deep(tbody tr:nth-child(even)) {
    background-color: rgb(30 41 59 / 0.4);
  }

  :deep(tbody tr:hover) {
    background-color: rgb(51 65 85 / 0.6);
  }
}

.dark :deep(tbody tr:nth-child(even)) {
  background-color: rgb(30 41 59 / 0.4);
}

.dark :deep(tbody tr:hover) {
  background-color: rgb(51 65 85 / 0.6);
}
</style>
