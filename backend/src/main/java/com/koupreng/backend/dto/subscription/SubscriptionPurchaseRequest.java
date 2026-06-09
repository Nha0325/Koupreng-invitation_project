package com.koupreng.backend.dto.subscription;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscriptionPurchaseRequest {

    @NotNull(message = "Package ID is required")
    private Long packageId;
}
