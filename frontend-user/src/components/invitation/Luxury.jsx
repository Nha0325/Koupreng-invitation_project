/**
 * Luxury invitation template — placeholder.
 */
export default function Luxury({ data = {} }) {
    return (
        <div style={{ padding: 40, textAlign: "center", fontFamily: "'Moul', serif", minHeight: "100vh", background: "#1a1510", color: "#B0926A" }}>
            <h1>{data.groom || "កូនប្រុស"} & {data.bride || "កូនស្រី"}</h1>
            <p>Luxury Template</p>
        </div>
    );
}
