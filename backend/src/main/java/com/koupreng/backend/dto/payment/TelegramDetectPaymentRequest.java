package com.koupreng.backend.dto.payment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TelegramDetectPaymentRequest {

    @NotBlank(message = "Raw message is required")
    private String rawMessage;

    @NotBlank(message = "Detected by is required")
    private String detectedBy;
}
