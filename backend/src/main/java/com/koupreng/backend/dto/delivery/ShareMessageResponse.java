package com.koupreng.backend.dto.delivery;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShareMessageResponse {

    private Long guestId;
    private String guestName;
    private String invitationUrl;
    private String message;
}
