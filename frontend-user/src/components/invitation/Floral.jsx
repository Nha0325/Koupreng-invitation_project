/**
 * Floral invitation template — placeholder.
 */
export default function Floral({ data = {} }) {
    return (
        <div style={{ padding: 40, textAlign: "center", fontFamily: "'Moul', serif", minHeight: "100vh", background: "#fce7f3" }}>
            <h1 style={{ color: "#be185d" }}>{data.groom || "កូនប្រុស"} & {data.bride || "កូនស្រី"}</h1>
            <p>Floral Template</p>
        </div>
    );
}
