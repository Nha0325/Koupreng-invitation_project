import { TEMPLATES } from "../../templates/data/templatesData";

export default function SelectTemplateStep({ draft, update }) {
    return (
        <div>
            <h2>1. ជ្រើសរើសគំរូ</h2>
            <p className="wb-help">ជ្រើសរើសគ្រោងសន្លឹកការណ៍ដែលចូលចិត្ត។</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {TEMPLATES.map((t) => (
                    <button
                        type="button"
                        key={t.id}
                        onClick={() => update({ templateId: t.id })}
                        style={{
                            border:
                                draft.templateId === t.id
                                    ? "2px solid #7d6443"
                                    : "1px solid #d8cdb8",
                            borderRadius: 12,
                            padding: 8,
                            background: "#fff",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            textAlign: "left",
                        }}
                    >
                        <img
                            src={t.image}
                            alt={t.name}
                            style={{
                                width: "100%",
                                aspectRatio: "3/4",
                                objectFit: "cover",
                                borderRadius: 8,
                            }}
                        />
                        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600 }}>
                            {t.name}
                        </div>
                        <div style={{ fontSize: 12, color: "#7d6443" }}>{t.style}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
