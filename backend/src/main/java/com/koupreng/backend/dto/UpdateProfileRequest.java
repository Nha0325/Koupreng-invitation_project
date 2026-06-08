package com.koupreng.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank @Size(max = 120) String fullName,
        @Size(max = 30) String phone,
        @Size(max = 1024) String profileImage
) {
}
