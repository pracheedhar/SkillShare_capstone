# Quick Fix for Signup/Login Issues

## ✅ All Fixes Applied

I've fixed several issues that were preventing signup/login:

### 1. **API URL Mismatch** ✅
- Frontend was defaulting to port 5000, but backend runs on 5001
- Fixed: Updated default API URL to port 5001

### 2. **Better Error Handling** ✅
- Added detailed error logging in AuthContext
- Added network error detection
- Improved error messages for users

### 3. **Validation Improvements** ✅
- Enhanced validation error messages
- Better error extraction from responses

## 🚀 How to Test

### Step 1: Verify Backend is Running
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5001
📡 API available at http://localhost:5001/api
✅ MySQL database connected successfully
```

### Step 2: Verify Database Connection
```bash
cd backend
npm run check-db
```

### Step 3: Test Health Endpoint
Open in browser or use curl:
```
http://localhost:5001/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "connected"
}
```

### Step 4: Test Signup
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill in the form:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123 (min 6 characters)
   - Role: Student or Instructor
4. Click "Sign Up"

### Step 5: Check for Errors

**If signup fails, check:**

1. **Browser Console (F12)**:
   - Look for error messages
   - Check Network tab for failed requests

2. **Backend Terminal**:
   - Look for error messages
   - Check database connection status

3. **Common Issues**:

   **"Cannot connect to server"**
   - Backend not running: Start with `npm run dev` in backend folder
   - Wrong port: Check frontend/.env.local has `NEXT_PUBLIC_API_URL=http://localhost:5001/api`

   **"Database connection failed"**
   - MySQL not running: Start MySQL service
   - Database doesn't exist: Run `CREATE DATABASE skillshare;`
   - Wrong credentials: Check DATABASE_URL in backend/.env

   **"Validation failed"**
   - Name too short (min 2 characters)
   - Invalid email format
   - Password too short (min 6 characters)

## 🔧 Quick Troubleshooting

### Issue: "Network Error"
**Solution:**
1. Check backend is running: `curl http://localhost:5001/api/health`
2. Check frontend .env.local: `NEXT_PUBLIC_API_URL=http://localhost:5001/api`
3. Restart both servers

### Issue: "Database connection error"
**Solution:**
```bash
# Check MySQL is running
mysql -u root -p

# Create database if needed
CREATE DATABASE skillshare;

# Run migrations
cd backend
npm run prisma:migrate:dev
```

### Issue: "User already exists"
**Solution:**
- Use a different email address
- Or delete the user from database

## 📝 Testing Checklist

- [ ] Backend server running on port 5001
- [ ] Frontend server running on port 3000
- [ ] MySQL database exists and is accessible
- [ ] Database migrations have been run
- [ ] Frontend .env.local has correct API URL
- [ ] Backend .env has correct DATABASE_URL
- [ ] Health endpoint returns "connected"
- [ ] Can access signup page
- [ ] Can submit signup form
- [ ] No errors in browser console
- [ ] No errors in backend terminal

## 🎯 Expected Behavior

**Successful Signup:**
1. Form submits
2. Loading state shows "Signing up..."
3. Redirects to /dashboard
4. User is logged in

**Failed Signup:**
1. Error message appears in red box
2. Form stays on page
3. Can try again

Check browser console and backend terminal for specific error messages!

