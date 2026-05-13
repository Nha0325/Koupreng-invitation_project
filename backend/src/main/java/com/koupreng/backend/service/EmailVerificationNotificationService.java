package com.koupreng.backend.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.config.AppProperties;
import com.koupreng.backend.entity.AppUser;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationNotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(EmailVerificationNotificationService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final AppProperties appProperties;

    public EmailVerificationNotificationService(
            ObjectProvider<JavaMailSender> mailSenderProvider,
            AppProperties appProperties
    ) {
        this.mailSenderProvider = mailSenderProvider;
        this.appProperties = appProperties;
    }

    public void sendVerificationLink(AppUser user, String token, Instant expiresAt) {
        String verificationLink = buildVerificationLink(token);
        AppProperties.EmailVerification emailVerification = appProperties.getEmailVerification();

        if (emailVerification.isLogTokenInDevelopment()) {
            LOGGER.warn("Development email verification link for user id {} expires at {}: {}", user.getId(), expiresAt, verificationLink);
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            LOGGER.error("Email verification mail is not configured; no verification link sent for user id {}", user.getId());
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Email verification mail is not configured");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(appProperties.getPasswordReset().getEmailFrom());
        message.setTo(user.getEmail());
        message.setSubject("Verify your Koupreng account");
        message.setText("""
                Thanks for registering your Koupreng account.

                Use this link to verify your email:
                %s

                This link expires at %s.
                If you did not create this account, ignore this email.
                """.formatted(verificationLink, expiresAt));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            LOGGER.error("Could not send email verification link for user id {}", user.getId(), exception);
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Email verification mail could not be sent");
        }
    }

    private String buildVerificationLink(String token) {
        String frontendUrl = appProperties.getEmailVerification().getFrontendUrl();
        String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
        if (frontendUrl.contains("{token}")) {
            return frontendUrl.replace("{token}", encodedToken);
        }

        String separator = frontendUrl.contains("?") ? "&" : "?";
        return frontendUrl + separator + "token=" + encodedToken;
    }
}
