-- MVP static ABA PayWay template/package payment orders.
-- This is not official ABA webhook integration; admin/Telegram confirmation controls PAID status.

CREATE TABLE IF NOT EXISTS template_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_link TEXT NOT NULL,
    payment_note VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_provider VARCHAR(50) NOT NULL DEFAULT 'ABA_PAYWAY_STATIC',
    confirm_source VARCHAR(100) NULL,
    confirmed_by VARCHAR(100) NULL,
    confirmed_at DATETIME(6) NULL,
    paid_at DATETIME(6) NULL,
    expires_at DATETIME(6) NULL,
    raw_telegram_message TEXT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_template_orders_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_template_orders_user_id (user_id),
    INDEX idx_template_orders_status (status),
    INDEX idx_template_orders_order_code (order_code),
    INDEX idx_template_orders_template_id (template_id),
    INDEX idx_template_orders_expires_at (expires_at)
);

CREATE TABLE IF NOT EXISTS user_template_access (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    access_type VARCHAR(50) NOT NULL DEFAULT 'PURCHASED',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_user_template_access_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_template_access_order FOREIGN KEY (order_id) REFERENCES template_orders(id) ON DELETE CASCADE,
    INDEX idx_user_template_access_user_id (user_id),
    INDEX idx_user_template_access_template_id (template_id),
    UNIQUE KEY uq_user_template_access_user_template_order (user_id, template_id, order_id)
);
