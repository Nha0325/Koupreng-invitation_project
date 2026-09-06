export default function ParentsHonorSection({
  groomParents = "លោក ជា សុផល & លោកស្រី កែវ ចរិយា",
  brideParents = "លោក សុខ វិបុល & លោកស្រី អ៊ុំ សោភា",
}) {
  return (
    <div className="rkh-parents-grid">
      <div className="rkh-parent-box">
        <h3 style={{ fontFamily: "Moul, serif", fontSize: "1.05rem", color: "var(--rkh-gold)", marginBottom: "0.5rem" }}>
          មាតាបិតាខាងកូនប្រុស
        </h3>
        <p style={{ fontWeight: "600", color: "#1e293b", fontSize: "0.95rem" }}>
          {groomParents || "លោកឪពុក & អ្នកម្តាយ"}
        </p>
      </div>

      <div className="rkh-parent-box">
        <h3 style={{ fontFamily: "Moul, serif", fontSize: "1.05rem", color: "var(--rkh-gold)", marginBottom: "0.5rem" }}>
          មាតាបិតាខាងកូនស្រី
        </h3>
        <p style={{ fontWeight: "600", color: "#1e293b", fontSize: "0.95rem" }}>
          {brideParents || "លោកឪពុក & អ្នកម្តាយ"}
        </p>
      </div>
    </div>
  );
}
