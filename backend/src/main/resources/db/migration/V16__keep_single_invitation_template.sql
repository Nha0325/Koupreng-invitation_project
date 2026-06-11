-- Keep only Garden Royal Khmer Wedding active while preserving history.

INSERT INTO templates (
    name, code, category, description, thumbnail_url, preview_url,
    is_premium, price, currency, status, sort_order, created_at, updated_at
)
SELECT 'Garden Royal Khmer Wedding',
       'garden-royal-khmer-wedding',
       'TRADITIONAL',
       'Elegant watercolor garden traditional Cambodian wedding template with soft blue and green floral aesthetics.',
       '/facebook/all/03-card/cover-card.jpg',
       '/templates/garden-royal-khmer-wedding',
       FALSE,
       0.00,
       'USD',
       'ACTIVE',
       0,
       NOW(6),
       NOW(6)
WHERE NOT EXISTS (
    SELECT 1 FROM templates WHERE code = 'garden-royal-khmer-wedding'
);

UPDATE templates
SET category = 'TRADITIONAL',
    status = 'ACTIVE',
    is_premium = FALSE,
    price = 0.00,
    currency = 'USD',
    sort_order = 0,
    thumbnail_url = '/facebook/all/03-card/cover-card.jpg',
    preview_url = '/templates/garden-royal-khmer-wedding',
    updated_at = NOW(6)
WHERE code = 'garden-royal-khmer-wedding';

SET @kept_template_id = (
    SELECT template_id
    FROM templates
    WHERE code = 'garden-royal-khmer-wedding'
    LIMIT 1
);

UPDATE invitations
SET template_id = @kept_template_id,
    updated_at = NOW(6)
WHERE @kept_template_id IS NOT NULL
  AND (template_id IS NULL OR template_id <> @kept_template_id);

UPDATE template_orders
SET template_id = @kept_template_id,
    template_name = 'Garden Royal Khmer Wedding',
    updated_at = NOW(6)
WHERE @kept_template_id IS NOT NULL
  AND (template_id IS NULL OR template_id <> @kept_template_id);

UPDATE template_payment_orders
SET template_id = @kept_template_id,
    template_name = 'Garden Royal Khmer Wedding',
    updated_at = NOW(6)
WHERE @kept_template_id IS NOT NULL
  AND (template_id IS NULL OR template_id <> @kept_template_id);

UPDATE user_template_access
SET template_id = @kept_template_id
WHERE @kept_template_id IS NOT NULL
  AND (template_id IS NULL OR template_id <> @kept_template_id);

UPDATE templates
SET status = 'INACTIVE',
    updated_at = NOW(6)
WHERE code <> 'garden-royal-khmer-wedding';
