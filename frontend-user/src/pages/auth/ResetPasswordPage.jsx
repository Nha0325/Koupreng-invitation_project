import { Link } from "react-router-dom";
import "./AuthPage.css";

/**
 * ResetPasswordPage
 *
 * The actual reset flow lives inside `<ForgotPasswordPage />` as a wizard
 * (identifier → OTP → new password → success), so this page is a small
 * landing card that points the user back to the canonical entry point.
 *
 * Kept as its own route so deep links to `/reset-password` (e.g. from older
 * marketing copy) don't 404.
 */
const ResetPasswordPage = () => {
    return (
        <div className="auth-page">
            <div className="auth-blob auth-blob-1" />
            <div className="auth-blob auth-blob-2" />
            <div className="auth-blob auth-blob-3" />

            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">កំណត់លេខសម្ងាត់ឡើងវិញ</h1>
                    <p className="auth-subtitle">
                        ដើម្បីកំណត់លេខសម្ងាត់ឡើងវិញ សូមចាប់ផ្តើមដោយការផ្ញើ OTP
                    </p>
                </div>

                <Link
                    to="/forgot-password"
                    className="auth-submit"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                    }}
                >
                    ចាប់ផ្តើម
                </Link>

                <div className="auth-back">
                    <Link to="/login" className="auth-back-btn">
                        ← ត្រឡប់ទៅចូលគណនី
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
