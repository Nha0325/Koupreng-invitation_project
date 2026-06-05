package com.koupreng.backend.dto.admin;

import com.koupreng.backend.entity.invitation.TemplateCategory;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminTemplateRequest {

    @NotBlank(message = "Template name is required")
    private String name;

    private TemplateCategory category;
    private String thumbnailUrl;
    private String previewUrl;
    private Boolean premium;
    private String status;
}
