package com.koupreng.backend.auth;

import java.util.List;

import com.koupreng.backend.auth.dto.UpdateRoleRequest;
import com.koupreng.backend.auth.dto.UserResponse;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
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
            @PathVariable Long userId,
            @Valid @RequestBody UpdateRoleRequest request
    ) {
        return userService.updateRole(userId, request.role());
    }
}
