package com.koupreng.backend.controller;

import jakarta.validation.Valid;

import com.koupreng.backend.dto.ChangePasswordRequest;
import com.koupreng.backend.dto.UpdateProfileRequest;
import com.koupreng.backend.dto.UserResponse;
import com.koupreng.backend.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import com.koupreng.backend.service.storage.StorageService;
import com.koupreng.backend.service.storage.StorageUploadResult;

@RestController
@Validated
@RequestMapping("/api/users/me")
public class UserController {

    private final UserService userService;
    private final StorageService storageService;

    public UserController(UserService userService, StorageService storageService) {
        this.userService = userService;
        this.storageService = storageService;
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
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(authentication, request);
    }

    @PostMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadProfileImage(
            Authentication authentication,
            @org.springframework.web.bind.annotation.RequestParam("file") MultipartFile file
    ) {
        // We use PROFILE_IMAGE media type and 0L for invitationId since it's a user profile image
        StorageUploadResult result = storageService.upload(file, com.koupreng.backend.enums.MediaType.PROFILE_IMAGE, 0L);
        return Map.of("url", result.fileUrl());
    }
}
