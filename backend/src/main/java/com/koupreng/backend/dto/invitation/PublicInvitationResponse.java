package com.koupreng.backend.dto.invitation;

import com.koupreng.backend.entity.invitation.EventType;
import com.koupreng.backend.entity.invitation.InvitationTemplate;
import com.koupreng.backend.entity.invitation.UserInvitation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicInvitationResponse {

    private Long templateId;
    private String templateName;
    private String title;
    private String slug;
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
    private LocalDate rsvpDeadline;

    public static PublicInvitationResponse from(UserInvitation invitation) {
        InvitationTemplate template = invitation.getTemplate();
        return PublicInvitationResponse.builder()
                .templateId(template == null ? null : template.getId())
                .templateName(template == null ? null : template.getName())
                .title(invitation.getTitle())
                .slug(invitation.getSlug())
                .eventType(invitation.getEventType())
                .eventDate(invitation.getEventDate())
                .eventTime(invitation.getEventTime())
                .venueName(invitation.getVenueName())
                .venueAddress(invitation.getVenueAddress())
                .googleMapUrl(invitation.getGoogleMapUrl())
                .hostName(invitation.getHostName())
                .partnerName(invitation.getPartnerName())
                .groomName(invitation.getGroomName())
                .brideName(invitation.getBrideName())
                .storyText(invitation.getStoryText())
                .languageMode(invitation.getLanguageMode())
                .rsvpDeadline(invitation.getRsvpDeadline())
                .build();
    }
}
