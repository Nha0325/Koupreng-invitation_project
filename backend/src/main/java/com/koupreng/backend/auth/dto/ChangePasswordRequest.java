package com.koupreng.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank @Size(max = 100) String currentPassword,
        @NotBlank @Size(min = 8, max = 100) String newPassword
) {
}
