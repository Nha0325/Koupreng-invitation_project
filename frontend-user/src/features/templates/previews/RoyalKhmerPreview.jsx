/**
 * Phone-mock preview for W05 — ទេវីសួគ៌ា (Royal Khmer).
 */
export default function W05Preview({ data }) {
    return (
        <div className="tpl-preview" style={{ background: "linear-gradient(180deg,#1e3a8a 0%,#1e69dc 60%,#dbeafe 100%)" }}>
            <div className="tpl-preview-arch" style={{ borderColor: "rgba(255,255,255,.3)" }} />
            <div className="tpl-preview-content">
                <div className="tpl-preview-label" style={{ color: "rgba(255,255,255,.75)" }}>រាជមង្គលសួគ៌ា</div>
                <div className="tpl-preview-names" style={{ color: "#fff" }}>
                    {data?.groom ?? "វិចិត្រ"}
                    <br /><span style={{ color: "#fef3c7" }}>♛</span><br />
                    {data?.bride ?? "ពេជ្រ"}
                </div>
                <div className="tpl-preview-line" style={{ background: "#fef3c7" }} />
                <div className="tpl-preview-date" style={{ color: "rgba(255,255,255,.85)" }}>{data?.dateText ?? "២៥ មេសា ២០២៦"}</div>
            </div>
        </div>
    );
}
