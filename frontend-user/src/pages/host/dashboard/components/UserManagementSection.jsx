import {
  guestHeaders,
  guests,
  quickActions,
  upcomingTasks,
} from "../hooks/useDashboardData";

export default function UserManagementSection() {
  return (
    <section className="dash-bottom-row" aria-label="User management">
      <div className="dash-card flex flex-col w-full">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h2 className="text-[13px] font-semibold text-slate-800 m-0">
              ភ្ញៀវថ្មីៗ
            </h2>

            <p className="text-xs text-[#7a8799] m-0">
              បញ្ជីភ្ញៀវដែលបានចុះឈ្មោះថ្មីៗ
            </p>
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-[#eae9f8] rounded-xl text-xs text-[#6b6bc4] font-medium"
          >
            មើលទាំងអស់
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-[#f0d5d4] rounded-lg mb-1">
          {guestHeaders.map((header, index) => (
            <span key={index} className="text-xs text-[#344256] font-medium">
              {header}
            </span>
          ))}
        </div>

        {guests.map((guest, index) => (
          <div
            key={index}
            className={`grid grid-cols-5 gap-4 px-4 py-3 rounded-xl ${
              index % 2 === 0 ? "border border-[#f8f4ff]" : "bg-neutral-50"
            }`}
          >
            <div className="flex items-center gap-2 self-center">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                {guest.name.charAt(0)}
              </div>

              <span className="text-sm text-slate-800 truncate">
                {guest.name}
              </span>
            </div>

            <span className="text-xs text-[#7a8799] self-center">
              {guest.phone}
            </span>

            <span className="text-xs text-[#344256] self-center">
              {guest.group}
            </span>

            <div className="self-center">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${guest.statusClass}`}
              >
                {guest.status}
              </span>
            </div>

            <span className={`text-xs font-semibold self-center ${guest.amountClass}`}>
              {guest.amount}
            </span>
          </div>
        ))}
      </div>

      <aside className="dash-card flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-3">
          <h3 className="text-[15px] font-semibold text-slate-800 m-0">
            សកម្មភាពរហ័ស
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                type="button"
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border border-solid ${action.bg} ${action.border} transition-opacity hover:opacity-80`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg ${action.iconBg}`}
                >
                  {action.icon}
                </div>

                <span className="text-xs text-[#344256] font-medium">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-slate-800 m-0">
              កិច្ចការខាងមុខ
            </h3>

            <span className="px-2.5 py-1 bg-[#eae9f8] rounded-full text-xs font-semibold text-[#6b6bc4]">
              3 ថ្ងៃ
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {upcomingTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-[#f8f8fd] rounded-xl"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${task.dotClass}`}
                />

                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm text-slate-800 truncate">
                    {task.title}
                  </span>

                  <span className="text-xs text-[#7a8799]">
                    {task.time}
                  </span>
                </div>

                <svg
                  width="7"
                  height="12"
                  fill="none"
                  viewBox="0 0 7 12"
                  stroke="currentColor"
                  className="text-[#7a8799] flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M1 1l5 5-5 5"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}