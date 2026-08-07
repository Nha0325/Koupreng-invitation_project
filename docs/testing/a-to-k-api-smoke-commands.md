# A-K API Smoke Commands

These commands are placeholders for a seeded local or staging environment. Replace the token and IDs before running them.

```powershell
$base = "http://localhost:8080"
$token = "<JWT_ACCESS_TOKEN>"
$headers = @{ Authorization = "Bearer $token" }
$invitationId = "<INVITATION_ID>"
$guestId = "<GUEST_ID>"
$rsvpId = "<RSVP_ID>"
$tableId = "<TABLE_ID>"
$orderCode = "<ORDER_CODE>"
```

## A. Auth and Account

```powershell
Invoke-RestMethod "$base/api/health"
Invoke-RestMethod "$base/api/auth/register" -Method Post -ContentType "application/json" -Body '{"name":"QA User","email":"qa-user@example.com","password":"Password123!"}'
Invoke-RestMethod "$base/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"qa-user@example.com","password":"Password123!"}'
Invoke-RestMethod "$base/api/auth/me" -Headers $headers
Invoke-RestMethod "$base/api/auth/change-password" -Method Post -Headers $headers -ContentType "application/json" -Body '{"currentPassword":"Password123!","newPassword":"Password123!!"}'
```

## B-K. Core Invitation Flows

```powershell
Invoke-RestMethod "$base/api/v1/templates"
Invoke-RestMethod "$base/api/v1/invitations" -Method Post -Headers $headers -ContentType "application/json" -Body '{"title":"QA Wedding","slug":"qa-wedding","status":"DRAFT"}'
Invoke-RestMethod "$base/api/v1/invitations/my" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/preview" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/publish" -Method Patch -Headers $headers
Invoke-RestMethod "$base/api/v1/public/invitations/qa-wedding"
Invoke-RestMethod "$base/api/v1/public/invitations/qa-wedding/rsvp" -Method Post -ContentType "application/json" -Body '{"guestName":"QA Guest","status":"ATTENDING","attendeeCount":2}'
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/guests" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/rsvps" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/dashboard" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/reports/rsvp" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/budget" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/qr" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/check-in/summary" -Headers $headers
Invoke-RestMethod "$base/api/v1/invitations/$invitationId/seating" -Headers $headers
Invoke-RestMethod "$base/api/v1/notifications" -Headers $headers
```

## Extra Implemented Areas

```powershell
Invoke-RestMethod "$base/api/v1/packages"
Invoke-RestMethod "$base/api/v1/me/payments" -Headers $headers
Invoke-RestMethod "$base/api/v1/me/payments/$orderCode" -Headers $headers
Invoke-RestMethod "$base/api/v1/me/payments/$orderCode/receipt" -Headers $headers
Invoke-RestMethod "$base/api/v1/organizations" -Headers $headers
Invoke-RestMethod "$base/api/v1/ai/invitation-copy" -Method Post -Headers $headers -ContentType "application/json" -Body '{"tone":"formal","language":"km","names":"QA Couple"}'
Invoke-RestMethod "$base/api/v1/admin/system-health" -Headers $headers
Invoke-RestMethod "$base/api/v1/admin/system-logs" -Headers $headers
```
