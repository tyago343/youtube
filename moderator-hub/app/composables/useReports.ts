import type { Report } from "#shared/schemas/report";

export function useReports() {
  return useFetch<Report[]>("/api/reports", {
    key: "reports",
    default: () => [],
  });
}
