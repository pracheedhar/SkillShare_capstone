# Database Connection Fix Guide

## 🔧 Quick Fix

The database connection is failing because the MySQL password in `.env` is incorrect.

### Option 1: Use Setup Script (Easiest)

Run the interactive setup script:
```bash
cd backend
npm run setup-db
```

This will:
1. Test your MySQL connection
2. Ask for your MySQL credentials
3. Create the database if needed
4. Update your .env file
5. Run Prisma migrations

### Option 2: Manual Fix

**Step 1: Find Your MySQL Password**

If you don't know your MySQL root password, try:
```bash
# Try connecting with no password
mysql -u root

# Or try common defaults
mysql -u root -p
# (then try: password, root, or just press Enter)
```

**Step 2: Update .env File**

Edit `backend/.env` and update DATABASE_URL:
```env
DATABASE_URL=mysql://root:YOUR_ACTUAL_PASSWORD@localhost:3306/skillshare
```

Replace `YOUR_ACTUAL_PASSWORD` with your actual MySQL password.

**Step 3: Create Database**

```bash
mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE skillshare;
EXIT;
```

**Step 4: Test Connection**

```bash
cd backend
npm run check-db
```

**Step 5: Run Migrations**

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

## 🔍 Troubleshooting

### Issue: "Authentication failed"

**Solution:**
- Wrong password in DATABASE_URL
- Run `npm run setup-db` to update credentials
- Or manually edit `backend/.env` with correct password

### Issue: "Cannot reach MySQL server"

**Solution:**
```bash
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
# Start MySQL service from Services panel
```

### Issue: "Database does not exist"

**Solution:**
```bash
mysql -u root -p
CREATE DATABASE skillshare;
EXIT;
```

### Issue: "Access denied"

**Solution:**
- Check MySQL user has permissions
- Try creating a new MySQL user:
```sql
CREATE USER 'skillshare'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON skillshare.* TO 'skillshare'@'localhost';
FLUSH PRIVILEGES;
```

Then update DATABASE_URL:
```env
DATABASE_URL=mysql://skillshare:yourpassword@localhost:3306/skillshare
```

## ✅ Verification

After fixing, verify everything works:

1. **Test database connection:**
   ```bash
   cd backend
   npm run check-db
   ```
   Should show: ✅ Database connection check passed!

2. **Test server:**
   ```bash
   npm run dev
   ```
   Should show: ✅ MySQL database connected successfully

3. **Test health endpoint:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"OK","database":"connected"}`

## 🎯 Quick Commands

```bash
# Setup database (interactive)
npm run setup-db

# Check database connection
npm run check-db

# Test MySQL directly
mysql -u root -p

# Start MySQL (macOS)
brew services start mysql

# Check MySQL status
brew services list | grep mysql
```

## 📝 Common MySQL Passwords

If you forgot your password, try:
- (empty/no password)
- `root`
- `password`
- `admin`
- Your system password

If none work, you may need to reset MySQL password:
```bash
# macOS (Homebrew)
mysqld_safe --skip-grant-tables &
mysql -u root
# Then in MySQL:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
```

## 🚀 After Fixing

Once the database connection works:
1. Start backend: `npm run dev`
2. Start frontend: `cd ../frontend && npm run dev`
3. Test signup at http://localhost:3000

The setup script (`npm run setup-db`) is the easiest way to fix everything!

