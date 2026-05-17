package com.koupreng.backend.controller;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import com.koupreng.backend.dto.UpdateRoleRequest;
import com.koupreng.backend.dto.UserResponse;
import com.koupreng.backend.service.UserService;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> listUsers() {
        return userService.listUsers();
    }

    @PatchMapping("/{userId}/role")
    public UserResponse updateRole(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateRoleRequest request
    ) {
        return userService.updateRole(userId, request.role());
    }
}
