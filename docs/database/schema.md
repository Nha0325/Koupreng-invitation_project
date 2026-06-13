# Database Schema

Verified entity groups:
- User: `users`, password reset tokens.
- Invitation: `invitations`, guests, RSVPs, media files, tables, seat assignments, check-ins.
- Budget: budgets and budget items.
- Gift: wedding gifts.
- Delivery: invitation delivery events.
- Notification: notifications.
- Payment/subscription: payment orders, transactions, subscriptions, packages.
- Organization: organizations and members.

Invitation relationships verified from entities:
- `guests.invitation_id -> invitations.invitation_id`
- `rsvps.invitation_id -> invitations.invitation_id`
- `media_files.invitation_id -> invitations.invitation_id`
- `wedding_gifts.invitation_id -> invitations.invitation_id`
- `invitation_delivery_events.invitation_id -> invitations.invitation_id`
- `notifications.invitation_id -> invitations.invitation_id`
- `guest_check_ins.invitation_id -> invitations.invitation_id`
- `guest_seat_assignments.invitation_id -> invitations.invitation_id`
- `event_tables.invitation_id -> invitations.invitation_id`

Insufficient data to verify:
- Exact SQL DDL for every table from this document alone.
