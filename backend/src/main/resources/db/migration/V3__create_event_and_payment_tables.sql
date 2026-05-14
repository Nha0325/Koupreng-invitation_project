-- V3__create_event_and_payment_tables.sql

-- Templates
CREATE TABLE templates (
    template_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    thumbnail_url VARCHAR(1000),
    preview_url VARCHAR(1000),
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20),
    created_at DATETIME(6)
);

-- Invitations
CREATE TABLE invitations (
    invitation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    template_id BIGINT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    event_type VARCHAR(50),
    event_date DATE,
    event_time TIME,
    venue_name VARCHAR(255),
    venue_address VARCHAR(1000),
    google_map_url VARCHAR(1000),
    host_name VARCHAR(255),
    partner_name VARCHAR(255),
    groom_name VARCHAR(255),
    bride_name VARCHAR(255),
    groom_father_name VARCHAR(255),
    groom_mother_name VARCHAR(255),
    bride_father_name VARCHAR(255),
    bride_mother_name VARCHAR(255),
    story_text TEXT,
    language_mode VARCHAR(20),
    visibility VARCHAR(20),
    access_password VARCHAR(255),
    rsvp_deadline DATE,
    status VARCHAR(20),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_invitations_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_invitations_template FOREIGN KEY (template_id) REFERENCES templates(template_id) ON DELETE SET NULL
);

-- Invitation Sections
CREATE TABLE invitation_sections (
    section_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    section_key VARCHAR(50) NOT NULL,
    section_title VARCHAR(255),
    content_json JSON,
    sort_order INT,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_sections_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE
);

-- Media Files
CREATE TABLE media_files (
    media_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    media_type VARCHAR(50),
    file_url VARCHAR(1000),
    public_id VARCHAR(255),
    sort_order INT,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6),
    CONSTRAINT fk_media_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE
);

-- Guests
CREATE TABLE guests (
    guest_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    email VARCHAR(255),
    guest_group VARCHAR(255),
    side_type VARCHAR(255),
    table_number VARCHAR(255),
    invite_token VARCHAR(255) UNIQUE,
    qr_code_url VARCHAR(1000),
    send_status VARCHAR(50),
    invitation_viewed_at DATETIME(6),
    contribution_status VARCHAR(50),
    total_contributed DECIMAL(10,2),
    created_at DATETIME(6),
    CONSTRAINT fk_guests_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE
);

-- RSVPs
CREATE TABLE rsvps (
    rsvp_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT,
    response_status VARCHAR(50),
    attendee_count INT,
    message TEXT,
    responded_at DATETIME(6),
    CONSTRAINT fk_rsvps_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_rsvps_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE SET NULL
);

-- Notifications
CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT,
    channel VARCHAR(50),
    subject VARCHAR(255),
    message_body TEXT,
    scheduled_at DATETIME(6),
    sent_at DATETIME(6),
    status VARCHAR(50),
    CONSTRAINT fk_notifications_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE SET NULL
);

-- Budgets
CREATE TABLE budgets (
    budget_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL UNIQUE,
    total_budget DECIMAL(12,2),
    notes TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_budgets_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE
);

-- Budget Items
CREATE TABLE budget_items (
    budget_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    budget_id BIGINT NOT NULL,
    category VARCHAR(100),
    item_name VARCHAR(255) NOT NULL,
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    vendor_name VARCHAR(255),
    notes TEXT,
    CONSTRAINT fk_budget_items_budget FOREIGN KEY (budget_id) REFERENCES budgets(budget_id) ON DELETE CASCADE
);

-- Packages
CREATE TABLE packages (
    package_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    duration_days INT,
    max_invitations INT,
    max_guests INT,
    features_json JSON,
    status VARCHAR(50)
);

-- Subscriptions
CREATE TABLE subscriptions (
    subscription_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    package_id BIGINT NOT NULL,
    start_date DATETIME(6),
    end_date DATETIME(6),
    payment_status VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6),
    CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_package FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE
);

-- Audit Logs
CREATE TABLE audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(100),
    target_id BIGINT,
    details TEXT,
    created_at DATETIME(6),
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Payment Configs
CREATE TABLE payment_configs (
    payment_config_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL UNIQUE,
    provider VARCHAR(50),
    payment_mode VARCHAR(50),
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    is_fixed_amount BOOLEAN NOT NULL DEFAULT FALSE,
    fixed_amount DECIMAL(12,2),
    min_amount DECIMAL(12,2),
    max_amount DECIMAL(12,2),
    currency VARCHAR(10),
    allow_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    organizer_label VARCHAR(255),
    success_message TEXT,
    telegram_notify_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    telegram_chat_id VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_payment_configs_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE
);

-- Payment Transactions
CREATE TABLE payment_transactions (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT,
    payment_config_id BIGINT NOT NULL,
    payer_name VARCHAR(255),
    payer_message TEXT,
    merchant_ref_no VARCHAR(255) UNIQUE,
    payway_transaction_id VARCHAR(255),
    channel VARCHAR(50),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    qr_payload TEXT,
    payment_link VARCHAR(1000),
    status VARCHAR(50),
    requested_at DATETIME(6),
    paid_at DATETIME(6),
    expired_at DATETIME(6),
    callback_received BOOLEAN NOT NULL DEFAULT FALSE,
    raw_callback_json JSON,
    verification_response_json JSON,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_payment_tx_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_tx_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE SET NULL,
    CONSTRAINT fk_payment_tx_config FOREIGN KEY (payment_config_id) REFERENCES payment_configs(payment_config_id) ON DELETE CASCADE
);

-- Payment Webhook Logs
CREATE TABLE payment_webhook_logs (
    webhook_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT,
    provider VARCHAR(50),
    event_type VARCHAR(100),
    request_headers TEXT,
    request_body TEXT,
    received_at DATETIME(6),
    processed_status VARCHAR(50),
    processing_note TEXT,
    CONSTRAINT fk_webhook_payment FOREIGN KEY (payment_id) REFERENCES payment_transactions(payment_id) ON DELETE SET NULL
);

-- Telegram Notifications
CREATE TABLE telegram_notifications (
    telegram_notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    chat_id VARCHAR(255) NOT NULL,
    message_text TEXT NOT NULL,
    status VARCHAR(50),
    sent_at DATETIME(6),
    response_json JSON,
    created_at DATETIME(6),
    CONSTRAINT fk_telegram_payment FOREIGN KEY (payment_id) REFERENCES payment_transactions(payment_id) ON DELETE CASCADE
);

-- Organizer Payout Accounts
CREATE TABLE organizer_payout_accounts (
    payout_account_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider VARCHAR(50),
    merchant_id VARCHAR(255),
    merchant_name VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_payout_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
