# Neon PostgreSQL Database Setup

## Quick Setup

### Option 1: Run SQL in Neon Dashboard (Recommended)

1. Go to your Neon Dashboard: https://console.neon.tech
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Copy and paste the contents of `database-schema.sql`
5. Click "Run" to execute the SQL

### Option 2: Use Neon CLI

```bash
# Install Neon CLI (if not installed)
npm install -g neonctl

# Connect to your database
neonctl connection-string --project-id YOUR_PROJECT_ID

# Run the SQL file
psql YOUR_CONNECTION_STRING -f database-schema.sql
```

## Table Structure

The `users` table has the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Auto-incrementing unique ID |
| `name` | VARCHAR(255) NOT NULL | User's name (required) |
| `device` | VARCHAR(255) | Device/browser information |
| `latitude` | DECIMAL(10, 8) | GPS latitude coordinate |
| `longitude` | DECIMAL(11, 8) | GPS longitude coordinate |
| `visit_time` | TIMESTAMP | When user visited (defaults to now) |
| `created_at` | TIMESTAMP | Record creation time (defaults to now) |

## Indexes Created

- `idx_users_visit_time` - For fast queries sorted by visit time
- `idx_users_name` - For fast lookups by name

## Testing the Connection

After creating the table:

1. Open `test-db.html` in your browser
2. Click "Test Database" to verify connection
3. Click "Save Demo User" to insert test data
4. Click "Load Users" to see the data

## Environment Variable

Make sure `DATABASE_URL` is set in Vercel:

```
DATABASE_URL=postgresql://neondb_owner:***@ep-damp-wave-af3blftp-pooler.c-2.us-west-2.aws.neon.tech/neondb
```

## Notes

- The table is created with `IF NOT EXISTS` so it's safe to run multiple times
- Indexes are also created with `IF NOT EXISTS`
- The API will automatically create the table if it doesn't exist, but it's better to create it manually first
