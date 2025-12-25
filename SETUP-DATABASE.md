# Neon Database Setup Guide

## Setting DATABASE_URL in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://neondb_owner:npg_3iksbn4YTxIW@ep-damp-wave-af3blftp-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application for changes to take effect

## Important Security Notes

⚠️ **NEVER** put DATABASE_URL in:
- Frontend JavaScript files
- Public repositories
- Client-side code
- HTML files

✅ **ALWAYS** keep DATABASE_URL in:
- Environment variables (Vercel dashboard)
- Server-side code only (API routes)
- `.env.local` for local development (not committed to git)

## Local Development

For local testing with Vercel CLI:

1. Install Vercel CLI: `npm i -g vercel`
2. Create a `.env.local` file in the root directory (copy from `.env.example`)
3. Add your DATABASE_URL to `.env.local`:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_3iksbn4YTxIW@ep-damp-wave-af3blftp-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
4. Run: `vercel dev` (this will use `.env.local` automatically)

**Important Security Notes:**
- ✅ `.env.local` is in `.gitignore` - it will NOT be committed to git
- ✅ `database.txt` has been deleted for security
- ❌ NEVER commit DATABASE_URL to git
- ❌ NEVER share your DATABASE_URL publicly

## Testing

1. After setting DATABASE_URL in Vercel, redeploy
2. Visit `/test-db.html`
3. Click "Test Database" to verify connection
4. Click "Save Demo User" to test insert operation

