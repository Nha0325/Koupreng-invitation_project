package com.koupreng.backend.dto.payment;

import com.koupreng.backend.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayWayCallbackResponse {

    private String message;
    private String orderCode;
    private PaymentStatus status;
}
