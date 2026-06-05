package com.koupreng.backend.controller;

import jakarta.validation.Valid;

import com.koupreng.backend.dto.AuthResponse;
import com.koupreng.backend.dto.ChangePasswordRequest;
import com.koupreng.backend.dto.ForgotPasswordRequest;
import com.koupreng.backend.dto.GoogleLoginRequest;
import com.koupreng.backend.dto.LoginRequest;
import com.koupreng.backend.dto.MessageResponse;
import com.koupreng.backend.dto.RegisterRequest;
import com.koupreng.backend.dto.ResetPasswordRequest;
import com.koupreng.backend.dto.TelegramLoginRequest;
import com.koupreng.backend.dto.UpdateProfileRequest;
import com.koupreng.backend.dto.UserResponse;
import com.koupreng.backend.security.AuthCookieService;
import com.koupreng.backend.service.AccountService;
import com.koupreng.backend.service.AuthService;
import com.koupreng.backend.service.UserService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AccountService accountService;
    private final UserService userService;
    private final AuthCookieService authCookieService;

    public AuthController(
            AuthService authService,
            AccountService accountService,
            UserService userService,
            AuthCookieService authCookieService
    ) {
        this.authService = authService;
        this.accountService = accountService;
        this.userService = userService;
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

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return userService.getProfile(authentication);
    }

    @PutMapping("/me")
    public UserResponse updateMe(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return userService.updateProfile(authentication, request);
    }

    @PostMapping("/change-password")
    public MessageResponse changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        accountService.changePassword(authentication, request);
        return new MessageResponse("Password changed successfully");
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        accountService.forgotPassword(request);
        return new MessageResponse("If the email exists, password reset instructions will be sent");
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        accountService.resetPassword(request);
        return new MessageResponse("Password reset successfully");
    }

    private ResponseEntity<AuthResponse> withAuthCookie(AuthResponse authResponse) {
        ResponseEntity.BodyBuilder response = ResponseEntity.ok();
        authCookieService.createAuthCookie(authResponse)
                .map(ResponseCookie::toString)
                .ifPresent(cookie -> response.header(HttpHeaders.SET_COOKIE, cookie));
        return response.body(authResponse);
    }
}
