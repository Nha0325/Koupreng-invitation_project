package com.koupreng.backend.auth;

import com.koupreng.backend.auth.dto.ChangePasswordRequest;
import com.koupreng.backend.auth.dto.MessageResponse;
import com.koupreng.backend.auth.dto.UpdateProfileRequest;
import com.koupreng.backend.auth.dto.UserResponse;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public UserResponse getProfile(Authentication authentication) {
        return userService.getProfile(authentication);
    }

    @PatchMapping
    public UserResponse updateProfile(
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
        return userService.changePassword(authentication, request);
    }
}
