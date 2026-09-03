import { useCallback, useEffect, useState } from "react";
import { reportsApi } from "../api/reportsApi";

export function useReports(invitationId) {
  const [reportType, setReportType] = useState("GUEST");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const loadReport = useCallback(() => {
    if (!invitationId) return;
    setLoading(true);
    setError("");

    const params = { type: reportType };
    if (dateFrom) params.from = dateFrom;
    if (dateTo) params.to = dateTo;

    reportsApi
      .getReport(invitationId, params)
      .then((data) => {
        setReportData(data || null);
      })
      .catch((err) => {
        setError(err?.message || "Could not load report data");
      })
      .finally(() => setLoading(false));
  }, [invitationId, reportType, dateFrom, dateTo]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const exportCsv = async () => {
    setExporting(true);
    try {
      await reportsApi.exportCsv(invitationId, reportType);
    } catch (err) {
      setError(err?.message || "Could not export CSV");
    } finally {
      setExporting(false);
    }
  };

  return {
    reportType,
    setReportType,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    reportData,
    loading,
    exporting,
    error,
    loadReport,
    exportCsv,
  };
}

export default useReports;
