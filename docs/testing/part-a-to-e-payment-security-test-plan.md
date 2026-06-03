# Part A-E, Payment, Telegram, And Security Test Plan

Scope: current authentication, invitation, template/customization, media, guest, ABA static KHQR payment, Telegram auto-confirm, and security/configuration flows.

Static ABA KHQR payment must remain:

```text
https://link.payway.com.kh/ABAPAYrD450560q
```

Status values are placeholders for manual/API execution: `NOT RUN`, `PASS`, `FAIL`, `PARTIAL`, `BLOCKED`, or `NOT IMPLEMENTED`.

## Part A - Auth

| Test ID | Module | Preconditions | Request/UI steps | Expected result | Status |
|---|---|---|---|---|---|
| AUTH-001 | Auth | Backend running, unique email/phone | POST `/api/auth/register` with valid fullName, email or phone, and password | User is created, password is not returned, JWT auth response is returned | NOT RUN |
| AUTH-002 | Auth | Registered active user exists | POST `/api/auth/login` with valid identifier and password | Bearer token and user response returned; password hash is not returned | NOT RUN |
| AUTH-003 | Auth | Registered user exists | POST `/api/auth/login` with wrong password | Login fails without revealing whether identifier or password was wrong | NOT RUN |
| AUTH-004 | Auth | Valid bearer token exists | GET current user endpoint, such as `/api/users/me`, with token | Current authenticated user profile returned | NOT RUN |
| AUTH-005 | Auth | No token | Call protected endpoint, such as GET `/api/v1/invitations/my` | Request is rejected with 401 | NOT RUN |
| AUTH-006 | Auth | Normal user token | Call admin endpoint, such as GET `/api/admin/users` | Request is rejected with 403 | NOT RUN |
| AUTH-007 | Auth | Two users and one private resource owned by user A | User B calls user A owned invitation/media/guest endpoint | Request is rejected with 403 or not-found equivalent | NOT RUN |

## Part B - Invitation

| Test ID | Module | Preconditions | Request/UI steps | Expected result | Status |
|---|---|---|---|---|---|
| INV-001 | Invitation | Authenticated user | POST `/api/v1/invitations` with minimal draft request | Draft invitation is created with safe unique slug | NOT RUN |
| INV-002 | Invitation | Existing owner draft | PUT `/api/v1/invitations/{id}` with changed venue/title/date | Invitation updates only for owner | NOT RUN |
| INV-003 | Invitation | Existing incomplete draft | PATCH `/api/v1/invitations/{id}/publish` | Publish fails with missing requirements listed | NOT RUN |
| INV-004 | Invitation | Existing valid draft | PATCH `/api/v1/invitations/{id}/publish` | Invitation becomes PUBLISHED with publishedAt set | NOT RUN |
| INV-005 | Invitation | Existing published invitation | PATCH `/api/v1/invitations/{id}/unpublish` | Invitation becomes UNPUBLISHED and public slug is unavailable | NOT RUN |
| INV-006 | Invitation | Published public invitation | GET `/api/v1/public/invitations/{slug}` | Public DTO is returned without internal userId, ownerName, email, phone, or password | NOT RUN |
| INV-007 | Invitation | User A owns invitation, user B authenticated | User B tries PUT or DELETE on user A invitation | Request is rejected with 403 | NOT RUN |
| INV-008 | Invitation | Owner has invitation | DELETE `/api/v1/invitations/{id}` | Invitation is soft-deleted and absent from normal lists | NOT RUN |

## Part C - Template Selection And Customization

| Test ID | Module | Preconditions | Request/UI steps | Expected result | Status |
|---|---|---|---|---|---|
| TPL-001 | Templates | Frontend user app running | Open `/templates` | Available templates render without white screen | NOT RUN |
| TPL-002 | Templates | Frontend user app running | Open template preview route | Preview page renders the selected template | NOT RUN |
| TPL-003 | Templates | Authenticated user, free template exists | Create/update invitation with free templateId | Backend saves selected free template | NOT RUN |
| TPL-004 | Templates | Authenticated user, premium template exists, no access | Create/update invitation with premium templateId | Backend rejects with forbidden premium access error | NOT RUN |
| TPL-005 | Templates | User has active UserTemplateAccess for premium template | Create/update invitation with premium templateId | Backend allows selected premium template | NOT RUN |
| TPL-006 | Customization | Customization editor implemented | Change colors, text, fonts, and sections, then save | Changes persist after refresh | NOT RUN |
| TPL-007 | Customization | Khmer/English switch implemented | Switch language mode and save | Selected language mode persists and public page renders correctly | NOT RUN |
| TPL-008 | Customization security | Custom text field available | Submit `<script>alert(1)</script>` in custom text | Script is rejected or safely escaped and never executes | NOT RUN |
| TPL-009 | Customization security | Custom URL field available | Submit `javascript:alert(1)` URL | URL is rejected or sanitized | NOT RUN |

## Part D - Media

| Test ID | Module | Preconditions | Request/UI steps | Expected result | Status |
|---|---|---|---|---|---|
| MED-001 | Media | Authenticated owner, valid image | POST cover upload endpoint with valid JPEG/PNG/WebP | Cover uploads and replaces previous cover | NOT RUN |
| MED-002 | Media | Authenticated owner, valid images | POST gallery upload endpoint with multiple images | Gallery images upload with sort order | NOT RUN |
| MED-003 | Media | Authenticated owner | Upload `.exe` file | Request is rejected | NOT RUN |
| MED-004 | Media | Authenticated owner | Upload image larger than configured limit | Request is rejected with size error | NOT RUN |
| MED-005 | Media | Authenticated owner | Upload fake extension or MIME mismatch | Request is rejected | NOT RUN |
| MED-006 | Media | Authenticated owner | Upload filename `../../test.png` | Request is rejected as unsafe filename | NOT RUN |
| MED-007 | Media | User A owns media, user B authenticated | User B tries replace/delete user A media | Request is rejected with 403 or not-found equivalent | NOT RUN |
| MED-008 | Media | Published public invitation with media | GET `/api/v1/public/invitations/{slug}/media` | Only media for published public invitation is returned | NOT RUN |

## Part E - Guest

| Test ID | Module | Preconditions | Request/UI steps | Expected result | Status |
|---|---|---|---|---|---|
| GST-001 | Guest | Authenticated owner with invitation | POST guest create endpoint | Guest is created with unique invite token and invitation link | NOT RUN |
| GST-002 | Guest | Existing guest | PUT guest update endpoint | Editable guest fields update | NOT RUN |
| GST-003 | Guest | Existing guest | DELETE guest endpoint | Guest is removed | NOT RUN |
| GST-004 | Guest | Invitation has guests | GET guest list endpoint | Guests list is returned only to owner | NOT RUN |
| GST-005 | Guest | Invitation has guests | GET guest search endpoint with name/phone/email keyword | Search is scoped to owner invitation | NOT RUN |
| GST-006 | Guest | Invitation has guest groups | GET `/api/v1/invitations/{id}/guests/grouped` | Guests are grouped by category | NOT RUN |
| GST-007 | Guest | Invitation has guests | GET `/api/v1/invitations/{id}/guests/send-list` | Invite links are generated and sendable count is correct | NOT RUN |
| GST-008 | Guest security | User A owns invitation and guests, user B authenticated | User B tries list/search/edit/delete user A guest | Request is rejected with 403 | NOT RUN |

## Payment

| Test ID | Module | Preconditions | Request/UI steps | Expected result | Status |
|---|---|---|---|---|---|
| PAY-001 | Payment | Authenticated user | POST `/api/v1/template-payments/static/create` with amount USD 0.01 | PENDING order is created with provider `ABA_PAYWAY_STATIC_TELEGRAM` | NOT RUN |
| PAY-002 | Payment frontend | Frontend user app running | Click Buy Template | Frontend calls static create endpoint only, stores PENDING order, redirects to static ABA link | NOT RUN |
| PAY-003 | Payment | Authenticated order owner | GET `/api/v1/template-payments/{orderCode}` | Owner sees order status; other user is rejected | NOT RUN |
| PAY-004 | Payment Telegram | Pending static order exists | POST valid telegram-detect payload with matching orderCode and USD 0.01 | Backend marks PAID and creates UserTemplateAccess | NOT RUN |
| PAY-005 | Payment Telegram | Pending static order exists | POST telegram-detect payload with wrong amount | Backend rejects amount mismatch and does not unlock template | NOT RUN |
| PAY-006 | Payment Telegram | No matching order | POST telegram-detect payload with unknown orderCode | Backend rejects order not found | NOT RUN |
| PAY-007 | Payment manual fallback | Pending order exists, admin secret configured | POST `/api/v1/admin/template-payments/confirm` with correct secret and amount | Backend marks PAID and creates access | NOT RUN |
| PAY-008 | Payment security | Missing or wrong admin secret | POST admin confirm or telegram-detect endpoint | Request is rejected with 401 or 403 | NOT RUN |
| PAY-009 | Payment access | PENDING or PAID_PENDING_REVIEW order exists | Check template access endpoint | Template access is false until status is PAID | NOT RUN |

## Telegram

| Test ID | Module | Preconditions | Request/UI steps | Expected result | Status |
|---|---|---|---|---|---|
| TLG-001 | Telegram | Webhook running in allowed group | Send `/id` | Bot replies with chat ID, sender ID, trust diagnostics | NOT RUN |
| TLG-002 | Telegram | Trusted ABA PayWay bot configured | Trusted bot posts `Payment received USD 0.01 Note: EVT260529001` | Bot calls backend telegram-detect endpoint | NOT RUN |
| TLG-003 | Telegram security | Normal user in allowed group | Normal user posts fake payment message | Bot ignores message for auto-confirm | NOT RUN |
| TLG-004 | Telegram security | Trusted bot configured | Trusted bot posts amount without order code | Bot does not call backend and asks for manual check | NOT RUN |
| TLG-005 | Telegram security | Trusted bot configured | Trusted bot posts wrong amount for known order | Backend rejects amount mismatch | NOT RUN |
| TLG-006 | Telegram fallback | Allowed admin configured | Admin sends `/paid EVT260529001 0.01` | Bot calls manual confirm endpoint with admin secret | NOT RUN |

## Security And Configuration

| Test ID | Module | Preconditions | Request/UI steps | Expected result | Status |
|---|---|---|---|---|---|
| SEC-001 | Secrets | Repository checkout | Search tracked files for real tokens, admin secrets, ABA keys, RSA private keys, DB passwords | No real secrets are committed; placeholders only | NOT RUN |
| SEC-002 | CORS | Backend running | Check configured origins and credential mode | No wildcard with credentials; expected frontend origins only | NOT RUN |
| SEC-003 | WAF | Backend running | Send path traversal, script tag, and oversized request payloads | WAF blocks malicious requests | NOT RUN |
| SEC-004 | Rate limit | Backend running | Send repeated auth/API requests above limit | Rate limit blocks excessive requests | NOT RUN |
| SEC-005 | Public DTO | Published invitation exists | GET public invitation endpoint | Response excludes internal userId, ownerName, owner email/phone, accessPassword | NOT RUN |
| SEC-006 | IDOR | Two users and private resources | User B accesses user A invitation/media/guest/payment order | Backend rejects unauthorized access | NOT RUN |
| SEC-007 | Upload validation | Backend running | Try empty file, unsafe filename, executable, mismatched MIME, too large file | Backend rejects invalid upload | NOT RUN |
| SEC-008 | XSS customization | Customization fields implemented | Submit script tags and javascript URLs | Backend or frontend rejects/escapes unsafe values | NOT RUN |
