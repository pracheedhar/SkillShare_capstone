#!/bin/bash

echo "Starting SkillShare Backend..."
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  backend/.env file not found!"
    echo "Creating backend/.env from template..."
    cat > backend/.env << EOF
PORT=5000
NODE_ENV=development
JWT_SECRET=skillshare-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/skillshare
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Created backend/.env"
    echo "⚠️  Please update MONGODB_URI if using MongoDB Atlas"
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
echo "Backend will run on http://localhost:5000"
echo ""

npm run dev

