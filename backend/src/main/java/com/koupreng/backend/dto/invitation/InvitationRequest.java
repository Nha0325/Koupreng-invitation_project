package com.koupreng.backend.dto.invitation;

import com.koupreng.backend.entity.invitation.EventType;
import jakarta.validation.constraints.NotBlank;
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
    private String visibility;
    private String accessPassword;
    private LocalDate rsvpDeadline;
}
