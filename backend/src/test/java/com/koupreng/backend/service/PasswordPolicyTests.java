package com.koupreng.backend.service;

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

    @Test
    void rejectsPasswordOver72Bytes() {
        String longPassword = "a".repeat(73) + "A1!";
        assertThrows(ApiException.class, () -> passwordPolicy.validate(longPassword, "user@example.com", "Jane Doe"));
    }
}
