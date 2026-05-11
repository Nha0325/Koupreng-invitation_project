package com.koupreng.backend.auth;

import com.koupreng.backend.auth.dto.AuthResponse;
import com.koupreng.backend.auth.dto.ForgotPasswordRequest;
import com.koupreng.backend.auth.dto.ForgotPasswordResponse;
import com.koupreng.backend.auth.dto.LoginRequest;
import com.koupreng.backend.auth.dto.MessageResponse;
import com.koupreng.backend.auth.dto.RegisterRequest;
import com.koupreng.backend.auth.dto.ResetPasswordRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(
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

    private String clientAddress(HttpServletRequest request) {
        String remoteAddress = request.getRemoteAddr();
        return remoteAddress == null || remoteAddress.isBlank() ? "unknown" : remoteAddress;
    }
}
