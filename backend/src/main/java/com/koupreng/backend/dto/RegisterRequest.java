package com.koupreng.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(max = 120) String fullName,
        @Email @Size(max = 255) String email,
        @Size(max = 30) String phone,
        @NotBlank @Size(min = 8, max = 100) String password
) {
}
