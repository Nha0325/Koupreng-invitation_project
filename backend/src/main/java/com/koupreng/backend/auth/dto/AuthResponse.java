package com.koupreng.backend.auth.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresInSeconds,
        UserResponse user
) {
}
