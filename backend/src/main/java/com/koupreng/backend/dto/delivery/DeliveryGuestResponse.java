package com.koupreng.backend.dto.delivery;

import java.time.Instant;

import com.koupreng.backend.entity.invitation.Guest;

public record DeliveryGuestResponse(
        Long guestId,
        String guestName,
        String phone,
        String email,
        String inviteToken,
        String invitationUrl,
        String sendStatus,
        boolean sendable,
        Instant lastSentAt,
        Instant lastReminderAt,
        Integer reminderCount,
        String lastSendChannel,
        String lastSendError,
        Instant invitationViewedAt,
        boolean responded) {
    public static DeliveryGuestResponse from(Guest guest, String invitationUrl, boolean sendable, boolean responded) {
        return new DeliveryGuestResponse(
                guest.getId(),
                guest.getGuestName(),
                guest.getPhone(),
                guest.getEmail(),
                guest.getInviteToken(),
                invitationUrl,
                guest.getSendStatus(),
                sendable,
                guest.getLastSentAt(),
                guest.getLastReminderAt(),
                guest.getReminderCount(),
                guest.getLastSendChannel(),
                guest.getLastSendError(),
                guest.getInvitationViewedAt(),
                responded);
    }
}
