import { useState } from "react";
import { FormField, LoadingButton, Modal } from "@/shared/ui";

export default function GuestImportModal({
  isOpen,
  onClose,
  saving,
  onImport,
  t,
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleProcessImport = () => {
    setError("");
    const lines = text.split("\n").filter((l) => l.trim());
    if (!lines.length) {
      setError(t ? t("importEmptyErr") : "សូមបញ្ចូលឈ្មោះយ៉ាងហោចណាស់ 1");
      return;
    }

    const imported = lines.map((line) => {
      const parts = line.split(",").map((p) => p.trim());
      return {
        name: parts[0] || "Guest",
        phone: parts[1] || "",
        group: parts[2] || "Groom Side",
        category: parts[3] || "Friend",
      };
    });

    onImport(imported).then((success) => {
      if (success) {
        setText("");
        onClose();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t ? t("importTitle") : "នាំចូលបញ្ជីភ្ញៀវ"}
      subtitle={t ? t("importSubtitle") : "បញ្ចូលឈ្មោះភ្ញៀវ (១ ជួរក្នុងម្នាក់ ឬ ឈ្មោះ, លេខទូរស័ព្ទ, ក្រុម, ប្រភេទ)"}
      size="md"
      closeOnBackdropClick={!saving}
      closeOnEscape={!saving}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormField label={t ? t("importDataLabel") : "ទិន្នន័យភ្ញៀវ"} error={error}>
          <textarea
            rows="8"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`សុក ដារ៉ា, 012345678, Groom Side, Friend\nស៊ឹម ចាន់ថា, 098765432, Bride Side, Family`}
          />
        </FormField>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button type="button" className="pe-secondary-btn" onClick={onClose} disabled={saving}>
            {t ? t("cancel") : "បោះបង់"}
          </button>
          <LoadingButton
            type="button"
            isLoading={saving}
            className="pe-primary-btn"
            onClick={handleProcessImport}
          >
            {t ? t("importSubmitBtn") : "នាំចូលឥឡូវ"}
          </LoadingButton>
        </div>
      </div>
    </Modal>
  );
}
