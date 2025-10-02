# Deployment Guide

This guide covers deploying the ShearStream Showcase application to Vercel with real API integration.

## Prerequisites

1. A Vercel account ([sign up here](https://vercel.com/signup))
2. ShearStream API credentials (username and password)
3. GitHub repository connected to Vercel

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: ShearStream Showcase with SciChart.js"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shearstream-showcase.git
git push -u origin main
```

## Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## Step 3: Configure Environment Variables

Before deploying, add the following environment variables in Vercel:

1. In your Vercel project settings, go to **Settings** → **Environment Variables**
2. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `SHEARSTREAM_USERNAME` | your-email@example.com | Production, Preview |
| `SHEARSTREAM_PASSWORD` | your-password | Production, Preview |
| `SHEARSTREAM_API_URL` | https://app.shearstreaming.com/api/v1 | Production, Preview |

### Important Notes:
- These credentials are stored **server-side only** in Vercel
- They are **never exposed** to the browser
- The `/api/proxy` serverless function uses them to authenticate with ShearStream

## Step 4: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete (usually 2-3 minutes)
3. Vercel will provide a deployment URL (e.g., `https://your-project.vercel.app`)

## Step 5: Verify Deployment

1. Visit your deployment URL
2. Navigate to the Dashboard page
3. Check that:
   - The UnifiedChart loads successfully
   - Data shows "LIVE" indicator (not "MOCK DATA")
   - Real-time data updates every 2 seconds
   - Value display boxes show current channel values

## Architecture

### How the Proxy Works

```
Browser → /api/proxy?path=timeseries/746/data
         ↓
Vercel Serverless Function (api/proxy.ts)
- Adds Basic Auth header with credentials from env vars
- Forwards request to ShearStream API
         ↓
ShearStream API (app.shearstreaming.com)
- Validates credentials
- Returns timeseries data
         ↓
Vercel Serverless Function
- Forwards response back to browser
```

### Benefits
- ✅ **No CORS issues** - All API calls go through same domain
- ✅ **Secure credentials** - Never exposed to browser
- ✅ **Simplified frontend** - No auth token management
- ✅ **Serverless scaling** - Handles traffic automatically

## Development vs Production

### Development Mode
- Uses direct API calls (no proxy by default)
- Requires authenticated browser session
- Set `VITE_USE_PROXY=true` in `.env.local` to test proxy locally

### Production Mode
- Always uses proxy endpoint (`/api/proxy`)
- Credentials managed by Vercel environment variables
- CORS-free, secure API access

## Troubleshooting

### 401 Authentication Error
- **Cause**: Invalid credentials in Vercel environment variables
- **Fix**: Double-check `SHEARSTREAM_USERNAME` and `SHEARSTREAM_PASSWORD`

### Proxy not found (404)
- **Cause**: Vercel hasn't deployed the `/api/proxy` function
- **Fix**: Ensure `api/proxy.ts` exists and redeploy

### CORS errors
- **Cause**: API service not using proxy
- **Fix**: Verify `USE_PROXY` is `true` in production build

### Chart not loading
- **Cause**: SciChart initialization error
- **Fix**: Check browser console for WebGL errors

## Updating Deployment

To update your deployment with new changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel will automatically trigger a new deployment on push to main.

## Custom Domain

To add a custom domain:

1. Go to **Settings** → **Domains** in Vercel
2. Add your domain (e.g., `showcase.shearstream.com`)
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificate

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `SHEARSTREAM_USERNAME` | Yes | ShearStream API username (email) |
| `SHEARSTREAM_PASSWORD` | Yes | ShearStream API password |
| `SHEARSTREAM_API_URL` | No | API base URL (defaults to app.shearstreaming.com) |

## Security Notes

- ✅ Credentials are encrypted at rest in Vercel
- ✅ Environment variables are never logged or exposed
- ✅ Basic Auth is used for API authentication
- ✅ HTTPS is enforced by default

## Support

For issues or questions:
- Vercel Documentation: https://vercel.com/docs
- ShearStream API: Contact your account manager
- Repository Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/shearstream-showcase/issues)
