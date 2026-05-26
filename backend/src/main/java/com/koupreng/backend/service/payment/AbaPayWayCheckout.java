package com.koupreng.backend.service.payment;

import java.util.Map;

public record AbaPayWayCheckout(
        String checkoutUrl,
        Map<String, String> checkoutFormFields,
        String requestJson,
        String responseJson
) {
}
