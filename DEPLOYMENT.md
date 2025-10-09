# Deployment Guide

This guide will help you deploy the CipherChat application with the frontend on Netlify and the backend on Render.

## Prerequisites

- GitHub account (or GitLab/Bitbucket)
- Netlify account
- Render account
- MongoDB Atlas account (for database)

## Backend Deployment (Render)

### Option 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment configurations"
   git push origin master
   ```

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Configure Environment Variables**
   Set these in the Render dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `CORS_ORIGIN` - Your Netlify frontend URL (e.g., `https://your-app.netlify.app`)
   - `JWT_SECRET` - Will be auto-generated or set your own
   - `JWT_EXPIRATION` - Default is `7d`

### Option 2: Manual Setup

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your repository

2. **Configure Service**
   - **Name**: `cipherchat-api`
   - **Region**: Choose closest to your users
   - **Branch**: `master`
   - **Root Directory**: Leave empty (monorepo)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     yarn install && yarn turbo run build --filter=cipherchat-api
     ```
   - **Start Command**: 
     ```bash
     cd apps/api && yarn start
     ```
   - **Plan**: Free (or choose paid plan)

3. **Add Environment Variables** (same as Option 1)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your API URL (e.g., `https://cipherchat-api.onrender.com`)

## Frontend Deployment (Netlify)

### Option 1: Using netlify.toml (Recommended)

1. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git provider and select your repository

2. **Configure Build Settings**
   Netlify will automatically detect `netlify.toml`, but verify:
   - **Base directory**: `apps/web`
   - **Build command**: `cd ../.. && yarn install && yarn turbo run build --filter=cipherchat-web`
   - **Publish directory**: `apps/web/.next`

3. **Configure Environment Variables**
   In Netlify dashboard, go to Site settings → Environment variables:
   - `NEXT_PUBLIC_API_URL` - Your Render backend URL (e.g., `https://cipherchat-api.onrender.com`)
   - `NEXT_PUBLIC_SOCKET_URI` - Same as API URL (e.g., `https://cipherchat-api.onrender.com`)
   - `NODE_VERSION` - `18`

4. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Note your site URL (e.g., `https://your-app.netlify.app`)

### Option 2: Manual Setup

1. **Connect Repository** (same as Option 1)

2. **Manual Build Settings**
   - **Build command**: 
     ```bash
     cd ../.. && yarn install && yarn turbo run build --filter=cipherchat-web
     ```
   - **Publish directory**: `apps/web/.next`
   - **Base directory**: `apps/web`

3. **Environment Variables** (same as Option 1)

## Post-Deployment Steps

### 1. Update CORS Origin

Go back to Render and update the `CORS_ORIGIN` environment variable with your Netlify URL:
```
https://your-app.netlify.app
```

### 2. Test the Application

- Visit your Netlify URL
- Try registering a new user
- Test login functionality
- Send test messages

### 3. Configure Custom Domain (Optional)

**For Netlify:**
- Go to Domain settings → Add custom domain
- Follow DNS configuration instructions

**For Render:**
- Go to Settings → Custom Domain
- Add your domain and configure DNS

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Choose a region close to your Render server

2. **Configure Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add Render's IP addresses for better security

3. **Create Database User**
   - Go to Database Access
   - Add new database user
   - Save username and password

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add this to Render's `MONGODB_URI` environment variable

## Troubleshooting

### Frontend Issues

**Build fails:**
- Check that all environment variables are set
- Verify Node version is 18
- Check build logs in Netlify dashboard

**Can't connect to backend:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings on backend
- Check browser console for errors

### Backend Issues

**Build fails:**
- Check Render build logs
- Verify build command is correct
- Ensure all dependencies are in `package.json`

**Database connection fails:**
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access settings
- Ensure database user has correct permissions

**API not responding:**
- Check Render logs for errors
- Verify environment variables are set
- Check health check endpoint

## Environment Variables Reference

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
CORS_ORIGIN=https://your-app.netlify.app
```

### Frontend (Netlify)
```
NEXT_PUBLIC_API_URL=https://cipherchat-api.onrender.com
NEXT_PUBLIC_SOCKET_URI=https://cipherchat-api.onrender.com
NODE_VERSION=18
```

## Continuous Deployment

Both Netlify and Render support automatic deployments:
- Push to `master` branch to trigger automatic deployment
- Monitor deployments in respective dashboards
- Roll back if needed

## Important Notes

- **Free Tier Limitations**: Render's free tier spins down after inactivity. First request may take 30-60 seconds.
- **Environment Variables**: Never commit sensitive data. Always use environment variables.
- **HTTPS**: Both Netlify and Render provide free SSL certificates automatically.
- **Logs**: Check deployment logs if something goes wrong.

## Support

For issues:
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Render: [render.com/docs](https://render.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
