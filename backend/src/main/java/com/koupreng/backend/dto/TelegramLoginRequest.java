package com.koupreng.backend.dto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

public record TelegramLoginRequest(
        @Size(max = 8192) String idToken,
        @Positive Long id,
        @JsonProperty("first_name") @JsonAlias("firstName") @Size(max = 120) String firstName,
        @JsonProperty("last_name") @JsonAlias("lastName") @Size(max = 120) String lastName,
        @Size(max = 120) String username,
        @JsonProperty("photo_url") @JsonAlias("photoUrl") @Size(max = 512) String photoUrl,
        @JsonProperty("auth_date") @JsonAlias("authDate") @Positive Long authDate,
        @Size(max = 256) String hash
) {
}
