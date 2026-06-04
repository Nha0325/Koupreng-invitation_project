package com.koupreng.backend.dto.invitation;

import com.koupreng.backend.entity.invitation.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class InvitationRequest {

    private Long templateId;

    @NotBlank(message = "Invitation title is required")
    private String title;

    private EventType eventType;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venueName;
    private String venueAddress;
    private String googleMapUrl;
    private String hostName;
    private String partnerName;
    private String groomName;
    private String brideName;
    private String storyText;
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
    private String visibility;
    private String accessPassword;
    private LocalDate rsvpDeadline;
}
