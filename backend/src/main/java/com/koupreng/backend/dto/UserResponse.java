package com.koupreng.backend.dto;

import java.time.Instant;

import com.koupreng.backend.entity.AppUser;
import com.koupreng.backend.entity.Role;

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
