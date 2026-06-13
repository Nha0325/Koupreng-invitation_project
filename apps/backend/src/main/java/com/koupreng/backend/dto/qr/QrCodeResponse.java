package com.koupreng.backend.dto.qr;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrCodeResponse {

    private String invitationUrl;
    private String qrCodeDataUri;
    private String qrPayload;
    private String guestName;
    private String tokenType;
}
