import { Sparkles } from "lucide-react";

export default function PalaceGateOpening({
  opened,
  onOpenGate,
  groom,
  bride,
}) {
  return (
    <div className={`rkh-gate-overlay ${opened ? "opened" : ""}`}>
      <div className="rkh-gate-door left" />
      <div className="rkh-gate-door right" />
      <div className="rkh-gate-center">
        <div className="rkh-gate-seal" onClick={onOpenGate} title="ចុចដើម្បីបើកទ្វារព្រះបរមរាជវាំង">
          <Sparkles className="w-12 h-12 text-amber-950" />
        </div>
        <h2 style={{ fontFamily: "Moul, serif", fontSize: "1.6rem", color: "var(--rkh-gold-light)", marginBottom: "0.5rem" }}>
          សិរីសួស្តីអាពាហ៍ពិពាហ៍
        </h2>
        <p style={{ color: "#f3d790", fontSize: "1rem", marginBottom: "1.5rem", fontWeight: "600" }}>
          {groom} &amp; {bride}
        </p>
        <button type="button" className="rkh-enter-btn" onClick={onOpenGate}>
          បើកទ្វារមង្គលការ (ចូលទស្សនា)
        </button>
      </div>
    </div>
  );
}
