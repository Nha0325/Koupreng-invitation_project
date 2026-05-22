package com.koupreng.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @JsonAlias({"email", "phone", "emailOrPhone"}) @NotBlank @Size(max = 255) String identifier,
        @NotBlank @Size(max = 100) String password
) {
}
