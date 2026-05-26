import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { paymentService } from "./paymentService";
import { statusMessage } from "./paymentStatus";
import { toast } from "../../shared/ui/toast";
import "./PaymentPages.css";

export default function PaymentInstructionCard({ order, onStatusChange }) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);

    const copyOrderCode = async () => {
        try {
            await navigator.clipboard.writeText(order.orderCode);
            toast("Order code copied");
        } catch {
            toast("Copy failed. Please select and copy the order code manually.");
        }
    };

    const checkStatus = async () => {
        setChecking(true);
        try {
            const latest = await paymentService.getTemplateOrder(order.orderCode);
            onStatusChange?.(latest);
            if (latest.status === "PAID") {
                toast("Payment confirmed. Template unlocked.");
            }
        } catch (err) {
            toast(err.message || "Could not check payment status");
        } finally {
            setChecking(false);
        }
    };

    return (
        <section className="payment-card">
            <div className="payment-summary">
                <span className={`payment-status ${order.status?.toLowerCase() || "pending"}`}>
                    {order.status || "PENDING"}
                </span>
                <h2>{order.templateName}</h2>
                <p>{order.packageName}</p>
                <strong>{order.currency || "USD"} {order.amount}</strong>
            </div>

            <div className="payment-code-box">
                <span>Order Code</span>
                <code>{order.orderCode}</code>
                <button type="button" className="payment-secondary-btn" onClick={copyOrderCode}>
                    Copy Order Code
                </button>
            </div>

            <div className="payment-instructions">
                <p>Please copy this Order Code and paste it into ABA payment note before confirming payment.</p>
                <p>សូមចម្លងលេខ Order Code នេះ ហើយដាក់ក្នុង Note របស់ ABA មុនពេលបង់ប្រាក់។</p>
                <p className="payment-warning">Do not close this page before copying your Order Code.</p>
                <p className="payment-muted">Payment will be approved after admin verification.</p>
                {order.expiresAt && <p className="payment-muted">Expires: {new Date(order.expiresAt).toLocaleString()}</p>}
            </div>

            <div className="payment-actions">
                <button type="button" className="payment-primary-btn" onClick={() => { window.location.href = order.paymentLink; }}>
                    Pay with ABA
                </button>
                <button type="button" className="payment-secondary-btn" disabled={checking} onClick={checkStatus}>
                    {checking ? "Checking..." : "Check Payment Status"}
                </button>
                <button type="button" className="payment-secondary-btn" onClick={() => navigate(`/payments/${order.orderCode}/status`)}>
                    Open Status Page
                </button>
            </div>

            <div className="payment-status-note">
                {order.status === "PAID" ? "✅ " : ""}{statusMessage(order.status)}
            </div>
        </section>
    );
}
