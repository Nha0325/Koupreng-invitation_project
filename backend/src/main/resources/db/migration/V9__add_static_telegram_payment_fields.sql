SET @payment_link_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'payment_link'
);
SET @add_payment_link_column := IF(
    @payment_link_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN payment_link TEXT NULL AFTER checkout_url',
    'SELECT 1'
);
PREPARE add_payment_link_column_stmt FROM @add_payment_link_column;
EXECUTE add_payment_link_column_stmt;
DEALLOCATE PREPARE add_payment_link_column_stmt;

SET @payment_note_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'payment_note'
);
SET @add_payment_note_column := IF(
    @payment_note_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN payment_note VARCHAR(100) NULL AFTER payment_link',
    'SELECT 1'
);
PREPARE add_payment_note_column_stmt FROM @add_payment_note_column;
EXECUTE add_payment_note_column_stmt;
DEALLOCATE PREPARE add_payment_note_column_stmt;

SET @confirm_source_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'confirm_source'
);
SET @add_confirm_source_column := IF(
    @confirm_source_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN confirm_source VARCHAR(100) NULL AFTER payment_note',
    'SELECT 1'
);
PREPARE add_confirm_source_column_stmt FROM @add_confirm_source_column;
EXECUTE add_confirm_source_column_stmt;
DEALLOCATE PREPARE add_confirm_source_column_stmt;

SET @confirmed_by_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'confirmed_by'
);
SET @add_confirmed_by_column := IF(
    @confirmed_by_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN confirmed_by VARCHAR(100) NULL AFTER confirm_source',
    'SELECT 1'
);
PREPARE add_confirmed_by_column_stmt FROM @add_confirmed_by_column;
EXECUTE add_confirmed_by_column_stmt;
DEALLOCATE PREPARE add_confirmed_by_column_stmt;

SET @confirmed_at_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'confirmed_at'
);
SET @add_confirmed_at_column := IF(
    @confirmed_at_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN confirmed_at DATETIME(6) NULL AFTER confirmed_by',
    'SELECT 1'
);
PREPARE add_confirmed_at_column_stmt FROM @add_confirmed_at_column;
EXECUTE add_confirmed_at_column_stmt;
DEALLOCATE PREPARE add_confirmed_at_column_stmt;

SET @raw_telegram_message_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'raw_telegram_message'
);
SET @add_raw_telegram_message_column := IF(
    @raw_telegram_message_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN raw_telegram_message TEXT NULL AFTER expires_at',
    'SELECT 1'
);
PREPARE add_raw_telegram_message_column_stmt FROM @add_raw_telegram_message_column;
EXECUTE add_raw_telegram_message_column_stmt;
DEALLOCATE PREPARE add_raw_telegram_message_column_stmt;

SET @telegram_chat_id_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'telegram_chat_id'
);
SET @add_telegram_chat_id_column := IF(
    @telegram_chat_id_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN telegram_chat_id VARCHAR(100) NULL AFTER raw_telegram_message',
    'SELECT 1'
);
PREPARE add_telegram_chat_id_column_stmt FROM @add_telegram_chat_id_column;
EXECUTE add_telegram_chat_id_column_stmt;
DEALLOCATE PREPARE add_telegram_chat_id_column_stmt;

SET @telegram_message_id_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'telegram_message_id'
);
SET @add_telegram_message_id_column := IF(
    @telegram_message_id_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN telegram_message_id VARCHAR(100) NULL AFTER telegram_chat_id',
    'SELECT 1'
);
PREPARE add_telegram_message_id_column_stmt FROM @add_telegram_message_id_column;
EXECUTE add_telegram_message_id_column_stmt;
DEALLOCATE PREPARE add_telegram_message_id_column_stmt;

SET @telegram_sender_username_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'telegram_sender_username'
);
SET @add_telegram_sender_username_column := IF(
    @telegram_sender_username_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN telegram_sender_username VARCHAR(100) NULL AFTER telegram_message_id',
    'SELECT 1'
);
PREPARE add_telegram_sender_username_column_stmt FROM @add_telegram_sender_username_column;
EXECUTE add_telegram_sender_username_column_stmt;
DEALLOCATE PREPARE add_telegram_sender_username_column_stmt;

SET @telegram_sender_id_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'telegram_sender_id'
);
SET @add_telegram_sender_id_column := IF(
    @telegram_sender_id_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN telegram_sender_id VARCHAR(100) NULL AFTER telegram_sender_username',
    'SELECT 1'
);
PREPARE add_telegram_sender_id_column_stmt FROM @add_telegram_sender_id_column;
EXECUTE add_telegram_sender_id_column_stmt;
DEALLOCATE PREPARE add_telegram_sender_id_column_stmt;

SET @payway_approval_code_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'payway_approval_code'
);
SET @add_payway_approval_code_column := IF(
    @payway_approval_code_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN payway_approval_code VARCHAR(100) NULL AFTER payway_transaction_id',
    'SELECT 1'
);
PREPARE add_payway_approval_code_column_stmt FROM @add_payway_approval_code_column;
EXECUTE add_payway_approval_code_column_stmt;
DEALLOCATE PREPARE add_payway_approval_code_column_stmt;

SET @static_match_index_exists := (
    SELECT COUNT(*)
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND INDEX_NAME = 'idx_template_payment_orders_static_match'
);
SET @add_static_match_index := IF(
    @static_match_index_exists = 0,
    'ALTER TABLE template_payment_orders ADD INDEX idx_template_payment_orders_static_match (status, provider, currency, amount, created_at)',
    'SELECT 1'
);
PREPARE add_static_match_index_stmt FROM @add_static_match_index;
EXECUTE add_static_match_index_stmt;
DEALLOCATE PREPARE add_static_match_index_stmt;
