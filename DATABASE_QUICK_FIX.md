# Quick Database Fix - Step by Step

## 🎯 The Problem
MySQL root password is set and we don't know it. We need to either:
1. Reset the password, OR
2. Create a new user without password

## ✅ Solution: Create New MySQL User (Easiest)

### Step 1: Connect to MySQL
You'll need to enter your MySQL root password when prompted:

```bash
mysql -u root -p
```

**If you don't know the password, try:**
- Just press Enter (no password)
- `root`
- `password`
- Your system password

### Step 2: Once Connected, Run These Commands:

```sql
CREATE DATABASE IF NOT EXISTS skillshare;
CREATE USER IF NOT EXISTS 'skillshare'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON skillshare.* TO 'skillshare'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Update .env File

Edit `backend/.env` and change DATABASE_URL to:
```env
DATABASE_URL=mysql://skillshare:@localhost:3306/skillshare
```

### Step 4: Test Connection

```bash
cd backend
npm run check-db
```

### Step 5: Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate:dev
```

## 🔄 Alternative: Reset Root Password

If you want to reset the root password instead:

### macOS (Homebrew):

```bash
# Stop MySQL
brew services stop mysql

# Start in safe mode (in one terminal)
mysqld_safe --skip-grant-tables --skip-networking

# In another terminal, connect and reset
mysql -u root

# In MySQL:
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
EXIT;

# Stop safe mode MySQL (Ctrl+C in first terminal)
# Start MySQL normally
brew services start mysql
```

Then update `.env`:
```env
DATABASE_URL=mysql://root:@localhost:3306/skillshare
```

## 🚀 After Fixing

1. **Test connection:**
   ```bash
   cd backend
   npm run check-db
   ```

2. **Start server:**
   ```bash
   npm run dev
   ```

3. **Should see:**
   ```
   ✅ MySQL database connected successfully
   ✅ Database query test passed
   🚀 Server running on port 5001
   ```

## 📝 Quick Copy-Paste Commands

**If you can connect to MySQL (with password):**
```bash
mysql -u root -p
# Enter password when prompted, then:
```

```sql
CREATE DATABASE IF NOT EXISTS skillshare;
CREATE USER IF NOT EXISTS 'skillshare'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON skillshare.* TO 'skillshare'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Then update .env:**
```bash
cd backend
# Edit .env and set:
# DATABASE_URL=mysql://skillshare:@localhost:3306/skillshare
```

**Then test:**
```bash
npm run check-db
npm run prisma:migrate:dev
npm run dev
```

## ✅ Success Indicators

- ✅ `npm run check-db` shows "Database connection check passed!"
- ✅ `npm run dev` shows "MySQL database connected successfully"
- ✅ Health endpoint works: `curl http://localhost:5001/api/health`

The easiest solution is to create the `skillshare` user with no password as shown above!

