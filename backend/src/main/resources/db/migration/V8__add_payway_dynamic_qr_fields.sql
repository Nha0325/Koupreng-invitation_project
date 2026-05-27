SET @qr_string_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'qr_string'
);
SET @add_qr_string_column := IF(
    @qr_string_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN qr_string TEXT NULL AFTER provider',
    'SELECT 1'
);
PREPARE add_qr_string_column_stmt FROM @add_qr_string_column;
EXECUTE add_qr_string_column_stmt;
DEALLOCATE PREPARE add_qr_string_column_stmt;

SET @qr_image_url_column_exists := (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'template_payment_orders'
      AND COLUMN_NAME = 'qr_image_url'
);
SET @add_qr_image_url_column := IF(
    @qr_image_url_column_exists = 0,
    'ALTER TABLE template_payment_orders ADD COLUMN qr_image_url TEXT NULL AFTER qr_string',
    'SELECT 1'
);
PREPARE add_qr_image_url_column_stmt FROM @add_qr_image_url_column;
EXECUTE add_qr_image_url_column_stmt;
DEALLOCATE PREPARE add_qr_image_url_column_stmt;

ALTER TABLE template_payment_orders
    MODIFY COLUMN provider VARCHAR(50) NOT NULL DEFAULT 'ABA_PAYWAY_DYNAMIC_QR_SANDBOX';

UPDATE template_payment_orders
SET provider = 'ABA_PAYWAY_DYNAMIC_QR_SANDBOX'
WHERE provider IS NULL
   OR provider = ''
   OR provider = 'ABA_PAYWAY_SANDBOX';

ALTER TABLE user_template_access
    MODIFY COLUMN template_payment_order_id BIGINT NULL;

UPDATE user_template_access uta
LEFT JOIN template_payment_orders tpo ON tpo.id = uta.template_payment_order_id
SET uta.template_payment_order_id = NULL
WHERE uta.template_payment_order_id IS NOT NULL
  AND tpo.id IS NULL;
