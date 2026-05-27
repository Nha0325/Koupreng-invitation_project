const STATUS_TEXT = {
    PENDING: "Payment order created.",
    QR_CREATED: "QR created. Waiting for ABA PayWay verification.",
    CHECKOUT_CREATED: "Checkout created. Waiting for PayWay verification.",
    PAID: "Payment verified. Template unlocked.",
    FAILED: "Payment failed.",
    CANCELLED: "Payment was cancelled or not completed.",
    REJECTED: "Payment was rejected. Please contact support.",
    EXPIRED: "This payment order has expired. Please create a new order.",
};

export function statusMessage(status) {
    return STATUS_TEXT[status] || "Payment status is unavailable.";
}

export function isTerminalStatus(status) {
    return ["PAID", "FAILED", "CANCELLED", "EXPIRED", "REJECTED"].includes(status);
}
