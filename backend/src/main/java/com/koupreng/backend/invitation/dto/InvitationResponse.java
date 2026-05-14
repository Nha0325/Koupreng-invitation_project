package com.koupreng.backend.invitation.dto;

public record InvitationResponse(
        Long id,
        String title,
        String templateName,
        String canvasDataJson,
        String thumbnailDataUrl,
        String shareToken,
        String shareUrl,
        String createdAt,
        String updatedAt
) {
}
