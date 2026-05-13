package com.koupreng.backend.invitation.dto;

public record TemplateResponse(
        Long id,
        String name,
        String category,
        String eventType,
        String canvasConfigJson,
        String thumbnailUrl
) {
}
