import { useState } from "react";
import { IoCheckmark, IoCopyOutline, IoSparklesOutline } from "react-icons/io5";
import { FormField, LoadingButton, toast } from "@/shared/ui";

export default function AssistantResult({
  response,
  onApply,
}) {
  const [editedText, setEditedText] = useState(response?.generatedText || "");
  const [copied, setCopied] = useState(false);

  if (!response) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      toast.success("បានចម្លងអត្ថបទរួចរាល់ / Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("មិនអាចចម្លងអត្ថបទបានទេ");
    }
  };

  return (
    <article
      style={{
        background: "var(--brand-surface)",
        border: "1px solid var(--brand-border)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <IoSparklesOutline style={{ color: "var(--brand-primary)" }} />
          <span>លទ្ធផលអត្ថបទដែលបានបង្កើត / Generated Result</span>
        </h3>
      </div>

      <FormField label="អ្នកអាចកែសម្រួលអត្ថបទមុនពេលប្រើប្រាស់ (Editable Content)">
        <textarea
          rows="6"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          style={{ fontFamily: "var(--font-sans)", lineHeight: "1.6" }}
        />
      </FormField>

      {response.suggestions?.length > 0 && (
        <div style={{ background: "rgba(107, 107, 196, 0.06)", padding: "0.875rem", borderRadius: "10px", border: "1px solid rgba(107, 107, 196, 0.2)" }}>
          <strong style={{ fontSize: "0.875rem", color: "var(--brand-primary)", display: "block", marginBottom: "0.375rem" }}>
            💡 អនុសាសន៍បន្ថែម (Suggestions):
          </strong>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.875rem", color: "var(--brand-text)" }}>
            {response.suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
        <button type="button" className="pe-secondary-btn" onClick={handleCopy}>
          {copied ? <IoCheckmark aria-hidden="true" /> : <IoCopyOutline aria-hidden="true" />}
          <span>{copied ? "បានចម្លង" : "ចម្លងអត្ថបទ"}</span>
        </button>
        {onApply && (
          <LoadingButton
            type="button"
            className="pe-primary-btn"
            onClick={() => onApply(editedText)}
          >
            យកទៅប្រើក្នុងធៀប / Apply to Invitation
          </LoadingButton>
        )}
      </div>
    </article>
  );
}
