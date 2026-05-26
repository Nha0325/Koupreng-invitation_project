package com.koupreng.backend.controller;

import com.koupreng.backend.dto.ApiResponse;
import com.koupreng.backend.dto.payment.ConfirmTemplatePaymentRequest;
import com.koupreng.backend.dto.payment.CreateTemplateOrderRequest;
import com.koupreng.backend.dto.payment.CreateTemplateOrderResponse;
import com.koupreng.backend.dto.payment.PaymentConfirmResponse;
import com.koupreng.backend.dto.payment.TelegramDetectPaymentRequest;
import com.koupreng.backend.dto.payment.TemplateAccessCheckResponse;
import com.koupreng.backend.dto.payment.TemplateOrderResponse;
import com.koupreng.backend.dto.payment.UserTemplateAccessResponse;
import com.koupreng.backend.service.TemplatePaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/v1")
public class TemplatePaymentController {

    private final TemplatePaymentService templatePaymentService;

    public TemplatePaymentController(TemplatePaymentService templatePaymentService) {
        this.templatePaymentService = templatePaymentService;
    }

    @PostMapping("/template-payments/create")
    public ResponseEntity<ApiResponse<CreateTemplateOrderResponse>> create(
            Authentication authentication,
            @Valid @RequestBody CreateTemplateOrderRequest request
    ) {
        CreateTemplateOrderResponse response = templatePaymentService.createOrder(authentication, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Template payment order created successfully", response));
    }

    @GetMapping("/template-payments/{orderCode}")
    public ResponseEntity<ApiResponse<TemplateOrderResponse>> getOrder(
            Authentication authentication,
            @PathVariable String orderCode
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Template payment order fetched successfully",
                templatePaymentService.getOrderByCode(authentication, orderCode)
        ));
    }

    @GetMapping("/me/templates/paid")
    public ResponseEntity<ApiResponse<List<UserTemplateAccessResponse>>> paidTemplates(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(
                "Paid templates fetched successfully",
                templatePaymentService.getPaidTemplatesByCurrentUser(authentication)
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

    @PostMapping("/admin/template-payments/confirm")
    public ResponseEntity<ApiResponse<PaymentConfirmResponse>> confirm(
            @Valid @RequestBody ConfirmTemplatePaymentRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Template payment confirmed successfully",
                templatePaymentService.confirmManualPayment(request, "MANUAL_ADMIN")
        ));
    }

    @PostMapping("/admin/template-payments/telegram-detect")
    public ResponseEntity<ApiResponse<PaymentConfirmResponse>> telegramDetect(
            @Valid @RequestBody TelegramDetectPaymentRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Template payment detection processed successfully",
                templatePaymentService.detectPaymentFromTelegram(request)
        ));
    }

    @GetMapping("/admin/template-payments/pending")
    public ResponseEntity<ApiResponse<List<TemplateOrderResponse>>> pending() {
        return ResponseEntity.ok(ApiResponse.success(
                "Pending template payment orders fetched successfully",
                templatePaymentService.listPendingForAdmin()
        ));
    }
}
