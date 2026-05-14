import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <main
            style={{
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                padding: "2rem",
                textAlign: "center",
            }}
        >
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3rem", margin: 0 }}>
                404
            </h1>
            <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
                We could not find the page you were looking for.
            </p>
            <Link
                to="/"
                style={{
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontWeight: 600,
                }}
            >
                ← Back to home
            </Link>
        </main>
    );
};

export default NotFoundPage;
