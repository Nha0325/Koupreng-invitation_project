package com.koupreng.backend.auth;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

import com.koupreng.backend.auth.dto.AuthResponse;
import com.koupreng.backend.auth.dto.ForgotPasswordResponse;
import com.koupreng.backend.auth.dto.LoginRequest;
import com.koupreng.backend.auth.dto.MessageResponse;
import com.koupreng.backend.auth.dto.RegisterRequest;
import com.koupreng.backend.auth.dto.ResetPasswordRequest;
import com.koupreng.backend.auth.dto.UserResponse;
import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.config.AppProperties;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final String PASSWORD_RESET_MESSAGE = "If the email exists, password reset instructions will be sent";

    private final AppUserRepository userRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenHashingService tokenHashingService;
    private final PasswordResetNotificationService passwordResetNotificationService;
    private final AuthRateLimiter authRateLimiter;
    private final PasswordPolicy passwordPolicy;
    private final boolean firstUserAdminEnabled;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Duration resetTokenTtl;

    public AuthService(
            AppUserRepository userRepository,
            PasswordResetTokenRepository resetTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            TokenHashingService tokenHashingService,
            PasswordResetNotificationService passwordResetNotificationService,
            AuthRateLimiter authRateLimiter,
            PasswordPolicy passwordPolicy,
            AppProperties appProperties
    ) {
        this.userRepository = userRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenHashingService = tokenHashingService;
        this.passwordResetNotificationService = passwordResetNotificationService;
        this.authRateLimiter = authRateLimiter;
        this.passwordPolicy = passwordPolicy;
        this.resetTokenTtl = Duration.ofMinutes(appProperties.getPasswordResetTokenMinutes());
        this.firstUserAdminEnabled = appProperties.getAuth().isFirstUserAdminEnabled();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, String clientAddress) {
        authRateLimiter.checkRegister(clientAddress);
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
        }

        passwordPolicy.validate(request.password(), email, request.fullName());

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setFullName(request.fullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(firstUserAdminEnabled && userRepository.count() == 0 ? Role.ADMIN : Role.USER);

        AppUser savedUser = userRepository.save(user);
        return authResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, String clientAddress) {
        String email = normalizeEmail(request.email());
        authRateLimiter.checkLogin(email, clientAddress);

        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isEnabled() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return authResponse(user);
    }

    @Transactional
    public MessageResponse logout(Authentication authentication) {
        AppUser user = findAuthenticatedUser(authentication);
        user.incrementTokenVersion();
        return new MessageResponse("Logged out successfully");
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(String emailInput, String clientAddress) {
        String email = normalizeEmail(emailInput);
        authRateLimiter.checkForgotPassword(email, clientAddress);

        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElse(null);

        if (user == null) {
            return passwordResetResponse();
        }

        resetTokenRepository.findByUserAndUsedAtIsNull(user).forEach(PasswordResetToken::markUsed);

        String token = generateToken();
        Instant expiresAt = Instant.now().plus(resetTokenTtl);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setTokenHash(tokenHashingService.sha256(token));
        resetToken.setExpiresAt(expiresAt);
        resetTokenRepository.save(resetToken);

        passwordResetNotificationService.sendResetLink(user, token, expiresAt);
        return passwordResetResponse();
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request, String clientAddress) {
        authRateLimiter.checkResetPassword(clientAddress);

        PasswordResetToken resetToken = resetTokenRepository.findByTokenHash(tokenHashingService.sha256(request.token()))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid reset token"));

        if (resetToken.getUsedAt() != null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Reset token has already been used");
        }

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }

        AppUser user = resetToken.getUser();
        passwordPolicy.validate(request.newPassword(), user);
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.incrementTokenVersion();
        resetTokenRepository.findByUserAndUsedAtIsNull(user).forEach(PasswordResetToken::markUsed);

        return new MessageResponse("Password reset successfully");
    }

    private AuthResponse authResponse(AppUser user) {
        return new AuthResponse(
                jwtService.createAccessToken(user),
                "Bearer",
                jwtService.getAccessTokenTtlSeconds(),
                UserResponse.from(user)
        );
    }

    private AppUser findAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadCredentialsException("Authentication required");
        }

        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new BadCredentialsException("Authentication required"));
    }

    private ForgotPasswordResponse passwordResetResponse() {
        return new ForgotPasswordResponse(PASSWORD_RESET_MESSAGE);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
