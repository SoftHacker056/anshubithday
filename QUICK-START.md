# 🚀 Quick Start Guide

## The Problem
You're seeing `Cannot GET /api/test-db` because:
- ❌ Live Server (`http://127.0.0.1:5500`) can't run Vercel serverless functions
- ✅ You need Vercel CLI to test API routes locally

## ✅ Solution: 3 Simple Steps

### Step 1: Install Vercel CLI
Open terminal in your project folder and run:
```bash
npm install -g vercel
```

### Step 2: Start Development Server
```bash
vercel dev
```

### Step 3: Open Your Site
- Vercel will start a server (usually `http://localhost:3000`)
- Open: `http://localhost:3000/test-db.html`
- Click "Test Database" - it should work! ✅

## 📝 Your `.env.local` File

Make sure you have `env.local` (or `.env.local`) in the root with:
```
DATABASE_URL=postgresql://neondb_owner:npg_3iksbn4YTxIW@ep-damp-wave-af3blftp-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🎯 What Changed?

- **Before**: `http://127.0.0.1:5500` → ❌ API routes don't work
- **After**: `http://localhost:3000` (via `vercel dev`) → ✅ API routes work!

## 🚨 Important Notes

1. **Stop Live Server** - Close the `127.0.0.1:5500` tab
2. **Use Vercel Dev** - Run `vercel dev` in terminal
3. **New URL** - Use `http://localhost:3000` instead

## 💡 Alternative: Deploy to Vercel

If you want to test on a live URL:
1. Push code to GitHub
2. Connect to Vercel
3. Add DATABASE_URL in Vercel dashboard
4. Deploy
5. Test on your live URL!

