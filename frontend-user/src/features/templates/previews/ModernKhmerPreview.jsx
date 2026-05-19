/**
 * Phone-mock preview for W02 — បុប្ផាភ្នំពេញ (Modern Khmer).
 */
export default function W02Preview({ data }) {
    return (
        <div className="tpl-preview" style={{ background: "linear-gradient(180deg,#f8f4ff 0%,#e6d8ff 100%)" }}>
            <div className="tpl-preview-arch" style={{ borderColor: "rgba(124,58,237,.3)" }} />
            <div className="tpl-preview-content">
                <div className="tpl-preview-label" style={{ color: "#5B21B6" }}>គ្រប់ឱកាសសម្រាប់អ្នក</div>
                <div className="tpl-preview-names" style={{ color: "#4C1D95" }}>
                    {data?.groom ?? "បញ្ញា"}
                    <br /><span style={{ color: "#7C3AED" }}>&</span><br />
                    {data?.bride ?? "ច័ន្ទនី"}
                </div>
                <div className="tpl-preview-line" style={{ background: "#7C3AED" }} />
                <div className="tpl-preview-date" style={{ color: "#5B21B6" }}>{data?.dateText ?? "២០ ធ្នូ ២០២៦"}</div>
            </div>
        </div>
    );
}
