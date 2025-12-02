# Deployment Guide

## Backend Deployment (Render/Railway)

### Render Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install && npm run prisma:generate`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `PORT` (auto-set by Render)
   - `NODE_ENV=production`
   - `JWT_SECRET` (generate a strong secret)
   - `JWT_EXPIRE=7d`
   - `MONGODB_URI` (your MongoDB connection string)
   - `FRONTEND_URL` (your frontend URL)

### Railway Deployment

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add a MongoDB service or use external MongoDB
4. Set environment variables (same as Render)
5. Railway will auto-detect and deploy

## Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (your backend API URL)
5. Deploy!

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your backend environment variables

### Local MongoDB

For local development, install MongoDB and use:
```
MONGODB_URI=mongodb://localhost:27017/skillshare
```

## Post-Deployment

1. Run Prisma migrations on your production database
2. Verify all environment variables are set correctly
3. Test API endpoints
4. Test frontend-backend connectivity

