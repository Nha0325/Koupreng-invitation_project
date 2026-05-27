import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { Link, useNavigate } from "react-router-dom";
import { paymentService } from "./paymentService";
import { isTerminalStatus, statusMessage } from "./paymentStatus";
import { toast } from "../../shared/ui/toast";
import "./PaymentPages.css";

function secondsRemaining(expiresAt, now = Date.now()) {
    if (!expiresAt) {
        return null;
    }
    const expiresTime = new Date(expiresAt).getTime();
    if (Number.isNaN(expiresTime)) {
        return null;
    }
    return Math.max(0, Math.floor((expiresTime - now) / 1000));
}

function formatRemaining(seconds) {
    if (seconds == null) {
        return "";
    }
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export default function PaymentQrCard({ order, onStatusChange, onRetry }) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);
    const [now, setNow] = useState(() => Date.now());
    const status = order?.status || "PENDING";
    const waitingForPayment = status === "PENDING" || status === "QR_CREATED";
    const orderCode = order?.orderCode || "";
    const qrValue = order?.qrString || "";

    const checkStatus = useCallback(async ({ quiet = false } = {}) => {
        if (!orderCode) {
            return;
        }
        setChecking(true);
        try {
            const latest = await paymentService.getTemplateOrder(orderCode);
            onStatusChange?.(latest);
            if (!quiet && latest.status === "PAID") {
                toast("Payment confirmed. Template unlocked.");
            }
        } catch (err) {
            if (!quiet) {
                toast(err.message || "Could not check payment status");
            }
        } finally {
            setChecking(false);
        }
    }, [onStatusChange, orderCode]);

    useEffect(() => {
        if (!order?.expiresAt || isTerminalStatus(status)) {
            return undefined;
        }
        const timer = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);
        return () => window.clearInterval(timer);
    }, [order?.expiresAt, status]);

    useEffect(() => {
        if (!waitingForPayment || !orderCode) {
            return undefined;
        }
        const timer = window.setInterval(() => {
            checkStatus({ quiet: true });
        }, 5000);
        return () => window.clearInterval(timer);
    }, [checkStatus, orderCode, waitingForPayment]);

    const remaining = useMemo(() => secondsRemaining(order?.expiresAt, now), [order?.expiresAt, now]);
    const countdownText = useMemo(() => {
        if (remaining == null) {
            return "";
        }
        return remaining > 0 ? formatRemaining(remaining) : "Expired";
    }, [remaining]);

    return (
        <section className="payment-card payment-qr-card">
            <div className="payment-summary">
                <span className={`payment-status ${status.toLowerCase()}`}>
                    {status}
                </span>
                <h2>{order.templateName}</h2>
                <p>{order.packageName}</p>
                <strong>{order.currency || "USD"} {order.amount}</strong>
            </div>

            <div className="payment-qr-layout">
                <div className="payment-qr-box">
                    {order.qrImageUrl ? (
                        <img src={order.qrImageUrl} alt={`ABA PayWay QR for order ${order.orderCode}`} />
                    ) : qrValue ? (
                        <QRCode value={qrValue} size={220} level="M" />
                    ) : (
                        <div className="payment-qr-empty">QR unavailable</div>
                    )}
                </div>

                <div className="payment-qr-details">
                    <div className="payment-code-box">
                        <span>Order</span>
                        <code>{order.orderCode}</code>
                        <small>Transaction {order.transactionId}</small>
                    </div>

                    {countdownText && (
                        <div className="payment-countdown">
                            <span>QR expires in</span>
                            <strong>{countdownText}</strong>
                        </div>
                    )}

                    <div className="payment-instructions">
                        <p>Scan this QR code with ABA Mobile to pay. Your template will unlock automatically after payment is verified.</p>
                        <p>សូមស្កេន QR Code នេះជាមួយ ABA Mobile ដើម្បីបង់ប្រាក់។ Template នឹងបើកប្រើបាន បន្ទាប់ពីប្រព័ន្ធផ្ទៀងផ្ទាត់ការបង់ប្រាក់រួច។</p>
                        <p className="payment-muted">{statusMessage(status)}</p>
                    </div>
                </div>
            </div>

            {status === "PAID" && (
                <div className="payment-confirmed">
                    <strong>Payment confirmed. Template unlocked.</strong>
                    <Link to={`/create/wedding?template=${order.templateId}`} className="payment-primary-btn link-button">
                        Use Template
                    </Link>
                </div>
            )}

            {status === "EXPIRED" && (
                <div className="payment-warning-panel">
                    <strong>This QR code expired. Please create a new payment.</strong>
                    {onRetry && (
                        <button type="button" className="payment-primary-btn" onClick={onRetry}>
                            Create New Payment
                        </button>
                    )}
                </div>
            )}

            {(status === "FAILED" || status === "CANCELLED" || status === "REJECTED") && (
                <div className="payment-warning-panel">
                    <strong>{statusMessage(status)}</strong>
                    {onRetry && (
                        <button type="button" className="payment-primary-btn" onClick={onRetry}>
                            Retry Payment
                        </button>
                    )}
                </div>
            )}

            <div className="payment-actions">
                {order.checkoutUrl && status !== "PAID" && (
                    <a className="payment-secondary-btn link-button" href={order.checkoutUrl}>
                        Open ABA Mobile
                    </a>
                )}
                <button type="button" className="payment-secondary-btn" disabled={checking} onClick={() => checkStatus()}>
                    {checking ? "Checking..." : "Check Payment Status"}
                </button>
                <button type="button" className="payment-secondary-btn" onClick={() => navigate(`/payments/${order.orderCode}/status`)}>
                    Open Status
                </button>
                <Link to="/dashboard/templates/paid" className="payment-secondary-btn link-button">
                    View Paid Templates
                </Link>
            </div>
        </section>
    );
}
