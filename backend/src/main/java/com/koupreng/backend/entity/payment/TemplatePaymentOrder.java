package com.koupreng.backend.entity.payment;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.enums.PaymentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Table(name = "template_payment_orders")
public class TemplatePaymentOrder {

    public static final String PROVIDER_ABA_PAYWAY_SANDBOX = "ABA_PAYWAY_SANDBOX";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_code", nullable = false, unique = true, length = 50)
    private String orderCode;

    @Column(name = "transaction_id", nullable = false, unique = true, length = 100)
    private String transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(name = "template_id", nullable = false)
    private Long templateId;

    @Column(name = "template_name", nullable = false)
    private String templateName;

    @Column(name = "package_name", nullable = false, length = 100)
    private String packageName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "paid_amount", precision = 10, scale = 2)
    private BigDecimal paidAmount;

    @Column(nullable = false, length = 10)
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(nullable = false, length = 50)
    private String provider = PROVIDER_ABA_PAYWAY_SANDBOX;

    @Column(name = "payway_request_json", columnDefinition = "TEXT")
    private String paywayRequestJson;

    @Column(name = "payway_response_json", columnDefinition = "TEXT")
    private String paywayResponseJson;

    @Column(name = "callback_raw_json", columnDefinition = "TEXT")
    private String callbackRawJson;

    @Column(name = "payway_status", length = 100)
    private String paywayStatus;

    @Column(name = "payway_transaction_id")
    private String paywayTransactionId;

    @Column(name = "checkout_url", columnDefinition = "TEXT")
    private String checkoutUrl;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (status == null) {
            status = PaymentStatus.PENDING;
        }
        if (currency == null || currency.isBlank()) {
            currency = "USD";
        }
        if (provider == null || provider.isBlank()) {
            provider = PROVIDER_ABA_PAYWAY_SANDBOX;
        }
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
