package com.koupreng.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import com.koupreng.backend.dto.AuthResponse;
import com.koupreng.backend.dto.ForgotPasswordRequest;
import com.koupreng.backend.dto.ForgotPasswordResponse;
import com.koupreng.backend.dto.GoogleLoginRequest;
import com.koupreng.backend.dto.LoginRequest;
import com.koupreng.backend.dto.MessageResponse;
import com.koupreng.backend.dto.RegisterRequest;
import com.koupreng.backend.dto.ResendVerificationEmailRequest;
import com.koupreng.backend.dto.ResetPasswordRequest;
import com.koupreng.backend.dto.TelegramLoginRequest;
import com.koupreng.backend.dto.VerifyEmailRequest;
import com.koupreng.backend.security.ClientAddressResolver;
import com.koupreng.backend.service.AuthService;

import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final ClientAddressResolver clientAddressResolver;

    public AuthController(
            AuthService authService,
            ClientAddressResolver clientAddressResolver
    ) {
        this.authService = authService;
        this.clientAddressResolver = clientAddressResolver;
    }

    @PostMapping("/register")
    public MessageResponse register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest
    ) {
        return authService.register(request, clientAddress(httpRequest));
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        return authService.login(request, clientAddress(httpRequest));
    }

    @PostMapping("/google")
    public AuthResponse loginWithGoogle(
            @Valid @RequestBody GoogleLoginRequest request,
            HttpServletRequest httpRequest
    ) {
        return authService.loginWithGoogle(request, clientAddress(httpRequest));
    }

    @PostMapping("/telegram")
    public AuthResponse loginWithTelegram(
            @Valid @RequestBody TelegramLoginRequest request,
            HttpServletRequest httpRequest
    ) {
        return authService.loginWithTelegram(request, clientAddress(httpRequest));
    }

    @PostMapping("/logout")
    public MessageResponse logout(Authentication authentication) {
        return authService.logout(authentication);
    }

    @PostMapping("/forgot-password")
    public ForgotPasswordResponse forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        return authService.forgotPassword(request.email(), clientAddress(httpRequest));
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(
            @Valid @RequestBody ResetPasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        return authService.resetPassword(request, clientAddress(httpRequest));
    }

    @PostMapping("/verify-email")
    public MessageResponse verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request,
            HttpServletRequest httpRequest
    ) {
        return authService.verifyEmail(request, clientAddress(httpRequest));
    }

    @PostMapping("/resend-verification")
    public MessageResponse resendVerificationEmail(
            @Valid @RequestBody ResendVerificationEmailRequest request,
            HttpServletRequest httpRequest
    ) {
        return authService.resendVerificationEmail(request.email(), clientAddress(httpRequest));
    }

    private String clientAddress(HttpServletRequest request) {
        return clientAddressResolver.resolve(request);
    }
}
