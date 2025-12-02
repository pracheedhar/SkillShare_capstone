#!/bin/bash

# Create MySQL user and database for SkillShare
# This script will create a user with no password for local development

echo "🔧 Setting up MySQL for SkillShare..."
echo ""

# Check if MySQL is running
if ! mysql --version > /dev/null 2>&1; then
    echo "❌ MySQL is not installed or not in PATH"
    echo "   Install with: brew install mysql"
    exit 1
fi

echo "This script will create a MySQL user 'skillshare' with no password"
echo "and grant access to the 'skillshare' database."
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Try to connect and create user/database
# First, try with common passwords
PASSWORDS=("" "root" "password")

for PASSWORD in "${PASSWORDS[@]}"; do
    if [ -z "$PASSWORD" ]; then
        MYSQL_CMD="mysql -u root"
    else
        MYSQL_CMD="mysql -u root -p$PASSWORD"
    fi
    
    echo "🔄 Trying to connect..."
    
    if $MYSQL_CMD -e "SELECT 1" > /dev/null 2>&1; then
        echo "✅ Connected to MySQL"
        echo ""
        
        echo "🔄 Creating database..."
        $MYSQL_CMD -e "CREATE DATABASE IF NOT EXISTS skillshare;" 2>&1
        
        echo "🔄 Creating user..."
        $MYSQL_CMD -e "CREATE USER IF NOT EXISTS 'skillshare'@'localhost' IDENTIFIED BY '';" 2>&1
        $MYSQL_CMD -e "GRANT ALL PRIVILEGES ON skillshare.* TO 'skillshare'@'localhost';" 2>&1
        $MYSQL_CMD -e "FLUSH PRIVILEGES;" 2>&1
        
        echo "✅ User and database created!"
        echo ""
        echo "Updating .env file..."
        
        # Update .env file
        cd "$(dirname "$0")/.."
        if [ -f .env ]; then
            # Update DATABASE_URL
            sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL=mysql://skillshare:@localhost:3306/skillshare|' .env
            rm -f .env.bak
            echo "✅ .env file updated"
        else
            echo "DATABASE_URL=mysql://skillshare:@localhost:3306/skillshare" >> .env
            echo "✅ Created .env file"
        fi
        
        echo ""
        echo "✅ Setup complete!"
        echo "   Database: skillshare"
        echo "   User: skillshare"
        echo "   Password: (none)"
        echo ""
        echo "Run: npm run prisma:migrate:dev"
        exit 0
    fi
done

echo "❌ Could not connect to MySQL with common passwords"
echo ""
echo "Please run MySQL and create the user manually:"
echo ""
echo "mysql -u root -p"
echo ""
echo "Then run:"
echo "CREATE DATABASE skillshare;"
echo "CREATE USER 'skillshare'@'localhost' IDENTIFIED BY '';"
echo "GRANT ALL PRIVILEGES ON skillshare.* TO 'skillshare'@'localhost';"
echo "FLUSH PRIVILEGES;"
echo ""
echo "Or run: npm run setup-db (interactive setup)"
exit 1

