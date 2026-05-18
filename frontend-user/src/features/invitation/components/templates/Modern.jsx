/**
 * កំណត់ចំណាំ: កុំព្យូទ័រ
 * ឯកសារ: src/features/invitation/components/templates/Modern.jsx
 */
/**
 * Modern invitation template — placeholder.
 */
export default function Modern({ data = {} }) {
    return (
        <div style={{ padding: 40, textAlign: "center", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#fff" }}>
            <h1 style={{ color: "#7033ff" }}>{data.groom || "Groom"} & {data.bride || "Bride"}</h1>
            <p>Modern Template</p>
        </div>
    );
}
