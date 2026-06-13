package com.koupreng.backend.dto.invitation;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InvitationAccessVerifyRequest {

    @Size(max = 255)
    private String password;

    @Size(max = 120)
    private String accessToken;

    @Size(max = 120)
    private String inviteToken;
}
