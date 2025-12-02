#!/bin/bash

echo "Starting SkillShare Frontend..."
echo ""

# Check if .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local file not found!"
    echo "Creating frontend/.env.local..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
    echo "✅ Created frontend/.env.local"
fi

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Starting frontend server..."
echo "Frontend will run on http://localhost:3000"
echo ""

npm run dev

