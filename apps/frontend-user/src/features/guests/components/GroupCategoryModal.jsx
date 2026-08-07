import { useState } from "react";
import { IoAdd, IoCheckmark, IoClose, IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { Modal } from "@/shared/ui";
import { createHostRecordId } from "@/shared/storage/hostPlanningStorage";

export default function GroupCategoryModal({
  isOpen,
  title,
  items = [],
  onClose,
  onSave,
  t,
}) {
  const [draftItems, setDraftItems] = useState(items);
  const [form, setForm] = useState({ name: "", note: "" });
  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState({ name: "", note: "" });

  const noDesc = t ? t("managerNoDesc") : "មិនមានពណ៌នា";

  const addItem = () => {
    if (!form.name.trim()) return;
    setDraftItems((current) => [
      ...current,
      {
        id: createHostRecordId("option"),
        name: form.name.trim(),
        note: form.note.trim(),
      },
    ]);
    setForm({ name: "", note: "" });
  };

  const updateEditing = () => {
    if (!editing.name.trim()) return;
    setDraftItems((current) =>
      current.map((item) =>
        item.id === editingId
          ? { ...item, name: editing.name.trim(), note: editing.note.trim() }
          : item
      )
    );
    setEditingId(null);
    setEditing({ name: "", note: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="pe-manager-add">
          <label>
            <span>{t ? t("managerFieldName") : "ឈ្មោះ"}</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t ? t("managerFieldName") : "បញ្ចូលឈ្មោះ"}
            />
          </label>
          <label>
            <span>{t ? t("managerFieldNote") : "ពណ៌នា"}</span>
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder={t ? t("managerFieldNote") : "បញ្ចូលពណ៌នា"}
            />
          </label>
          <button type="button" className="pe-primary-btn" onClick={addItem}>
            <IoAdd aria-hidden="true" />
            <span>{t ? t("managerAddBtn") : "បន្ថែម"}</span>
          </button>
        </div>

        <h3>{t ? t("managerListTitle", { count: draftItems.length }) : `បញ្ជី (${draftItems.length})`}</h3>
        <div className="pe-manager-list">
          {draftItems.map((item) => {
            const isEditing = item.id === editingId;
            return (
              <article key={item.id} className={`pe-manager-row${isEditing ? " is-editing" : ""}`}>
                {isEditing ? (
                  <>
                    <div className="pe-manager-edit-grid">
                      <label>
                        <span>{t ? t("managerFieldName") : "ឈ្មោះ"}</span>
                        <input
                          value={editing.name}
                          onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        />
                      </label>
                      <label>
                        <span>{t ? t("managerFieldNote") : "ពណ៌នា"}</span>
                        <input
                          value={editing.note}
                          onChange={(e) => setEditing({ ...editing, note: e.target.value })}
                        />
                      </label>
                    </div>
                    <div className="pe-manager-actions">
                      <button type="button" onClick={() => setEditingId(null)} aria-label="Cancel">
                        <IoClose aria-hidden="true" />
                      </button>
                      <button type="button" onClick={updateEditing} aria-label="Save">
                        <IoCheckmark aria-hidden="true" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>{item.name}</strong>
                      <small style={{ display: "block", color: "var(--brand-text-muted)" }}>
                        {item.note || noDesc}
                      </small>
                    </div>
                    <div className="pe-manager-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditing({ name: item.name, note: item.note || "" });
                        }}
                        aria-label="Edit"
                      >
                        <IoPencilOutline aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftItems((current) => current.filter((e) => e.id !== item.id))
                        }
                        aria-label="Delete"
                      >
                        <IoTrashOutline aria-hidden="true" />
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button type="button" className="pe-secondary-btn" onClick={onClose}>
            {t ? t("cancel") : "បោះបង់"}
          </button>
          <button type="button" className="pe-primary-btn" onClick={() => onSave(draftItems)}>
            <IoCheckmark aria-hidden="true" />
            <span>{t ? t("managerSave") : "រក្សាទុក"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
