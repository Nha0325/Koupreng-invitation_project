import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import {
  IoCopyOutline,
  IoCheckmarkCircle,
  IoRefreshOutline,
  IoShieldCheckmarkOutline,
  IoOpenOutline,
  IoSparkles,
} from "react-icons/io5";

import { paymentService } from "./paymentService";
import { isTerminalStatus } from "./paymentStatus";
import { toast } from "../../shared/ui/toast";
import { KEEP_TEMPLATE_CODE } from "@/features/templates";
import "./PaymentPages.css";


const DEFAULT_ABA_KHQR_STRING =
  "00020101021129450016abaakhppxxx@abaa01090098588160208ABA Bank40600006abaP2P011241CF604FF46E020900985881603090078303860404Dual5204000053031165802KH5908PANHA NY6010Phnom Penh6304E9DC";

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
  const [checking, setChecking] = useState(false);

  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);

  const status = order?.status || "PENDING";
  const waitingForPayment = !isTerminalStatus(status);
  const orderCode = order?.orderCode || "";
  const qrValue = order?.qrString || DEFAULT_ABA_KHQR_STRING;

  const copyOrderCode = () => {
    if (!orderCode) return;
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    toast(`បាន Copy Order Code: ${orderCode}`);
    setTimeout(() => setCopied(false), 2500);
  };

  const checkStatus = useCallback(
    async ({ quiet = false } = {}) => {
      if (!orderCode) {
        return;
      }
      setChecking(true);
      try {
        const latest = await paymentService.getTemplateOrder(orderCode);
        onStatusChange?.(latest);
        if (!quiet && latest.status === "PAID") {
          toast("ការទូទាត់ជោគជ័យ! Template ត្រូវបាន Unlock រួចរាល់។");
        }
      } catch (err) {
        if (!quiet) {
          toast(err.message || "Could not check payment status");
        }
      } finally {
        setChecking(false);
      }
    },
    [onStatusChange, orderCode]
  );

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

  const remaining = useMemo(
    () => secondsRemaining(order?.expiresAt, now),
    [order?.expiresAt, now]
  );

  const countdownText = useMemo(() => {
    if (remaining == null) {
      return "";
    }
    return remaining > 0 ? formatRemaining(remaining) : "ផុតកំណត់ (Expired)";
  }, [remaining]);

  const targetTemplateId =
    order?.templateId || order?.templateSlug || KEEP_TEMPLATE_CODE;

  return (
    <section className="checkout-card payment-qr-card-lux">
      {/* Top Order Summary Bar */}
      <div className="payment-summary-lux">
        <div>
          <span className="checkout-template-cat">
            {order?.packageName || "Premium"} Plan • {order?.currency || "USD"} {order?.amount || "0.01"}
          </span>
          <h2 className="payment-title-lux">
            {order?.templateName || "Garden Royal Khmer Wedding"}
          </h2>
        </div>

        <span className={`payment-status-badge ${status.toLowerCase()}`}>
          {status === "PAID"
            ? "✓ ទូទាត់ជោគជ័យ (PAID)"
            : status === "PENDING"
            ? "⏳ រង់ចាំការទូទាត់ (PENDING)"
            : status}
        </span>
      </div>

      {/* QR & Details Layout */}
      <div className="payment-qr-grid-lux">
        {/* Left: Pure Clean Vector QR Code */}
        <div className="payment-qr-box-lux">
          {/* KHQR Card Top Header */}
          <div className="payment-khqr-header">
            <div className="payment-khqr-tag">KHQR</div>
            <div className="payment-khqr-sub">BAKONG • ABA BANK</div>
          </div>

          {/* Clean High-Contrast Vector QR */}
          <div className="payment-qr-canvas-wrap">
            <QRCode
              value={qrValue}
              size={220}
              level="M"
              style={{ height: "auto", maxWidth: "100%", width: "100%", display: "block" }}
            />
          </div>

          {/* Payee Info */}
          <div className="payment-khqr-footer">
            <strong>PANHA NY</strong>
            <span>USD 0.01</span>
          </div>

          <span className="payment-qr-brand-label">
            <IoShieldCheckmarkOutline /> ស្កេនបានជាមួយគ្រប់ App ធនាគារ
          </span>
        </div>

        {/* Right: Order Code & Instructions */}
        <div className="payment-qr-info-lux">
          {/* Order Code Card */}
          <div className="payment-code-box-lux">
            <div className="payment-code-header">
              <span>លេខកូដសម្គាល់ការទិញ (Order Code)</span>
              <button
                type="button"
                className="payment-copy-btn"
                onClick={copyOrderCode}
                title="Copy Order Code"
              >
                {copied ? <IoCheckmarkCircle style={{ color: "#0f766e" }} /> : <IoCopyOutline />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <code className="payment-code-number">{orderCode}</code>
            <small className="payment-trx-id">
              Transaction ID: {order?.transactionId || "—"}
            </small>
          </div>

          {/* Countdown timer */}
          {countdownText && status === "PENDING" && (
            <div className="payment-countdown-lux">
              <span>⏱️ QR ផុតកំណត់ក្នុងរយៈពេល (Expires In):</span>
              <strong>{countdownText}</strong>
            </div>
          )}

          {/* Instructions text */}
          <div className="payment-instructions-lux">
            <p>
              👉 <strong>របៀបស្កេនទូទាត់៖</strong> បើកកម្មវិធី <strong>ABA Mobile</strong> (ឬ Bakong / ធនាគារណាក៏បាន) រួច Scan QR Code ខាងឆ្វេង។
            </p>
            <p className="payment-muted-lux">
              Scan this clean KHQR with ABA Mobile to complete your test payment ($0.01). Your template unlocks automatically after verification.
            </p>
          </div>

          {/* Success Status Panel */}
          {status === "PAID" && (
            <div className="payment-confirmed-lux">
              <div className="payment-confirmed-icon">
                <IoCheckmarkCircle />
              </div>
              <div>
                <strong>ការទូទាត់ត្រូវបានផ្ទៀងផ្ទាត់ជោគជ័យ!</strong>
                <p>គំរូធៀបការរបស់អ្នកត្រូវបាន Unlock រួចរាល់ហើយ។ អ្នកអាចចាប់ផ្តើមបង្កើតធៀបការបានឥឡូវនេះ។</p>
              </div>
              <Link
                to={`/create/wedding?template=${targetTemplateId}`}
                className="checkout-pay-btn"
                style={{ marginTop: "12px", width: "100%" }}
              >
                <IoSparkles /> ចាប់ផ្តើមបង្កើតធៀបការ (Use Template)
              </Link>
            </div>
          )}

          {/* Expired / Failed Panel */}
          {status === "EXPIRED" && (
            <div className="payment-alert-panel expired">
              <strong>⚠️ QR Code នេះបានផុតកំណត់ហើយ</strong>
              <p>សូមបង្កើតការបញ្ជាទិញម្ដងទៀតដើម្បីទទួលបាន QR ថ្មី។</p>
              {onRetry && (
                <button
                  type="button"
                  className="payment-primary-btn"
                  onClick={onRetry}
                  style={{ marginTop: "10px" }}
                >
                  បង្កើតការទូទាត់ថ្មី (Retry)
                </button>
              )}
            </div>
          )}

          {/* Actions Bar */}
          <div className="payment-actions-lux">
            {order?.checkoutUrl && status !== "PAID" && (
              <a
                className="payment-action-gold-btn"
                href={order.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoOpenOutline /> Open ABA Link
              </a>
            )}

            <button
              type="button"
              className="payment-action-secondary-btn"
              disabled={checking}
              onClick={() => checkStatus()}
            >
              <IoRefreshOutline className={checking ? "checkout-spinner" : ""} />
              <span>{checking ? "កំពុងពិនិត្យ..." : "Check Status"}</span>
            </button>

            <Link
              to="/dashboard/templates/paid"
              className="payment-action-secondary-btn"
            >
              Paid Templates
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
