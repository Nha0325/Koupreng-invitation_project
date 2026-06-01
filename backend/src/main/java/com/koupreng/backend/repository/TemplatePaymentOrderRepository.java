package com.koupreng.backend.repository;

import com.koupreng.backend.entity.payment.TemplatePaymentOrder;
import com.koupreng.backend.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TemplatePaymentOrderRepository extends JpaRepository<TemplatePaymentOrder, Long> {

    Optional<TemplatePaymentOrder> findByOrderCode(String orderCode);

    Optional<TemplatePaymentOrder> findByTransactionId(String transactionId);

    boolean existsByOrderCode(String orderCode);

    boolean existsByTransactionId(String transactionId);

    List<TemplatePaymentOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<TemplatePaymentOrder> findByStatusInOrderByCreatedAtDesc(Collection<PaymentStatus> statuses);

    List<TemplatePaymentOrder> findTop5ByStatusAndProviderAndCurrencyAndAmountAndCreatedAtAfterOrderByCreatedAtDesc(
            PaymentStatus status,
            String provider,
            String currency,
            BigDecimal amount,
            Instant createdAt
    );

    List<TemplatePaymentOrder> findByStatusInAndExpiresAtBefore(
            Collection<PaymentStatus> statuses,
            Instant expiresAt
    );
}
