import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div
      style={{
        padding: 80,
        textAlign: "center",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      <h1
        style={{
          fontFamily: "'Moul', serif",
          fontSize: 48,
          color: "#7D6443",
        }}
      >
        404
      </h1>
      <p style={{ color: "#777", marginTop: 12 }}>មិនមានទំព័រនេះទេ</p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: 20,
          padding: "10px 24px",
          background: "#B0926A",
          color: "white",
          borderRadius: 30,
          textDecoration: "none",
        }}
      >
        ត្រឡប់ទៅទំព័រដើម
      </Link>
    </div>
  );
};

export default NotFoundPage;
