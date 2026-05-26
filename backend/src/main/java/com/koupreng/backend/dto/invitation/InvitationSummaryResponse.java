package com.koupreng.backend.dto.invitation;

import com.koupreng.backend.entity.invitation.EventType;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.enums.InvitationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationSummaryResponse {

    private Long id;
    private String title;
    private String slug;
    private EventType eventType;
    private LocalDate eventDate;
    private String venueName;
    private InvitationStatus status;

    public static InvitationSummaryResponse from(UserInvitation invitation) {
        return InvitationSummaryResponse.builder()
                .id(invitation.getId())
                .title(invitation.getTitle())
                .slug(invitation.getSlug())
                .eventType(invitation.getEventType())
                .eventDate(invitation.getEventDate())
                .venueName(invitation.getVenueName())
                .status(invitation.getStatus())
                .build();
    }
}
