-- Seed Royal Khmer Wedding template
INSERT INTO templates (name, code, category, description, thumbnail_url, preview_url, is_premium, price, currency, status, sort_order, created_at, updated_at)
SELECT 'Royal Khmer Wedding', 'royal-khmer-wedding', 'TRADITIONAL', 'Elegant traditional Cambodian wedding template with Royal Khmer aesthetics.', '/facebook/all/01-card/cover-card.jpg', '/templates/royal-khmer-wedding', FALSE, 0.00, 'USD', 'ACTIVE', 0, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'royal-khmer-wedding');
