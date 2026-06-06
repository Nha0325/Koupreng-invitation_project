-- Add the remaining standalone indexes expected by the legacy events module.

CREATE INDEX idx_events_deleted ON events (deleted);
CREATE INDEX idx_events_created_at ON events (created_at);
