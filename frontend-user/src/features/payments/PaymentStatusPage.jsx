import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PaymentQrCard from "./PaymentQrCard";
import { statusMessage } from "./paymentStatus";
import { paymentService } from "./paymentService";
import "./PaymentPages.css";

export default function PaymentStatusPage() {
    const { orderCode } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        paymentService.getTemplateOrder(orderCode)
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
        <main className="payment-page">
            <section className="payment-hero">
                <span className="payment-eyebrow">Payment status</span>
                <h1>{orderCode}</h1>
                <p>{order ? statusMessage(order.status) : "Checking your payment order."}</p>
            </section>

            {loading && <div className="payment-card">Loading payment status...</div>}
            {error && <div className="payment-error">{error}</div>}
            {order && <PaymentQrCard order={order} onStatusChange={setOrder} />}

            <div className="payment-footer-links">
                <Link to="/dashboard/templates/paid">View paid templates</Link>
                <Link to="/templates">Browse templates</Link>
            </div>
        </main>
    );
}
