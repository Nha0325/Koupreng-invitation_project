import { Sparkles } from "lucide-react";

export default function WaxSealEnvelope({
  tpl,
  isFlapOpen,
  isCardEmerging,
  onOpenEnvelope,
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 z-20 transition-opacity duration-700">
      <div className="tdy-envelope-scene mb-8">
        <div className="tdy-envelope-wrapper">
          {/* Envelope Back Base */}
          <div className="tdy-envelope-base">
            <div className="tdy-envelope-lining" />
          </div>

          {/* Inside Card (Pre-emerging / Emerging) */}
          <div
            className={`tdy-card-preview p-6 flex flex-col items-center justify-center text-center ${
              isCardEmerging ? "is-emerging" : ""
            }`}
            style={{ backgroundColor: "#FFFDF9", border: "1px solid #d4af37" }}
          >
            <span className="text-[10px] tracking-[0.25em] uppercase text-amber-800 font-serif font-bold mb-2">
              WEDDING INVITATION
            </span>
            <div className="text-xl font-serif font-bold text-zinc-900 leading-tight">
              {tpl.groom}
              <span className="text-amber-600 font-light mx-1">&amp;</span>
              {tpl.bride}
            </div>
            <div className="text-[11px] text-zinc-600 font-serif mt-2">
              {tpl.dateText}
            </div>
          </div>

          {/* Envelope Pocket Front (Left, Right, Bottom Triangles) */}
          <div className="tdy-envelope-pocket" />

          {/* Envelope Top Flap (Rotates on Open) */}
          <div className={`tdy-envelope-flap ${isFlapOpen ? "is-open" : ""}`}>
            <div className="tdy-flap-triangle" />
          </div>

          {/* Wax Seal with Luxury Monogram */}
          <div
            className={`tdy-wax-seal ${isFlapOpen ? "is-broken" : ""}`}
            onClick={onOpenEnvelope}
            title="ចុចដើម្បីបើកសំបុត្រអញ្ជើញ"
          >
            <div className="tdy-wax-texture">
              <span className="tdy-wax-initials">
                {tpl.groom?.[0] || "V"} &amp; {tpl.bride?.[0] || "S"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Prompt & Pulsing Button */}
      {!isFlapOpen && (
        <div className="flex flex-col items-center gap-3 animate-fade-in text-center px-4">
          <p className="text-xs tracking-[0.25em] text-amber-300/80 uppercase font-serif">
            សូមចុចលើត្រាទៀនក្រមួន ដើម្បីបើកសំបុត្រ
          </p>
          <button
            type="button"
            onClick={onOpenEnvelope}
            className="group relative px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(212,175,55,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 opacity-90 group-hover:opacity-100 transition" />
            <div className="relative flex items-center gap-2 text-stone-950 font-serif font-semibold text-xs tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-stone-950 animate-spin-slow" />
              <span>បើកសំបុត្រអាពាហ៍ពិពាហ៍</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
