package com.koupreng.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank
        @Size(max = 255)
        String token,

        @NotBlank
        @Size(min = 8, max = 100)
        String newPassword
) {
}
