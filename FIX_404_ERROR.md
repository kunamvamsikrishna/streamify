# Fix: 404 Error on Login/API Calls

## Problem
You're seeing this error in the browser console:
```
GET https://streamify-1-ltde.onrender.com/login 404 (Not Found)
```

## Root Cause
The `VITE_API_URL` environment variable on Render is missing `/api` at the end.

## Solution

### Step 1: Update Environment Variable on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **frontend** service (e.g., `streamify-frontend`)
3. Go to **Environment** tab
4. Find `VITE_API_URL` and update it to:
   ```
   https://streamify-1-ltde.onrender.com/api
   ```
   ⚠️ **Make sure it ends with `/api`**

5. Click **"Save Changes"**

### Step 2: Redeploy Frontend

1. In the same frontend service, go to **Manual Deploy**
2. Click **"Deploy latest commit"**
3. Wait for the deployment to complete (this will rebuild with the correct environment variable)

### Step 3: Verify Fix

1. Once deployment is complete, visit your frontend URL
2. Open browser DevTools (F12) → Console tab
3. Look for the log: `🌐 API Base URL: https://streamify-1-ltde.onrender.com/api`
4. Try logging in - it should now work!

## Why This Happens

Your backend routes are mounted at:
- `/api/auth/login` (not `/login`)
- `/api/auth/signup` (not `/signup`)
- `/api/users/` (not `/users/`)

So the frontend needs to call `https://your-backend.onrender.com/api` as the base URL.

## Prevention

The code now includes auto-correction in `axios.js`:
- If you forget `/api`, it will automatically add it and show a warning in console
- This helps prevent this issue in future deployments

## Still Having Issues?

1. **Check the console**: Open DevTools and look for the API Base URL log
2. **Verify backend is running**: Visit `https://streamify-1-ltde.onrender.com/health`
3. **Check CORS settings**: Make sure `FRONTEND_URL` is set correctly in backend environment variables
4. **Clear cache**: Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
