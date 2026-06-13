package com.koupreng.backend.dto.dashboard;

import com.koupreng.backend.dto.rsvp.RsvpResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RsvpReportResponse {

    private Long invitationId;
    private long totalGuests;
    private long yesCount;
    private long noCount;
    private long maybeCount;
    private long pendingCount;
    private long attendeeTotal;
    private List<RsvpResponse> responses;
}
