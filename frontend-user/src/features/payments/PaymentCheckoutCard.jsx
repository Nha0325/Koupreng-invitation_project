import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { paymentService } from "./paymentService";
import { statusMessage } from "./paymentStatus";
import { toast } from "../../shared/ui/toast";
import "./PaymentPages.css";

export default function PaymentCheckoutCard({ order, onStatusChange }) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);
    const fields = order?.checkoutFormFields || {};
    const canContinue = Boolean(order?.checkoutUrl && Object.keys(fields).length > 0);

    const checkStatus = async () => {
        setChecking(true);
        try {
            const latest = await paymentService.getTemplateOrder(order.orderCode);
            onStatusChange?.(latest);
            if (latest.status === "PAID") {
                toast("Payment verified. Template unlocked.");
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
                <span>Order</span>
                <code>{order.orderCode}</code>
                <small>Transaction {order.transactionId}</small>
            </div>

            <div className="payment-instructions">
                <p>{statusMessage(order.status)}</p>
                {order.expiresAt && <p className="payment-muted">Expires: {new Date(order.expiresAt).toLocaleString()}</p>}
            </div>

            <div className="payment-actions">
                {canContinue && (
                    <form action={order.checkoutUrl} method="POST" className="payment-post-form">
                        {Object.entries(fields).map(([name, value]) => (
                            <input key={name} type="hidden" name={name} value={value ?? ""} />
                        ))}
                        <button type="submit" className="payment-primary-btn">
                            Continue to ABA PayWay
                        </button>
                    </form>
                )}
                <button type="button" className="payment-secondary-btn" disabled={checking} onClick={checkStatus}>
                    {checking ? "Checking..." : "Check Status"}
                </button>
                <button type="button" className="payment-secondary-btn" onClick={() => navigate(`/payments/${order.orderCode}/status`)}>
                    Open Status
                </button>
                {order.status === "PAID" && (
                    <Link to="/dashboard/templates/paid" className="payment-secondary-btn link-button">
                        View Paid Templates
                    </Link>
                )}
            </div>
        </section>
    );
}
