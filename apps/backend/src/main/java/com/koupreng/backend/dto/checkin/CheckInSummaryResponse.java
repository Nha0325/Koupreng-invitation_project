package com.koupreng.backend.dto.checkin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInSummaryResponse {

    private Long invitationId;
    private long totalGuests;
    private long checkedIn;
    private long remaining;
    private long attendingCheckedIn;
}
