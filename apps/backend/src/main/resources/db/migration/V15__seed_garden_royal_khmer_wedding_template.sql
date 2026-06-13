-- Seed Garden Royal Khmer Wedding template
INSERT INTO templates (name, code, category, description, thumbnail_url, preview_url, is_premium, price, currency, status, sort_order, created_at, updated_at)
SELECT 'Garden Royal Khmer Wedding', 'garden-royal-khmer-wedding', 'TRADITIONAL', 'Elegant watercolor garden traditional Cambodian wedding template with soft blue and green floral aesthetics.', '/facebook/all/03-card/cover-card.jpg', '/templates/garden-royal-khmer-wedding', FALSE, 0.00, 'USD', 'ACTIVE', 0, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'garden-royal-khmer-wedding');
