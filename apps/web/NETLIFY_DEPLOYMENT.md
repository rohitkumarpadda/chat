# Netlify Deployment Instructions

## Quick Setup

### 1. Install Netlify CLI (Optional, for local testing)
```bash
npm install -g netlify-cli
```

### 2. Required Environment Variables

Set these in your Netlify dashboard under **Site settings → Environment variables**:

- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://your-app.onrender.com`)
- `NEXT_PUBLIC_SOCKET_URI` - Your backend Socket.IO URL (same as API URL)

### 3. Deploy via Netlify Dashboard

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git repository
4. Netlify will auto-detect the `netlify.toml` configuration
5. Add the environment variables listed above
6. Click "Deploy site"

### 4. Build Configuration (Auto-detected from netlify.toml)

The `netlify.toml` file configures:
- **Base directory**: `apps/web`
- **Build command**: Runs from monorepo root with Turborepo
- **Node version**: 18
- **Next.js plugin**: Automatically configured

## Troubleshooting

### Build fails with "Missing environment variables"
- Make sure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URI` are set in Netlify dashboard
- These MUST be set before deployment

### Build fails with TypeScript errors
- Check the build logs for specific errors
- Run `yarn turbo run build --filter=cipherchat-web` locally to see the same errors

### Build fails with dependency errors
- Clear Netlify cache and redeploy
- Check that all dependencies in `package.json` are correct

### "Module not found" errors
- This is a monorepo - make sure the build command runs from root (`cd ../..`)
- Verify that workspace dependencies (`ui`, `interfaces`) are properly configured

## Local Testing with Netlify CLI

```bash
# From the project root
cd apps/web
netlify dev
```

## Manual Deployment (if needed)

```bash
# From the project root
cd apps/web
netlify deploy --prod
```

## Notes

- The build runs in a monorepo context, so all workspace dependencies are resolved
- The `@netlify/plugin-nextjs` handles Next.js-specific optimizations
- Environment variables prefixed with `NEXT_PUBLIC_` are embedded in the client bundle
