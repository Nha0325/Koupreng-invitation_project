package com.koupreng.backend.auth.dto;

import java.time.Instant;

import com.koupreng.backend.auth.AppUser;
import com.koupreng.backend.auth.Role;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        Role role,
        boolean enabled,
        Instant createdAt,
        Instant updatedAt
) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
