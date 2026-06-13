package com.koupreng.backend.dto.invitation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationAccessVerifyResponse {

    private String slug;
    private boolean accessGranted;
    private String accessToken;
}
