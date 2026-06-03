package com.koupreng.backend.controller;

import com.koupreng.backend.dto.ApiResponse;
import com.koupreng.backend.dto.delivery.DeliveryRequest;
import com.koupreng.backend.dto.delivery.InvitationDeliveryResponse;
import com.koupreng.backend.service.InvitationDeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api/v1/invitations/{invitationId}/delivery")
public class InvitationDeliveryController {

    private final InvitationDeliveryService deliveryService;

    public InvitationDeliveryController(InvitationDeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @PostMapping("/prepare")
    public ResponseEntity<ApiResponse<InvitationDeliveryResponse>> prepare(
            Authentication authentication,
            @PathVariable Long invitationId,
            @RequestBody(required = false) DeliveryRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Invitation delivery prepared successfully",
                deliveryService.prepare(authentication, invitationId, safeRequest(request))
        ));
    }

    @PostMapping("/share-link")
    public ResponseEntity<ApiResponse<InvitationDeliveryResponse>> sendShareableLink(
            Authentication authentication,
            @PathVariable Long invitationId,
            @RequestBody(required = false) DeliveryRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Invitation shareable link marked as sent",
                deliveryService.sendShareableLink(authentication, invitationId, safeRequest(request))
        ));
    }

    @PostMapping("/email")
    public ResponseEntity<ApiResponse<InvitationDeliveryResponse>> sendEmail(
            Authentication authentication,
            @PathVariable Long invitationId,
            @RequestBody(required = false) DeliveryRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Invitation email delivery prepared successfully",
                deliveryService.sendEmail(authentication, invitationId, safeRequest(request))
        ));
    }

    @PostMapping("/reminder")
    public ResponseEntity<ApiResponse<InvitationDeliveryResponse>> sendReminder(
            Authentication authentication,
            @PathVariable Long invitationId,
            @RequestBody(required = false) DeliveryRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Invitation reminders prepared successfully",
                deliveryService.sendReminder(authentication, invitationId, safeRequest(request))
        ));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<InvitationDeliveryResponse>> status(
            Authentication authentication,
            @PathVariable Long invitationId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Invitation delivery status fetched successfully",
                deliveryService.status(authentication, invitationId)
        ));
    }

    private DeliveryRequest safeRequest(DeliveryRequest request) {
        return request == null ? new DeliveryRequest() : request;
    }
}
