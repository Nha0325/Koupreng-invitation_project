package com.koupreng.backend.dto.payment;

import com.koupreng.backend.entity.payment.TemplatePaymentOrder;
import com.koupreng.backend.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTemplatePaymentResponse {

    private String orderCode;
    private String transactionId;
    private Long templateId;
    private String templateName;
    private String packageName;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private String checkoutUrl;
    private Map<String, String> checkoutFormFields;
    private String message;

    public static CreateTemplatePaymentResponse from(
            TemplatePaymentOrder order,
            Map<String, String> checkoutFormFields,
            String message
    ) {
        return CreateTemplatePaymentResponse.builder()
                .orderCode(order.getOrderCode())
                .transactionId(order.getTransactionId())
                .templateId(order.getTemplateId())
                .templateName(order.getTemplateName())
                .packageName(order.getPackageName())
                .amount(order.getAmount())
                .currency(order.getCurrency())
                .status(order.getStatus())
                .checkoutUrl(order.getCheckoutUrl())
                .checkoutFormFields(checkoutFormFields)
                .message(message)
                .build();
    }
}
