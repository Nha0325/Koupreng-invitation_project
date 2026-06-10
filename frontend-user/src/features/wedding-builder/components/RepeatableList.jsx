import { useCallback } from "react";
import { DatePicker } from "../../../shared/ui/DatePicker";
import { TimePicker } from "../../../shared/ui/TimePicker";

/**
 * RepeatableList — generic add/remove/edit editor for a list of objects.
 *
 * Used by the wedding builder to let hosts input any number of love-story
 * chapters, schedule items, wedding-party members, gift accounts and FAQs.
 * Each item is a plain object; `fields` describes which keys are editable.
 *
 * Props:
 *  - kicker, title, help   section heading text
 *  - items                 current array of objects
 *  - fields                [{ key, label, placeholder, type, rows, wide }]
 *  - makeEmpty             () => object for a fresh item (id is added here)
 *  - onChange              (nextItems) => void
 *  - addLabel, itemLabel   button / card labels
 *  - max                   maximum number of items
 */
function rid() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function RepeatableList({
    kicker,
    title,
    help,
    items = [],
    fields = [],
    makeEmpty,
    onChange,
    addLabel = "+ បន្ថែម",
    itemLabel = "ធាតុ",
    max = 12,
}) {
    const updateItem = useCallback(
        (index, key, value) => {
            onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
        },
        [items, onChange]
    );

    const addItem = useCallback(() => {
        if (items.length >= max) return;
        const empty = makeEmpty ? makeEmpty() : {};
        onChange([...items, { id: rid(), ...empty }]);
    }, [items, makeEmpty, onChange, max]);

    const removeItem = useCallback(
        (index) => {
            onChange(items.filter((_, i) => i !== index));
        },
        [items, onChange]
    );

    return (
        <section className="wb-section">
            <div className="wb-section-head">
                {kicker && <span className="wb-section-kicker">{kicker}</span>}
                <h3>{title}</h3>
            </div>
            {help && (
                <p className="wb-help" style={{ marginTop: -6 }}>
                    {help}
                </p>
            )}

            <div className="wb-li-list">
                {items.length === 0 && (
                    <p className="wb-li-empty">មិនទាន់មានទេ — ចុច «{addLabel}» ដើម្បីបន្ថែម។</p>
                )}

                {items.map((item, index) => (
                    <div className="wb-li-card" key={item.id || index}>
                        <div className="wb-li-card-head">
                            <span className="wb-li-card-title">
                                {itemLabel} {index + 1}
                            </span>
                            <button
                                type="button"
                                className="wb-li-remove"
                                onClick={() => removeItem(index)}
                                aria-label={`Remove ${itemLabel} ${index + 1}`}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="wb-li-fields">
                            {fields.map((field) => (
                                <div
                                    className={`wb-field${field.wide ? " wb-li-field-wide" : ""}`}
                                    key={field.key}
                                >
                                    <label>{field.label}</label>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            rows={field.rows || 3}
                                            value={item[field.key] || ""}
                                            onChange={(e) => updateItem(index, field.key, e.target.value)}
                                            placeholder={field.placeholder || ""}
                                        />
                                    ) : field.type === "time" ? (
                                        <TimePicker
                                            value={item[field.key] || ""}
                                            onChange={(val) => updateItem(index, field.key, val)}
                                            placeholder={field.placeholder || "ជ្រើសម៉ោង"}
                                        />
                                    ) : field.type === "date" ? (
                                        <DatePicker
                                            value={item[field.key] || ""}
                                            onChange={(val) => updateItem(index, field.key, val)}
                                            placeholder={field.placeholder || "ជ្រើសកាលបរិច្ឆេទ"}
                                        />
                                    ) : (
                                        <input
                                            type={field.type || "text"}
                                            value={item[field.key] || ""}
                                            onChange={(e) => updateItem(index, field.key, e.target.value)}
                                            placeholder={field.placeholder || ""}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                className="wb-li-add"
                onClick={addItem}
                disabled={items.length >= max}
            >
                {addLabel}
            </button>
        </section>
    );
}
