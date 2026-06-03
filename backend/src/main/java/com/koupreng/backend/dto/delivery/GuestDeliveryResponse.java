package com.koupreng.backend.dto.delivery;

import com.koupreng.backend.entity.invitation.Guest;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class GuestDeliveryResponse {

    private Long guestId;
    private String guestName;
    private String email;
    private String phone;
    private String sendStatus;
    private String inviteToken;
    private String invitationLink;
    private String qrCodeUrl;
    private Instant viewedAt;

    public static GuestDeliveryResponse from(Guest guest, String invitationLink) {
        return GuestDeliveryResponse.builder()
                .guestId(guest.getId())
                .guestName(guest.getGuestName())
                .email(guest.getEmail())
                .phone(guest.getPhone())
                .sendStatus(guest.getSendStatus())
                .inviteToken(guest.getInviteToken())
                .invitationLink(invitationLink)
                .qrCodeUrl(guest.getQrCodeUrl())
                .viewedAt(guest.getInvitationViewedAt())
                .build();
    }
}
