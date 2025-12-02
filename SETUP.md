# Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Set Up Environment Variables

### Backend (.env file in backend folder)
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=skillshare-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/skillshare
FRONTEND_URL=http://localhost:3000
```

**For MongoDB Atlas**, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillshare?retryWrites=true&w=majority
```

### Frontend (.env.local file in frontend folder)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 3: Set Up Database

### Make sure MongoDB is running
- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Your connection string should be ready

### Generate Prisma Client and Run Migrations
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

## Step 4: Start Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Sign Up" to create an account
3. Fill in the form and submit
4. You should be redirected to the dashboard

## Troubleshooting

### "Database connection error"
- Make sure MongoDB is running
- Check your MONGODB_URI in backend/.env
- For MongoDB Atlas, ensure your IP is whitelisted

### "Cannot find module '@prisma/client'"
- Run `npm run prisma:generate` in the backend folder

### "Port already in use"
- Change PORT in backend/.env to a different port (e.g., 5001)
- Update NEXT_PUBLIC_API_URL in frontend/.env.local accordingly

### Signup not working
- Check browser console for errors
- Check backend terminal for error messages
- Ensure MongoDB is running and accessible
- Verify all environment variables are set correctly

