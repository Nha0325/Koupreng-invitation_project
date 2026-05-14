import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authService } from "../../shared/services/api";
import "./AuthPage.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const hasSubmitted = useRef(false);
  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "Verifying your email..." : "Verification token is missing.");

  useEffect(() => {
    if (!token || hasSubmitted.current) return;
    hasSubmitted.current = true;

    authService.verifyEmail(token)
      .then(({ data }) => {
        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Could not verify email.");
      });
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">បញ្ជាក់អ៊ីមែល</h1>
          <p className="auth-subtitle">ពិនិត្យស្ថានភាពអ៊ីមែលរបស់អ្នក</p>
        </div>

        <div className={`auth-success ${status}`}>
          <div className="auth-success-icon">
            {status === "loading" ? (
              <span className="auth-spinner" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={status === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
            )}
          </div>
          <div>
            <h2>{status === "success" ? "បានបញ្ជាក់រួចរាល់" : status === "loading" ? "កំពុងបញ្ជាក់" : "មិនអាចបញ្ជាក់បាន"}</h2>
            <p className={status === "error" ? "auth-error-msg" : ""}>{message}</p>
          </div>
          <Link to="/login" className="auth-submit" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", marginTop: "4px" }}>
            ចូលគណនី
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
