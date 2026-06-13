package com.koupreng.backend.dto.admin;

import com.koupreng.backend.entity.user.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminUpdateUserRoleRequest {

    @NotNull(message = "User role is required")
    private Role role;
}
