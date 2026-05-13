package com.koupreng.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResendVerificationEmailRequest(
        @NotBlank @Email @Size(max = 255) String email
) {
}
