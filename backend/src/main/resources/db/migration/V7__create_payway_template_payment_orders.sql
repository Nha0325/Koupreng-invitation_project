CREATE TABLE IF NOT EXISTS template_payment_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) NOT NULL UNIQUE,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    template_id BIGINT NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    package_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'ABA_PAYWAY_SANDBOX',
    payway_request_json TEXT NULL,
    payway_response_json TEXT NULL,
    callback_raw_json TEXT NULL,
    payway_status VARCHAR(100) NULL,
    payway_transaction_id VARCHAR(255) NULL,
    checkout_url TEXT NULL,
    paid_at DATETIME(6) NULL,
    expires_at DATETIME(6) NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_template_payment_orders_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_template_payment_orders_user_id (user_id),
    INDEX idx_template_payment_orders_status (status),
    INDEX idx_template_payment_orders_order_code (order_code),
    INDEX idx_template_payment_orders_transaction_id (transaction_id),
    INDEX idx_template_payment_orders_template_id (template_id),
    INDEX idx_template_payment_orders_expires_at (expires_at)
);

SET @old_access_fk := (
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'user_template_access'
      AND COLUMN_NAME = 'order_id'
      AND REFERENCED_TABLE_NAME = 'template_orders'
    LIMIT 1
);
SET @drop_old_access_fk := IF(
    @old_access_fk IS NULL,
    'SELECT 1',
    CONCAT('ALTER TABLE user_template_access DROP FOREIGN KEY ', @old_access_fk)
);
PREPARE drop_old_access_fk_stmt FROM @drop_old_access_fk;
EXECUTE drop_old_access_fk_stmt;
DEALLOCATE PREPARE drop_old_access_fk_stmt;

ALTER TABLE user_template_access
    MODIFY COLUMN order_id BIGINT NULL;

SET @access_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'user_template_access'
      AND COLUMN_NAME = 'template_payment_order_id'
);
SET @add_access_column := IF(
    @access_column_exists = 0,
    'ALTER TABLE user_template_access ADD COLUMN template_payment_order_id BIGINT NULL',
    'SELECT 1'
);
PREPARE add_access_column_stmt FROM @add_access_column;
EXECUTE add_access_column_stmt;
DEALLOCATE PREPARE add_access_column_stmt;

ALTER TABLE user_template_access
    MODIFY COLUMN template_payment_order_id BIGINT NULL;

UPDATE user_template_access uta
LEFT JOIN template_payment_orders tpo ON tpo.id = uta.template_payment_order_id
SET uta.template_payment_order_id = NULL
WHERE uta.template_payment_order_id IS NOT NULL
  AND tpo.id IS NULL;

SET @old_access_fk_exists := (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'user_template_access'
      AND CONSTRAINT_NAME = 'fk_user_template_access_old_order'
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);
SET @add_old_access_fk := IF(
    @old_access_fk_exists = 0,
    'ALTER TABLE user_template_access ADD CONSTRAINT fk_user_template_access_old_order FOREIGN KEY (order_id) REFERENCES template_orders(id) ON DELETE SET NULL',
    'SELECT 1'
);
PREPARE add_old_access_fk_stmt FROM @add_old_access_fk;
EXECUTE add_old_access_fk_stmt;
DEALLOCATE PREPARE add_old_access_fk_stmt;

SET @payway_access_fk_exists := (
    SELECT COUNT(*)
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'user_template_access'
      AND CONSTRAINT_NAME = 'fk_user_template_access_template_payment_order'
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);
SET @add_payway_access_fk := IF(
    @payway_access_fk_exists = 0,
    'ALTER TABLE user_template_access ADD CONSTRAINT fk_user_template_access_template_payment_order FOREIGN KEY (template_payment_order_id) REFERENCES template_payment_orders(id) ON DELETE CASCADE',
    'SELECT 1'
);
PREPARE add_payway_access_fk_stmt FROM @add_payway_access_fk;
EXECUTE add_payway_access_fk_stmt;
DEALLOCATE PREPARE add_payway_access_fk_stmt;

SET @payway_access_index_exists := (
    SELECT COUNT(*)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'user_template_access'
      AND INDEX_NAME = 'idx_user_template_access_template_payment_order_id'
);
SET @add_payway_access_index := IF(
    @payway_access_index_exists = 0,
    'ALTER TABLE user_template_access ADD INDEX idx_user_template_access_template_payment_order_id (template_payment_order_id)',
    'SELECT 1'
);
PREPARE add_payway_access_index_stmt FROM @add_payway_access_index;
EXECUTE add_payway_access_index_stmt;
DEALLOCATE PREPARE add_payway_access_index_stmt;
