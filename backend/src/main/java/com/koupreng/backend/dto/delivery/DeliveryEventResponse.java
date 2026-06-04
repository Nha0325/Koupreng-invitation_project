package com.koupreng.backend.dto.delivery;

import java.time.Instant;

import com.koupreng.backend.entity.delivery.InvitationDeliveryEvent;

public record DeliveryEventResponse(
        Long id,
        Long guestId,
        String guestName,
        String eventType,
        String channel,
        String status,
        String message,
        String errorMessage,
        Instant createdAt) {
    public static DeliveryEventResponse from(InvitationDeliveryEvent event) {
        return new DeliveryEventResponse(
                event.getId(),
                event.getGuest() == null ? null : event.getGuest().getId(),
                event.getGuest() == null ? null : event.getGuest().getGuestName(),
                event.getEventType(),
                event.getChannel(),
                event.getStatus(),
                event.getMessage(),
                event.getErrorMessage(),
                event.getCreatedAt());
    }
}
