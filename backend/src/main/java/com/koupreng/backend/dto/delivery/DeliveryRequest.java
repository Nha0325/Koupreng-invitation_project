package com.koupreng.backend.dto.delivery;

import java.util.List;

public record DeliveryRequest(
        List<Long> guestIds,
        Boolean allEligible,
        String subject,
        String message) {
}
