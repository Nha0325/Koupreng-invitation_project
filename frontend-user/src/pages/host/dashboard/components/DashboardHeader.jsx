export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-[19px] font-bold text-slate-800 m-0 leading-8">
          ផ្ទាំងព័ត៌មានទូទៅ
        </h1>

        <p className="text-sm text-[#7a8799] m-0">
          ត្រួតពិនិត្យស្ថានភាពព្រឹត្តិការណ៍របស់អ្នក
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-[#f3e8f0] text-sm text-[#344256]"
        >
          📅 ថ្ងៃទី ១ ធ្នូ ២០២៥
        </button>

        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[12px] font-medium shadow-[0px_4px_16px_#8686d94c]"
          style={{
            background: "linear-gradient(166deg,#8686d9 0%,#6b6bc4 100%)",
          }}
        >
          + បន្ថែមព្រឹត្តិការណ៍
        </button>
      </div>
    </header>
  );
}