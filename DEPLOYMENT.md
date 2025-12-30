# Deployment Guide for Render

This guide will help you deploy Streamify to Render.

## Prerequisites

1. GitHub account with the repository pushed
2. Render account (sign up at https://render.com)
3. MongoDB database (MongoDB Atlas recommended)
4. Stream.io account with API keys

## Step 1: Deploy Backend

1. Go to your Render dashboard: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `kunamvamsikrishna/streamify`
4. Configure the service:
   - **Name**: `streamify-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `BACKEND` ⚠️ **IMPORTANT: Must be set to `BACKEND`**
   - **Build Command**: `npm install` ⚠️ **Make sure it's `npm install`, NOT `yarn`**
   - **Start Command**: `npm start` ⚠️ **Must be `npm start`**
   
   **⚠️ CRITICAL**: If you see "Running build command 'yarn'..." in logs, go to Settings → Build & Deploy and change Build Command to `npm install`

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5001` (or leave empty, Render will auto-assign)
   - `MONGO_URI` = Your MongoDB connection string
   - `SECRET_KEY` = Your JWT secret key (generate a strong random string)
   - `STREAM_API_KEY` = Your Stream.io API key
   - `STREAM_SECRET_KEY` = Your Stream.io secret key
   - `FRONTEND_URL` = `https://streamify-frontend.onrender.com` (update after frontend is deployed)

6. Click **"Create Web Service"**

7. Wait for deployment to complete. Note your backend URL (e.g., `https://streamify-backend.onrender.com`)

## Step 2: Deploy Frontend

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository: `kunamvamsikrishna/streamify`
3. Configure the service:
   - **Name**: `streamify-frontend`
   - **Branch**: `main`
   - **Root Directory**: `FRONTEND`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variables:
   - `VITE_API_URL` = `https://streamify-backend.onrender.com/api` ⚠️ **CRITICAL: MUST end with /api**
   - `VITE_STREAM_API_KEY` = Your Stream.io API key
   
   **⚠️ IMPORTANT**: The `VITE_API_URL` MUST include `/api` at the end!
   - ✅ CORRECT: `https://streamify-1-ltde.onrender.com/api`
   - ❌ WRONG: `https://streamify-1-ltde.onrender.com`
   - ❌ WRONG: `https://streamify-1-ltde.onrender.com/`

5. Click **"Create Static Site"**

6. **Important**: After the first deployment, go to **Settings** → **Environment** and add the variables again, then click **"Save Changes"** and **"Manual Deploy"** → **"Deploy latest commit"** (This rebuilds with the environment variables)

## Step 3: Update Backend CORS

1. Go back to your backend service on Render
2. Update the `FRONTEND_URL` environment variable to your frontend URL: `https://streamify-frontend.onrender.com`
3. Save and redeploy

## Step 4: Test Your Deployment

1. Visit your frontend URL
2. Test signup/login functionality
3. Test video calling and chat features

## Troubleshooting

### Backend Issues

- **Application exited early / No errors in logs**:
  - ✅ **Fixed in latest version**: The server now has better error handling
  - Check that all required environment variables are set:
    - `MONGO_URI` (MongoDB connection string)
    - `SECRET_KEY` (JWT secret)
    - `STREAM_API_KEY` (Stream.io API key)
    - `STREAM_SECRET_KEY` (Stream.io secret key)
  - Check the logs for specific error messages (they should now appear)
  - Visit `/health` endpoint to see if server is running
  - Verify MongoDB connection string is correct and accessible
  - Make sure MongoDB IP whitelist includes Render's IPs (or use `0.0.0.0/0`)

- **Build fails**: Check that all dependencies are in `package.json`
- **Connection refused**: Verify MongoDB connection string is correct
- **CORS errors**: Ensure `FRONTEND_URL` matches your frontend domain exactly
- **Port issues**: Render automatically sets `PORT`, don't hardcode it

### Frontend Issues

- **404 Error on API calls (e.g., `/login 404 Not Found`)**:
  - ⚠️ **MOST COMMON ISSUE**: `VITE_API_URL` is missing `/api` at the end
  - **Symptom**: Browser console shows `GET https://your-backend.onrender.com/login 404`
  - **Solution**: 
    1. Go to Render dashboard → Frontend service → Environment
    2. Update `VITE_API_URL` to include `/api`: `https://your-backend.onrender.com/api`
    3. Save and trigger a **Manual Deploy** → **Deploy latest commit**
  - **Example**: If your backend is `https://streamify-1-ltde.onrender.com`, set:
    - ✅ `VITE_API_URL=https://streamify-1-ltde.onrender.com/api`
    - ❌ NOT `https://streamify-1-ltde.onrender.com`

- **API calls fail**: 
  - Verify `VITE_API_URL` is set correctly
  - Check browser console for CORS errors
  - Ensure backend is running and accessible

- **Environment variables not working**:
  - Vite requires variables to start with `VITE_`
  - Rebuild the service after adding variables
  - Clear browser cache

### Common Environment Variable Issues

- Variables must be set in Render dashboard
- Frontend variables must start with `VITE_`
- After adding variables, rebuild the service
- Check for typos in variable names

## MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses (or use `0.0.0.0/0` for Render)
5. Get connection string and use it as `MONGO_URI`

## Stream.io Setup

1. Sign up at https://getstream.io
2. Create a new app
3. Get your API Key and Secret Key
4. Use these in your environment variables

## Notes

- Free tier services on Render may spin down after inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid tier for production use
- Monitor logs in Render dashboard for debugging

## Support

If you encounter issues:
1. Check Render service logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB and Stream.io services are accessible

