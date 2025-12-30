# Fix 404 Errors on React Router Routes in Render

## Problem

When you visit routes like `/login` or `/signup` directly, you get a 404 error because the server is looking for those files, but they don't exist (it's a Single Page Application).

## Solution for Render Static Sites

Render Static Sites need to be configured to serve `index.html` for all routes. Here's how:

### Option 1: Configure in Render Dashboard (Recommended)

1. Go to your frontend service on Render
2. Click **"Settings"** in the left sidebar
3. Scroll down to **"Headers"** section
4. Add a custom header:
   - **Name**: `X-Render-SPA`
   - **Value**: `true`
5. Save changes

### Option 2: Use Rewrite Rules

If the above doesn't work, you can configure rewrite rules:

1. Go to **Settings** → **Headers**
2. Add header:
   - **Name**: `X-Render-Rewrite`
   - **Value**: `/* /index.html 200`

### Option 3: Contact Render Support

If neither option works, Render might need to enable SPA mode for your service. Contact support or check their documentation.

## Alternative: Use Hash Router (Not Recommended)

If the above solutions don't work, you could switch to HashRouter, but this changes URLs to use `#` (e.g., `/#/login`).

## Current Status

The `_redirects` file has been created in `public/`, but Render might not use it. The dashboard configuration is the most reliable solution.

