package com.koupreng.backend.auth;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.koupreng.backend.common.ApiException;

import org.junit.jupiter.api.Test;

class PasswordPolicyTests {

    private final PasswordPolicy passwordPolicy = new PasswordPolicy();

    @Test
    void acceptsStrongPassword() {
        assertDoesNotThrow(() -> passwordPolicy.validate("Str0ng!Password", "user@example.com", "Jane Doe"));
    }

    @Test
    void rejectsWeakPassword() {
        assertThrows(ApiException.class, () -> passwordPolicy.validate("password123", "user@example.com", "Jane Doe"));
    }

    @Test
    void rejectsPersonalInfo() {
        assertThrows(ApiException.class, () -> passwordPolicy.validate("JaneDoe!12345", "jane@example.com", "Jane Doe"));
    }
}
