package com.koupreng.backend.dto.delivery;

import lombok.Data;

import java.util.List;

@Data
public class DeliveryRequest {

    private List<Long> guestIds;
    private Boolean allEligible;
    private String subject;
    private String message;
}
