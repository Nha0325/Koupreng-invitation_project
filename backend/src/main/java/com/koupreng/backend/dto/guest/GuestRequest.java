package com.koupreng.backend.dto.guest;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class GuestRequest {

    @NotBlank(message = "Guest name is required")
    private String guestName;

    private String phone;
    private String email;
    private String guestGroup;
    private String sideType;
    private String tableNumber;
    private String sendStatus;
    private String contributionStatus;
    private BigDecimal totalContributed;
}
