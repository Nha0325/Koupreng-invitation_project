package com.koupreng.backend.invitation.dto;

public record ShareLinkResponse(
        String shareUrl,
        String shareToken
) {
}
