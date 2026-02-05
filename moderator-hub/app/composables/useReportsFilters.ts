import type { Report, ReportStatus } from "#shared/schemas/report";

export type ReportsSortField = "status" | "createdAt";
export type ReportsSortOrder = "asc" | "desc";

export function useReportsFilters() {
  const statusFilter = ref<ReportStatus | null>(null);
  const sortField = ref<ReportsSortField>("status");
  const sortOrder = ref<ReportsSortOrder>("asc");

  const statusOrder: ReportStatus[] = [
    "PENDING",
    "ASSIGNED",
    "IN_REVIEW",
    "ESCALATED_TO_LEGAL",
    "RESOLVED",
    "DISMISSED",
  ];

  function filterAndSort(reports: Report[]): Report[] {
    let list = [...reports];

    if (statusFilter.value) {
      list = list.filter((r) => r.status === statusFilter.value);
    }

    list.sort((a, b) => {
      if (sortField.value === "status") {
        const ia = statusOrder.indexOf(a.status);
        const ib = statusOrder.indexOf(b.status);
        const cmp = ia - ib;
        return sortOrder.value === "asc" ? cmp : -cmp;
      }
      if (sortField.value === "createdAt") {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        const cmp = ta - tb;
        return sortOrder.value === "asc" ? cmp : -cmp;
      }
      return 0;
    });

    return list;
  }

  function setStatusFilter(status: ReportStatus | null) {
    statusFilter.value = status;
  }

  function setSort(field: ReportsSortField, order?: ReportsSortOrder) {
    sortField.value = field;
    if (order !== undefined) sortOrder.value = order;
  }

  return {
    statusFilter,
    sortField,
    sortOrder,
    filterAndSort,
    setStatusFilter,
    setSort,
  };
}
