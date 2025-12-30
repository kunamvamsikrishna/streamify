# Frontend Deployment Guide for Render

This is a detailed step-by-step guide to deploy the Streamify frontend to Render.

## Prerequisites

Before deploying the frontend, make sure:
- ✅ Backend is already deployed and running
- ✅ You have your backend URL (e.g., `https://streamify-backend.onrender.com`)
- ✅ You have your Stream.io API key
- ✅ Your GitHub repository is pushed and up to date

## Step-by-Step Frontend Deployment

### Step 1: Access Render Dashboard

1. Go to https://dashboard.render.com
2. Sign in to your Render account
3. You should see your dashboard with your backend service (if already deployed)

### Step 2: Create New Static Site

1. Click the **"New +"** button in the top right corner
2. Select **"Static Site"** from the dropdown menu

### Step 3: Connect GitHub Repository

1. In the "Connect a repository" section:
   - If this is your first time, click **"Connect account"** and authorize Render to access your GitHub
   - Search for your repository: `kunamvamsikrishna/streamify`
   - Click **"Connect"** next to your repository

### Step 4: Configure Static Site Settings

Fill in the following configuration:

#### Basic Settings:
- **Name**: `streamify-frontend`
  - This will be part of your URL: `https://streamify-frontend.onrender.com`

- **Branch**: `main`
  - Make sure this matches your main branch name

- **Root Directory**: `FRONTEND`
  - ⚠️ **CRITICAL**: This tells Render where your frontend code is located
  - Must be exactly `FRONTEND` (case-sensitive)

#### Build Settings:
- **Build Command**: `npm install && npm run build`
  - This installs dependencies and builds your React app
  - ⚠️ Make sure it's `npm install`, NOT `yarn`

- **Publish Directory**: `dist`
  - This is where Vite outputs the built files
  - Must be exactly `dist` (case-sensitive)

### Step 5: Add Environment Variables

**⚠️ IMPORTANT**: Environment variables must be added BEFORE the first build!

1. Scroll down to the **"Environment Variables"** section
2. Click **"Add Environment Variable"** for each variable:

#### Required Variables:

**Variable 1:**
- **Key**: `VITE_API_URL`
- **Value**: `https://your-backend-url.onrender.com/api`
  - Replace `your-backend-url` with your actual backend URL
  - Example: `https://streamify-backend.onrender.com/api`
  - ⚠️ **Must include `/api` at the end**

**Variable 2:**
- **Key**: `VITE_STREAM_API_KEY`
- **Value**: Your Stream.io API key
  - Get this from your Stream.io dashboard
  - Example: `abc123xyz456`

#### Environment Variable Notes:
- ✅ All frontend variables **MUST** start with `VITE_`
- ✅ Vite only includes variables that start with `VITE_` in the build
- ✅ Variables are embedded at build time, not runtime
- ⚠️ If you add variables after the first build, you MUST rebuild

### Step 6: Create the Static Site

1. Review all your settings
2. Click **"Create Static Site"** at the bottom
3. Render will start the deployment process

### Step 7: Monitor the Build

You'll see the build progress:

1. **Cloning repository** - Render downloads your code
2. **Installing dependencies** - Running `npm install`
3. **Building** - Running `npm run build`
4. **Deploying** - Uploading the built files

**Expected build time**: 2-5 minutes

### Step 8: Verify Environment Variables (CRITICAL STEP)

⚠️ **IMPORTANT**: After the first deployment completes:

1. Go to your service dashboard
2. Click **"Settings"** in the left sidebar
3. Scroll to **"Environment Variables"** section
4. **Verify** that both variables are present:
   - `VITE_API_URL`
   - `VITE_STREAM_API_KEY`
5. If variables are missing or incorrect:
   - Add/update them
   - Click **"Save Changes"**
   - Go to **"Manual Deploy"** tab
   - Click **"Deploy latest commit"**
   - This rebuilds with the correct environment variables

### Step 9: Get Your Frontend URL

Once deployment is complete:

1. Your frontend will be available at: `https://streamify-frontend.onrender.com`
2. The URL is shown at the top of your service dashboard
3. Copy this URL - you'll need it for the backend CORS configuration

### Step 10: Update Backend CORS

Now update your backend to allow requests from the frontend:

1. Go to your **backend service** on Render
2. Click **"Environment"** in the left sidebar
3. Find the `FRONTEND_URL` variable
4. Update it to: `https://streamify-frontend.onrender.com`
   - Replace with your actual frontend URL
5. Click **"Save Changes"**
6. The backend will automatically redeploy

### Step 11: Test Your Deployment

1. Visit your frontend URL: `https://streamify-frontend.onrender.com`
2. Open browser developer tools (F12)
3. Check the Console tab for any errors
4. Test the following:
   - ✅ Page loads without errors
   - ✅ Sign up functionality
   - ✅ Login functionality
   - ✅ API calls work (check Network tab)
   - ✅ Video calling works
   - ✅ Chat works

## Common Issues and Solutions

### Issue 1: Build Fails

**Symptoms**: Build fails with errors

**Solutions**:
- Check that **Root Directory** is set to `FRONTEND`
- Verify **Build Command** is `npm install && npm run build`
- Check build logs for specific error messages
- Ensure all dependencies are in `package.json`

### Issue 2: Environment Variables Not Working

**Symptoms**: API calls fail, variables are `undefined`

**Solutions**:
- ✅ Variables must start with `VITE_`
- ✅ Rebuild after adding variables (Manual Deploy → Deploy latest commit)
- ✅ Check variable names for typos
- ✅ Verify `VITE_API_URL` includes `/api` at the end
- ✅ Clear browser cache

### Issue 3: API Calls Fail / CORS Errors

**Symptoms**: Network errors, CORS errors in console

**Solutions**:
- Verify `VITE_API_URL` is correct in frontend environment variables
- Verify `FRONTEND_URL` is set correctly in backend environment variables
- Check that backend is running and accessible
- Ensure backend URL includes `/api` in frontend variable

### Issue 4: Blank Page / 404 Errors

**Symptoms**: Page loads but shows blank or 404

**Solutions**:
- Check browser console for errors
- Verify build completed successfully
- Check that `Publish Directory` is set to `dist`
- Try clearing browser cache

### Issue 5: Build Uses Wrong Package Manager

**Symptoms**: Build fails with "yarn" errors

**Solutions**:
- Go to Settings → Build & Deploy
- Change Build Command to: `npm install && npm run build`
- Save and redeploy

## Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `VITE_API_URL` = `https://your-backend.onrender.com/api`
- [ ] `VITE_STREAM_API_KEY` = Your Stream.io API key
- [ ] Both variables are added in Render dashboard
- [ ] Variables start with `VITE_`
- [ ] Backend URL includes `/api` at the end

## After Deployment Checklist

- [ ] Frontend URL is accessible
- [ ] No console errors in browser
- [ ] Login/Signup works
- [ ] API calls succeed (check Network tab)
- [ ] Backend `FRONTEND_URL` is updated
- [ ] CORS errors are resolved
- [ ] Video calling works
- [ ] Chat functionality works

## Quick Reference

**Frontend URL Format**: `https://streamify-frontend.onrender.com`

**Backend API URL Format**: `https://streamify-backend.onrender.com/api`

**Environment Variables**:
```
VITE_API_URL=https://streamify-backend.onrender.com/api
VITE_STREAM_API_KEY=your_stream_api_key
```

**Build Settings**:
- Root Directory: `FRONTEND`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

## Need Help?

If you encounter issues:

1. **Check Build Logs**: Go to your service → Logs tab
2. **Check Browser Console**: Open DevTools (F12) → Console tab
3. **Check Network Tab**: Open DevTools → Network tab to see API calls
4. **Verify Environment Variables**: Settings → Environment Variables
5. **Try Manual Rebuild**: Manual Deploy → Deploy latest commit

## Next Steps

After successful deployment:

1. ✅ Test all features
2. ✅ Update backend CORS with frontend URL
3. ✅ Share your deployed app URL
4. ✅ Monitor logs for any issues
5. ✅ Consider setting up custom domain (optional)

---

**Congratulations!** 🎉 Your frontend should now be live on Render!

