import { FormField, LoadingButton, Modal } from "@/shared/ui";

export default function GuestFormModal({
  isOpen,
  onClose,
  form,
  setForm,
  groups,
  categories,
  editingId,
  saving,
  onSave,
  t,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingId ? (t ? t("editGuestTitle") : "កែប្រែព័ត៌មានភ្ញៀវ") : (t ? t("addGuestTitle") : "បន្ថែមភ្ញៀវថ្មី")}
      size="md"
      closeOnBackdropClick={!saving}
      closeOnEscape={!saving}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormField label={t ? t("fieldName") : "ឈ្មោះភ្ញៀវ"} required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="សុក ដារ៉ា / Sok Dara"
          />
        </FormField>

        <FormField label={t ? t("fieldCompanion") : "ឈ្មោះអ្នករួមដំណើរ"}>
          <input
            type="text"
            value={form.companionName}
            onChange={(e) => setForm({ ...form, companionName: e.target.value })}
            placeholder="និងភរិយា / & Family"
          />
        </FormField>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <FormField label={t ? t("fieldPhone") : "លេខទូរស័ព្ទ"}>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="012 345 678"
            />
          </FormField>

          <FormField label={t ? t("fieldSeats") : "ចំនួនកៅអី"}>
            <input
              type="number"
              min="1"
              value={form.count}
              onChange={(e) => setForm({ ...form, count: e.target.value })}
            />
          </FormField>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <FormField label={t ? t("fieldGroup") : "ក្រុម"}>
            <select
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label={t ? t("fieldCategory") : "ប្រភេទ"}>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label={t ? t("fieldNote") : "ចំណាំ"}>
          <textarea
            rows="2"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="បន្ថែមចំណាំរៀបចំ..."
          />
        </FormField>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button type="button" className="pe-secondary-btn" onClick={onClose} disabled={saving}>
            {t ? t("cancel") : "បោះបង់"}
          </button>
          <LoadingButton type="submit" isLoading={saving} className="pe-primary-btn">
            {t ? t("save") : "រក្សាទុក"}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
