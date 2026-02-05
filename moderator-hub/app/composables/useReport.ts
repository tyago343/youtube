import type { MaybeRefOrGetter } from "vue";
import type {
  FullReportResponse,
  Report,
  ReportableItem,
} from "#shared/schemas/report";

export type UseReportListReturn = {
  reportList: Ref<Report[]>;
  pending: Ref<boolean>;
  error: Ref<unknown>;
  status: Ref<"idle" | "pending" | "success" | "error">;
  refresh: () => Promise<void>;
};

export type UseReportDetailReturn = {
  fullReport: Ref<FullReportResponse | undefined>;
  report: ComputedRef<Report | null>;
  reportableItem: ComputedRef<ReportableItem | null>;
  pending: Ref<boolean>;
  error: Ref<unknown>;
  status: Ref<"idle" | "pending" | "success" | "error">;
  refresh: () => Promise<void>;
};

const REPORTS_LIST_KEY = "reports-list";

function normalizeId(
  id: MaybeRefOrGetter<string | string[] | undefined>
): string {
  const value = toValue(id);
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value[0] ?? "";
  return value;
}

export async function useReport(
  id?: MaybeRefOrGetter<string | string[] | undefined>
): Promise<UseReportListReturn | UseReportDetailReturn> {
  if (id === undefined || id === null) {
    const result = await useFetch<Report[]>("/api/reports", {
      key: REPORTS_LIST_KEY,
      default: () => [],
    });
    if (!result.data) {
      throw new Error("Failed to fetch reports list");
    }
    return {
      reportList: computed(() => result.data?.value ?? []),
      pending: result.pending,
      error: result.error,
      status: result.status,
      refresh: result.refresh,
    };
  }

  const idRef = computed(() => normalizeId(id));
  const result = await useFetch<FullReportResponse>(
    () => `/api/reports/${idRef.value}`,
    { key: () => `report-${idRef.value}` }
  );
  if (!result.data) {
    throw new Error("Failed to fetch report");
  }
  return {
    fullReport: computed(() => result.data?.value ?? undefined),
    report: computed(() => result.data?.value?.report ?? null),
    reportableItem: computed(() => result.data?.value?.reportableItem ?? null),
    pending: result.pending,
    error: result.error,
    status: result.status,
    refresh: result.refresh,
  };
}
