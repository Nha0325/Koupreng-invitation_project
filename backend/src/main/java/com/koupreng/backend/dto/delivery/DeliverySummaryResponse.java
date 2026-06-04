package com.koupreng.backend.dto.delivery;

import java.util.List;

public record DeliverySummaryResponse(
        Long invitationId,
        String invitationSlug,
        int totalGuests,
        int notReady,
        int ready,
        int linkGenerated,
        int sent,
        int failed,
        int reminderSent,
        int opened,
        int responded,
        List<DeliveryGuestResponse> guests) {
}