# Deployment Guide for Render

This guide covers deploying the FraudBusters app to Render with proper environment configuration to fix cross-origin authentication issues.

## Backend Deployment

### Environment Variables for Backend Service

Set these environment variables in your Render backend service:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=https://your-frontend-name.onrender.com
PORT=10000
```

**Important Notes:**
- Replace `your-frontend-name.onrender.com` with your actual frontend domain
- The `CLIENT_ORIGIN` should match exactly what Render assigns to your frontend
- `PORT=10000` is recommended for Render (though it will use the assigned port anyway)

### Backend Service Configuration
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node
- **Region:** Choose the same region as your frontend for better performance

## Frontend Deployment

### Environment Variables for Frontend Service

Set these environment variables in your Render frontend service:

```
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

**Important Notes:**
- Replace `your-backend-name.onrender.com` with your actual backend domain
- Do NOT include `/api` at the end - the code handles that
- Make sure there's no trailing slash

### Frontend Service Configuration
- **Build Command:** `npm run build`
- **Publish Directory:** `build`
- **Environment:** Static Site
- **Region:** Choose the same region as your backend

## Deployment Steps

1. **Push your code changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix cross-origin authentication for production deployment"
   git push origin main
   ```

2. **Update Backend Service on Render:**
   - Go to your backend service dashboard
   - Navigate to "Environment" tab
   - Add/update the environment variables listed above
   - Click "Save Changes"
   - The service will automatically redeploy

3. **Update Frontend Service on Render:**
   - Go to your frontend service dashboard
   - Navigate to "Environment" tab
   - Add the `REACT_APP_API_URL` environment variable
   - Click "Save Changes"
   - The service will automatically redeploy

4. **Clear Build Cache (if needed):**
   If you encounter issues, try clearing the build cache:
   - Go to Settings → Build & Deploy
   - Click "Clear Cache & Deploy"

## Troubleshooting

### Common Issues and Solutions

1. **"Cannot GET /" on backend URL:**
   - This is normal! The backend API is at `/api/*` endpoints
   - Test with: `https://your-backend.onrender.com/api/health`

2. **CORS errors:**
   - Ensure `CLIENT_ORIGIN` exactly matches your frontend URL
   - Check that both services are in the same region
   - Verify the frontend URL doesn't have a trailing slash

3. **Cookie authentication not working:**
   - The code now sets `SameSite=None; Secure` cookies in production
   - Ensure both services use HTTPS (Render does this automatically)

4. **JSON parsing errors:**
   - The frontend now has robust error handling
   - Check browser network tab for actual error responses
   - Verify API endpoints are responding correctly

5. **Environment variables not taking effect:**
   - Wait for the service to fully redeploy after changing env vars
   - Check the service logs for startup errors
   - Try manual redeploy if automatic one fails

### Testing Your Deployment

1. **Backend Health Check:**
   ```bash
   curl https://your-backend-name.onrender.com/api/health
   ```
   Should return: `{"ok":true,"env":"production"}`

2. **Frontend Access:**
   - Visit your frontend URL
   - Open browser dev tools → Network tab
   - Try to sign up/sign in
   - Check that requests go to the correct backend URL

3. **Full Authentication Flow:**
   - Register a new user
   - Login with credentials
   - Verify cookies are set correctly
   - Check that protected routes work

### Performance Notes

- First request to a Render service may be slow (cold start)
- Both services should "wake up" after the first request
- Consider upgrading to paid plans to avoid cold starts

## Local Development

For local development, use the included `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000
```

Make sure your backend is running on port 5000 locally.

## Need Help?

If you encounter issues:

1. Check Render service logs for both frontend and backend
2. Verify all environment variables are set correctly
3. Test API endpoints directly with curl or Postman
4. Clear browser cookies and try again
5. Try incognito/private browsing mode to avoid cached issues
