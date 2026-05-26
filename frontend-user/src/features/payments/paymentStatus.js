const STATUS_TEXT = {
    PENDING: "Payment is still pending.",
    WAITING_MANUAL_CONFIRMATION: "Payment is waiting for manual confirmation.",
    PAID_PENDING_REVIEW: "Payment detected and waiting for admin review.",
    PAID: "Payment confirmed. Template unlocked.",
    REJECTED: "Payment was rejected. Please contact support.",
    EXPIRED: "This payment order has expired. Please create a new order.",
};

export function statusMessage(status) {
    return STATUS_TEXT[status] || "Payment status is unavailable.";
}
