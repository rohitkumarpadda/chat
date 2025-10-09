# API Connection Issues Fix

## Issues Found and Fixed

### 1. MongoDB Connection Issue (Render Backend)

**Problem:**
```
MongooseServerSelectionError: connect ECONNREFUSED localhost:27017
```

**Root Cause:**
- The code in `connectToDb.ts` was using `process.env.MONGO_URI`
- But the deployment documentation said to use `MONGODB_URI`
- The environment variable wasn't set correctly in Render

**Solution:**
Updated `apps/api/src/utils/connectToDb.ts` to:
- Support both `MONGODB_URI` (primary) and `MONGO_URI` (fallback)
- Add validation to check if the variable is set
- Add better logging with emojis for clarity

```typescript
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ MONGODB_URI environment variable is not set!");
  throw new Error("MONGODB_URI environment variable is required");
}
```

**Action Required in Render:**
Set the `MONGODB_URI` environment variable to:
```
mongodb+srv://test-user-cipherchat:CipherChat@webp.tnwerul.mongodb.net/?retryWrites=true&w=majority&appName=webp
```

---

### 2. API Route 404 Error (Frontend)

**Problem:**
```
AxiosError: Request failed with status code 404
Cannot POST /auth/register
```

**Root Cause:**
- Backend mounts all routes at `/api/v1` prefix (in `server.ts`)
- Frontend was calling `/auth/register` directly
- The full path should be `/api/v1/auth/register`

**Code Analysis:**

Backend (`apps/api/src/server.ts`):
```typescript
app.use('/api/v1', routes); // ← All routes prefixed with /api/v1
```

Frontend (`apps/web/src/utils/request.ts`):
```typescript
const result = await axiosInstance.post("/auth/register", data); // ← Missing /api/v1
```

**Solution:**
Updated `apps/web/src/utils/axios.ts` to include the `/api/v1` prefix in baseURL:

```typescript
export const axiosInstance = withInterceptors(
  axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`, // ← Added /api/v1
    withCredentials: true,
  })
);
```

---

## Files Modified

1. ✅ `apps/api/src/utils/connectToDb.ts` - Fixed MongoDB URI handling
2. ✅ `apps/web/src/utils/axios.ts` - Added `/api/v1` prefix to baseURL

## Environment Variables Required

### Render (Backend)
Set these in Render Dashboard → Environment:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://test-user-cipherchat:CipherChat@webp.tnwerul.mongodb.net/?retryWrites=true&w=majority&appName=webp` |
| `CORS_ORIGIN` | Your Netlify URL (e.g., `https://cipher-chat-io.netlify.app`) |
| `JWT_SECRET` | Any secure random string |
| `NODE_ENV` | `production` |

### Netlify (Frontend)
Already set, but verify:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Your Render URL (e.g., `https://cipherchat-api.onrender.com`) |
| `NEXT_PUBLIC_SOCKET_URI` | Same as API URL |

## Testing the Fix

### 1. Test Backend Connection Locally
```bash
cd apps/api
# Update .env with your MongoDB URI
yarn dev
# Should see: ✅ Database connected: true
```

### 2. Test Frontend API Calls
```bash
cd apps/web
yarn dev
# Try to register a user
# Should now connect to /api/v1/auth/register
```

### 3. Deploy to Render
```bash
git add .
git commit -m "Fix: MongoDB URI and API route prefix"
git push
```

Then in Render:
- Set `MONGODB_URI` environment variable
- Redeploy the service
- Check logs for "✅ Database connected"

### 4. Deploy to Netlify
Netlify will auto-deploy from the git push. Check that:
- Build succeeds
- Registration works (makes calls to `/api/v1/auth/register`)

## Expected Behavior After Fix

### Backend (Render)
```
🔌 Connecting to MongoDB...
✅ Database connected: true
[server]: Server is running at https://0.0.0.0:10000
```

### Frontend (Netlify)
When registering:
```
POST https://your-render-url.onrender.com/api/v1/auth/register
Status: 200 OK (or appropriate response)
```

## Common Issues & Troubleshooting

### Backend still shows "localhost:27017"
- ✅ Make sure `MONGODB_URI` is set in Render
- ✅ Redeploy the service after setting the variable
- ✅ Check environment variables in Render dashboard

### Frontend still gets 404
- ✅ Make sure you've pushed the updated `axios.ts` file
- ✅ Netlify should auto-deploy on push
- ✅ Clear browser cache and try again
- ✅ Check Network tab to see the actual URL being called

### CORS errors
- ✅ Set `CORS_ORIGIN` in Render to your Netlify URL
- ✅ Make sure it matches exactly (with https://)
- ✅ No trailing slash

## Status

✅ **MongoDB Connection**: Fixed - now supports MONGODB_URI  
✅ **API Routes**: Fixed - added /api/v1 prefix  
✅ **Build**: Successful  
✅ **Ready for Deployment**

## Next Steps

1. **Set `MONGODB_URI` in Render** - Critical!
2. **Push changes to GitHub**
3. **Verify deployments succeed**
4. **Test registration/login flow**

---

*Last Updated: October 9, 2025*
