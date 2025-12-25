# Local Development Setup

## Problem
When running with Live Server (`http://127.0.0.1:5500`), API routes don't work because:
- Vercel serverless functions need Vercel's runtime
- Simple HTTP servers can't execute serverless functions

## Solution: Use Vercel CLI for Local Development

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Link Your Project (Optional)
```bash
vercel link
```

### Step 4: Run Development Server
```bash
vercel dev
```

This will:
- Start a local server (usually on `http://localhost:3000`)
- Load your `.env.local` file automatically
- Execute API routes properly
- Simulate Vercel's serverless environment

### Step 5: Test Your API
- Open `http://localhost:3000/test-db.html`
- Click "Test Database"
- It should work now!

## Alternative: Deploy to Vercel

If you don't want to use Vercel CLI locally:

1. **Push your code to GitHub**
2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add `DATABASE_URL` in Environment Variables
   - Deploy
3. **Test on your live URL**: `https://your-project.vercel.app/test-db.html`

## Quick Start Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Run local development server
vercel dev

# Your site will be at http://localhost:3000
```

## Troubleshooting

**Error: "Cannot GET /api/test-db"**
- ✅ Use `vercel dev` instead of Live Server
- ✅ Make sure you're on `http://localhost:3000` not `http://127.0.0.1:5500`

**Error: "DATABASE_URL not set"**
- ✅ Create `.env.local` file in root directory
- ✅ Add: `DATABASE_URL=your_connection_string`
- ✅ Restart `vercel dev`

