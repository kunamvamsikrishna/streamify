# Troubleshooting: Infinite Loading Spinner

If your site at https://streamify-1-ltde.onrender.com/ is stuck showing only a loading spinner, follow these steps:

## Quick Fixes

### 1. Check Environment Variables in Render

**Go to your frontend service on Render:**
1. Open your service dashboard
2. Click **"Environment"** in the left sidebar
3. Verify these variables are set:

```
VITE_API_URL = https://your-backend-url.onrender.com/api
VITE_STREAM_API_KEY = your_stream_api_key
```

**⚠️ Important:**
- `VITE_API_URL` must include `/api` at the end
- Replace `your-backend-url` with your actual backend URL
- Example: `https://streamify-backend.onrender.com/api`

### 2. Rebuild After Adding Variables

**After setting environment variables:**
1. Go to **"Manual Deploy"** tab
2. Click **"Deploy latest commit"**
3. Wait for rebuild to complete

**Why?** Vite embeds environment variables at build time, so you must rebuild after adding/changing them.

### 3. Check Backend is Running

**Verify your backend is accessible:**
1. Visit: `https://your-backend-url.onrender.com/health`
2. Should return: `{"status":"ok","message":"Server is running",...}`

If backend is not accessible:
- Check backend logs in Render
- Verify backend is deployed and running
- Check backend environment variables

### 4. Check Browser Console

**Open browser developer tools:**
1. Press `F12` or right-click → Inspect
2. Go to **Console** tab
3. Look for error messages:
   - `API Network Error` = Backend not accessible
   - `CORS error` = Backend CORS not configured
   - `API Request Timeout` = Backend not responding
   - `API Base URL: undefined` = Environment variable not set

### 5. Verify CORS Configuration

**In your backend service on Render:**
1. Go to **Environment** variables
2. Check `FRONTEND_URL` is set to: `https://streamify-1-ltde.onrender.com`
3. Save and redeploy backend

## Common Issues

### Issue 1: Environment Variable Not Set

**Symptoms:**
- Console shows: `API Base URL: http://localhost:5001/api`
- API calls fail

**Fix:**
- Add `VITE_API_URL` in Render dashboard
- Rebuild the service

### Issue 2: Wrong API URL

**Symptoms:**
- Console shows wrong URL
- 404 errors

**Fix:**
- Verify `VITE_API_URL` includes `/api` at the end
- Check backend URL is correct

### Issue 3: Backend Not Running

**Symptoms:**
- Network errors in console
- Timeout errors

**Fix:**
- Check backend service is running
- Verify backend logs
- Test backend health endpoint

### Issue 4: CORS Errors

**Symptoms:**
- Console shows CORS errors
- Requests blocked

**Fix:**
- Update backend `FRONTEND_URL` environment variable
- Redeploy backend

## Step-by-Step Debugging

### Step 1: Check Environment Variables
```
✅ VITE_API_URL is set
✅ VITE_API_URL includes /api
✅ VITE_STREAM_API_KEY is set
```

### Step 2: Check Backend
```
✅ Backend service is running
✅ Backend /health endpoint works
✅ Backend FRONTEND_URL is set correctly
```

### Step 3: Check Browser Console
```
✅ No CORS errors
✅ No network errors
✅ API URL is correct
```

### Step 4: Rebuild Frontend
```
✅ Rebuild after setting environment variables
✅ Check build logs for errors
```

## After Fixes Applied

The latest code changes include:
- ✅ 10-second timeout on API requests (prevents infinite loading)
- ✅ Better error handling (app proceeds even if API fails)
- ✅ Improved logging (easier to debug)
- ✅ Error state handling (shows login page on error)

**After deploying the latest code:**
1. The app will timeout after 10 seconds if backend is unreachable
2. The app will show login page if API fails (instead of infinite loading)
3. Console will show detailed error messages

## Still Not Working?

1. **Check Render Logs:**
   - Frontend service → Logs tab
   - Look for build errors

2. **Check Browser Network Tab:**
   - F12 → Network tab
   - See if API requests are being made
   - Check request URLs and responses

3. **Verify Backend URL:**
   - Make sure backend URL is correct
   - Test backend health endpoint directly

4. **Clear Browser Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear cache in browser settings

## Quick Checklist

- [ ] `VITE_API_URL` is set in Render
- [ ] `VITE_API_URL` includes `/api` at the end
- [ ] Frontend was rebuilt after setting variables
- [ ] Backend is running and accessible
- [ ] Backend `FRONTEND_URL` is set correctly
- [ ] No CORS errors in browser console
- [ ] Browser cache is cleared
- [ ] Latest code is deployed

---

**After fixing these issues, the loading spinner should stop and you should see the login page.**

