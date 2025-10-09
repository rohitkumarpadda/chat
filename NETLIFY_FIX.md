# Netlify Build Fix Summary

## Issues Identified

1. **Incorrect publish directory** - Was set to `apps/web/.next`, but with `@netlify/plugin-nextjs`, this should be auto-detected
2. **Missing `...` in Turbo filter** - Should use `--filter=cipherchat-web...` to build dependencies
3. **UI package peer dependencies** - React should be in `peerDependencies`, not just `devDependencies`
4. **Environment variable validation** - No validation at build time for required env vars
5. **Unnecessary NPM flags** - Removed conflicting flags

## Changes Made

### 1. Updated `netlify.toml`
- Removed manual `publish` directory (let plugin handle it)
- Removed unnecessary redirects (Next.js plugin handles routing)
- Updated build command to use `--filter=cipherchat-web...` (includes dependencies)
- Removed conflicting `NPM_FLAGS`
- Kept `NODE_VERSION` and `YARN_VERSION` settings

### 2. Updated `packages/ui/package.json`
- Added `peerDependencies` for React
- This ensures proper dependency resolution in the monorepo

### 3. Updated `apps/web/next.config.js`
- Added environment variable validation
- Clear error messages if required env vars are missing
- Proper TypeScript and ESLint configuration

### 4. Created `.npmrc` at root
- Ensures proper workspace support

### 5. Created `apps/web/NETLIFY_DEPLOYMENT.md`
- Comprehensive deployment instructions
- Troubleshooting guide

## Required Environment Variables in Netlify

Set these in Netlify Dashboard → Site settings → Environment variables:

1. **NEXT_PUBLIC_API_URL** - Your backend API URL (e.g., `https://your-app.onrender.com`)
2. **NEXT_PUBLIC_SOCKET_URI** - Your backend Socket.IO URL (same as API URL)

## Deployment Steps

1. **Commit and push these changes**:
   ```bash
   git add .
   git commit -m "Fix Netlify deployment configuration"
   git push
   ```

2. **In Netlify Dashboard**:
   - Set the required environment variables
   - Trigger a new deployment (or it will auto-deploy from the push)

3. **Monitor the build**:
   - Check the Netlify deploy logs
   - Look for the success message

## Expected Build Flow

1. Netlify checks out your repo
2. Runs `cd ../.. && yarn install --frozen-lockfile`
3. Runs `yarn turbo run build --filter=cipherchat-web...`
4. Turbo builds `ui` and `interfaces` packages first (dependencies)
5. Then builds `cipherchat-web`
6. Next.js plugin optimizes the output
7. Deployment completes

## If Build Still Fails

Check these common issues:

1. **Environment variables not set** - See error in build log
2. **TypeScript errors** - Run `yarn turbo run build --filter=cipherchat-web` locally
3. **Dependency issues** - Clear Netlify cache and redeploy
4. **Node version mismatch** - Verify `NODE_VERSION=18` in netlify.toml

## Testing Locally

```bash
# From project root
yarn install
yarn turbo run build --filter=cipherchat-web...

# If successful, deployment should work
```
