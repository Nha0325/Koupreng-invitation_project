import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../app/providers/AdminAuthProvider";

function safeNext(searchParams) {
    const next = searchParams.get("next");
    if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
    return next;
}

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(identifier.trim(), password);
            navigate(safeNext(searchParams), { replace: true });
        } catch (err) {
            setError(err?.message || "ការចូលប្រើបានបរាជ័យ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <div className="login-crest">⚜️</div>
                <h1 className="login-title">រដ្ឋបាលគូព្រេង</h1>
                <p className="login-sub">ចូលប្រើប្រាស់សម្រាប់អ្នកគ្រប់គ្រងប្រព័ន្ធ</p>

                {error && <div className="login-error">{error}</div>}

                <div className="field">
                    <label htmlFor="identifier">អ៊ីមែល ឬ លេខទូរស័ព្ទ</label>
                    <input
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="admin@koupreng.com"
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="password">លេខសម្ងាត់</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />
                </div>

                <button type="submit" className="login-submit" disabled={loading}>
                    {loading ? "កំពុងចូល..." : "ចូលគណនី"}
                </button>
            </form>
        </div>
    );
}
