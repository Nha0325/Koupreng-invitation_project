package com.koupreng.backend.dto.delivery;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class InvitationDeliveryResponse {

    private Long invitationId;
    private String slug;
    private String invitationLink;
    private String channel;
    private String status;
    private String subject;
    private String message;
    private int guestCount;
    private int preparedCount;
    private int sentCount;
    private int reminderCount;
    private int failedCount;
    private Map<String, Long> statusCounts;
    private List<GuestDeliveryResponse> guests;
    private Instant preparedAt;
}
