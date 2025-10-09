# WebSocket Connection Fix for Production

## Problem

```
WebSocket connection to 'wss://cipherchat-api.onrender.com/socket.io/?EIO=4&transport=websocket&sid=9cHwtg5hF03Btc2wAAa1' failed
```

The Socket.IO WebSocket connection was failing in production (Netlify).

## Root Causes

### 1. Environment Variable Issue

The local `.env.production` file had development URLs:

```bash
NEXT_PUBLIC_SOCKET_URI = ws://10.145.179.129:3001  # ❌ Local IP
```

**Important:** This file is only for local production builds. Netlify uses environment variables from the dashboard.

### 2. Socket.IO Authentication Method

Browser-based Socket.IO connections have limitations with custom headers. The original code only used `extraHeaders`, which may not work reliably across all browsers and proxies.

## Solutions Implemented

### 1. Updated Frontend Socket Connection

**File:** `apps/web/src/features/chat/context/SocketProvider.tsx`

Added multiple authentication methods and better transport handling:

```typescript
const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URI!, {
	auth: {
		token: accessToken, // ✅ NEW: Socket.IO v4+ auth object (most reliable)
	},
	extraHeaders: {
		Authorization: `Bearer ${accessToken}`, // ✅ Fallback for HTTP headers
	},
	transports: ['websocket', 'polling'], // ✅ NEW: Try WebSocket, fallback to polling
});
```

**Benefits:**

- **`auth` object**: Most reliable method for Socket.IO v4+ (works in all browsers)
- **`extraHeaders`**: Backup method for older clients
- **Transport fallback**: If WebSocket fails, automatically falls back to HTTP long-polling

### 2. Updated Backend Socket Authentication

**File:** `apps/api/src/socket/handleSocketEvents.ts`

Updated to check both authentication methods:

```typescript
const handleConnectEvent = (socket: Socket, io: SocketServer) => {
	let tokenString = '';

	// Try to get token from Authorization header
	if (socket.handshake.headers.authorization) {
		tokenString = socket.handshake.headers.authorization.split(' ')[1] || '';
	}

	// Fallback to auth object (Socket.IO v4+)
	if (!tokenString && socket.handshake.auth?.token) {
		tokenString = socket.handshake.auth.token; // ✅ NEW
	}

	const token = verifyJWT(tokenString);

	if (token) {
		console.log(`✅ User connected: ${socket.id} | User ID: ${token.user.id}`);
		addUser(socket.id, token.user.id);
	} else {
		console.log('❌ [socket]: unauthorized - no valid token');
		socket.disconnect();
	}
};
```

**Benefits:**

- Checks both `Authorization` header and `auth.token`
- More compatible with different Socket.IO clients
- Better logging with emojis for clarity

## Critical: Netlify Environment Variables

**🚨 MUST BE SET IN NETLIFY DASHBOARD:**

Go to: **Site settings → Environment variables → Edit variables**

| Variable                 | Value                                 | Notes                       |
| ------------------------ | ------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SOCKET_URI` | `https://cipherchat-api.onrender.com` | ⚠️ Use HTTPS, not WS or WSS |
| `NEXT_PUBLIC_API_URL`    | `https://cipherchat-api.onrender.com` | Same URL as socket          |

**Important Notes:**

1. ✅ Use `https://` (not `ws://` or `wss://`)
2. ✅ Socket.IO automatically upgrades to WebSocket (`wss://`)
3. ✅ Don't include `/socket.io` path - Socket.IO adds it automatically
4. ✅ No trailing slash

## How Socket.IO Connection Works

### Connection Flow:

```
1. Client connects to: https://cipherchat-api.onrender.com
2. Socket.IO handshake: HTTP POST with auth token
3. Upgrade to WebSocket: wss://cipherchat-api.onrender.com/socket.io/...
4. Fallback (if WSS fails): HTTP long-polling
```

### Transport Priority:

1. **WebSocket** (preferred) - Real-time bidirectional communication
2. **Polling** (fallback) - HTTP long-polling if WebSocket is blocked

## Testing

### Local Testing

```bash
# Start backend
cd apps/api
yarn dev

# Start frontend (in another terminal)
cd apps/web
yarn dev

# In browser console:
# - Should see: "Creating socket with auth token..."
# - Should see: "✅ Socket connected: [socket-id]"
```

### Production Testing (After Deployment)

1. **Set Environment Variables in Netlify**
   - `NEXT_PUBLIC_SOCKET_URI=https://cipherchat-api.onrender.com`
   - `NEXT_PUBLIC_API_URL=https://cipherchat-api.onrender.com`

2. **Deploy**

   ```bash
   git add .
   git commit -m "Fix: WebSocket connection with improved auth"
   git push
   ```

3. **Test in Production**
   - Open https://your-app.netlify.app
   - Login
   - Open browser console
   - Should see: "✅ Socket connected: [id]"
   - Should NOT see WebSocket connection errors

### Checking Render Backend Logs

In Render dashboard, you should see:

```
✅ User connected: abc123 | User ID: 507f1f77bcf86cd799439011
[socket] users: { abc123: '507f1f77bcf86cd799439011' }
```

If authentication fails:

```
❌ [socket]: unauthorized - no valid token
```

## Common Issues & Fixes

### 1. Still Getting WebSocket Errors

**Check:**

- ✅ Netlify environment variables are set correctly
- ✅ Using `https://` not `ws://` or `wss://`
- ✅ No trailing slash in URL
- ✅ Deployed the latest code

### 2. Socket Connects with Polling Instead of WebSocket

**This is OK!** Polling works fine and will be used if:

- Corporate firewall blocks WebSocket
- Proxy doesn't support WebSocket upgrade
- Network issues

Socket.IO will automatically try WebSocket first, then fall back to polling.

### 3. Authentication Fails

**Check Render logs for:**

- Token validation errors
- Missing token in handshake
- JWT signature issues

**Frontend console should show:**

```
Creating socket with auth token...
```

If token is missing, check:

- User is logged in
- `accessToken` is available in AuthContext
- Token is being passed to socket config

### 4. CORS Errors

In Render, set `CORS_ORIGIN`:

```
CORS_ORIGIN=https://your-app.netlify.app
```

Or for testing (not recommended for production):

```
CORS_ORIGIN=*
```

## Files Modified

1. ✅ `apps/web/src/features/chat/context/SocketProvider.tsx`
   - Added `auth` object for token
   - Added transport fallback
   - Better error logging

2. ✅ `apps/api/src/socket/handleSocketEvents.ts`
   - Check both header and auth object for token
   - Better logging with emojis

## Build Status

✅ **Both builds successful:**

```
Tasks:    2 successful, 2 total
Time:    13.811s
```

## Deployment Checklist

- [ ] Set `NEXT_PUBLIC_SOCKET_URI` in Netlify (use `https://` URL)
- [ ] Set `NEXT_PUBLIC_API_URL` in Netlify (same URL)
- [ ] Commit and push changes
- [ ] Wait for Netlify auto-deploy
- [ ] Wait for Render auto-deploy
- [ ] Test login and socket connection
- [ ] Check browser console for "✅ Socket connected"
- [ ] Check Render logs for "✅ User connected"

## Expected Behavior After Fix

### Frontend (Browser Console)

```
Creating socket with auth token...
✅ Socket connected: xyz789abc123
```

### Backend (Render Logs)

```
✅ User connected: xyz789abc123 | User ID: 507f1f77bcf86cd799439011
[socket] users: { xyz789abc123: '507f1f77bcf86cd799439011' }
```

### Network Tab

```
Request URL: wss://cipherchat-api.onrender.com/socket.io/?EIO=4&transport=websocket
Status: 101 Switching Protocols ✅
```

---

_Last Updated: October 9, 2025_
