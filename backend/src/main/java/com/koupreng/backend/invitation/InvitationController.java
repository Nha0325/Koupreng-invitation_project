package com.koupreng.backend.invitation;

import java.util.List;

import com.koupreng.backend.invitation.dto.InvitationRequest;
import com.koupreng.backend.invitation.dto.InvitationResponse;
import com.koupreng.backend.invitation.dto.ShareLinkResponse;
import com.koupreng.backend.invitation.dto.TemplateResponse;

import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/invitations")
@Validated
public class InvitationController {

    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @GetMapping("/templates")
    public List<TemplateResponse> getTemplates(
            @RequestParam(required = false) TemplateCategory category,
            @RequestParam(required = false) EventType eventType
    ) {
        return invitationService.getTemplatesByFilter(category, eventType);
    }

    @GetMapping("/templates/{id}")
    public TemplateResponse getTemplateById(@PathVariable Long id) {
        return invitationService.getTemplateById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InvitationResponse createInvitation(
            @Valid @RequestBody InvitationRequest request,
            JwtAuthenticationToken authentication
    ) {
        Long userId = extractUserId(authentication);
        return invitationService.saveInvitation(userId, request);
    }

    @PutMapping("/{id}")
    public InvitationResponse updateInvitation(
            @PathVariable Long id,
            @Valid @RequestBody InvitationRequest request,
            JwtAuthenticationToken authentication
    ) {
        Long userId = extractUserId(authentication);
        return invitationService.updateInvitation(userId, id, request);
    }

    @GetMapping("/my")
    public List<InvitationResponse> getUserInvitations(JwtAuthenticationToken authentication) {
        Long userId = extractUserId(authentication);
        return invitationService.getUserInvitations(userId);
    }

    @GetMapping("/{id}")
    public InvitationResponse getInvitationById(
            @PathVariable Long id,
            JwtAuthenticationToken authentication
    ) {
        Long userId = extractUserId(authentication);
        return invitationService.getInvitationById(userId, id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInvitation(
            @PathVariable Long id,
            JwtAuthenticationToken authentication
    ) {
        Long userId = extractUserId(authentication);
        invitationService.deleteInvitation(userId, id);
    }

    @PostMapping("/{id}/share")
    public ShareLinkResponse generateShareLink(
            @PathVariable Long id,
            JwtAuthenticationToken authentication
    ) {
        Long userId = extractUserId(authentication);
        return invitationService.generateShareLink(userId, id);
    }

    @GetMapping("/shared/{shareToken}")
    public InvitationResponse getSharedInvitation(@PathVariable String shareToken) {
        return invitationService.getSharedInvitation(shareToken);
    }

    private Long extractUserId(JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();
        Object uid = jwt.getClaim("uid");
        if (uid instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalStateException("Invalid token: missing uid claim");
    }
}
