package com.koupreng.backend.invitation;

import java.util.List;
import java.util.UUID;

import com.koupreng.backend.auth.AppUser;
import com.koupreng.backend.auth.AppUserRepository;
import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.invitation.dto.InvitationRequest;
import com.koupreng.backend.invitation.dto.InvitationResponse;
import com.koupreng.backend.invitation.dto.ShareLinkResponse;
import com.koupreng.backend.invitation.dto.TemplateResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class InvitationService {

    private final InvitationTemplateRepository templateRepository;
    private final UserInvitationRepository invitationRepository;
    private final AppUserRepository userRepository;
    private final String shareBaseUrl;

    public InvitationService(
            InvitationTemplateRepository templateRepository,
            UserInvitationRepository invitationRepository,
            AppUserRepository userRepository,
            @Value("${app.invitation.share-base-url:http://localhost:5173/preview/}") String shareBaseUrl
    ) {
        this.templateRepository = templateRepository;
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.shareBaseUrl = shareBaseUrl;
    }

    public List<TemplateResponse> getAllTemplates() {
        return templateRepository.findAll().stream()
                .map(this::toTemplateResponse)
                .toList();
    }

    public List<TemplateResponse> getTemplatesByFilter(TemplateCategory category, EventType eventType) {
        List<InvitationTemplate> templates;
        if (category != null && eventType != null) {
            templates = templateRepository.findByCategoryAndEventType(category, eventType);
        } else if (category != null) {
            templates = templateRepository.findByCategory(category);
        } else if (eventType != null) {
            templates = templateRepository.findByEventType(eventType);
        } else {
            templates = templateRepository.findAll();
        }
        return templates.stream().map(this::toTemplateResponse).toList();
    }

    public TemplateResponse getTemplateById(Long id) {
        InvitationTemplate template = templateRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Template not found"));
        return toTemplateResponse(template);
    }

    public InvitationResponse saveInvitation(Long userId, InvitationRequest request) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        UserInvitation invitation = new UserInvitation();
        invitation.setUser(user);
        invitation.setTitle(request.title());
        invitation.setCanvasDataJson(request.canvasDataJson());
        invitation.setThumbnailDataUrl(request.thumbnailDataUrl());

        if (request.templateId() != null) {
            InvitationTemplate template = templateRepository.findById(request.templateId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Template not found"));
            invitation.setTemplate(template);
        }

        UserInvitation saved = invitationRepository.save(invitation);
        return toInvitationResponse(saved);
    }

    public InvitationResponse updateInvitation(Long userId, Long id, InvitationRequest request) {
        UserInvitation invitation = invitationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invitation not found"));

        invitation.setTitle(request.title());
        invitation.setCanvasDataJson(request.canvasDataJson());
        invitation.setThumbnailDataUrl(request.thumbnailDataUrl());

        if (request.templateId() != null) {
            InvitationTemplate template = templateRepository.findById(request.templateId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Template not found"));
            invitation.setTemplate(template);
        }

        UserInvitation saved = invitationRepository.save(invitation);
        return toInvitationResponse(saved);
    }

    public List<InvitationResponse> getUserInvitations(Long userId) {
        return invitationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toInvitationResponse)
                .toList();
    }

    public InvitationResponse getInvitationById(Long userId, Long id) {
        UserInvitation invitation = invitationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invitation not found"));
        return toInvitationResponse(invitation);
    }

    public void deleteInvitation(Long userId, Long id) {
        UserInvitation invitation = invitationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invitation not found"));
        invitationRepository.delete(invitation);
    }

    public ShareLinkResponse generateShareLink(Long userId, Long id) {
        UserInvitation invitation = invitationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invitation not found"));

        String token = UUID.randomUUID().toString();
        invitation.setShareToken(token);
        invitationRepository.save(invitation);

        String shareUrl = shareBaseUrl + token;
        return new ShareLinkResponse(shareUrl, token);
    }

    public InvitationResponse getSharedInvitation(String shareToken) {
        UserInvitation invitation = invitationRepository.findByShareToken(shareToken)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Shared invitation not found"));
        return toInvitationResponse(invitation);
    }

    private TemplateResponse toTemplateResponse(InvitationTemplate template) {
        return new TemplateResponse(
                template.getId(),
                template.getName(),
                template.getCategory().name(),
                template.getEventType().name(),
                template.getCanvasConfigJson(),
                template.getThumbnailUrl()
        );
    }

    private InvitationResponse toInvitationResponse(UserInvitation invitation) {
        String templateName = invitation.getTemplate() != null
                ? invitation.getTemplate().getName()
                : null;
        String shareUrl = invitation.getShareToken() != null
                ? shareBaseUrl + invitation.getShareToken()
                : null;
        return new InvitationResponse(
                invitation.getId(),
                invitation.getTitle(),
                templateName,
                invitation.getCanvasDataJson(),
                invitation.getThumbnailDataUrl(),
                invitation.getShareToken(),
                shareUrl,
                invitation.getCreatedAt() != null ? invitation.getCreatedAt().toString() : null,
                invitation.getUpdatedAt() != null ? invitation.getUpdatedAt().toString() : null
        );
    }
}
