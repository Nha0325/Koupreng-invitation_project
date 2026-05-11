package com.koupreng.backend.auth.dto;

import com.koupreng.backend.auth.Role;

import jakarta.validation.constraints.NotNull;

public record UpdateRoleRequest(
        @NotNull Role role
) {
}
