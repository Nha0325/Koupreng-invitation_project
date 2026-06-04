package com.koupreng.backend.dto.delivery;

import java.util.List;

public record DeliveryActionResponse(
        Long invitationId,
        int totalTargets,
        int successCount,
        int failedCount,
        List<DeliveryGuestResponse> guests) {

}
