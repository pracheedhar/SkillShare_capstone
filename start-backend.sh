#!/bin/bash

echo "Starting SkillShare Backend..."
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env file not found!"
    echo "Creating backend/.env from template..."
    cat > backend/.env << EOF
PORT=5001
NODE_ENV=development
JWT_SECRET=skillshare-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRE=7d
DATABASE_URL=mysql://root:password@localhost:3306/skillshare
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Created backend/.env"
    echo "⚠️  Please update DATABASE_URL with your MySQL credentials"
    echo "⚠️  Make sure to create the database: CREATE DATABASE skillshare;"
fi

cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if Prisma client is generated
if [ ! -d "node_modules/.prisma" ]; then
    echo "Generating Prisma client..."
    npm run prisma:generate
fi

echo ""
echo "Starting backend server..."
echo "Backend will run on http://localhost:5001"
echo ""

npm run dev
