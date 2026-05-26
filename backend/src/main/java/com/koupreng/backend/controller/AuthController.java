package com.koupreng.backend.controller;

import jakarta.validation.Valid;

import com.koupreng.backend.dto.AuthResponse;
import com.koupreng.backend.dto.GoogleLoginRequest;
import com.koupreng.backend.dto.LoginRequest;
import com.koupreng.backend.dto.MessageResponse;
import com.koupreng.backend.dto.RegisterRequest;
import com.koupreng.backend.dto.TelegramLoginRequest;
import com.koupreng.backend.security.AuthCookieService;
import com.koupreng.backend.service.AuthService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
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
    private final AuthCookieService authCookieService;

    public AuthController(AuthService authService, AuthCookieService authCookieService) {
        this.authService = authService;
        this.authCookieService = authCookieService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return withAuthCookie(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return withAuthCookie(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        return withAuthCookie(authService.loginWithGoogle(request));
    }

    @PostMapping("/telegram")
    public ResponseEntity<AuthResponse> loginWithTelegram(@Valid @RequestBody TelegramLoginRequest request) {
        return withAuthCookie(authService.loginWithTelegram(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(Authentication authentication) {
        authService.logout(authentication);
        ResponseEntity.BodyBuilder response = ResponseEntity.ok();
        authCookieService.clearAuthCookie()
                .map(ResponseCookie::toString)
                .ifPresent(cookie -> response.header(HttpHeaders.SET_COOKIE, cookie));
        return response.body(new MessageResponse("Logged out"));
    }

    private ResponseEntity<AuthResponse> withAuthCookie(AuthResponse authResponse) {
        ResponseEntity.BodyBuilder response = ResponseEntity.ok();
        authCookieService.createAuthCookie(authResponse)
                .map(ResponseCookie::toString)
                .ifPresent(cookie -> response.header(HttpHeaders.SET_COOKIE, cookie));
        return response.body(authResponse);
    }
}
