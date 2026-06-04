-- NOTE: Adds delivery preparation fields to guests for Feature F.
ALTER TABLE guests
ADD COLUMN seat_count INT NULL,
ADD COLUMN last_sent_at DATETIME(6) NULL,
ADD COLUMN last_reminder_at DATETIME(6) NULL,
ADD COLUMN reminder_count INT DEFAULT 0,
ADD COLUMN last_send_channel VARCHAR(50) NULL,
ADD COLUMN last_send_error VARCHAR(1000) NULL;

-- NOTE: Stores sending/link/email/reminder audit history for Feature F.
CREATE TABLE IF NOT EXISTS invitation_delivery_events (
    delivery_event_id BIGINT NOT NULL AUTO_INCREMENT,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT NULL,
    event_type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NULL,
    status VARCHAR(50) NULL,
    message TEXT NULL,
    error_message VARCHAR(1000) NULL,
    created_at DATETIME(6) NULL,
    PRIMARY KEY (delivery_event_id),
    INDEX idx_delivery_events_invitation_id (invitation_id),
    INDEX idx_delivery_events_guest_id (guest_id),
    CONSTRAINT fk_delivery_events_invitation
        FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id),
    CONSTRAINT fk_delivery_events_guest
        FOREIGN KEY (guest_id)
        REFERENCES guests (guest_id)
);