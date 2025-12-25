-- ============================================
-- SIMPLE VERSION - Just create the table
-- Copy and paste this into Neon SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    device VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_visit_time ON users(visit_time DESC);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
