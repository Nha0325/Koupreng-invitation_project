/**
 * កំណត់ចំណាំ: កុំព្យូទ័រ
 * ឯកសារ: src/features/invitation/components/templates/Classic.jsx
 */
/**
 * Classic invitation template — placeholder. Replace with your real layout.
 */
export default function Classic({ data = {} }) {
    return (
        <div style={{ padding: 40, textAlign: "center", fontFamily: "'Moul', serif", minHeight: "100vh", background: "#FCF8F2" }}>
            <h1 style={{ color: "#7D6443" }}>{data.groom || "កូនប្រុស"} & {data.bride || "កូនស្រី"}</h1>
            <p>ពិធីមង្គលការ — Classic Template</p>
            <p>{data.date} {data.time}</p>
        </div>
    );
}
