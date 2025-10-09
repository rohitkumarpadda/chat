# Quick Deployment Checklist

## Before Deploying

- [ ] All code is committed and pushed to GitHub
- [ ] MongoDB Atlas cluster is created and configured
- [ ] You have accounts on Netlify and Render

## Step 1: Deploy Backend to Render

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `cipherchat-api`
   - **Build Command**: `yarn install && yarn turbo run build --filter=cipherchat-api`
   - **Start Command**: `cd apps/api && yarn start`
5. Add Environment Variables:
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Any secure random string
   - `CORS_ORIGIN` = `*` (update later with Netlify URL)
   - `NODE_ENV` = `production`
6. Click "Create Web Service"
7. **Save the URL** (e.g., `https://cipherchat-api.onrender.com`)

## Step 2: Deploy Frontend to Netlify

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Base directory**: `apps/web`
   - **Build command**: `cd ../.. && yarn install && yarn turbo run build --filter=cipherchat-web`
   - **Publish directory**: `apps/web/.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = Your Render URL from Step 1
   - `NEXT_PUBLIC_SOCKET_URI` = Your Render URL from Step 1
   - `NODE_VERSION` = `18`
6. Click "Deploy site"
7. **Save the URL** (e.g., `https://your-app.netlify.app`)

## Step 3: Update Backend CORS

1. Go back to Render dashboard
2. Navigate to your `cipherchat-api` service
3. Go to Environment
4. Update `CORS_ORIGIN` with your Netlify URL from Step 2
5. Save and redeploy

## Step 4: Test

1. Visit your Netlify URL
2. Register a new account
3. Login
4. Send a test message

## Done! 🎉

Your app is now deployed!

- Frontend: Your Netlify URL
- Backend: Your Render URL

## Notes

- First request to Render free tier may take 30-60 seconds (cold start)
- Check deployment logs if something goes wrong
- Update DNS settings if using custom domains
