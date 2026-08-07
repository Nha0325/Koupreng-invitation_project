import { FormField, LoadingButton } from "@/shared/ui";
import { AI_ACTIONS, LANGUAGE_OPTIONS, TONE_OPTIONS } from "../model/aiAssistantConstants";

export default function AssistantComposer({
  form,
  setForm,
  loading,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <FormField label="ជំនួយការសរសេរ (Feature Action)" required>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.5rem" }}>
          {AI_ACTIONS.map((act) => (
            <button
              key={act.value}
              type="button"
              className={`pe-action-chip${form.action === act.value ? " active" : ""}`}
              onClick={() => setForm({ ...form, action: act.value })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 0.875rem",
                borderRadius: "10px",
                border: form.action === act.value ? "2px solid var(--brand-primary)" : "1px solid var(--brand-border)",
                background: form.action === act.value ? "rgba(107, 107, 196, 0.08)" : "var(--brand-surface)",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "var(--brand-text)",
              }}
            >
              <span>{act.icon}</span>
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      </FormField>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <FormField label="ឈ្មោះគូស្វាមីភរិយា / Couple Names">
          <input
            type="text"
            value={form.coupleNames}
            onChange={(e) => setForm({ ...form, coupleNames: e.target.value })}
            placeholder="សុក ដារ៉ា & កែវ សោភា"
          />
        </FormField>

        <FormField label="ឈ្មោះម្ចាស់ដើមការ / Host Name">
          <input
            type="text"
            value={form.hostName}
            onChange={(e) => setForm({ ...form, hostName: e.target.value })}
            placeholder="លោក សុក ចាន់ & លោកស្រី"
          />
        </FormField>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <FormField label="ថ្ងៃខែឆ្នាំ / Event Date">
          <input
            type="text"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            placeholder="ថ្ងៃអាទិត្យ ទី១៥ ខែមីនា ឆ្នាំ២០២៦"
          />
        </FormField>

        <FormField label="ទីតាំង / Venue">
          <input
            type="text"
            value={form.venueName}
            onChange={(e) => setForm({ ...form, venueName: e.target.value })}
            placeholder="សណ្ឋាគារ ហ៊ីមវ៉ារី ភ្នំពេញ"
          />
        </FormField>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <FormField label="ភាសា / Language">
          <select
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
          >
            {LANGUAGE_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="ទម្រង់សំណេរ / Tone">
          <select
            value={form.tone}
            onChange={(e) => setForm({ ...form, tone: e.target.value })}
          >
            {TONE_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="ព័ត៌មានបន្ថែម / Extra Notes">
        <textarea
          rows="3"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="បន្ថែមពាក្យជូនពរ ព័ត៌មានភ្ញៀវ ឬសំណូមពរពិសេស..."
        />
      </FormField>

      <LoadingButton type="submit" isLoading={loading} className="pe-primary-btn" style={{ alignSelf: "flex-start" }}>
        ✨ រៀបចំអត្ថបទ / Generate Content
      </LoadingButton>
    </form>
  );
}
