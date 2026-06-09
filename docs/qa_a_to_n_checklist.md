# Koupreng A-N Full QA Checklist

Use this checklist with a local or staging backend. Replace `{id}`, `{slug}`, `{guestId}`, `{rsvpId}`, `{itemId}`, `{orderCode}`, `{token}`, and `{packageId}` with real values.

| Area | Method | Endpoint / Route | Role / Access | Sample request body | Expected response | Pass |
| --- | --- | --- | --- | --- | --- | --- |
| **A. Auth** | POST | `/api/auth/register` | Public | `{"fullName":"Test User","phone":"012345678","password":"Pass1234"}` | 200 with bearer token and user | [ ] |
| **A. Auth** | POST | `/api/auth/login` | Public | `{"identifier":"012345678","password":"Pass1234"}` | 200 with bearer token and user | [ ] |
| **A. Auth** | POST | `/api/auth/logout` | USER | `{}` | 200, token version invalidated | [ ] |
| **A. Auth** | GET | `/api/auth/me` | USER | none | Current user profile | [ ] |
| **A. Auth** | PUT | `/api/auth/me` | USER | `{"fullName":"New Name","phone":"012345679"}` | Updated profile | [ ] |
| **A. Auth** | POST | `/api/auth/change-password` | USER | `{"oldPassword":"Pass1234","newPassword":"Newpass123"}` | 200 success, old token invalid | [ ] |
| **A. Auth** | POST | `/api/auth/forgot-password` | Public | `{"email":"user@example.com"}` | Generic success, no account existence leak | [ ] |
| **A. Auth** | POST | `/api/auth/reset-password` | Public | `{"token":"{token}","newPassword":"Reset1234"}` | Password changed, token marked used | [ ] |
| **B. Invitation** | POST | `/api/v1/invitations` | USER | `{"title":"Wedding","eventType":"WEDDING","eventDate":"2026-12-12","eventTime":"18:00:00","venueName":"Venue","venueAddress":"Phnom Penh","groomName":"A","brideName":"B"}` | Draft invitation created | [ ] |
| **B. Invitation** | GET | `/api/v1/invitations/my` | USER | none | Only current user's invitations | [ ] |
| **B. Invitation** | GET | `/api/v1/invitations/{id}` | Owner | none | Invitation detail | [ ] |
| **B. Invitation** | PUT | `/api/v1/invitations/{id}` | Owner | Invitation body | Updated invitation | [ ] |
| **B. Invitation** | PATCH | `/api/v1/invitations/{id}/publish` | Owner | none | Published invitation | [ ] |
| **B. Invitation** | PATCH | `/api/v1/invitations/{id}/unpublish` | Owner | none | Unpublished invitation | [ ] |
| **B. Invitation** | DELETE | `/api/v1/invitations/{id}` | Owner | none | Soft deleted invitation | [ ] |
| **B. Invitation** | GET | `/api/v1/public/invitations/{slug}` | Public | none | Safe public invitation data only | [ ] |
| **C. Template** | GET | `/api/v1/invitations/{id}/customization` | Owner | none | Saved template/design/content fields | [ ] |
| **C. Template** | PUT | `/api/v1/invitations/{id}/customization` | Owner | `{"templateId":10,"languageMode":"km","designJson":"{\"theme\":\"royal\"}","contentJson":"{\"heroTitle\":\"Wedding\"}","customColors":"{\"primary\":\"#b0926a\"}","customFonts":"{\"body\":\"Kantumruy Pro\"}","enabledSections":"[\"hero\",\"rsvp\"]","layoutSettings":"{\"density\":\"classic\"}"}` | Customization persists after reload | [ ] |
| **D. Media** | POST | `/api/v1/invitations/{id}/media/cover` | Owner | multipart `file` | Valid cover uploaded | [ ] |
| **D. Media** | POST | `/api/v1/invitations/{id}/media/gallery` | Owner | multipart `files` | Valid gallery items uploaded | [ ] |
| **D. Media** | POST | `/api/v1/invitations/{id}/media/video` | Owner | multipart `file` | Valid video uploaded or validation error | [ ] |
| **D. Media** | POST | `/api/v1/invitations/{id}/media/music` | Owner | multipart `file` | Valid music uploaded or validation error | [ ] |
| **D. Media** | GET | `/api/v1/invitations/{id}/media` | Owner | none | Owner media list | [ ] |
| **D. Media** | GET | `/api/v1/public/invitations/{slug}/media` | Public | none | Public-safe media URLs | [ ] |
| **D. Media** | PUT | `/api/v1/invitations/{id}/media/{mediaId}/replace` | Owner | multipart `file` | Existing media replaced | [ ] |
| **D. Media** | DELETE | `/api/v1/invitations/{id}/media/{mediaId}` | Owner | none | Media deleted | [ ] |
| **E. Guest** | POST | `/api/v1/invitations/{id}/guests` | Owner | `{"guestName":"Guest","phone":"012300000","groupName":"Family"}` | Guest created | [ ] |
| **E. Guest** | GET | `/api/v1/invitations/{id}/guests` | Owner | none | Guest list | [ ] |
| **E. Guest** | GET | `/api/v1/invitations/{id}/guests/search?q=Guest` | Owner | none | Filtered guest list | [ ] |
| **E. Guest** | POST | `/api/v1/invitations/{id}/guests/import` | Owner | `{"guests":[{"guestName":"A"},{"guestName":"B"}]}` | Guests imported | [ ] |
| **E. Guest** | GET | `/api/v1/invitations/{id}/guests/grouped` | Owner | none | Grouped guests | [ ] |
| **E. Guest** | GET | `/api/v1/invitations/{id}/guests/send-list` | Owner | none | Share/send list with invite tokens | [ ] |
| **E. Guest** | PUT | `/api/v1/invitations/{id}/guests/{guestId}` | Owner | Guest body | Guest updated | [ ] |
| **E. Guest** | DELETE | `/api/v1/invitations/{id}/guests/{guestId}` | Owner | none | Guest deleted | [ ] |
| **F. Delivery** | POST | `/api/v1/invitations/{id}/delivery/prepare` | Owner | `{}` | Delivery batch prepared | [ ] |
| **F. Delivery** | GET | `/api/v1/invitations/{id}/delivery/summary` | Owner | none | Delivery summary | [ ] |
| **F. Delivery** | GET | `/api/v1/invitations/{id}/delivery/guests/{guestId}/share-message` | Owner | none | Share message | [ ] |
| **F. Delivery** | POST | `/api/v1/invitations/{id}/delivery/guests/{guestId}/mark-shared` | Owner | `{}` | Guest marked shared | [ ] |
| **F. Delivery** | POST | `/api/v1/invitations/{id}/delivery/email` | Owner | `{}` | Email send queued/sent where configured | [ ] |
| **F. Delivery** | POST | `/api/v1/invitations/{id}/delivery/reminders` | Owner | `{}` | Reminders created | [ ] |
| **F. Delivery** | GET | `/api/v1/invitations/{id}/delivery/events` | Owner | none | Delivery event history | [ ] |
| **G. RSVP** | POST | `/api/v1/public/invitations/{slug}/rsvp` | Public | `{"guestName":"Guest","responseStatus":"ACCEPTED","attendeeCount":2,"message":"Congrats"}` | RSVP created/updated safely | [ ] |
| **G. RSVP** | POST | `/api/v1/public/invitations/{slug}/guests/{token}/rsvp` | Public token | RSVP body | Token guest RSVP saved | [ ] |
| **G. RSVP** | GET | `/api/v1/public/invitations/{slug}/rsvp-summary-public` | Public | none | Public RSVP summary | [ ] |
| **G. RSVP** | GET | `/api/v1/public/invitations/{slug}/wishes` | Public | none | Public wishes wall | [ ] |
| **G. RSVP** | GET | `/api/v1/invitations/{id}/rsvps` | Owner | none | Owner RSVP list | [ ] |
| **G. RSVP** | GET | `/api/v1/invitations/{id}/rsvps/summary` | Owner | none | Owner RSVP summary | [ ] |
| **G. RSVP** | PATCH | `/api/v1/invitations/{id}/rsvps/{rsvpId}` | Owner | `{"responseStatus":"DECLINED","attendeeCount":0,"message":"Sorry"}` | RSVP updated | [ ] |
| **G. RSVP** | DELETE | `/api/v1/invitations/{id}/rsvps/{rsvpId}` | Owner | none | RSVP deleted | [ ] |
| **H. Notification** | GET | `/api/v1/notifications` | USER | none | Only user's notifications | [ ] |
| **H. Notification** | GET | `/api/v1/notifications/summary` | USER | none | User notification counts | [ ] |
| **H. Notification** | PATCH | `/api/v1/notifications/{notificationId}/read` | USER | none | One notification marked read | [ ] |
| **H. Notification** | PATCH | `/api/v1/notifications/read-all` | USER | none | All user notifications marked read | [ ] |
| **H. Notification** | GET | `/api/v1/invitations/{id}/notifications` | Owner | none | Invitation notifications | [ ] |
| **I. Dashboard** | GET | `/api/v1/dashboard/summary` | USER | none | User dashboard summary | [ ] |
| **I. Dashboard** | GET | `/api/v1/invitations/{id}/dashboard` | Owner | none | Invitation dashboard | [ ] |
| **I. Dashboard** | GET | `/api/v1/invitations/{id}/reports/rsvp` | Owner | none | RSVP report | [ ] |
| **I. Dashboard** | GET | `/api/v1/invitations/{id}/reports/guests` | Owner | none | Guest report | [ ] |
| **I. Dashboard** | GET | `/api/v1/invitations/{id}/reports/rsvp/export` | Owner | none | CSV export | [ ] |
| **I. Dashboard** | GET | `/api/v1/invitations/{id}/reports/guests/export` | Owner | none | CSV export | [ ] |
| **J. Admin** | GET | `/api/v1/admin/dashboard/summary` | ADMIN | none | Admin dashboard | [ ] |
| **J. Admin** | GET | `/api/v1/admin/users` | ADMIN | none | Users list | [ ] |
| **J. Admin** | PATCH | `/api/v1/admin/users/{userId}/deactivate` | ADMIN | none | User deactivated | [ ] |
| **J. Admin** | PATCH | `/api/v1/admin/users/{userId}/activate` | ADMIN | none | User activated | [ ] |
| **J. Admin** | PATCH | `/api/v1/admin/users/{userId}/role` | ADMIN | `{"role":"ADMIN"}` | User role updated | [ ] |
| **J. Admin** | GET | `/api/v1/admin/templates` | ADMIN | none | Templates list | [ ] |
| **J. Admin** | POST | `/api/v1/admin/templates` | ADMIN | Template body | Template created | [ ] |
| **J. Admin** | PUT | `/api/v1/admin/templates/{templateId}` | ADMIN | Template body | Template updated | [ ] |
| **J. Admin** | GET | `/api/v1/admin/invitations` | ADMIN | none | All invitations | [ ] |
| **J. Admin** | PATCH | `/api/v1/admin/invitations/{invitationId}/moderate` | ADMIN | `{"moderationStatus":"SUSPENDED","reason":"policy review"}` | Moderation updated | [ ] |
| **J. Admin** | GET | `/api/v1/admin/system-logs` | ADMIN | none | Audit log list | [ ] |
| **K. Budget** | GET | `/api/v1/invitations/{id}/budget` | Owner | none | Budget with items | [ ] |
| **K. Budget** | PUT | `/api/v1/invitations/{id}/budget` | Owner | `{"totalBudget":500,"notes":"Wedding budget"}` | Budget updated | [ ] |
| **K. Budget** | GET | `/api/v1/invitations/{id}/budget/summary` | Owner | none | Budget summary | [ ] |
| **K. Budget** | POST | `/api/v1/invitations/{id}/budget/items` | Owner | `{"category":"Venue","itemName":"Hall","estimatedAmount":300,"actualAmount":0,"status":"PLANNED"}` | Item added | [ ] |
| **K. Budget** | PUT | `/api/v1/invitations/{id}/budget/items/{itemId}` | Owner | Budget item body | Item updated | [ ] |
| **K. Budget** | DELETE | `/api/v1/invitations/{id}/budget/items/{itemId}` | Owner | none | Item deleted | [ ] |
| **K. Budget** | GET | `/api/v1/invitations/{id}/budget/export` | Owner | none | CSV export | [ ] |
| **L. Polish** | GET | `/api/v1/public/invitations/{slug}/guest-view` | Public + Token | none | Custom guest details + wishing wall | [ ] |
| **M. Advanced** | GET | `/api/v1/invitations/{id}/qr` | Owner | none | Invitation base QR code payload | [ ] |
| **M. Advanced** | GET | `/api/v1/invitations/{id}/guests/{guestId}/qr` | Owner | none | Guest personalized QR response | [ ] |
| **M. Advanced** | GET | `/api/v1/invitations/{id}/seating/summary` | Owner | none | Tables count, capacity, seats detail | [ ] |
| **M. Advanced** | GET | `/api/v1/invitations/{id}/tables` | Owner | none | Seating tables list | [ ] |
| **M. Advanced** | POST | `/api/v1/invitations/{id}/tables` | Owner | `{"tableName":"Table 1","capacity":10}` | New seating table created | [ ] |
| **M. Advanced** | POST | `/api/v1/invitations/{id}/tables/{tableId}/assign-guests` | Owner | `{"guestId":12,"seatCount":1}` | Assigns guest to table | [ ] |
| **M. Advanced** | DELETE | `/api/v1/invitations/{id}/guests/{guestId}/seat` | Owner | none | Unassigns guest from table | [ ] |
| **M. Advanced** | GET | `/api/v1/admin/packages` | ADMIN | none | All subscription packages | [ ] |
| **M. Advanced** | POST | `/api/v1/admin/packages` | ADMIN | `{"packageName":"Silver","price":5.00,"active":true}` | Creates new pricing package | [ ] |
| **M. Advanced** | GET | `/api/v1/me/payments` | USER | none | Unified payment history (merged) | [x] |
| **M. Advanced** | GET | `/api/v1/me/payments/{orderCode}` | Owner | none | Detailed order payment record | [x] |
| **M. Advanced** | GET | `/api/v1/me/payments/{orderCode}/receipt` | Owner | none | Detailed payment receipt | [x] |
| **M. Advanced** | GET | `/api/v1/admin/payments` | ADMIN | none | Global unified payments | [ ] |
| **M. Advanced** | POST | `/api/v1/ai/invitation/story` | USER | `{"coupleNames":"A & B"}` | AI generated couple story | [ ] |
| **M. Advanced** | POST | `/api/v1/ai/invitation/formal-text` | USER | `{"venueName":"Main Hall"}` | AI generated invitation copy | [ ] |
| **M. Advanced** | POST | `/api/v1/ai/invitation/translate` | USER | `{"generatedText":"Welcome"}` | AI generated translation copy | [ ] |
| **M. Advanced** | POST | `/api/v1/ai/invitation/timeline-suggestion` | USER | `{"eventType":"wedding"}` | AI timeline itinerary | [ ] |
| **M. Advanced** | PATCH | `/api/v1/organizations/{orgId}/members/{memberId}/role` | Org Owner | `{"role":"MANAGER"}` | Updates organization member role | [ ] |
| **N. Security** | POST | `/api/v1/internal/template-payments/confirm` | No secret | Confirm payload | 401 Unauthorized before service call | [x] |
| **N. Security** | POST | `/api/v1/internal/template-payments/confirm` | Wrong secret | Confirm payload | 403 Forbidden before service call | [x] |
| **N. Security** | POST | `/api/v1/internal/template-payments/confirm` | Valid secret, no JWT | Confirm payload | Controller/service reached | [x] |
| **N. Security** | POST | `/api/v1/internal/template-payments/telegram-detect` | No secret | Telegram payload | 401 Unauthorized before service call | [x] |
| **N. Security** | POST | `/api/v1/internal/template-payments/telegram-detect` | Wrong secret | Telegram payload | 403 Forbidden before service call | [x] |
| **N. Security** | POST | `/api/v1/internal/template-payments/telegram-detect` | Valid secret, no JWT | Telegram payload | Controller/service reached | [x] |
| **N. Security** | GET | `/api/v1/admin/users` | Normal User | none | 403 Forbidden | [x] |
| **N. Security** | GET | `/api/v1/invitations/{otherUserInvitationId}` | User B | none | 403 or 404 access validation | [x] |
| **N. Security** | GET | `/api/v1/invitations/{id}/reports/guests/export` | Owner | none | CSV formula injection hardening | [x] |
| **N. Security** | POST | `(Any Admin Action)` | ADMIN | none | Audit IP spoofing mitigation (X-Forwarded-For) | [x] |
