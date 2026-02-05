export async function useReports() {
  const { fetchReportList, reportList, error, status } = useReportStore();
  await callOnce(fetchReportList);

  return {
    reportList: reportList,
    error: error,
    status: status,
  };
}
