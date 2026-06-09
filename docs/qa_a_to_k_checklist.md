# Koupreng A-K MVP QA Checklist

Use this checklist with a local or staging backend. Replace `{id}`, `{slug}`, `{guestId}`, `{rsvpId}`, `{itemId}`, `{orderCode}`, and `{token}` with real values.

| Area | Method | Endpoint | Role | Sample request body | Expected response | Pass |
| --- | --- | --- | --- | --- | --- | --- |
| Auth | POST | `/api/auth/register` | Public | `{"fullName":"Test User","phone":"012345678","password":"Pass1234"}` | 200 with bearer token and user | [ ] |
| Auth | POST | `/api/auth/login` | Public | `{"identifier":"012345678","password":"Pass1234"}` | 200 with bearer token and user | [ ] |
| Auth | POST | `/api/auth/logout` | USER | `{}` | 200, token version invalidated | [ ] |
| Auth | GET | `/api/auth/me` | USER | none | Current user profile | [ ] |
| Auth | PUT | `/api/auth/me` | USER | `{"fullName":"New Name","phone":"012345679"}` | Updated profile | [ ] |
| Auth | POST | `/api/auth/change-password` | USER | `{"oldPassword":"Pass1234","newPassword":"Newpass123"}` | 200 success, old token invalid | [ ] |
| Auth | POST | `/api/auth/forgot-password` | Public | `{"email":"user@example.com"}` | Generic success, no account existence leak | [ ] |
| Auth | POST | `/api/auth/reset-password` | Public | `{"token":"{token}","newPassword":"Reset1234"}` | Password changed, token marked used | [ ] |
| Invitation | POST | `/api/v1/invitations` | USER | `{"title":"Wedding","eventType":"WEDDING","eventDate":"2026-12-12","eventTime":"18:00:00","venueName":"Venue","venueAddress":"Phnom Penh","groomName":"A","brideName":"B"}` | Draft invitation created | [ ] |
| Invitation | GET | `/api/v1/invitations/my` | USER | none | Only current user's invitations | [ ] |
| Invitation | GET | `/api/v1/invitations/{id}` | Owner | none | Invitation detail | [ ] |
| Invitation | PUT | `/api/v1/invitations/{id}` | Owner | Invitation body | Updated invitation | [ ] |
| Invitation | PATCH | `/api/v1/invitations/{id}/publish` | Owner | none | Published invitation | [ ] |
| Invitation | PATCH | `/api/v1/invitations/{id}/unpublish` | Owner | none | Unpublished invitation | [ ] |
| Invitation | DELETE | `/api/v1/invitations/{id}` | Owner | none | Soft deleted invitation | [ ] |
| Public invitation | GET | `/api/v1/public/invitations/{slug}` | Public | none | Safe public invitation data only | [ ] |
| Template customization | GET | `/api/v1/invitations/{id}/customization` | Owner | none | Saved template/design/content fields | [ ] |
| Template customization | PUT | `/api/v1/invitations/{id}/customization` | Owner | `{"templateId":10,"languageMode":"km","designJson":"{\"theme\":\"royal\"}","contentJson":"{\"heroTitle\":\"Wedding\"}","customColors":"{\"primary\":\"#b0926a\"}","customFonts":"{\"body\":\"Kantumruy Pro\"}","enabledSections":"[\"hero\",\"rsvp\"]","layoutSettings":"{\"density\":\"classic\"}"}` | Customization persists after reload | [ ] |
| Media | POST | `/api/v1/invitations/{id}/media/cover` | Owner | multipart `file` | Valid cover uploaded | [ ] |
| Media | POST | `/api/v1/invitations/{id}/media/gallery` | Owner | multipart `files` | Valid gallery items uploaded | [ ] |
| Media | POST | `/api/v1/invitations/{id}/media/video` | Owner | multipart `file` | Valid video uploaded or validation error | [ ] |
| Media | POST | `/api/v1/invitations/{id}/media/music` | Owner | multipart `file` | Valid music uploaded or validation error | [ ] |
| Media | GET | `/api/v1/invitations/{id}/media` | Owner | none | Owner media list | [ ] |
| Media | GET | `/api/v1/public/invitations/{slug}/media` | Public | none | Public-safe media URLs | [ ] |
| Media | PUT | `/api/v1/invitations/{id}/media/{mediaId}/replace` | Owner | multipart `file` | Existing media replaced | [ ] |
| Media | DELETE | `/api/v1/invitations/{id}/media/{mediaId}` | Owner | none | Media deleted | [ ] |
| Guest | POST | `/api/v1/invitations/{id}/guests` | Owner | `{"guestName":"Guest","phone":"012300000","groupName":"Family"}` | Guest created | [ ] |
| Guest | GET | `/api/v1/invitations/{id}/guests` | Owner | none | Guest list | [ ] |
| Guest | GET | `/api/v1/invitations/{id}/guests/search?q=Guest` | Owner | none | Filtered guest list | [ ] |
| Guest | POST | `/api/v1/invitations/{id}/guests/import` | Owner | `{"guests":[{"guestName":"A"},{"guestName":"B"}]}` | Guests imported | [ ] |
| Guest | GET | `/api/v1/invitations/{id}/guests/grouped` | Owner | none | Grouped guests | [ ] |
| Guest | GET | `/api/v1/invitations/{id}/guests/send-list` | Owner | none | Share/send list with invite tokens | [ ] |
| Guest | PUT | `/api/v1/invitations/{id}/guests/{guestId}` | Owner | Guest body | Guest updated | [ ] |
| Guest | DELETE | `/api/v1/invitations/{id}/guests/{guestId}` | Owner | none | Guest deleted | [ ] |
| Delivery | POST | `/api/v1/invitations/{id}/delivery/prepare` | Owner | `{}` | Delivery batch prepared | [ ] |
| Delivery | GET | `/api/v1/invitations/{id}/delivery/summary` | Owner | none | Delivery summary | [ ] |
| Delivery | GET | `/api/v1/invitations/{id}/delivery/guests/{guestId}/share-message` | Owner | none | Share message | [ ] |
| Delivery | POST | `/api/v1/invitations/{id}/delivery/guests/{guestId}/mark-shared` | Owner | `{}` | Guest marked shared | [ ] |
| Delivery | POST | `/api/v1/invitations/{id}/delivery/email` | Owner | `{}` | Email send queued/sent where configured | [ ] |
| Delivery | POST | `/api/v1/invitations/{id}/delivery/reminders` | Owner | `{}` | Reminders created | [ ] |
| Delivery | GET | `/api/v1/invitations/{id}/delivery/events` | Owner | none | Delivery event history | [ ] |
| RSVP | POST | `/api/v1/public/invitations/{slug}/rsvp` | Public | `{"guestName":"Guest","responseStatus":"ACCEPTED","attendeeCount":2,"message":"Congrats"}` | RSVP created/updated safely | [ ] |
| RSVP | POST | `/api/v1/public/invitations/{slug}/guests/{token}/rsvp` | Public token | RSVP body | Token guest RSVP saved | [ ] |
| RSVP | GET | `/api/v1/public/invitations/{slug}/rsvp-summary-public` | Public | none | Public RSVP summary | [ ] |
| RSVP | GET | `/api/v1/public/invitations/{slug}/wishes` | Public | none | Public wishes wall | [ ] |
| RSVP | GET | `/api/v1/invitations/{id}/rsvps` | Owner | none | Owner RSVP list | [ ] |
| RSVP | GET | `/api/v1/invitations/{id}/rsvps/summary` | Owner | none | Owner RSVP summary | [ ] |
| RSVP | PATCH | `/api/v1/invitations/{id}/rsvps/{rsvpId}` | Owner | `{"responseStatus":"DECLINED","attendeeCount":0,"message":"Sorry"}` | RSVP updated | [ ] |
| RSVP | DELETE | `/api/v1/invitations/{id}/rsvps/{rsvpId}` | Owner | none | RSVP deleted | [ ] |
| Notification | GET | `/api/v1/notifications` | USER | none | Only user's notifications | [ ] |
| Notification | GET | `/api/v1/notifications/summary` | USER | none | User notification counts | [ ] |
| Notification | PATCH | `/api/v1/notifications/{notificationId}/read` | USER | none | One notification marked read | [ ] |
| Notification | PATCH | `/api/v1/notifications/read-all` | USER | none | All user notifications marked read | [ ] |
| Notification | GET | `/api/v1/invitations/{id}/notifications` | Owner | none | Invitation notifications | [ ] |
| Dashboard | GET | `/api/v1/dashboard/summary` | USER | none | User dashboard summary | [ ] |
| Dashboard | GET | `/api/v1/invitations/{id}/dashboard` | Owner | none | Invitation dashboard | [ ] |
| Dashboard | GET | `/api/v1/invitations/{id}/reports/rsvp` | Owner | none | RSVP report | [ ] |
| Dashboard | GET | `/api/v1/invitations/{id}/reports/guests` | Owner | none | Guest report | [ ] |
| Dashboard | GET | `/api/v1/invitations/{id}/reports/rsvp/export` | Owner | none | CSV export | [ ] |
| Dashboard | GET | `/api/v1/invitations/{id}/reports/guests/export` | Owner | none | CSV export | [ ] |
| Admin | GET | `/api/v1/admin/dashboard/summary` | ADMIN | none | Admin dashboard | [ ] |
| Admin | GET | `/api/v1/admin/users` | ADMIN | none | Users list | [ ] |
| Admin | PATCH | `/api/v1/admin/users/{userId}/deactivate` | ADMIN | none | User deactivated | [ ] |
| Admin | PATCH | `/api/v1/admin/users/{userId}/activate` | ADMIN | none | User activated | [ ] |
| Admin | PATCH | `/api/v1/admin/users/{userId}/role` | ADMIN | `{"role":"ADMIN"}` | User role updated | [ ] |
| Admin | GET | `/api/v1/admin/templates` | ADMIN | none | Templates list | [ ] |
| Admin | POST | `/api/v1/admin/templates` | ADMIN | Template body | Template created | [ ] |
| Admin | PUT | `/api/v1/admin/templates/{templateId}` | ADMIN | Template body | Template updated | [ ] |
| Admin | GET | `/api/v1/admin/invitations` | ADMIN | none | All invitations | [ ] |
| Admin | PATCH | `/api/v1/admin/invitations/{invitationId}/moderate` | ADMIN | `{"moderationStatus":"SUSPENDED","reason":"policy review"}` | Moderation updated | [ ] |
| Admin | GET | `/api/v1/admin/system-logs` | ADMIN | none | Audit log list | [ ] |
| Budget | GET | `/api/v1/invitations/{id}/budget` | Owner | none | Budget with items | [ ] |
| Budget | PUT | `/api/v1/invitations/{id}/budget` | Owner | `{"totalBudget":500,"notes":"Wedding budget"}` | Budget updated | [ ] |
| Budget | GET | `/api/v1/invitations/{id}/budget/summary` | Owner | none | Budget summary | [ ] |
| Budget | POST | `/api/v1/invitations/{id}/budget/items` | Owner | `{"category":"Venue","itemName":"Hall","estimatedAmount":300,"actualAmount":0,"status":"PLANNED"}` | Item added | [ ] |
| Budget | PUT | `/api/v1/invitations/{id}/budget/items/{itemId}` | Owner | Budget item body | Item updated | [ ] |
| Budget | DELETE | `/api/v1/invitations/{id}/budget/items/{itemId}` | Owner | none | Item deleted | [ ] |
| Budget | GET | `/api/v1/invitations/{id}/budget/export` | Owner | none | CSV export | [ ] |
| Payment | POST | `/api/v1/template-payments/static/create` | USER | `{"templateId":10,"templateName":"Royal","packageName":"Premium","amount":0.01,"currency":"USD"}` | Static ABA order with paymentLink | [ ] |
| Payment | GET | `/api/v1/template-payments/{orderCode}` | Owner or ADMIN | none | Order status | [ ] |
| Payment | POST | `/api/v1/internal/template-payments/telegram-detect` | Internal secret | Telegram payload with order code, amount, currency | Valid secret marks PAID if exact match | [ ] |
| Payment security | POST | `/api/v1/internal/template-payments/telegram-detect` | No secret | Telegram payload | 401 | [ ] |
| Payment security | POST | `/api/v1/internal/template-payments/telegram-detect` | Wrong secret | Telegram payload | 403 | [ ] |
| Payment security | POST | `/api/v1/internal/template-payments/telegram-detect` | Valid secret, missing orderCode | Amount-only payload | Not PAID; review/failure message | [ ] |
| Admin security | GET | `/api/v1/admin/users` | USER | none | 403 | [ ] |
| Ownership security | GET | `/api/v1/invitations/{otherUserInvitationId}` | USER | none | 403 or 404 | [ ] |
| Ownership security | GET | `/api/v1/invitations/{otherUserInvitationId}/budget` | USER | none | 403 or 404 | [ ] |
