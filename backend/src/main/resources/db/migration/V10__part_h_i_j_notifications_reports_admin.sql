-- Part H/I/J: notification management, reporting support, and admin audit logs.

ALTER TABLE notifications
    ADD COLUMN user_id BIGINT NULL AFTER notification_id,
    ADD COLUMN rsvp_id BIGINT NULL AFTER guest_id,
    ADD COLUMN payment_order_id BIGINT NULL AFTER rsvp_id,
    ADD COLUMN type VARCHAR(50) NULL AFTER payment_order_id,
    ADD COLUMN title VARCHAR(255) NULL AFTER status,
    ADD COLUMN message TEXT NULL AFTER title,
    ADD COLUMN recipient_name VARCHAR(255) NULL AFTER message,
    ADD COLUMN recipient_email VARCHAR(255) NULL AFTER recipient_name,
    ADD COLUMN recipient_phone VARCHAR(50) NULL AFTER recipient_email,
    ADD COLUMN recipient_telegram_id VARCHAR(100) NULL AFTER recipient_phone,
    ADD COLUMN provider_message_id VARCHAR(255) NULL AFTER recipient_telegram_id,
    ADD COLUMN error_message TEXT NULL AFTER provider_message_id,
    ADD COLUMN delivered_at DATETIME(6) NULL AFTER sent_at,
    ADD COLUMN read_at DATETIME(6) NULL AFTER delivered_at,
    ADD COLUMN created_at DATETIME(6) NULL AFTER read_at,
    ADD COLUMN updated_at DATETIME(6) NULL AFTER created_at;

UPDATE notifications
SET message = COALESCE(message, message_body),
    title = COALESCE(title, subject, 'Notification'),
    type = COALESCE(type, 'SYSTEM_ALERT'),
    status = COALESCE(NULLIF(status, ''), 'PENDING'),
    channel = COALESCE(NULLIF(channel, ''), 'SYSTEM'),
    created_at = COALESCE(created_at, scheduled_at, sent_at, CURRENT_TIMESTAMP(6)),
    updated_at = COALESCE(updated_at, sent_at, CURRENT_TIMESTAMP(6));

UPDATE notifications n
JOIN invitations i ON i.invitation_id = n.invitation_id
SET n.user_id = COALESCE(n.user_id, i.user_id);

ALTER TABLE notifications
    MODIFY invitation_id BIGINT NULL,
    MODIFY type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM_ALERT',
    MODIFY channel VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    MODIFY status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    MODIFY title VARCHAR(255) NOT NULL DEFAULT 'Notification',
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_notifications_rsvp FOREIGN KEY (rsvp_id) REFERENCES rsvps(rsvp_id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_notifications_payment_order FOREIGN KEY (payment_order_id) REFERENCES template_payment_orders(id) ON DELETE SET NULL;

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_invitation_id ON notifications (invitation_id);
CREATE INDEX idx_notifications_guest_id ON notifications (guest_id);
CREATE INDEX idx_notifications_status ON notifications (status);
CREATE INDEX idx_notifications_type ON notifications (type);
CREATE INDEX idx_notifications_created_at ON notifications (created_at);

ALTER TABLE invitations
    ADD COLUMN moderation_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' AFTER status;

ALTER TABLE guests
    ADD COLUMN seat_count INT NULL AFTER table_number,
    ADD COLUMN last_sent_at DATETIME(6) NULL AFTER seat_count,
    ADD COLUMN last_reminder_at DATETIME(6) NULL AFTER last_sent_at,
    ADD COLUMN reminder_count INT NULL DEFAULT 0 AFTER last_reminder_at,
    ADD COLUMN last_send_channel VARCHAR(50) NULL AFTER reminder_count,
    ADD COLUMN last_send_error VARCHAR(1000) NULL AFTER last_send_channel;

UPDATE guests
SET reminder_count = COALESCE(reminder_count, 0);

CREATE TABLE IF NOT EXISTS invitation_delivery_events (
    delivery_event_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NULL,
    status VARCHAR(50) NULL,
    error_message VARCHAR(1000) NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_delivery_events_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_delivery_events_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE,
    INDEX idx_delivery_events_invitation_id (invitation_id),
    INDEX idx_delivery_events_guest_id (guest_id),
    INDEX idx_delivery_events_event_type (event_type),
    INDEX idx_delivery_events_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS system_audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_user_id BIGINT NULL,
    actor_email VARCHAR(255) NULL,
    action VARCHAR(120) NOT NULL,
    resource_type VARCHAR(100) NULL,
    resource_id BIGINT NULL,
    description TEXT NULL,
    ip_address VARCHAR(100) NULL,
    user_agent VARCHAR(500) NULL,
    metadata_json TEXT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_system_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_system_audit_actor_user_id (actor_user_id),
    INDEX idx_system_audit_action (action),
    INDEX idx_system_audit_resource (resource_type, resource_id),
    INDEX idx_system_audit_created_at (created_at)
);
