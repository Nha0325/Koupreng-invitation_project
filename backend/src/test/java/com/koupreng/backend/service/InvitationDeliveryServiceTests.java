package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.delivery.DeliveryRequest;
import com.koupreng.backend.dto.delivery.InvitationDeliveryResponse;
import com.koupreng.backend.entity.invitation.Guest;
import com.koupreng.backend.entity.invitation.Notification;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.enums.InvitationStatus;
import com.koupreng.backend.repository.GuestRepository;
import com.koupreng.backend.repository.NotificationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class InvitationDeliveryServiceTests {

    @Test
    void prepareGeneratesGuestLinksAndMarksGuestsReadyBeforePublish() {
        Fixture fixture = fixture();
        fixture.invitation.setStatus(InvitationStatus.DRAFT);
        Guest guest = guest(20L, fixture.invitation, "Sophea", "sophea@example.com");
        fixture.guests.add(guest);

        InvitationDeliveryResponse response = fixture.service.prepare(fixture.authentication, 10L, new DeliveryRequest());

        assertEquals("READY", response.getStatus());
        assertEquals("http://localhost:5173/w/samnang-sreyneang", response.getInvitationLink());
        assertEquals(1, response.getPreparedCount());
        assertEquals(InvitationDeliveryService.STATUS_PREPARED, guest.getSendStatus());
        assertNotNull(guest.getInviteToken());
        assertEquals("http://localhost:5173/w/samnang-sreyneang?token=" + guest.getInviteToken(), response.getGuests().getFirst().getInvitationLink());
        verify(fixture.guestRepository).saveAll(List.of(guest));
    }

    @Test
    void emailSendSendsMailAndTracksMissingEmailAsFailure() {
        Fixture fixture = fixture();
        Guest withEmail = guest(20L, fixture.invitation, "Sophea", "sophea@example.com");
        Guest withoutEmail = guest(21L, fixture.invitation, "Dara", null);
        fixture.guests.addAll(List.of(withEmail, withoutEmail));

        InvitationDeliveryResponse response = fixture.service.sendEmail(fixture.authentication, 10L, new DeliveryRequest());

        assertEquals(1, response.getSentCount());
        assertEquals(1, response.getFailedCount());
        assertEquals(InvitationDeliveryService.STATUS_EMAIL_SENT, withEmail.getSendStatus());
        assertEquals(InvitationDeliveryService.STATUS_MISSING_EMAIL, withoutEmail.getSendStatus());
        verify(fixture.mailSender).send(any(SimpleMailMessage.class));
        verify(fixture.notificationRepository, times(2)).save(any(Notification.class));
    }

    @Test
    void emailSendTracksMailFailures() {
        Fixture fixture = fixture();
        Guest guest = guest(20L, fixture.invitation, "Sophea", "sophea@example.com");
        fixture.guests.add(guest);
        doThrow(new MailSendException("smtp unavailable"))
                .when(fixture.mailSender).send(any(SimpleMailMessage.class));

        InvitationDeliveryResponse response = fixture.service.sendEmail(fixture.authentication, 10L, new DeliveryRequest());

        assertEquals(0, response.getSentCount());
        assertEquals(1, response.getFailedCount());
        assertEquals(InvitationDeliveryService.STATUS_EMAIL_FAILED, guest.getSendStatus());
    }

    @Test
    void reminderSkipsAlreadyViewedGuests() {
        Fixture fixture = fixture();
        Guest viewed = guest(20L, fixture.invitation, "Sophea", "sophea@example.com");
        viewed.setInvitationViewedAt(Instant.now());
        Guest notViewed = guest(21L, fixture.invitation, "Dara", "dara@example.com");
        fixture.guests.addAll(List.of(viewed, notViewed));

        InvitationDeliveryResponse response = fixture.service.sendReminder(fixture.authentication, 10L, new DeliveryRequest());

        assertEquals(1, response.getGuests().size());
        assertEquals(InvitationDeliveryService.STATUS_REMINDER_SENT, notViewed.getSendStatus());
        assertEquals(1, response.getReminderCount());
    }

    @Test
    void cannotSendUnpublishedInvitation() {
        Fixture fixture = fixture();
        fixture.invitation.setStatus(InvitationStatus.DRAFT);

        assertThrows(ApiException.class, () -> fixture.service.sendShareableLink(fixture.authentication, 10L, new DeliveryRequest()));
    }

    private Fixture fixture() {
        GuestRepository guestRepository = mock(GuestRepository.class);
        NotificationRepository notificationRepository = mock(NotificationRepository.class);
        InvitationService invitationService = mock(InvitationService.class);
        JavaMailSender mailSender = mock(JavaMailSender.class);
        ObjectProvider<JavaMailSender> mailSenderProvider = mock(ObjectProvider.class);
        Authentication authentication = mock(Authentication.class);
        UserInvitation invitation = invitation();
        List<Guest> guests = new ArrayList<>();
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        InvitationDeliveryService service = new InvitationDeliveryService(
                guestRepository,
                notificationRepository,
                invitationService,
                mailSenderProvider,
                "http://localhost:5173",
                "no-reply@koupreng.test"
        );

        when(invitationService.requireOwnedInvitationEntity(authentication, 10L)).thenReturn(invitation);
        when(guestRepository.findByInvitationIdOrderByCreatedAtDesc(10L)).thenAnswer(invocation -> guests);
        when(guestRepository.existsByInviteToken(any())).thenReturn(false);
        when(guestRepository.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        return new Fixture(service, guestRepository, notificationRepository, mailSender, authentication, invitation, guests);
    }

    private UserInvitation invitation() {
        AppUser user = new AppUser();
        user.setId(1L);
        user.setFullName("Owner");

        UserInvitation invitation = new UserInvitation();
        invitation.setId(10L);
        invitation.setUser(user);
        invitation.setTitle("Wedding");
        invitation.setSlug("samnang-sreyneang");
        invitation.setStatus(InvitationStatus.PUBLISHED);
        return invitation;
    }

    private Guest guest(Long id, UserInvitation invitation, String name, String email) {
        Guest guest = new Guest();
        guest.setId(id);
        guest.setInvitation(invitation);
        guest.setGuestName(name);
        guest.setEmail(email);
        return guest;
    }

    private record Fixture(
            InvitationDeliveryService service,
            GuestRepository guestRepository,
            NotificationRepository notificationRepository,
            JavaMailSender mailSender,
            Authentication authentication,
            UserInvitation invitation,
            List<Guest> guests
    ) {
    }
}
