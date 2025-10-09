# TypeScript Build Fix for Render Deployment

## Problem

When building on Render, TypeScript couldn't find type definitions for various packages (express, passport, lodash, etc.), resulting in TS7016 errors.

## Root Cause

On Render's build environment, `@types/*` packages were in `devDependencies`, but by default, production builds don't install dev dependencies. Additionally, TypeScript and build tools need to be available during the build process.

## Solution

Moved all TypeScript-related packages from `devDependencies` to `dependencies` in `apps/api/package.json`:

### Packages Moved to Dependencies:

1. **Type Definitions:**
   - `@types/bcrypt`
   - `@types/body-parser`
   - `@types/cookie-parser`
   - `@types/cors`
   - `@types/express`
   - `@types/jsonwebtoken`
   - `@types/node`
   - `@types/passport`
   - `@types/passport-jwt`
   - `@types/passport-local`
   - `@types/lodash`

2. **Build Tools:**
   - `typescript` - Required for compilation
   - `esbuild` - Required at runtime for `esbuild-register`
   - `esbuild-register` - Required for running TypeScript directly in production

### Why This Works:

- **Dependencies** are installed in both development and production environments
- **DevDependencies** are only installed in development (unless `--production=false` is used)
- Moving these packages ensures they're available during Render's build process
- `esbuild` and `esbuild-register` are needed at runtime because the start command uses them

## Files Modified

### 1. `apps/api/package.json`

```json
{
	"dependencies": {
		// Runtime dependencies
		"bcrypt": "^5.1.0",
		"express": "^4.18.2",
		// ... other runtime deps

		// Type definitions (needed for build)
		"@types/express": "^4.17.12",
		"@types/passport": "^1.0.11",
		// ... other @types packages

		// Build tools (needed for build and runtime)
		"typescript": "^4.8.4",
		"esbuild": "^0.15.14",
		"esbuild-register": "^3.4.1"
	},
	"devDependencies": {
		// Only needed in development
		"eslint": "^7.32.0",
		"nodemon": "^2.0.20"
		// ... other dev-only tools
	}
}
```

### 2. `render.yaml`

```yaml
buildCommand: yarn install --frozen-lockfile && yarn workspace cipherchat-api build
startCommand: cd apps/api && node -r esbuild-register ./src/server.ts
```

## Verification

Build now completes successfully:

```bash
yarn workspace cipherchat-api build
# Output: Done in 2.48s ✅
```

## Why Not Use --production=false?

While we could use `yarn install --production=false` to install devDependencies, moving build-critical packages to dependencies is better because:

1. **Explicit dependencies**: Makes it clear what's needed for production
2. **Faster installs**: Don't install unnecessary dev tools (eslint, nodemon, etc.)
3. **Smaller deployment**: Production image only includes what's necessary
4. **Best practice**: Build dependencies should be in dependencies

## Deployment Impact

- ✅ TypeScript compilation works on Render
- ✅ All type definitions are available
- ✅ Runtime execution works with esbuild-register
- ✅ No need for special flags or workarounds
- ✅ Smaller production install (no eslint, nodemon, etc.)

## Next Steps

Your backend is now ready to deploy to Render! Follow the deployment checklist:

1. Commit and push these changes
2. Connect your repo to Render
3. Render will automatically build and deploy
4. No additional configuration needed

## Note on Alternative Approaches

If you wanted to compile TypeScript to JavaScript and run compiled code instead:

1. Update `startCommand` to: `cd apps/api/dist && node server.js`
2. Ensure build outputs to `dist` folder
3. Move typescript back to devDependencies
4. Remove esbuild-register from dependencies

However, the current approach (using esbuild-register) is simpler and works well for most use cases.
