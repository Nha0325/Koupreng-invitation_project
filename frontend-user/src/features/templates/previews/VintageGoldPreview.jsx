/**
 * Phone-mock preview for W06 — សិរីមង្គល (Vintage Gold).
 */
export default function W06Preview({ data }) {
    return (
        <div className="tpl-preview" style={{ background: "linear-gradient(180deg,#f8f7f5 0%,#e7e5e4 100%)" }}>
            <div className="tpl-preview-arch" style={{ borderColor: "rgba(82,82,82,.3)" }} />
            <div className="tpl-preview-content">
                <div className="tpl-preview-label" style={{ color: "#525252" }}>សូមរីករាយជាមួយយើង</div>
                <div className="tpl-preview-names" style={{ color: "#262626" }}>
                    {data?.groom ?? "សិរី"}
                    <br /><span style={{ color: "#a3a3a3" }}>&</span><br />
                    {data?.bride ?? "ចន្ធា"}
                </div>
                <div className="tpl-preview-line" style={{ background: "#737373" }} />
                <div className="tpl-preview-date" style={{ color: "#525252" }}>{data?.dateText ?? "១៨ តុលា ២០២៦"}</div>
            </div>
        </div>
    );
}
