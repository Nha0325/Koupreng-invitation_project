import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function DigitalYesRsvpModal({ children }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState("yes");
  const [count, setCount] = useState("1");
  const [wishes, setWishes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (children) {
    return (
      <div id="rsvp-section" className="rounded-2xl bg-black/40 border border-amber-500/30 p-5 mt-8 text-left">
        {children}
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="rsvp-section" className="rounded-2xl bg-black/40 border border-amber-500/30 p-5 mt-8 text-left">
      <div className="text-center mb-4">
        <h4 className="text-base font-bold text-white font-serif">ឆ្លើយតបការចូលរួម (RSVP)</h4>
        <p className="text-xs text-amber-200/60 mt-0.5">
          សូមផ្តល់ដំណឹងជូនម្ចាស់កម្មវិធីដើម្បីងាយស្រួលរៀបចំតុ
        </p>
      </div>

      {submitted ? (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center animate-in fade-in">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
          <h5 className="text-sm font-bold text-emerald-300">អរគុណសម្រាប់ការឆ្លើយតប!</h5>
          <p className="text-xs text-emerald-200/70 mt-1">
            ទិន្នន័យត្រូវបានកត់ត្រាដោយជោគជ័យ។ ជួបគ្នាក្នុងថ្ងៃពិសេស!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              ឈ្មោះរបស់អ្នក (Your Name) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ឧ. លោក សុខ សុវណ្ណ"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-amber-500/25 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              លេខទូរស័ព្ទ (Phone Number)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="012 345 678"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-amber-500/25 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              ការចូលរួម (Will you attend?)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttendance("yes")}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  attendance === "yes"
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                    : "bg-white/5 text-amber-200 border-amber-500/20"
                }`}
              >
                ✓ នឹងចូលរួម
              </button>
              <button
                type="button"
                onClick={() => setAttendance("no")}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  attendance === "no"
                    ? "bg-rose-600 text-white border-rose-500 font-bold"
                    : "bg-white/5 text-amber-200 border-amber-500/20"
                }`}
              >
                ✗ មិនអាចចូលរួម
              </button>
            </div>
          </div>

          {attendance === "yes" && (
            <div>
              <label className="block text-xs font-semibold text-amber-200 mb-1">
                ចំនួនអ្នកចូលរួម (Number of guests)
              </label>
              <select
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1a080c] border border-amber-500/25 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="1">១ នាក់ (1 person)</option>
                <option value="2">២ នាក់ (2 persons)</option>
                <option value="3">៣ នាក់ (3 persons)</option>
                <option value="4">៤ នាក់ (4 persons)</option>
                <option value="5">៥ នាក់ (5 persons)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-amber-200 mb-1">
              ពាក្យជូនពរ (Wishes &amp; Blessing)
            </label>
            <textarea
              rows={3}
              value={wishes}
              onChange={(e) => setWishes(e.target.value)}
              placeholder="សូមជូនពរឱ្យគូស្វាមីភរិយាថ្មី..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-amber-500/25 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-1.5"
          >
            <span>ផ្ញើការឆ្លើយតប (Submit RSVP)</span>
          </button>
        </form>
      )}
    </div>
  );
}
