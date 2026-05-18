import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import authService from "../../shared/services/authService";
import "./AuthPage.css";

function apiMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const visibleError = token ? error : "តំណបញ្ជាក់អ៊ីមែលមិនត្រឹមត្រូវ";

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let cancelled = false;
    authService
      .verifyEmail({ token })
      .then((response) => {
        if (!cancelled) {
          setMessage(response.message);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(apiMessage(err, "មិនអាចបញ្ជាក់អ៊ីមែលបានទេ"));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">បញ្ជាក់អ៊ីមែល</h1>
        </div>

        {visibleError && <p className="auth-error-msg">{visibleError}</p>}
        {message && <p className="auth-success-msg">{message}</p>}

        <div className="auth-back">
          <Link to="/login" className="auth-back-btn">
            ← ត្រឡប់ទៅចូលគណនី
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
