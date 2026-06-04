package com.koupreng.backend.dto.admin;

import com.koupreng.backend.entity.invitation.InvitationTemplate;
import com.koupreng.backend.entity.invitation.TemplateCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminTemplateResponse {

    private Long id;
    private String name;
    private TemplateCategory category;
    private String thumbnailUrl;
    private String previewUrl;
    private boolean premium;
    private String status;
    private Instant createdAt;

    public static AdminTemplateResponse from(InvitationTemplate template) {
        return AdminTemplateResponse.builder()
                .id(template.getId())
                .name(template.getName())
                .category(template.getCategory())
                .thumbnailUrl(template.getThumbnailUrl())
                .previewUrl(template.getPreviewUrl())
                .premium(template.isPremium())
                .status(template.getStatus())
                .createdAt(template.getCreatedAt())
                .build();
    }
}
