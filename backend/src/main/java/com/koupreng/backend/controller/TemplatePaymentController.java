package com.koupreng.backend.controller;

import com.koupreng.backend.dto.ApiResponse;
import com.koupreng.backend.dto.payment.ConfirmTemplatePaymentRequest;
import com.koupreng.backend.dto.payment.CreateTemplatePaymentRequest;
import com.koupreng.backend.dto.payment.CreateTemplatePaymentResponse;
import com.koupreng.backend.dto.payment.PayWayCallbackResponse;
import com.koupreng.backend.dto.payment.PaymentConfirmResponse;
import com.koupreng.backend.dto.payment.TemplateAccessCheckResponse;
import com.koupreng.backend.dto.payment.TemplatePaymentStatusResponse;
import com.koupreng.backend.dto.payment.TelegramDetectPaymentRequest;
import com.koupreng.backend.dto.payment.UserTemplateAccessResponse;
import com.koupreng.backend.service.TemplatePaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@Validated
@RequestMapping("/api/v1")
public class TemplatePaymentController {

    private static final String PAYWAY_SIGNATURE_HEADER = "X-PAYWAY-HMAC-SHA512";

    private final TemplatePaymentService templatePaymentService;

    public TemplatePaymentController(TemplatePaymentService templatePaymentService) {
        this.templatePaymentService = templatePaymentService;
    }

    @PostMapping("/template-payments/payway/create")
    public ResponseEntity<ApiResponse<CreateTemplatePaymentResponse>> createPaywayCheckout(
            Authentication authentication,
            @Valid @RequestBody CreateTemplatePaymentRequest request
    ) {
        CreateTemplatePaymentResponse response = templatePaymentService.createPaywayQrCheckout(authentication, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("PayWay QR payment created successfully", response));
    }

    @PostMapping("/template-payments/create")
    public ResponseEntity<ApiResponse<CreateTemplatePaymentResponse>> createStaticPayment(
            Authentication authentication,
            @Valid @RequestBody CreateTemplatePaymentRequest request
    ) {
        CreateTemplatePaymentResponse response = templatePaymentService.createPayment(authentication, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Static ABA payment order created successfully", response));
    }

    @GetMapping("/template-payments/{orderCode}")
    public ResponseEntity<ApiResponse<TemplatePaymentStatusResponse>> getOrder(
            Authentication authentication,
            @PathVariable String orderCode
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Template payment order fetched successfully",
                templatePaymentService.getOrderStatus(authentication, orderCode)
        ));
    }

    @GetMapping("/me/templates/paid")
    public ResponseEntity<ApiResponse<List<UserTemplateAccessResponse>>> paidTemplates(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Paid templates fetched successfully",
                templatePaymentService.getPaidTemplates(authentication)
        ));
    }

    @GetMapping("/me/templates/{templateId}/access")
    public ResponseEntity<ApiResponse<TemplateAccessCheckResponse>> templateAccess(
            Authentication authentication,
            @PathVariable Long templateId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Template access fetched successfully",
                templatePaymentService.hasTemplateAccess(authentication, templateId)
        ));
    }

    @PostMapping("/payway/callback")
    public ResponseEntity<ApiResponse<PayWayCallbackResponse>> paywayCallback(
            @RequestBody Map<String, Object> payload,
            @RequestHeader HttpHeaders headers
    ) {
        PayWayCallbackResponse response = templatePaymentService.handlePaywayCallback(
                payload,
                headers.getFirst(PAYWAY_SIGNATURE_HEADER)
        );
        return ResponseEntity.ok(ApiResponse.success("PayWay callback processed", response));
    }

    @GetMapping("/payway/return")
    public ResponseEntity<ApiResponse<Map<String, String>>> paywayReturn() {
        return ResponseEntity.ok(ApiResponse.success(
                "PayWay return received. Check order status from backend.",
                Map.of("message", "Payment is being verified.")
        ));
    }

    @GetMapping("/payway/cancel")
    public ResponseEntity<ApiResponse<Map<String, String>>> paywayCancel() {
        return ResponseEntity.ok(ApiResponse.success(
                "PayWay cancel received. No template access was unlocked.",
                Map.of("message", "Payment was cancelled or not completed.")
        ));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/template-payments")
    public ResponseEntity<ApiResponse<List<TemplatePaymentStatusResponse>>> adminOrders() {
        return ResponseEntity.ok(ApiResponse.success(
                "Template payment orders fetched successfully",
                templatePaymentService.listOrdersForAdmin()
        ));
    }

    @PostMapping("/admin/template-payments/confirm")
    public ResponseEntity<ApiResponse<PaymentConfirmResponse>> confirmManualPayment(
            @Valid @RequestBody ConfirmTemplatePaymentRequest request
    ) {
        PaymentConfirmResponse response = templatePaymentService.confirmManualPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Template payment confirmed successfully", response));
    }

    @PostMapping("/admin/template-payments/telegram-detect")
    public ResponseEntity<ApiResponse<PaymentConfirmResponse>> detectTelegramPayment(
            @Valid @RequestBody TelegramDetectPaymentRequest request
    ) {
        PaymentConfirmResponse response = templatePaymentService.detectPaymentFromTelegram(request);
        return ResponseEntity.ok(ApiResponse.success("Telegram payment detection processed", response));
    }
}
