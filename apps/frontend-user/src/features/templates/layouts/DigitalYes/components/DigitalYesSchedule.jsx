import { Clock } from "lucide-react";

export default function DigitalYesSchedule({ schedule = [] }) {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="my-8 text-left">
      <div className="flex items-center gap-2 justify-center mb-6">
        <Clock className="h-4 w-4 text-amber-400" />
        <h3 className="text-base font-bold text-amber-200 uppercase tracking-wider font-serif">
          កាលវិភាគកម្មវិធីមង្គលការ
        </h3>
      </div>

      <div className="space-y-4">
        {schedule.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex gap-4 p-3.5 rounded-xl bg-white/5 border border-amber-500/15 transition hover:border-amber-500/35"
          >
            <div className="flex flex-col items-center justify-center px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold min-w-[76px] text-center font-mono">
              <span>{item.time}</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{item.title}</h4>
              {(item.desc || item.description) && (
                <p className="text-xs text-amber-200/70 mt-0.5">{item.desc || item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
