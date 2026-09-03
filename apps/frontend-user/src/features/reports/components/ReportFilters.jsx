export function ReportFilters({
  reportType,
  setReportType,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) {
  const reportTypes = [
    { value: "GUEST", label: "របាយការណ៍ភ្ញៀវ (Guests)" },
    { value: "RSVP", label: "របាយការណ៍ឆ្លើយតប (RSVP)" },
    { value: "CHECKIN", label: "របាយការណ៍វត្តមាន (Check-In)" },
    { value: "GIFTS", label: "របាយការណ៍ចំណងដៃ (Gifts)" },
    { value: "DELIVERY", label: "របាយការណ៍ផ្ញើសារ (Delivery)" },
  ];

  return (
    <div className="report-filters-bar">
      <div className="report-filter-item">
        <label htmlFor="report-type-select">ប្រភេទរបាយការណ៍</label>
        <select
          id="report-type-select"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="report-select"
        >
          {reportTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="report-filter-item">
        <label htmlFor="report-date-from">ចាប់ពីថ្ងៃ</label>
        <input
          id="report-date-from"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="report-date-input"
        />
      </div>

      <div className="report-filter-item">
        <label htmlFor="report-date-to">ដល់ថ្ងៃ</label>
        <input
          id="report-date-to"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="report-date-input"
        />
      </div>
    </div>
  );
}

export default ReportFilters;
