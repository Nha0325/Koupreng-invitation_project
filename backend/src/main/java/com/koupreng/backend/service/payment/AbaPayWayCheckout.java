package com.koupreng.backend.service.payment;

import java.util.Map;

public record AbaPayWayCheckout(
        String checkoutUrl,
        String qrString,
        String qrImageUrl,
        String abaPayDeeplink,
        String requestJson,
        String responseJson,
        Map<String, String> requestFields
) {
}
