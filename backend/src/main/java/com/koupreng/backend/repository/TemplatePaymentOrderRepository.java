package com.koupreng.backend.repository;

import com.koupreng.backend.entity.payment.TemplatePaymentOrder;
import com.koupreng.backend.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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

    List<TemplatePaymentOrder> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);

    List<TemplatePaymentOrder> findByStatusInOrderByCreatedAtDesc(Collection<PaymentStatus> statuses);

    List<TemplatePaymentOrder> findByStatusInAndExpiresAtBefore(
            Collection<PaymentStatus> statuses,
            Instant expiresAt
    );
}
