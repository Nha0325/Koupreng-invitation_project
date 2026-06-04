package com.koupreng.backend.dto.delivery;

public record ShareMessageResponse(
        Long guestId,
        String guestName,
        String invitationUrl,
        String message
) {
}