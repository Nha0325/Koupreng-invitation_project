package com.koupreng.backend.invitation.dto;

import jakarta.validation.constraints.NotBlank;

public record InvitationRequest(
        Long templateId,
        @NotBlank String title,
        @NotBlank String canvasDataJson,
        String thumbnailDataUrl
) {
}
