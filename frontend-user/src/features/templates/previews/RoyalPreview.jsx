/**
 * Phone-mock preview for W01 — រាជមង្គលអង្គរ (Traditional Gold).
 * Used inside the gallery card and as the demo phone slide cover.
 */
export default function W01Preview({ data }) {
    return (
        <div className="tpl-preview" style={{ background: "linear-gradient(180deg,#fff8ec 0%,#f5e6c4 55%,#e9d4a3 100%)" }}>
            <div className="tpl-preview-arch" style={{ borderColor: "rgba(176,146,106,.4)" }} />
            <div className="tpl-preview-content">
                <div className="tpl-preview-label" style={{ color: "#7D6443" }}>ពិធីមង្គលការ</div>
                <div className="tpl-preview-names" style={{ color: "#5C4926" }}>
                    {data?.groom ?? "សុវណ្ណ"}
                    <br /><span style={{ color: "#B0926A" }}>និង</span><br />
                    {data?.bride ?? "សុដាណា"}
                </div>
                <div className="tpl-preview-line" style={{ background: "#B0926A" }} />
                <div className="tpl-preview-date" style={{ color: "#7D6443" }}>{data?.dateText ?? "១៣ កញ្ញា ២០២៦"}</div>
            </div>
        </div>
    );
}
