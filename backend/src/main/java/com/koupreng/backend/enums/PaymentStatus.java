package com.koupreng.backend.enums;

public enum PaymentStatus {
    PENDING,
    QR_CREATED,
    /**
     * Legacy status from the old hosted checkout flow. New dynamic QR orders use QR_CREATED.
     */
    CHECKOUT_CREATED,
    PAID,
    FAILED,
    CANCELLED,
    EXPIRED,
    REJECTED,
}
