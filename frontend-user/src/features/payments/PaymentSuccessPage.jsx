import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { paymentService } from "./paymentService";
import { isTerminalStatus, statusMessage } from "./paymentStatus";
import "./PaymentPages.css";

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode") || "";
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!orderCode) {
            return undefined;
        }

        let active = true;
        let timer;

        const loadStatus = () => {
            paymentService.getTemplateOrder(orderCode)
                .then((data) => {
                    if (!active) {
                        return;
                    }
                    setOrder(data);
                    setError("");
                    if (isTerminalStatus(data.status) && timer) {
                        window.clearInterval(timer);
                    }
                })
                .catch((err) => {
                    if (active) {
                        setError(err.message || "Could not load payment status");
                    }
                });
        };

        loadStatus();
        timer = window.setInterval(loadStatus, 5000);

        return () => {
            active = false;
            if (timer) {
                window.clearInterval(timer);
            }
        };
    }, [orderCode]);

    return (
        <main className="payment-page">
            <section className="payment-hero">
                <span className="payment-eyebrow">Payment return</span>
                <h1>Payment is being verified. Please wait.</h1>
                <p>{order ? statusMessage(order.status) : "Backend callback verification is required before access unlocks."}</p>
            </section>

            {error && <div className="payment-error">{error}</div>}
            {order && (
                <section className="payment-card payment-status-panel">
                    <span className={`payment-status ${order.status?.toLowerCase() || "pending"}`}>
                        {order.status}
                    </span>
                    <h2>{order.templateName}</h2>
                    <p>{order.orderCode}</p>
                    <Link className="payment-secondary-btn link-button" to={`/payments/${order.orderCode}/status`}>
                        Open Status
                    </Link>
                </section>
            )}

            <div className="payment-footer-links">
                <Link to="/dashboard/templates/paid">View paid templates</Link>
                <Link to="/templates">Browse templates</Link>
            </div>
        </main>
    );
}
