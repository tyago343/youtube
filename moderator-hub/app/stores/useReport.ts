import type { Report } from "#shared/schemas/report";

type ReportStatus = "idle" | "pending" | "success" | "error";

export const useReportStore = defineStore("report", {
  state: () => ({
    reportList: [] as Report[],
    report: null as Report | null,
    status: "idle" as ReportStatus,
    error: null as unknown,
  }),

  actions: {
    async fetchReportList() {
      const requestFetch = useRequestFetch();

      this.status = "pending";
      this.error = null;
      try {
        const data = await requestFetch<Report[]>("/api/reports");
        this.reportList = data;
        this.status = "success";
      } catch (e) {
        this.error = e;
        this.status = "error";
        throw e;
      } finally {
        this.status = "idle";
      }
    },
    async fetchReport(id: string) {
      const requestFetch = useRequestFetch();
      this.status = "pending";
      this.error = null;
      try {
        const data = await requestFetch<Report>(`/api/reports/${id}`);
        this.report = data;
        this.status = "success";
      } catch (e) {
        this.error = e;
        this.status = "error";
        throw e;
      } finally {
        this.status = "idle";
      }
    },
  },
});
