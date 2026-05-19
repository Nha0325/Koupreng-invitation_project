/**
 * Phone-mock preview for W04 — មង្គលជ័យ (Classic Style).
 */
export default function W04Preview({ data }) {
    return (
        <div className="tpl-preview" style={{ background: "linear-gradient(180deg,#fff7f5 0%,#fee2e2 100%)" }}>
            <div className="tpl-preview-arch" style={{ borderColor: "rgba(220,38,38,.3)" }} />
            <div className="tpl-preview-content">
                <div className="tpl-preview-label" style={{ color: "#991b1b" }}>សូមអញ្ជើញចូលរួម</div>
                <div className="tpl-preview-names" style={{ color: "#7f1d1d" }}>
                    {data?.groom ?? "ដារា"}
                    <br /><span style={{ color: "#dc2626" }}>និង</span><br />
                    {data?.bride ?? "មាលា"}
                </div>
                <div className="tpl-preview-line" style={{ background: "#dc2626" }} />
                <div className="tpl-preview-date" style={{ color: "#991b1b" }}>{data?.dateText ?? "១៥ មីនា ២០២៦"}</div>
            </div>
        </div>
    );
}
