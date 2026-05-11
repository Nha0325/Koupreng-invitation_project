package com.koupreng.backend.auth;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

import com.koupreng.backend.config.AppProperties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetNotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PasswordResetNotificationService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final AppProperties appProperties;

    public PasswordResetNotificationService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            AppProperties appProperties
    ) {
        this.mailSenderProvider = mailSenderProvider;
        this.appProperties = appProperties;
    }

    public void sendResetLink(AppUser user, String token, Instant expiresAt) {
        String resetLink = buildResetLink(token);
        AppProperties.PasswordReset passwordReset = appProperties.getPasswordReset();

        if (passwordReset.isLogTokenInDevelopment()) {
            LOGGER.warn("Development password reset link for user id {} expires at {}: {}", user.getId(), expiresAt, resetLink);
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            LOGGER.error("Password reset email is not configured; no reset link sent for user id {}", user.getId());
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(passwordReset.getEmailFrom());
        message.setTo(user.getEmail());
        message.setSubject("Reset your Koupreng password");
        message.setText("""
                A password reset was requested for your Koupreng account.

                Use this link to reset your password:
                %s

                This link expires at %s.
                If you did not request this reset, ignore this email.
                """.formatted(resetLink, expiresAt));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            LOGGER.error("Could not send password reset email for user id {}", user.getId(), exception);
        }
    }

    private String buildResetLink(String token) {
        String frontendUrl = appProperties.getPasswordReset().getFrontendUrl();
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        if (frontendUrl.contains("{token}")) {
            return frontendUrl.replace("{token}", encodedToken);
        }

        String separator = frontendUrl.contains("?") ? "&" : "?";
        return frontendUrl + separator + "token=" + encodedToken;
    }
}
