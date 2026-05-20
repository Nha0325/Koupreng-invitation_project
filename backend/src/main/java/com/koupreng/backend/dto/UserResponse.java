package com.koupreng.backend.dto;

import java.time.Instant;
import java.util.UUID;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;

public record UserResponse(
        UUID id,
        String email,
        String phone,
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
                user.getPhone(),
                user.getFullName(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
