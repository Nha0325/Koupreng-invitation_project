package com.koupreng.backend.auth;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.koupreng.backend.common.ApiException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class AuthRateLimiter {

    private static final int MAX_BUCKETS = 10_000;

    private final Clock clock = Clock.systemUTC();
    private final Map<String, Window> windows = new ConcurrentHashMap<>();

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

    private void check(String key, int maxAttempts, Duration windowSize) {
        Instant now = clock.instant();
        RateLimitDecision decision = new RateLimitDecision();

        windows.compute(key, (ignored, current) -> {
            if (current == null || !current.resetAt.isAfter(now)) {
                return new Window(now.plus(windowSize), 1);
            }

            if (current.attempts >= maxAttempts) {
                decision.blocked = true;
                return current;
            }

            current.attempts++;
            return current;
        });

        if (windows.size() > MAX_BUCKETS) {
            purgeExpired(now);
        }

        if (decision.blocked) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Too many requests. Try again later.");
        }
    }

    private void purgeExpired(Instant now) {
        windows.entrySet().removeIf(entry -> !entry.getValue().resetAt.isAfter(now));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private static class Window {
        private final Instant resetAt;
        private int attempts;

        private Window(Instant resetAt, int attempts) {
            this.resetAt = resetAt;
            this.attempts = attempts;
        }
    }

    private static class RateLimitDecision {
        private boolean blocked;
    }
}
