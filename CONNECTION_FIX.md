# Connection Fix Guide

## ✅ All Port Inconsistencies Fixed

I've fixed all port mismatches between frontend and backend.

### Changes Made:
1. ✅ `frontend/next.config.js` - Updated default to port 5001
2. ✅ `start-frontend.sh` - Updated to port 5001
3. ✅ Added better error logging in API client
4. ✅ Added server error handling for port conflicts
5. ✅ Created server startup checker script

## 🚀 How to Start Everything Correctly

### Step 1: Start Backend Server

**Option A: Using npm (Recommended)**
```bash
cd backend
npm run dev
```

**Option B: Using startup script**
```bash
cd backend
node scripts/start-server.js
```

**You should see:**
```
🚀 Server running on port 5001
📡 API available at http://localhost:5001/api
🌐 Health check: http://localhost:5001/api/health
✅ Backend is ready to accept connections!
```

### Step 2: Verify Backend is Running

Open in browser or use curl:
```bash
curl http://localhost:5001/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "connected"
}
```

### Step 3: Start Frontend Server

**In a NEW terminal:**
```bash
cd frontend
npm run dev
```

**You should see:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

### Step 4: Test Connection

1. Open http://localhost:3000
2. Open browser console (F12)
3. Check for any connection errors
4. Try to sign up

## 🔧 Troubleshooting

### Issue: "Port 5001 already in use"

**Solution:**
```bash
# Find what's using port 5001
lsof -i :5001

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or change port in backend/.env
PORT=5002
```

### Issue: Backend starts but frontend can't connect

**Check:**
1. Backend is actually running (check terminal)
2. Test health endpoint: `curl http://localhost:5001/api/health`
3. Check browser console for CORS errors
4. Verify `frontend/.env.local` exists with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

### Issue: CORS errors in browser

**Solution:**
- Backend CORS is configured for `http://localhost:3000`
- Make sure frontend is running on port 3000
- Check `backend/.env` has: `FRONTEND_URL=http://localhost:3000`

### Issue: "Cannot connect to server"

**Checklist:**
- [ ] Backend server is running (check terminal)
- [ ] Backend shows "Server running on port 5001"
- [ ] Health endpoint works: http://localhost:5001/api/health
- [ ] Frontend .env.local has correct URL
- [ ] No firewall blocking port 5001
- [ ] Both servers are running (backend on 5001, frontend on 3000)

## 📝 Quick Test Commands

```bash
# Test backend health
curl http://localhost:5001/api/health

# Test if port is in use
lsof -i :5001

# Check backend logs
# (Look at terminal where backend is running)

# Check frontend console
# (Open browser F12 → Console tab)
```

## ✅ Expected Behavior

**When everything works:**
1. Backend terminal shows: "Server running on port 5001"
2. Frontend terminal shows: "ready started server on 0.0.0.0:3000"
3. Browser can access http://localhost:3000
4. Signup form submits successfully
5. No errors in browser console
6. No errors in backend terminal

## 🎯 Next Steps

1. **Start backend:** `cd backend && npm run dev`
2. **Wait for:** "✅ Backend is ready to accept connections!"
3. **Start frontend:** `cd frontend && npm run dev` (new terminal)
4. **Open browser:** http://localhost:3000
5. **Test signup:** Fill form and submit

If you still see connection errors, check the browser console (F12) and backend terminal for specific error messages!

