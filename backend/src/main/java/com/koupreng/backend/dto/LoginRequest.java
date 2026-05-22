package com.koupreng.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank @Size(max = 255) String identifier,
        @NotBlank @Size(max = 100) String password
) {
}
