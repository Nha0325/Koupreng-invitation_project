package com.koupreng.backend.dto.delivery;

import lombok.Data;

import java.util.List;

@Data
public class DeliveryRequest {

    private List<Long> guestIds;
    private String subject;
    private String message;
}
