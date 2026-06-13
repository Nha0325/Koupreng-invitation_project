package com.koupreng.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @Size(max = 100)
        String oldPassword,

        @Size(max = 100)
        String currentPassword,

        @NotBlank
        @Size(min = 8, max = 100)
        String newPassword
) {
    public ChangePasswordRequest {
        oldPassword = trimToNull(oldPassword);
        currentPassword = trimToNull(currentPassword);
    }

    @Override
    public String oldPassword() {
        return oldPassword != null ? oldPassword : currentPassword;
    }

    @Override
    public String currentPassword() {
        return currentPassword != null ? currentPassword : oldPassword;
    }

    @AssertTrue(message = "Current password is required")
    public boolean isCurrentPasswordPresent() {
        return currentPassword() != null;
    }

    private static String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
