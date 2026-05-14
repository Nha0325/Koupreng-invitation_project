package com.koupreng.backend.service;

import java.time.Duration;
import java.util.Locale;

import org.springframework.stereotype.Service;

@Service
public class AuthRateLimiter {

    private final RateLimitService rateLimitService;

    public AuthRateLimiter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    public void checkRegister(String clientAddress) {
        check("register:ip:" + clientAddress, 5, Duration.ofHours(1));
    }

    public void checkLogin(String email, String clientAddress) {
        check("login:" + normalize(email) + ":ip:" + clientAddress, 5, Duration.ofMinutes(10));
    }

    public void checkForgotPassword(String email, String clientAddress) {
        check("forgot:" + normalize(email) + ":ip:" + clientAddress, 3, Duration.ofMinutes(15));
        check("forgot:ip:" + clientAddress, 10, Duration.ofMinutes(15));
    }

    public void checkResetPassword(String clientAddress) {
        check("reset:ip:" + clientAddress, 10, Duration.ofMinutes(15));
    }

    public void checkExternalAuth(String provider, String clientAddress) {
        check("external:" + normalize(provider) + ":ip:" + clientAddress, 20, Duration.ofMinutes(10));
    }

    public void checkEmailVerification(String clientAddress) {
        check("verify:ip:" + clientAddress, 10, Duration.ofMinutes(15));
    }

    public void checkResendVerification(String email, String clientAddress) {
        check("verify-resend:" + normalize(email) + ":ip:" + clientAddress, 3, Duration.ofMinutes(15));
        check("verify-resend:ip:" + clientAddress, 10, Duration.ofMinutes(15));
    }

    private void check(String key, int maxAttempts, Duration windowSize) {
        rateLimitService.check(key, maxAttempts, windowSize);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}
