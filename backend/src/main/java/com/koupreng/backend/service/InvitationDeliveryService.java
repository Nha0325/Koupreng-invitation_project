package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.delivery.DeliveryRequest;
import com.koupreng.backend.dto.delivery.GuestDeliveryResponse;
import com.koupreng.backend.dto.delivery.InvitationDeliveryResponse;
import com.koupreng.backend.entity.invitation.Guest;
import com.koupreng.backend.entity.invitation.Notification;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.enums.InvitationStatus;
import com.koupreng.backend.repository.GuestRepository;
import com.koupreng.backend.repository.NotificationRepository;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class InvitationDeliveryService {

    public static final String STATUS_PREPARED = "PREPARED";
    public static final String STATUS_LINK_SENT = "LINK_SENT";
    public static final String STATUS_EMAIL_SENT = "EMAIL_SENT";
    public static final String STATUS_EMAIL_FAILED = "EMAIL_FAILED";
    public static final String STATUS_REMINDER_SENT = "REMINDER_SENT";
    public static final String STATUS_MISSING_EMAIL = "MISSING_EMAIL";

    private final GuestRepository guestRepository;
    private final NotificationRepository notificationRepository;
    private final InvitationService invitationService;
    private final JavaMailSender mailSender;
    private final String publicBaseUrl;
    private final String mailFrom;

    public InvitationDeliveryService(
            GuestRepository guestRepository,
            NotificationRepository notificationRepository,
            InvitationService invitationService,
            ObjectProvider<JavaMailSender> mailSenderProvider,
            @Value("${app.invitation.public-base-url:http://localhost:5173}") String publicBaseUrl,
            @Value("${spring.mail.username:no-reply@koupreng.local}") String mailFrom
    ) {
        this.guestRepository = guestRepository;
        this.notificationRepository = notificationRepository;
        this.invitationService = invitationService;
        this.mailSender = mailSenderProvider.getIfAvailable();
        this.publicBaseUrl = publicBaseUrl;
        this.mailFrom = mailFrom;
    }

    @Transactional
    public InvitationDeliveryResponse prepare(Authentication authentication, Long invitationId, DeliveryRequest request) {
        UserInvitation invitation = invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        List<Guest> guests = selectedGuests(invitation, request);
        guests.forEach(guest -> {
            ensureGuestToken(invitation, guest);
            if (guest.getSendStatus() == null || guest.getSendStatus().isBlank()) {
                guest.setSendStatus(STATUS_PREPARED);
            }
        });
        guestRepository.saveAll(guests);
        return response(invitation, "PREPARE", "READY", guests, request, Instant.now());
    }

    @Transactional
    public InvitationDeliveryResponse sendShareableLink(Authentication authentication, Long invitationId, DeliveryRequest request) {
        UserInvitation invitation = requirePublishedOwnedInvitation(authentication, invitationId);
        List<Guest> guests = selectedGuests(invitation, request);
        Instant now = Instant.now();
        guests.forEach(guest -> {
            ensureGuestToken(invitation, guest);
            guest.setSendStatus(STATUS_LINK_SENT);
            notificationRepository.save(notification(invitation, guest, "LINK", null, messageFor(invitation, guest, request), STATUS_LINK_SENT, now));
        });
        guestRepository.saveAll(guests);
        return response(invitation, "LINK", "SENT", guests, request, now);
    }

    @Transactional
    public InvitationDeliveryResponse sendEmail(Authentication authentication, Long invitationId, DeliveryRequest request) {
        UserInvitation invitation = requirePublishedOwnedInvitation(authentication, invitationId);
        List<Guest> guests = selectedGuests(invitation, request);
        Instant now = Instant.now();
        guests.forEach(guest -> sendEmailToGuest(invitation, guest, request, now));
        guestRepository.saveAll(guests);
        return response(invitation, "EMAIL", "SENT", guests, request, now);
    }

    @Transactional
    public InvitationDeliveryResponse sendReminder(Authentication authentication, Long invitationId, DeliveryRequest request) {
        UserInvitation invitation = requirePublishedOwnedInvitation(authentication, invitationId);
        List<Guest> guests = selectedGuests(invitation, request).stream()
                .filter(notViewed())
                .toList();
        Instant now = Instant.now();
        guests.forEach(guest -> {
            ensureGuestToken(invitation, guest);
            guest.setSendStatus(STATUS_REMINDER_SENT);
            notificationRepository.save(notification(invitation, guest, "REMINDER", subjectFor(invitation, request), messageFor(invitation, guest, request), STATUS_REMINDER_SENT, now));
        });
        guestRepository.saveAll(guests);
        return response(invitation, "REMINDER", "SENT", guests, request, now);
    }

    @Transactional(readOnly = true)
    public InvitationDeliveryResponse status(Authentication authentication, Long invitationId) {
        UserInvitation invitation = invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        List<Guest> guests = guestRepository.findByInvitationIdOrderByCreatedAtDesc(invitationId);
        return response(invitation, "STATUS", "READY", guests, new DeliveryRequest(), null);
    }

    public String invitationLink(UserInvitation invitation) {
        return UriComponentsBuilder.fromUriString(trimTrailingSlash(publicBaseUrl))
                .path("/w/{slug}")
                .buildAndExpand(slug(invitation))
                .toUriString();
    }

    public String guestInvitationLink(UserInvitation invitation, Guest guest) {
        ensureGuestToken(invitation, guest);
        return UriComponentsBuilder.fromUriString(invitationLink(invitation))
                .queryParam("token", guest.getInviteToken())
                .toUriString();
    }

    private void sendEmailToGuest(UserInvitation invitation, Guest guest, DeliveryRequest request, Instant now) {
        ensureGuestToken(invitation, guest);
        String subject = subjectFor(invitation, request);
        String message = messageFor(invitation, guest, request);
        if (guest.getEmail() == null || guest.getEmail().isBlank()) {
            guest.setSendStatus(STATUS_MISSING_EMAIL);
            notificationRepository.save(notification(invitation, guest, "EMAIL", subject, message, STATUS_MISSING_EMAIL, now));
            return;
        }

        if (mailSender == null) {
            guest.setSendStatus(STATUS_EMAIL_FAILED);
            notificationRepository.save(notification(invitation, guest, "EMAIL", subject, failureMessage(message, "Mail sender is not configured"), STATUS_EMAIL_FAILED, now));
            return;
        }

        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(mailFrom);
            mailMessage.setTo(guest.getEmail().trim());
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailSender.send(mailMessage);
            guest.setSendStatus(STATUS_EMAIL_SENT);
            notificationRepository.save(notification(invitation, guest, "EMAIL", subject, message, STATUS_EMAIL_SENT, now));
        } catch (MailException ex) {
            guest.setSendStatus(STATUS_EMAIL_FAILED);
            notificationRepository.save(notification(invitation, guest, "EMAIL", subject, failureMessage(message, ex.getMessage()), STATUS_EMAIL_FAILED, now));
        }
    }

    private UserInvitation requirePublishedOwnedInvitation(Authentication authentication, Long invitationId) {
        UserInvitation invitation = invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        if (invitation.getStatus() != InvitationStatus.PUBLISHED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invitation must be published before sending");
        }
        return invitation;
    }

    private List<Guest> selectedGuests(UserInvitation invitation, DeliveryRequest request) {
        List<Guest> guests = guestRepository.findByInvitationIdOrderByCreatedAtDesc(invitation.getId());
        if (request == null || request.getGuestIds() == null || request.getGuestIds().isEmpty()) {
            return guests;
        }
        List<Long> selectedIds = request.getGuestIds();
        List<Guest> selected = guests.stream()
                .filter(guest -> selectedIds.contains(guest.getId()))
                .toList();
        if (selected.size() != selectedIds.stream().distinct().count()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "One or more guests do not belong to this invitation");
        }
        return selected;
    }

    private void ensureGuestToken(UserInvitation invitation, Guest guest) {
        if (guest.getInviteToken() == null || guest.getInviteToken().isBlank()) {
            guest.setInviteToken(uniqueInviteToken());
        }
        if (guest.getQrCodeUrl() == null || guest.getQrCodeUrl().isBlank()) {
            guest.setQrCodeUrl("/i/" + slug(invitation) + "?token=" + guest.getInviteToken());
        }
    }

    private InvitationDeliveryResponse response(
            UserInvitation invitation,
            String channel,
            String status,
            List<Guest> selectedGuests,
            DeliveryRequest request,
            Instant timestamp
    ) {
        List<Guest> allGuests = guestRepository.findByInvitationIdOrderByCreatedAtDesc(invitation.getId());
        Map<String, Long> statusCounts = allGuests.stream()
                .collect(Collectors.groupingBy(
                        guest -> normalizeStatus(guest.getSendStatus()),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));
        List<GuestDeliveryResponse> guestResponses = selectedGuests.stream()
                .map(guest -> GuestDeliveryResponse.from(guest, guestInvitationLink(invitation, guest)))
                .toList();
        return InvitationDeliveryResponse.builder()
                .invitationId(invitation.getId())
                .slug(slug(invitation))
                .invitationLink(invitationLink(invitation))
                .channel(channel)
                .status(status)
                .subject(request == null ? null : request.getSubject())
                .message(request == null ? null : request.getMessage())
                .guestCount(allGuests.size())
                .preparedCount(countStatus(statusCounts, STATUS_PREPARED))
                .sentCount(countStatus(statusCounts, STATUS_LINK_SENT) + countStatus(statusCounts, STATUS_EMAIL_SENT))
                .reminderCount(countStatus(statusCounts, STATUS_REMINDER_SENT))
                .failedCount(countStatus(statusCounts, STATUS_MISSING_EMAIL) + countStatus(statusCounts, STATUS_EMAIL_FAILED))
                .statusCounts(statusCounts)
                .guests(guestResponses)
                .preparedAt(timestamp)
                .build();
    }

    private Notification notification(UserInvitation invitation, Guest guest, String channel, String subject, String message, String status, Instant now) {
        Notification notification = new Notification();
        notification.setInvitation(invitation);
        notification.setGuest(guest);
        notification.setChannel(channel);
        notification.setSubject(subject);
        notification.setMessageBody(message);
        notification.setScheduledAt(now);
        notification.setSentAt(status.equals(STATUS_MISSING_EMAIL) || status.equals(STATUS_EMAIL_FAILED) ? null : now);
        notification.setStatus(status);
        return notification;
    }

    private String subjectFor(UserInvitation invitation, DeliveryRequest request) {
        String subject = request == null ? null : trimToNull(request.getSubject());
        return subject == null ? "Invitation: " + invitation.getTitle() : subject;
    }

    private String messageFor(UserInvitation invitation, Guest guest, DeliveryRequest request) {
        String message = request == null ? null : trimToNull(request.getMessage());
        if (message != null) {
            return message.replace("{guestName}", nullToEmpty(guest.getGuestName()))
                    .replace("{invitationTitle}", nullToEmpty(invitation.getTitle()))
                    .replace("{invitationLink}", guestInvitationLink(invitation, guest));
        }
        return "Dear " + guest.getGuestName() + ", please open your invitation: " + guestInvitationLink(invitation, guest);
    }

    private String failureMessage(String message, String reason) {
        return message + "\n\nDelivery failed: " + reason;
    }

    private Predicate<Guest> notViewed() {
        return guest -> guest.getInvitationViewedAt() == null;
    }

    private int countStatus(Map<String, Long> counts, String status) {
        return Math.toIntExact(counts.getOrDefault(status, 0L));
    }

    private String normalizeStatus(String status) {
        String normalized = trimToNull(status);
        return normalized == null ? "NOT_SENT" : normalized.toUpperCase(Locale.ROOT);
    }

    private String uniqueInviteToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "");
        } while (guestRepository.existsByInviteToken(token));
        return token;
    }

    private String slug(UserInvitation invitation) {
        return invitation.getSlug() == null || invitation.getSlug().isBlank()
                ? "invitation-" + invitation.getId()
                : invitation.getSlug();
    }

    private String trimTrailingSlash(String value) {
        String trimmed = trimToNull(value);
        if (trimmed == null) {
            return "http://localhost:5173";
        }
        return trimmed.endsWith("/") ? trimmed.substring(0, trimmed.length() - 1) : trimmed;
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String nullToEmpty(String value) {
        return value == null ? "" : value;
    }
}
