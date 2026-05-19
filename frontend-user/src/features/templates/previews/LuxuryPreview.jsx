/**
 * Phone-mock preview for W03 — និស្ស័យមង្គល (Luxury Wedding).
 */
export default function W03Preview({ data }) {
    return (
        <div className="tpl-preview" style={{ background: "linear-gradient(180deg,#0f3a22 0%,#1d5c38 60%,#16a34a 100%)" }}>
            <div className="tpl-preview-arch" style={{ borderColor: "rgba(255,255,255,.25)" }} />
            <div className="tpl-preview-content">
                <div className="tpl-preview-label" style={{ color: "rgba(255,255,255,.7)" }}>WEDDING CEREMONY</div>
                <div className="tpl-preview-names" style={{ color: "#fff" }}>
                    {data?.groom ?? "រតនា"}
                    <br /><span style={{ color: "#fde68a" }}>&</span><br />
                    {data?.bride ?? "ស្រីស"}
                </div>
                <div className="tpl-preview-line" style={{ background: "#fde68a" }} />
                <div className="tpl-preview-date" style={{ color: "rgba(255,255,255,.85)" }}>{data?.dateText ?? "០៧ កុម្ភៈ ២០២៦"}</div>
            </div>
        </div>
    );
}
