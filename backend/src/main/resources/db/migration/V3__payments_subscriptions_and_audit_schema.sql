-- Subscription, template-purchase, contribution payment, webhook, payout, and audit tables.

CREATE TABLE packages (
    package_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    billing_interval VARCHAR(30) NOT NULL DEFAULT 'ONCE',
    duration_days INT NULL,
    max_invitations INT NULL,
    max_guests INT NULL,
    max_guests_per_invitation INT NULL,
    max_team_members INT NULL,
    features_json JSON NULL,
    status VARCHAR(50) NULL,
    premium_templates_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    qr_invitations_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    qr_check_in_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    seating_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    advanced_analytics_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    custom_branding_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    team_members_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ai_assistant_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT uk_packages_code UNIQUE (code)
);

CREATE INDEX idx_packages_active_sort_price ON packages (active, sort_order, price);
CREATE INDEX idx_packages_status ON packages (status);

CREATE TABLE subscriptions (
    subscription_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    package_id BIGINT NOT NULL,
    start_date DATETIME(6) NULL,
    end_date DATETIME(6) NULL,
    order_code VARCHAR(50) NULL,
    amount DECIMAL(10,2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    provider VARCHAR(80) NULL,
    payment_link TEXT NULL,
    payment_note VARCHAR(120) NULL,
    payment_status VARCHAR(50) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_PAYMENT',
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT uk_subscriptions_order_code UNIQUE (order_code),
    CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_package FOREIGN KEY (package_id)
        REFERENCES packages (package_id) ON DELETE CASCADE
);

CREATE INDEX idx_subscriptions_user_active ON subscriptions (user_id, is_active, end_date);
CREATE INDEX idx_subscriptions_user_created ON subscriptions (user_id, created_at);
CREATE INDEX idx_subscriptions_package ON subscriptions (package_id);

CREATE TABLE template_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_link TEXT NOT NULL,
    payment_note VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_provider VARCHAR(50) NOT NULL DEFAULT 'ABA_PAYWAY_STATIC',
    confirm_source VARCHAR(100) NULL,
    confirmed_by VARCHAR(100) NULL,
    confirmed_at DATETIME(6) NULL,
    paid_at DATETIME(6) NULL,
    expires_at DATETIME(6) NULL,
    raw_telegram_message TEXT NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT uk_template_orders_order_code UNIQUE (order_code),
    CONSTRAINT fk_template_orders_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_template_orders_user_created ON template_orders (user_id, created_at);
CREATE INDEX idx_template_orders_status_created ON template_orders (status, created_at);
CREATE INDEX idx_template_orders_expires_at ON template_orders (expires_at);

CREATE TABLE template_payment_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    user_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    provider VARCHAR(50) NOT NULL DEFAULT 'ABA_PAYWAY_DYNAMIC_QR_SANDBOX',
    qr_string TEXT NULL,
    qr_image_url TEXT NULL,
    payway_request_json TEXT NULL,
    payway_response_json TEXT NULL,
    callback_raw_json TEXT NULL,
    payway_status VARCHAR(100) NULL,
    payway_transaction_id VARCHAR(255) NULL,
    checkout_url TEXT NULL,
    payment_link TEXT NULL,
    payment_note VARCHAR(100) NULL,
    confirm_source VARCHAR(100) NULL,
    confirmed_by VARCHAR(100) NULL,
    confirmed_at DATETIME(6) NULL,
    paid_at DATETIME(6) NULL,
    expires_at DATETIME(6) NULL,
    raw_telegram_message TEXT NULL,
    telegram_chat_id VARCHAR(100) NULL,
    telegram_message_id VARCHAR(100) NULL,
    telegram_sender_username VARCHAR(100) NULL,
    telegram_sender_id VARCHAR(100) NULL,
    payway_approval_code VARCHAR(100) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT uk_template_payment_orders_order_code UNIQUE (order_code),
    CONSTRAINT uk_template_payment_orders_transaction_id UNIQUE (transaction_id),
    CONSTRAINT fk_template_payment_orders_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_template_payment_orders_user_created ON template_payment_orders (user_id, created_at);
CREATE INDEX idx_template_payment_orders_status_created ON template_payment_orders (status, created_at);
CREATE INDEX idx_template_payment_orders_status_expires ON template_payment_orders (status, expires_at);
CREATE INDEX idx_template_payment_orders_static_match ON template_payment_orders (status, provider, currency, amount, created_at);

CREATE TABLE user_template_access (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    template_payment_order_id BIGINT NULL,
    access_type VARCHAR(50) NOT NULL DEFAULT 'PURCHASED',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NULL,
    CONSTRAINT fk_user_template_access_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_user_template_access_user_active ON user_template_access (user_id, active);
CREATE INDEX idx_user_template_access_user_template_active ON user_template_access (user_id, template_id, active);
CREATE INDEX idx_user_template_access_template_payment_order ON user_template_access (template_payment_order_id);

ALTER TABLE notifications
    ADD CONSTRAINT fk_notifications_payment_order FOREIGN KEY (payment_order_id)
        REFERENCES template_payment_orders (id) ON DELETE SET NULL;

CREATE TABLE payment_configs (
    payment_config_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    provider VARCHAR(50) NULL,
    payment_mode VARCHAR(50) NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    is_fixed_amount BOOLEAN NOT NULL DEFAULT FALSE,
    fixed_amount DECIMAL(12,2) NULL,
    min_amount DECIMAL(12,2) NULL,
    max_amount DECIMAL(12,2) NULL,
    currency VARCHAR(10) NULL,
    allow_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    organizer_label VARCHAR(255) NULL,
    success_message TEXT NULL,
    telegram_notify_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    telegram_chat_id VARCHAR(255) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT uk_payment_configs_invitation UNIQUE (invitation_id),
    CONSTRAINT fk_payment_configs_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE
);

CREATE TABLE payment_transactions (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT NULL,
    payment_config_id BIGINT NOT NULL,
    payer_name VARCHAR(255) NULL,
    payer_message TEXT NULL,
    merchant_ref_no VARCHAR(255) NULL,
    payway_transaction_id VARCHAR(255) NULL,
    channel VARCHAR(50) NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    qr_payload TEXT NULL,
    payment_link VARCHAR(1000) NULL,
    status VARCHAR(50) NULL,
    requested_at DATETIME(6) NULL,
    paid_at DATETIME(6) NULL,
    expired_at DATETIME(6) NULL,
    callback_received BOOLEAN NOT NULL DEFAULT FALSE,
    raw_callback_json JSON NULL,
    verification_response_json JSON NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT uk_payment_transactions_merchant_ref_no UNIQUE (merchant_ref_no),
    CONSTRAINT fk_payment_transactions_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_transactions_guest FOREIGN KEY (guest_id)
        REFERENCES guests (guest_id) ON DELETE SET NULL,
    CONSTRAINT fk_payment_transactions_config FOREIGN KEY (payment_config_id)
        REFERENCES payment_configs (payment_config_id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_transactions_invitation_status ON payment_transactions (invitation_id, status);
CREATE INDEX idx_payment_transactions_guest ON payment_transactions (guest_id);
CREATE INDEX idx_payment_transactions_config ON payment_transactions (payment_config_id);
CREATE INDEX idx_payment_transactions_payway_transaction ON payment_transactions (payway_transaction_id);

CREATE TABLE payment_webhook_logs (
    webhook_log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NULL,
    provider VARCHAR(50) NULL,
    event_type VARCHAR(100) NULL,
    request_headers TEXT NULL,
    request_body TEXT NULL,
    received_at DATETIME(6) NULL,
    processed_status VARCHAR(50) NULL,
    processing_note TEXT NULL,
    CONSTRAINT fk_payment_webhook_logs_payment FOREIGN KEY (payment_id)
        REFERENCES payment_transactions (payment_id) ON DELETE SET NULL
);

CREATE INDEX idx_payment_webhook_logs_payment ON payment_webhook_logs (payment_id);
CREATE INDEX idx_payment_webhook_logs_provider_event ON payment_webhook_logs (provider, event_type);

CREATE TABLE telegram_notifications (
    telegram_notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    chat_id VARCHAR(255) NOT NULL,
    message_text TEXT NOT NULL,
    status VARCHAR(50) NULL,
    sent_at DATETIME(6) NULL,
    response_json JSON NULL,
    created_at DATETIME(6) NULL,
    CONSTRAINT fk_telegram_notifications_payment FOREIGN KEY (payment_id)
        REFERENCES payment_transactions (payment_id) ON DELETE CASCADE
);

CREATE INDEX idx_telegram_notifications_payment ON telegram_notifications (payment_id);
CREATE INDEX idx_telegram_notifications_status ON telegram_notifications (status);

CREATE TABLE organizer_payout_accounts (
    payout_account_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider VARCHAR(50) NULL,
    merchant_id VARCHAR(255) NULL,
    merchant_name VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT fk_organizer_payout_accounts_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_organizer_payout_accounts_user_active ON organizer_payout_accounts (user_id, is_active);

CREATE TABLE audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(100) NULL,
    target_id BIGINT NULL,
    details TEXT NULL,
    created_at DATETIME(6) NULL,
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_user_created ON audit_logs (user_id, created_at);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);
CREATE INDEX idx_audit_logs_target ON audit_logs (target_type, target_id);

CREATE TABLE system_audit_logs (
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
    created_at DATETIME(6) NULL,
    CONSTRAINT fk_system_audit_logs_actor FOREIGN KEY (actor_user_id)
        REFERENCES users (user_id) ON DELETE SET NULL
);

CREATE INDEX idx_system_audit_logs_created_at ON system_audit_logs (created_at);
CREATE INDEX idx_system_audit_logs_actor ON system_audit_logs (actor_user_id);
CREATE INDEX idx_system_audit_logs_resource ON system_audit_logs (resource_type, resource_id);
