import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoArrowBackOutline, IoSparkles, IoShieldCheckmarkOutline } from "react-icons/io5";
import PaymentQrCard from "./PaymentQrCard";
import { statusMessage } from "./paymentStatus";
import { paymentService } from "./paymentService";
import heroBg from "../../assets/icons/background.png";
import "./PaymentPages.css";

export default function PaymentStatusPage() {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    paymentService
      .getTemplateOrder(orderCode)
      .then((data) => {
        if (active) {
          setOrder(data);
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Could not load payment status");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [orderCode]);

  return (
    <div className="checkout-theme-wrapper">
      {/* Background Decor */}
      <div
        className="checkout-bg"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="checkout-overlay"></div>
      </div>

      <main className="checkout-main-container" style={{ maxWidth: "860px" }}>
        {/* Navigation Bar */}
        <div className="checkout-nav-bar">
          <Link className="checkout-back-btn" to="/templates/browse">
            <IoArrowBackOutline />
            <span>ត្រឡប់ទៅមើលគំរូ (Back to templates)</span>
          </Link>
          <div className="checkout-secure-tag">
            <IoShieldCheckmarkOutline />
            <span>PAYMENT VERIFICATION</span>
          </div>
        </div>

        {/* Hero Header */}
        <header className="checkout-header">
          <span className="checkout-kicker">
            <IoSparkles /> ABA PAYWAY • KHQR PAYMENT
          </span>
          <h1 className="checkout-title">
            ស្កេនទូទាត់ <span className="gold-gradient-text">ABA KHQR</span>
          </h1>
          <div className="checkout-divider">
            <span></span>
            <div className="diamond"></div>
            <span></span>
          </div>
          <p className="checkout-subtitle">
            {order
              ? statusMessage(order.status)
              : "សូមស្កេន QR Code ខាងក្រោមដើម្បីបញ្ចប់ការទូទាត់ប្រាក់"}
          </p>
        </header>

        {loading && (
          <div className="checkout-card" style={{ textAlign: "center", padding: "40px" }}>
            <span className="checkout-spinner" style={{ borderColor: "#b0926a", borderTopColor: "transparent", margin: "0 auto 12px" }}></span>
            <p style={{ margin: 0, fontWeight: 600 }}>កំពុងទាញយកព័ត៌មានការទូទាត់...</p>
          </div>
        )}

        {error && (
          <div className="checkout-alert-error">
            <span>⚠️ {error}</span>
          </div>
        )}

        {order && <PaymentQrCard order={order} onStatusChange={setOrder} />}

        <div className="payment-footer-links">
          <Link to="/dashboard/templates/paid">មើលគំរូដែលបានទិញ (Paid Templates)</Link>
          <span>•</span>
          <Link to="/templates/browse">មើលគំរូទាំងអស់ (Browse Templates)</Link>
        </div>
      </main>
    </div>
  );
}
