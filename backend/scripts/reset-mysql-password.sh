#!/bin/bash

# Reset MySQL root password (macOS Homebrew)
# This will help you reset MySQL root password if you forgot it

echo "🔐 MySQL Password Reset Helper"
echo ""
echo "This script will help you reset your MySQL root password."
echo ""
echo "⚠️  WARNING: This will stop MySQL temporarily"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Stop MySQL
echo "🔄 Stopping MySQL..."
brew services stop mysql 2>/dev/null || pkill mysqld

sleep 2

# Start MySQL in safe mode
echo "🔄 Starting MySQL in safe mode..."
mysqld_safe --skip-grant-tables --skip-networking &
MYSQL_SAFE_PID=$!

sleep 3

# Reset password
echo "🔄 Resetting root password..."
mysql -u root << EOF
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
EOF

# Stop safe mode MySQL
kill $MYSQL_SAFE_PID 2>/dev/null
sleep 2

# Start MySQL normally
echo "🔄 Starting MySQL normally..."
brew services start mysql
sleep 3

# Test connection
echo "🔄 Testing connection..."
if mysql -u root -e "SELECT 1" > /dev/null 2>&1; then
    echo "✅ MySQL root password reset to empty (no password)"
    echo ""
    echo "Now creating database and user..."
    
    mysql -u root << EOF
CREATE DATABASE IF NOT EXISTS skillshare;
CREATE USER IF NOT EXISTS 'skillshare'@'localhost' IDENTIFIED BY '';
GRANT ALL PRIVILEGES ON skillshare.* TO 'skillshare'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    echo "✅ Database and user created!"
    echo ""
    echo "Updating .env file..."
    
    cd "$(dirname "$0")/.."
    if [ -f .env ]; then
        sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL=mysql://skillshare:@localhost:3306/skillshare|' .env
        rm -f .env.bak
    else
        echo "DATABASE_URL=mysql://skillshare:@localhost:3306/skillshare" >> .env
    fi
    
    echo "✅ Setup complete!"
    echo ""
    echo "Run: npm run prisma:migrate:dev"
else
    echo "❌ Password reset failed. Please try manual method."
    echo ""
    echo "Manual reset:"
    echo "1. Stop MySQL: brew services stop mysql"
    echo "2. Start safe mode: mysqld_safe --skip-grant-tables"
    echo "3. In another terminal: mysql -u root"
    echo "4. Run: ALTER USER 'root'@'localhost' IDENTIFIED BY '';"
fi

