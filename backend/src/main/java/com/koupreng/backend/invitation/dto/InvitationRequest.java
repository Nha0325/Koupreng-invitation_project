package com.koupreng.backend.invitation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InvitationRequest(
        Long templateId,
        @NotBlank @Size(max = 255) String title,
        @NotBlank @Size(max = 2_000_000) String canvasDataJson,
        @Size(max = 2_000_000) String thumbnailDataUrl
) {
}
