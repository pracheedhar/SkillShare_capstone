# Database Connection Troubleshooting

## Quick Fix Guide

If you're getting a "network error" or "database connection error" when signing up, follow these steps:

## Step 1: Check Database Connection

Run the database checker script:
```bash
cd backend
npm run check-db
```

This will tell you exactly what's wrong with your database connection.

## Step 2: Common Issues and Solutions

### Issue 1: MySQL Not Running

**Symptoms:**
- Error: `P1001 - Can't reach database server`
- Error: `ECONNREFUSED`

**Solution:**
```bash
# macOS (Homebrew)
brew services start mysql

# Linux
sudo systemctl start mysql
# or
sudo service mysql start

# Windows
# Start MySQL service from Services panel
```

**Verify MySQL is running:**
```bash
mysql -u root -p
# If this works, MySQL is running
```

### Issue 2: Database Doesn't Exist

**Symptoms:**
- Error: `P1003 - Database does not exist`

**Solution:**
```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE skillshare;
EXIT;
```

### Issue 3: Wrong Connection String

**Symptoms:**
- Error: `P1000 - Authentication failed`
- Error: `Access denied`

**Check your `.env` file:**
```env
DATABASE_URL=mysql://root:yourpassword@localhost:3306/skillshare
```

**Format:** `mysql://username:password@host:port/database`

**Common mistakes:**
- Wrong password
- Wrong username (should be `root` for local)
- Wrong port (should be `3306` for MySQL)
- Database name doesn't match

**Fix:**
1. Open `backend/.env`
2. Update `DATABASE_URL` with correct credentials
3. Make sure password doesn't have special characters (or URL-encode them)

### Issue 4: Tables Don't Exist

**Symptoms:**
- Connection works but signup fails
- Error about tables not existing

**Solution:**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate:dev
```

This will create all necessary tables.

### Issue 5: Wrong Port in Frontend

**Symptoms:**
- Frontend can't reach backend
- Network error in browser console

**Check `frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Make sure the port matches your backend port (5001).

## Step 3: Verify Everything Works

1. **Check database connection:**
   ```bash
   cd backend
   npm run check-db
   ```

2. **Check backend health:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running","database":"connected"}`

3. **Test signup:**
   - Open http://localhost:3000
   - Try to sign up
   - Check browser console (F12) for errors
   - Check backend terminal for errors

## Step 4: Complete Setup Checklist

- [ ] MySQL is installed and running
- [ ] Database `skillshare` exists
- [ ] `backend/.env` has correct `DATABASE_URL`
- [ ] `frontend/.env.local` has correct `NEXT_PUBLIC_API_URL`
- [ ] Ran `npm run prisma:generate`
- [ ] Ran `npm run prisma:migrate:dev`
- [ ] Backend server is running on port 5001
- [ ] Frontend server is running on port 3000

## Still Having Issues?

1. **Check backend terminal** - Look for error messages
2. **Check browser console** (F12) - Look for network errors
3. **Run database checker:**
   ```bash
   npm run check-db
   ```
4. **Check MySQL logs:**
   ```bash
   # macOS
   tail -f /usr/local/var/mysql/*.err
   
   # Linux
   tail -f /var/log/mysql/error.log
   ```

## Quick Test Commands

```bash
# Test MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# Test if database exists
mysql -u root -p -e "USE skillshare; SHOW TABLES;"

# Check backend health
curl http://localhost:5001/api/health
```

