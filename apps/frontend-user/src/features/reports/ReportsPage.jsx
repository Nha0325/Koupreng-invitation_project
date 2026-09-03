import { useParams } from "react-router-dom";
import { useReports } from "./hooks/useReports";
import { ReportFilters } from "./components/ReportFilters";
import { ReportSummaryCards } from "./components/ReportSummaryCards";
import { ReportTable } from "./components/ReportTable";
import { ErrorState, LoadingButton, SkeletonCard } from "@/shared/ui";
import "./ReportsPage.css";

export default function ReportsPage({ invitationId: propInvitationId }) {
  const params = useParams();
  const invitationId = propInvitationId || params.invitationId || params.id;

  const {
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
  } = useReports(invitationId);

  return (
    <main className="dash-main reports-page">
      <header className="dash-page-header reports-header">
        <div>
          <span className="dash-kicker">Analytics & Export</span>
          <h1>របាយការណ៍ និងស្ថិតិ</h1>
          <p>ពិនិត្យទិន្នន័យសង្ខេប ទាញយករបាយការណ៍ CSV សម្រាប់ភ្ញៀវ RSVP វត្តមាន និងចំណងដៃ។</p>
        </div>
        <LoadingButton
          type="button"
          className="dash-btn dash-btn-primary"
          isLoading={exporting}
          onClick={exportCsv}
        >
          ទាញយកជា CSV
        </LoadingButton>
      </header>

      <ReportFilters
        reportType={reportType}
        setReportType={setReportType}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      <ReportSummaryCards summary={reportData?.summary} />

      {error ? (
        <ErrorState message={error} onRetry={loadReport} />
      ) : loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "16px" }}>
          <SkeletonCard height="60px" />
          <SkeletonCard height="120px" />
        </div>
      ) : (
        <div className="report-data-section">
          <ReportTable data={reportData} reportType={reportType} />
        </div>
      )}
    </main>
  );
}
