package com.koupreng.backend.service;

import com.koupreng.backend.entity.AuthProvider;

public record ExternalAuthIdentity(
        AuthProvider provider,
        String providerId,
        String email,
        String fullName
) {
}
