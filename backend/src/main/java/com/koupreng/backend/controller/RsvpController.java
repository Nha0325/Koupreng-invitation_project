package com.koupreng.backend.controller;

import com.koupreng.backend.dto.ApiResponse;
import com.koupreng.backend.dto.rsvp.RsvpRequest;
import com.koupreng.backend.dto.rsvp.RsvpResponse;
import com.koupreng.backend.dto.rsvp.RsvpSummaryResponse;
import com.koupreng.backend.service.RsvpService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/v1")
public class RsvpController {

    private final RsvpService rsvpService;

    public RsvpController(RsvpService rsvpService) {
        this.rsvpService = rsvpService;
    }

    @PostMapping("/public/invitations/{slug}/rsvp")
    public ResponseEntity<ApiResponse<RsvpResponse>> publicRsvp(
            @PathVariable String slug,
            @Valid @RequestBody RsvpRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("RSVP submitted successfully", rsvpService.submitPublic(slug, request)));
    }

    @PostMapping("/public/invitations/{slug}/guests/{inviteToken}/rsvp")
    public ResponseEntity<ApiResponse<RsvpResponse>> publicTokenRsvp(
            @PathVariable String slug,
            @PathVariable String inviteToken,
            @Valid @RequestBody RsvpRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "RSVP submitted successfully",
                        rsvpService.submitPublicWithToken(slug, inviteToken, request)
                ));
    }

    @GetMapping("/public/invitations/{slug}/wishes")
    public ResponseEntity<ApiResponse<List<RsvpResponse>>> publicWishes(
            @PathVariable String slug,
            @RequestParam(required = false) String token
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Wishes fetched successfully",
                rsvpService.publicWishes(slug, token)
        ));
    }

    @GetMapping("/invitations/{invitationId}/rsvps")
    public ResponseEntity<ApiResponse<List<RsvpResponse>>> list(
            Authentication authentication,
            @PathVariable Long invitationId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "RSVPs fetched successfully",
                rsvpService.list(authentication, invitationId)
        ));
    }

    @GetMapping("/invitations/{invitationId}/rsvps/summary")
    public ResponseEntity<ApiResponse<RsvpSummaryResponse>> summary(
            Authentication authentication,
            @PathVariable Long invitationId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "RSVP summary fetched successfully",
                rsvpService.summary(authentication, invitationId)
        ));
    }
}
