package com.koupreng.backend.dto.invitation;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InvitationCustomizationRequest {

    private Long templateId;

    @Size(max = 20)
    private String languageMode;

    @Size(max = 20000)
    private String designJson;

    @Size(max = 50000)
    private String contentJson;

    @Size(max = 10000)
    private String customColors;

    @Size(max = 10000)
    private String customFonts;

    @Size(max = 10000)
    private String enabledSections;

    @Size(max = 10000)
    private String layoutSettings;
}
