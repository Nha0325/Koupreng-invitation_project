import { useNavigate } from "react-router-dom";

export default function ReviewPublishStep({ draft, update }) {
    const navigate = useNavigate();

    const slugify = (s) =>
        (s || "")
            .toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .toLowerCase()
            .slice(0, 40);

    const ensureSlug = () => {
        if (draft.slug) return draft.slug;
        const auto =
            slugify(`${draft.couple.groom}-${draft.couple.bride}`) ||
            draft.id.replace("wed-", "");
        update({ slug: auto });
        return auto;
    };

    const onPreview = () => navigate(`/preview/${draft.id}`);
    const onPublish = () => {
        const slug = ensureSlug();
        navigate(`/w/${slug}`);
    };

    return (
        <div>
            <h2>6. ត្រួតពិនិត្យ និងបោះផ្សាយ</h2>
            <p className="wb-help">ពិនិត្យព័ត៌មានរបស់អ្នកមុនបោះផ្សាយ។</p>

            <div className="wb-field">
                <label htmlFor="slug">តំណផ្ទាល់ខ្លួន (slug)</label>
                <input
                    id="slug"
                    type="text"
                    value={draft.slug}
                    onChange={(e) =>
                        update({ slug: slugify(e.target.value) })
                    }
                    placeholder="panha-phkay"
                />
                {draft.slug && (
                    <small style={{ color: "#7d6443" }}>
                        URL: /w/{draft.slug}
                    </small>
                )}
            </div>

            <div
                style={{
                    background: "#faf3e6",
                    padding: 16,
                    borderRadius: 8,
                    fontSize: 14,
                    lineHeight: 1.7,
                }}
            >
                <div>
                    <strong>គំរូ:</strong> {draft.templateId}
                </div>
                <div>
                    <strong>គូរ:</strong> {draft.couple.groom || "—"} &{" "}
                    {draft.couple.bride || "—"}
                </div>
                <div>
                    <strong>កាលបរិច្ឆេទ:</strong> {draft.event.date || "—"}
                </div>
                <div>
                    <strong>ទីកន្លែង:</strong> {draft.event.venueName || "—"}
                </div>
                <div>
                    <strong>RSVP:</strong>{" "}
                    {draft.rsvp.enabled ? "បើក" : "បិទ"}
                </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button
                    type="button"
                    className="wb-btn"
                    onClick={onPreview}
                >
                    មើលជាមុន
                </button>
                <button
                    type="button"
                    className="wb-btn wb-btn-primary"
                    onClick={onPublish}
                >
                    បោះផ្សាយ
                </button>
            </div>
        </div>
    );
}
