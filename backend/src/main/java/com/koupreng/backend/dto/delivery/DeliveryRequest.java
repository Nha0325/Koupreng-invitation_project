package com.koupreng.backend.dto.delivery;

import java.util.List;

public class DeliveryRequest {
    List<Long> guestIds;

    Boolean allEligibles;

    String subject;

    String message;
}
