-- ============================================
-- NEON POSTGRESQL DATABASE SCHEMA
-- Run this SQL in Neon SQL Editor
-- ============================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    device VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on visit_time for faster queries
CREATE INDEX IF NOT EXISTS idx_users_visit_time ON users(visit_time DESC);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- Optional: Add some sample data for testing
-- INSERT INTO users (name, device, latitude, longitude, visit_time)
-- VALUES 
--     ('Demo User 1', 'Chrome Browser', 28.6139, 77.2090, CURRENT_TIMESTAMP),
--     ('Demo User 2', 'Safari Browser', 19.0760, 72.8777, CURRENT_TIMESTAMP),
--     ('Demo User 3', 'Firefox Browser', 12.9716, 77.5946, CURRENT_TIMESTAMP);

-- Verify table creation
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Check if table was created successfully
SELECT COUNT(*) as table_exists 
FROM information_schema.tables 
WHERE table_name = 'users';
