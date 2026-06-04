# F. Invitation Sending / Delivery Preparation — Backend + Postman Note

## Purpose

This feature prepares wedding invitations for sending through guest-specific links and email.

It supports:

* Publishing invitation before sending
* Creating guest list
* Generating guest invite tokens
* Generating personalized guest invitation links
* Showing delivery summary
* Generating copyable share message
* Marking link as shared
* Sending email invitations
* Sending reminders
* Tracking delivery events

Current backend already has:

* `Guest.inviteToken`
* `Guest.qrCodeUrl`
* `Guest.sendStatus`
* `Guest.invitationViewedAt`

---

# Backend Implementation Steps

## Step 1 — Update `Guest.java`

File:

```text
backend/src/main/java/com/koupreng/backend/entity/invitation/Guest.java
```

Add these fields after `sendStatus`:

```java
// NOTE: Number of seats reserved for this guest.
@Column(name = "seat_count")
private Integer seatCount;

// NOTE: Last time invitation was sent to this guest.
@Column(name = "last_sent_at")
private Instant lastSentAt;

// NOTE: Last time reminder was sent to this guest.
@Column(name = "last_reminder_at")
private Instant lastReminderAt;

// NOTE: Total reminder count. Used to avoid spamming guests.
@Column(name = "reminder_count")
private Integer reminderCount = 0;

// NOTE: Last channel used for sending, example: LINK, EMAIL, REMINDER_EMAIL.
@Column(name = "last_send_channel", length = 50)
private String lastSendChannel;

// NOTE: Error message if email or reminder sending failed.
@Column(name = "last_send_error", length = 1000)
private String lastSendError;
```

Update `onCreate()`:

```java
@PrePersist
protected void onCreate() {
    // NOTE: Prevent null reminder count on new guests.
    if (reminderCount == null) {
        reminderCount = 0;
    }

    createdAt = Instant.now();
}
```

---

## Step 2 — Create delivery event entity

File:

```text
backend/src/main/java/com/koupreng/backend/entity/delivery/InvitationDeliveryEvent.java
```

Code:

```java
package com.koupreng.backend.entity.delivery;

import com.koupreng.backend.entity.invitation.Guest;
import com.koupreng.backend.entity.invitation.UserInvitation;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "invitation_delivery_events")
public class InvitationDeliveryEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "delivery_event_id")
    private Long id;

    // NOTE: Delivery event belongs to one invitation.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private UserInvitation invitation;

    // NOTE: Guest can be null only for invitation-level events.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id")
    private Guest guest;

    // NOTE: Example: LINK_GENERATED, LINK_SHARED, EMAIL_SENT, EMAIL_FAILED, REMINDER_SENT.
    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    // NOTE: Example: LINK, EMAIL, REMINDER_EMAIL.
    @Column(length = 50)
    private String channel;

    // NOTE: Example: SENT, FAILED, REMINDER_SENT.
    @Column(length = 50)
    private String status;

    // NOTE: Store generated share text or email body snapshot.
    @Column(columnDefinition = "TEXT")
    private String message;

    // NOTE: Store failed email/reminder reason.
    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
```

---

## Step 3 — Create delivery event repository

File:

```text
backend/src/main/java/com/koupreng/backend/repository/InvitationDeliveryEventRepository.java
```

Code:

```java
package com.koupreng.backend.repository;

import com.koupreng.backend.entity.delivery.InvitationDeliveryEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationDeliveryEventRepository extends JpaRepository<InvitationDeliveryEvent, Long> {

    // NOTE: Used by delivery audit trail API.
    List<InvitationDeliveryEvent> findByInvitationIdOrderByCreatedAtDesc(Long invitationId);
}
```

---

## Step 4 — Create delivery DTO files

Folder:

```text
backend/src/main/java/com/koupreng/backend/dto/delivery
```

### `DeliveryRequest.java`

```java
package com.koupreng.backend.dto.delivery;

import java.util.List;

public record DeliveryRequest(
        // NOTE: Send only selected guests when allEligible=false.
        List<Long> guestIds,

        // NOTE: true means send to all guests with valid contact info.
        Boolean allEligible,

        // NOTE: Optional email subject.
        String subject,

        // NOTE: Optional custom message body.
        String message
) {
}
```

### `DeliveryGuestResponse.java`

```java
package com.koupreng.backend.dto.delivery;

import com.koupreng.backend.entity.invitation.Guest;

import java.time.Instant;

public record DeliveryGuestResponse(
        Long guestId,
        String guestName,
        String phone,
        String email,
        String inviteToken,
        String invitationUrl,
        String sendStatus,
        boolean sendable,
        Instant lastSentAt,
        Instant lastReminderAt,
        Integer reminderCount,
        String lastSendChannel,
        String lastSendError,
        Instant invitationViewedAt,
        boolean responded
) {
    public static DeliveryGuestResponse from(Guest guest, String invitationUrl, boolean sendable, boolean responded) {
        return new DeliveryGuestResponse(
                guest.getId(),
                guest.getGuestName(),
                guest.getPhone(),
                guest.getEmail(),
                guest.getInviteToken(),
                invitationUrl,
                guest.getSendStatus(),
                sendable,
                guest.getLastSentAt(),
                guest.getLastReminderAt(),
                guest.getReminderCount(),
                guest.getLastSendChannel(),
                guest.getLastSendError(),
                guest.getInvitationViewedAt(),
                responded
        );
    }
}
```

### `DeliverySummaryResponse.java`

```java
package com.koupreng.backend.dto.delivery;

import java.util.List;

public record DeliverySummaryResponse(
        Long invitationId,
        String invitationSlug,
        int totalGuests,
        int notReady,
        int ready,
        int linkGenerated,
        int sent,
        int failed,
        int reminderSent,
        int opened,
        int responded,
        List<DeliveryGuestResponse> guests
) {
}
```

### `ShareMessageResponse.java`

```java
package com.koupreng.backend.dto.delivery;

public record ShareMessageResponse(
        Long guestId,
        String guestName,
        String invitationUrl,
        String message
) {
}
```

### `DeliveryActionResponse.java`

```java
package com.koupreng.backend.dto.delivery;

import java.util.List;

public record DeliveryActionResponse(
        Long invitationId,
        int totalTargets,
        int successCount,
        int failedCount,
        List<DeliveryGuestResponse> guests
) {
}
```

### `DeliveryEventResponse.java`

```java
package com.koupreng.backend.dto.delivery;

import com.koupreng.backend.entity.delivery.InvitationDeliveryEvent;

import java.time.Instant;

public record DeliveryEventResponse(
        Long id,
        Long guestId,
        String guestName,
        String eventType,
        String channel,
        String status,
        String message,
        String errorMessage,
        Instant createdAt
) {
    public static DeliveryEventResponse from(InvitationDeliveryEvent event) {
        return new DeliveryEventResponse(
                event.getId(),
                event.getGuest() == null ? null : event.getGuest().getId(),
                event.getGuest() == null ? null : event.getGuest().getGuestName(),
                event.getEventType(),
                event.getChannel(),
                event.getStatus(),
                event.getMessage(),
                event.getErrorMessage(),
                event.getCreatedAt()
        );
    }
}
```

---

## Step 5 — Create delivery service

File:

```text
backend/src/main/java/com/koupreng/backend/service/InvitationDeliveryService.java
```

Use this service for delivery logic.

Main responsibilities:

```text
prepare()
- checks invitation owner
- checks invitation is PUBLISHED
- generates missing invite token
- generates personalized invitation link
- marks guest as LINK_GENERATED or NOT_READY
- writes audit event

summary()
- returns delivery dashboard totals

shareMessage()
- returns copyable social message

markShared()
- marks guest sendStatus as SENT
- stores last sent time and channel LINK

sendEmail()
- sends email if mail config works
- records success or failure

sendReminders()
- sends reminder only to guests without RSVP
- increments reminder count

events()
- returns audit trail
```

Important notes:

```java
// NOTE: Do not send invitation if it is not PUBLISHED.
if (invitation.getStatus() != InvitationStatus.PUBLISHED) {
    throw new ApiException(HttpStatus.BAD_REQUEST, "Invitation must be published before sending");
}
```

```java
// NOTE: Personalized guest link format.
return base + "/i/" + invitation.getSlug() + "?token=" + guest.getInviteToken();
```

```java
// NOTE: A guest is sendable if phone or email exists.
private boolean isSendable(Guest guest) {
    return hasText(guest.getPhone()) || hasText(guest.getEmail());
}
```

```java
// NOTE: Failed email still updates guest delivery status.
guest.setSendStatus("FAILED");
guest.setLastSendError(error);
```

---

## Step 6 — Create delivery controller

File:

```text
backend/src/main/java/com/koupreng/backend/controller/InvitationDeliveryController.java
```

API routes:

```java
// NOTE: Prepare all guests for sending.
POST /api/v1/invitations/{invitationId}/delivery/prepare

// NOTE: Delivery dashboard summary.
GET /api/v1/invitations/{invitationId}/delivery/summary

// NOTE: Generate copyable text for social apps.
GET /api/v1/invitations/{invitationId}/delivery/guests/{guestId}/share-message

// NOTE: Owner confirms they shared the link.
POST /api/v1/invitations/{invitationId}/delivery/guests/{guestId}/mark-shared

// NOTE: Send email invitations.
POST /api/v1/invitations/{invitationId}/delivery/email

// NOTE: Send reminders to guests without RSVP.
POST /api/v1/invitations/{invitationId}/delivery/reminders

// NOTE: Audit trail.
GET /api/v1/invitations/{invitationId}/delivery/events
```

Controller code shape:

```java
@RestController
@RequestMapping("/api/v1/invitations/{invitationId}/delivery")
public class InvitationDeliveryController {

    private final InvitationDeliveryService deliveryService;

    public InvitationDeliveryController(InvitationDeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    // NOTE: Add the route methods here.
}
```

---

## Step 7 — Compile and run backend

Compile:

```bash
cd ~/Desktop/Koupreng-invitation_project/backend
./mvnw -DskipTests compile
```

Run:

```bash
./mvnw spring-boot:run
```

Expected backend URL:

```text
http://localhost:8080
```

If compile fails:

```bash
./mvnw -DskipTests compile
```

Read the first Java error and fix that file first.

---

# Postman Test Flow 1–10

## Postman 1 — Health check

```http
GET http://localhost:8080/api/health
```

Auth:

```text
No Auth
```

Expected:

```text
200 OK
```

---

## Postman 2 — Register

```http
POST http://localhost:8080/api/auth/register
```

Body → raw → JSON:

```json
{
  "fullName": "Postman User",
  "email": "postman.delivery@example.com",
  "phone": "85512345678",
  "password": "Password123!"
}
```

Expected:

```text
200 OK
```

Copy:

```text
accessToken
```

---

## Postman 3 — Current user

```http
GET http://localhost:8080/api/users/me
```

Authorization:

```text
Type: Bearer Token
Token: paste accessToken only
```

Expected:

```text
200 OK
```

---

## Postman 4 — Create invitation

```http
POST http://localhost:8080/api/v1/invitations
```

Authorization:

```text
Bearer Token
```

Body:

```json
{
  "templateId": null,
  "title": "Sokha and Dara Wedding Invitation",
  "eventType": "WEDDING",
  "eventDate": "2026-12-20",
  "eventTime": "18:30:00",
  "venueName": "Phnom Penh Wedding Hall",
  "venueAddress": "Norodom Blvd, Phnom Penh",
  "googleMapUrl": "https://maps.google.com/?q=Phnom+Penh",
  "hostName": "Sokha Family",
  "partnerName": "Dara Family",
  "groomName": "Dara",
  "brideName": "Sokha",
  "storyText": "Together with their families, they invite you to celebrate.",
  "languageMode": "km",
  "visibility": "PUBLIC",
  "accessPassword": null,
  "rsvpDeadline": "2026-12-10"
}
```

Expected:

```text
201 Created
```

Copy:

```text
data.id = invitationId
data.slug = invitationSlug
```

---

## Postman 5 — Publish invitation

```http
PATCH http://localhost:8080/api/v1/invitations/{{invitationId}}/publish
```

Expected:

```text
200 OK
```

---

## Postman 6 — Create guest

```http
POST http://localhost:8080/api/v1/invitations/{{invitationId}}/guests
```

Body:

```json
{
  "guestName": "Chan Dara",
  "phone": "85598765432",
  "email": "chan.dara@example.com",
  "guestGroup": "Friends",
  "sideType": "GROOM",
  "tableNumber": "A1",
  "sendStatus": "READY",
  "contributionStatus": "NONE",
  "totalContributed": 0
}
```

Expected:

```text
201 Created
```

Copy:

```text
data.id = guestId
data.inviteToken = inviteToken
```

---

## Postman 7 — Prepare delivery

```http
POST http://localhost:8080/api/v1/invitations/{{invitationId}}/delivery/prepare
```

Expected:

```text
200 OK
```

Response should include:

```text
totalGuests
notReady
ready
linkGenerated
sent
failed
opened
responded
guests[].invitationUrl
```

---

## Postman 8 — Get share message

```http
GET http://localhost:8080/api/v1/invitations/{{invitationId}}/delivery/guests/{{guestId}}/share-message
```

Expected:

```text
200 OK
```

Response should include:

```text
invitationUrl
message
```

Copy message and send through Telegram, Messenger, WhatsApp, SMS, etc.

---

## Postman 9 — Mark guest as shared

```http
POST http://localhost:8080/api/v1/invitations/{{invitationId}}/delivery/guests/{{guestId}}/mark-shared
```

Expected:

```text
200 OK
```

Expected response fields:

```text
sendStatus = SENT
lastSendChannel = LINK
lastSentAt != null
```

---

## Postman 10 — Delivery summary and audit trail

Summary:

```http
GET http://localhost:8080/api/v1/invitations/{{invitationId}}/delivery/summary
```

Audit trail:

```http
GET http://localhost:8080/api/v1/invitations/{{invitationId}}/delivery/events
```

Expected summary includes:

```text
totalGuests
notReady
ready
linkGenerated
sent
failed
reminderSent
opened
responded
```

Expected audit events include:

```text
LINK_GENERATED
LINK_SHARED
```

---

# Optional Email Tests

## Send email

```http
POST http://localhost:8080/api/v1/invitations/{{invitationId}}/delivery/email
```

Body:

```json
{
  "allEligible": true,
  "subject": "Wedding Invitation",
  "message": "Please open your wedding invitation link."
}
```

Note:

```text
If mail config is missing, backend should record FAILED status and lastSendError.
```

## Send reminder

```http
POST http://localhost:8080/api/v1/invitations/{{invitationId}}/delivery/reminders
```

Body:

```json
{
  "allEligible": true,
  "subject": "Invitation Reminder",
  "message": "Reminder: please open your invitation and submit RSVP."
}
```
